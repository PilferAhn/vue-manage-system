<template>
  <!-- 처음 불러오는 동안만 로딩 표시 (기억해 둔 목록이 있으면 바로 보여주고 뒤에서 새로 받아옴) -->
  <div class="container" v-loading="loading && applications.length === 0">
    <div class="search-box">
      <!-- Model / LOT ID 검색: 입력하면 포함된 항목을 아래에 보여줌 (받아 둔 목록에서 찾으므로 서버 요청 없음) -->
      <el-autocomplete
        v-model="searchInput"
        :fetch-suggestions="suggest"
        :trigger-on-focus="false"
        :debounce="50"
        placeholder="Model / LOT ID 검색"
        class="search-input mr10"
        popper-class="teg-suggest"
        clearable
        @select="handleSearch"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #default="{ item }">
          <span>{{ item.value }}</span>
          <span class="suggest-count">{{ item.kind }} · {{ item.count }}건</span>
        </template>
      </el-autocomplete>
      <el-button type="primary" @click="handleSearch">검색</el-button>
      <span v-if="appliedSearch" class="search-state">
        '<b>{{ appliedSearch }}</b>' 검색 결과 {{ filteredData.length.toLocaleString() }}건
        <el-button link type="primary" @click="clearSearch">검색 해제</el-button>
      </span>
    </div>

    <!-- 표 높이 = 화면 아래 끝까지 (표 안에서 스크롤, 페이지 번호는 항상 보임) -->
    <div ref="tableBox" v-show="pageData.length > 0">
      <el-table
        ref="tableRef"
        :data="pageData"
        :height="tableHeight"
        border
        class="table"
        header-cell-class-name="table-header"
        :row-class-name="getRowClass"
        show-overflow-tooltip
      >
        <!-- 모든 칸은 한 줄로 표시 (넘치면 … , 마우스를 대면 전체) -->
        <el-table-column label="Model Name" prop="productName" min-width="150" align="center" />
        <el-table-column label="LOT ID" prop="lotId" min-width="120" align="center" />
        <el-table-column label="Test Type" prop="measType" width="100" align="center" />
        <el-table-column label="개발자 / 의뢰자" prop="designer" min-width="160" align="center" />
        <el-table-column label="의뢰서 작성일" width="115" align="center">
          <template #default="scope">{{ formatDate(scope.row.dateOfCreated) }}</template>
        </el-table-column>
        <el-table-column label="완료일" width="115" align="center">
          <template #default="scope">{{ formatDate(scope.row.dateOfFinished) }}</template>
        </el-table-column>
        <el-table-column label="진행도" prop="progress" width="90" align="center" />
        <el-table-column label="우선순위" prop="priority" width="90" align="center" />
        <el-table-column v-if="userType === 'admin'" label="Action" width="330" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              class="small-button"
              @click="openPathDialog(scope.row.applicationID)"
              :disabled="scope.row.applicationVersion === '1'"
              >데이터 복사</el-button
            >
            <el-button
              type="warning"
              class="small-button"
              @click="downloadZip(scope.row.applicationID)"
              :disabled="scope.row.applicationVersion === '1'"
              >zip 다운로드</el-button
            >
            <el-button
              type="success"
              class="small-button"
              @click="downloadPpt(scope.row.applicationID)"
              :disabled="scope.row.applicationVersion === '1'"
              >CER 다운로드</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-if="pageData.length > 0"
      background
      layout="slot, sizes, prev, pager, next, jumper"
      :total="filteredData.length"
      :page-size="pageSize"
      :page-sizes="[20, 50, 100]"
      :current-page="currentPage"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      class="pagination-margin"
    >
      <span class="page-total">총 {{ filteredData.length.toLocaleString() }}건</span>
    </el-pagination>
    <!-- 불러오는 중에는 "없습니다" 문구를 띄우지 않음 -->
    <div v-else-if="loading" class="loading-space"></div>
    <el-empty v-else :description="appliedSearch ? '검색 결과가 없습니다.' : '완료된 TEG 측정 의뢰가 없습니다.'" />
  </div>
</template>

<script lang="ts">
// 받아온 목록을 기억 (다시 열 때 바로 표시하고 뒤에서 새로 받아옴). F5 하면 비워짐.
let cachedApplications: any[] | null = null;
</script>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import dayjs from "dayjs";
import { getNewTegApplication } from "../../../utils/tegUtility";
import { TegApplication } from "../../../utils/tegTypes";
import { openPathDialog, downloadZip, downloadPpt } from "./TegMeasurementFinishedQue";
import { useSessionRef } from "../../../utils/session-state";
import { useFillHeight } from "../../../utils/use-fill-height";

const userType = localStorage.getItem("ms_username");

const applications = ref<TegApplication[]>(cachedApplications ?? []);
const loading = ref(false);

// 페이지 / 건수는 F5 후에도 유지
const currentPage = useSessionRef<number>("teg_finished:page", 1);
const savedPageSize = useSessionRef<number>("teg_finished:pageSize", 50);
const pageSize = ref([20, 50, 100].includes(savedPageSize.value) ? savedPageSize.value : 50);

// 검색: 입력칸(searchInput)과 실제 적용된 검색어(appliedSearch)를 구분 (검색/Enter/목록 선택 시 적용)
const searchInput = ref("");
const appliedSearch = ref("");

const tableRef = ref<any>(null);
const tableBox = ref<HTMLElement | null>(null);
const { height: tableHeight } = useFillHeight(tableBox, 110);

onMounted(async () => {
  loading.value = true;
  const t0 = performance.now();
  try {
    const data = await getNewTegApplication("finished");
    applications.value = data as any;
    cachedApplications = data as any;
  } catch (error) {
    console.error("Error fetching applications:", error);
  } finally {
    loading.value = false;
    console.log(`TEG 완료 목록 조회: ${((performance.now() - t0) / 1000).toFixed(2)}초`);
  }
});

// Model / LOT ID 에 검색어가 포함된 의뢰
const filteredData = computed(() => {
  const kw = appliedSearch.value.toLowerCase();
  if (!kw) return applications.value;
  return applications.value.filter(
    (item: any) =>
      (item.productName || "").toLowerCase().includes(kw) ||
      (item.lotId || "").toLowerCase().includes(kw)
  );
});

const pageData = computed(() =>
  filteredData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
);

// 목록이 줄어 기억해 둔 페이지가 범위를 벗어나면 마지막 페이지로
watch(
  () => filteredData.value.length,
  (len) => {
    const last = Math.max(1, Math.ceil(len / pageSize.value));
    if (currentPage.value > last) currentPage.value = last;
  }
);

// 자동완성: Model / LOT ID 별 건수 (목록이 바뀔 때만 다시 계산)
const suggestIndex = computed(() => {
  const models = new Map<string, number>();
  const lots = new Map<string, number>();
  for (const item of applications.value as any[]) {
    if (item.productName) models.set(item.productName, (models.get(item.productName) ?? 0) + 1);
    if (item.lotId) lots.set(item.lotId, (lots.get(item.lotId) ?? 0) + 1);
  }
  const toList = (m: Map<string, number>, kind: string) =>
    [...m.entries()].map(([value, count]) => ({ value, count, kind, lower: value.toLowerCase() }));
  return [...toList(models, "Model"), ...toList(lots, "LOT")];
});

// 입력한 글자로 시작하는 항목을 먼저, 그다음 이름순. 최대 30개
const suggest = (text: string, cb: (items: any[]) => void) => {
  const kw = (text || "").trim().toLowerCase();
  if (!kw) return cb([]);
  const hits = suggestIndex.value.filter((x) => x.lower.includes(kw));
  hits.sort((a, b) => {
    const sa = a.lower.startsWith(kw) ? 0 : 1;
    const sb = b.lower.startsWith(kw) ? 0 : 1;
    return sa - sb || a.value.localeCompare(b.value);
  });
  cb(hits.slice(0, 30).map(({ value, count, kind }) => ({ value, count, kind })));
};

const handleSearch = () => {
  appliedSearch.value = (searchInput.value || "").trim();
  currentPage.value = 1;
  tableRef.value?.setScrollTop?.(0);
};

const clearSearch = () => {
  searchInput.value = "";
  handleSearch();
};

const handlePageChange = (val: number) => {
  currentPage.value = val;
  tableRef.value?.setScrollTop?.(0); // 새 페이지는 맨 위부터
};

// 건수를 바꿔도 보고 있던 첫 줄이 들어 있는 페이지로 이동
const handleSizeChange = (size: number) => {
  const firstRow = (currentPage.value - 1) * pageSize.value;
  pageSize.value = size;
  savedPageSize.value = size;
  currentPage.value = Math.floor(firstRow / size) + 1;
  tableRef.value?.setScrollTop?.(0);
};

// 날짜가 없으면 "Invalid Date" 대신 -
const formatDate = (v: string | null | undefined) => {
  if (!v) return "-";
  const d = dayjs(v);
  return d.isValid() ? d.format("YYYY-MM-DD") : "-";
};

function getRowClass({ row }: { row: TegApplication }) {
  const priority = Number(row.priority);
  return priority === 5 ? "high-priority" : "";
}
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.search-input {
  width: 260px;
}
.mr10 {
  margin-right: 10px;
}
.search-state {
  margin-left: 16px;
  padding: 4px 10px;
  border-radius: 4px;
  background: #ecf5ff;
  color: #303133;
  font-size: 13px;
}
.pagination-margin {
  margin-top: 20px;
}
.page-total {
  margin-right: 12px;
  font-weight: normal;
  color: #606266;
}
.loading-space {
  height: 300px;
}

/* 추가된 버튼 스타일 */
.el-button--warning {
  background-color: #f1c40f;
  border-color: #f1c40f;
  color: #fff;
}

.el-button {
  margin: 0 2px; /* 버튼 사이 여백 최소화 */
}

.el-button.small-button {
  padding: 5px 10px; /* 버튼 내부 여백 줄이기 */
  font-size: 12px; /* 폰트 크기 줄이기 */
  height: auto; /* 버튼 높이 자동 조절 */
  line-height: normal; /* 라인 높이 조절 */
  margin: 0 2px; /* 버튼 간 여백 최소화 */
}
</style>

<style>
/* 자동완성 목록은 body 아래에 그려지므로 전역 스타일 (클래스 이름으로 범위 한정) */
.teg-suggest li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.teg-suggest .suggest-count {
  color: #909399;
  font-size: 12px;
}
</style>
