<template>
  <div>
    <!-- 처음 불러오는 동안만 로딩 표시 (기억해 둔 목록이 있으면 바로 보여주고 뒤에서 새로 받아옴) -->
    <div class="container" v-loading="loading && allData.length === 0">
      <div class="search-box">
        <!-- 입력하면 그 글자가 포함된 모델을 아래에 보여줌 (이미 받아온 목록에서 찾으므로 서버 요청 없음) -->
        <el-autocomplete
          v-model="query.model_name"
          :fetch-suggestions="suggestModels"
          :trigger-on-focus="false"
          :debounce="50"
          placeholder="Model 검색"
          class="search-input mr10"
          popper-class="model-suggest"
          clearable
          @select="handleSearch"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #default="{ item }">
            <span>{{ item.value }}</span>
            <span class="suggest-count">{{ item.count }}건</span>
          </template>
        </el-autocomplete>
        <el-button type="primary" @click="handleSearch">검색</el-button>
        <!-- 검색이 걸려 있으면 눈에 띄게 표시 (목록이 걸러진 상태인지 바로 알 수 있도록) -->
        <span v-if="appliedSearch" class="search-state">
          '<b>{{ appliedSearch }}</b>' 검색 결과 {{ pageTotal }}건
          <el-button link type="primary" @click="clearSearch">검색 해제</el-button>
        </span>
      </div>
      <!-- 표 높이 = 화면 아래 끝까지 (표 안에서 스크롤, 페이지 번호는 항상 보임) -->
      <div ref="tableBox" v-show="tableData.length != 0">
      <el-table
        :data="tableData"
        :height="tableHeight"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        :row-class-name="getRowClassName"
        show-overflow-tooltip
      >
        <!-- 모든 칸은 한 줄로 표시 (넘치면 … , 마우스를 대면 전체). 줄바꿈으로 행 높이가 들쭉날쭉해지는 것을 막음.
             min-width 열은 화면이 넓으면 남는 폭을 나눠 가져 표가 화면 폭을 채움 -->
        <el-table-column
          prop="model_name"
          label="Product Name"
          :align="'center'"
          min-width="140"
        >
        </el-table-column>

        <el-table-column
          prop="band"
          label="Band"
          :align="'center'"
          width="70"
        >
          <template #default="scope">
            <span v-if="scope.row.band.length > 5">{{
              scope.row.band.substring(0, 4)
            }}</span>
            <span v-else>{{ scope.row.band }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="condition" label="SPL Status" min-width="90" :align="'center'">
        </el-table-column>

        <el-table-column prop="temperature" label="Temp°C" width="80" :align="'center'">
        </el-table-column>

        <el-table-column prop="signal_type" label="Signal" min-width="140" :align="'center'">
        </el-table-column>

        <el-table-column
          prop="target_position"
          label="Target"
          width="70"
          :align="'center'"
        >
        </el-table-column>

        <el-table-column prop="test_type" label="TEST" width="90" :align="'center'">
        </el-table-column>

        <el-table-column prop="vswr" label="vswr" width="60" :align="'center'">
        </el-table-column>

        <el-table-column prop="designer" label="Designer" min-width="110" :align="'center'">
        </el-table-column>

        <el-table-column prop="requester" label="Requester" min-width="100" :align="'center'">
        </el-table-column>

        <el-table-column label="Status" width="110" :align="'center'">
          <template #default="scope">
            <span
              v-if="scope.row.status === 'in progress'"
              :style="{ color: 'green' }"
              >In progress</span
            >
            <span
              v-else-if="scope.row.status === 'reserved'"
              :style="{ color: 'orange' }"
              >Waiting</span
            >
            <span v-else :style="{ color: 'blue' }">Finished</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="request_number"
          label="Request Number"
          width="90"
          :align="'center'"
        >
        </el-table-column>
        <!-- <el-table-column label="시작" :align="'center'">
          <template #default="scope">
            <span>{{ moment(scope.row.date_of_created).format('YY/MM/DD') }}</span>            
          </template>
        </el-table-column> -->
        <el-table-column label="Finished Date" width="90" :align="'center'">
          <template #default="scope">
            <!-- 완료일이 비어 있거나 잘못된 값이면 "Invalid date" 대신 - 표시 -->
            <span v-if="scope.row.status === 'finished' && scope.row.date_of_finished && moment(scope.row.date_of_finished).isValid()">{{
              moment(scope.row.date_of_finished).format("YY/MM/DD")
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="Action" width="90" :align="'center'">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
              >자세히</el-button
            >
            <!-- <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              >삭제</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      </div>

      <el-pagination
        v-if="tableData.length != 0"
        background
        layout="slot, sizes, prev, pager, next, jumper"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :page-sizes="[20, 50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        class="pagination-margin"
      >
        <span class="page-total">총 {{ pageTotal.toLocaleString() }}건</span>
      </el-pagination>
      <!-- 불러오는 중에는 "없습니다" 문구를 띄우지 않음 -->
      <div v-else-if="loading" class="loading-space"></div>
      <el-empty v-else :description="emptyText"></el-empty>
    </div>
  </div>
</template>

<script lang="ts">
// 탭별로 받아온 목록을 기억 (페이지/탭을 다시 열 때 바로 표시). F5 하면 비워짐.
const listCache = new Map<string, any[]>();
</script>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useSessionRef } from "../../../utils/session-state";
import { savedSearch } from "../../../utils/measurement-search";
import { useFillHeight } from "../../../utils/use-fill-height";
import axios from "axios";
import { ElMessage } from "element-plus";
import { getLastThursday, formatDate } from "../../../utils/utility";
import { applicationRules } from "../../../utils/FromRule";
import { useRouter } from "vue-router";
import moment from "moment";
import { deletePdtApplication } from "../../../utils/Pdt/application-utils";

const props = defineProps<{
  testType: string;
  searchType: string;
  status: string;
}>();

const getRowClassName = ({ row }) => {
  if (row.status === "in progress") {
    return "in-progress";
  } else if (row.status === "waiting") {
    return "waiting";
  }
  return "";
};

// 탭(상태+측정 종류)별로 보던 페이지 번호를 기억 (F5/뒤로가기 후에도 유지, 브라우저 탭을 닫으면 초기화)
const stateKey = `measurement_list:${props.status}:${props.testType}`;
const savedPage = useSessionRef<number>(`${stateKey}:page`, 1);

// 한 페이지 건수 (20/50/100, 기본 50). 모든 측정 탭에 공통으로 기억
const savedPageSize = useSessionRef<number>("measurement_list:pageSize", 50);

const query = reactive({
  model_name: "",
  pageIndex: savedPage.value,
  pageSize: [20, 50, 100].includes(savedPageSize.value) ? savedPageSize.value : 50,
});
watch(() => query.pageIndex, (v) => (savedPage.value = v));

const multipleTable = ref<any>(null);
const tableBox = ref<HTMLElement | null>(null);
// 아래 여백 = 페이지 번호 줄 + 바깥 여백
const { height: tableHeight } = useFillHeight(tableBox, 110);

// 실제로 적용된 검색어 (검색/Enter/목록 선택 시 확정). 입력만 하고 검색 안 한 글자는 적용하지 않음.
// 탭별로 기억하고, 의뢰서 화면에서 돌아올 때만 유지 (다른 곳에서 들어오면 목록 페이지가 비움)
const appliedSearch = ref(savedSearch[stateKey] || "");
query.model_name = appliedSearch.value;

const loading = ref(false);
const emptyText = computed(() => {
  if (appliedSearch.value) return "검색 결과가 없습니다.";
  return props.status === "finished" ? "완료된 측정 의뢰가 없습니다." : "진행중인 측정 의뢰가 없습니다.";
});

onMounted(() => {
  // 이전에 받아온 목록이 있으면 먼저 바로 표시 (서버 응답이 수 초 걸림)
  const cached = listCache.get(stateKey);
  if (cached) {
    allData.value = cached;
    filterData();
  }
  fetchData();
});

// 목록 페이지에 새로 들어와 검색어가 비워지면 화면에도 반영
watch(
  () => savedSearch[stateKey],
  (v) => {
    const next = v || "";
    if (next === appliedSearch.value) return;
    appliedSearch.value = next;
    query.model_name = next;
    query.pageIndex = 1;
    filterData();
  }
);
// (예전에는 검색어를 localStorage 에 저장해서 다음 날·다른 탭·대기 목록에도 남았음 → 위 방식으로 변경)
try {
  localStorage.removeItem("modelSearchQuery");
} catch {
  /* 무시 */
}

// // 로컬 저장소에서 저장된 값을 불러와서 초기화합니다.
// onMounted(() => {
//   query.model_name = localStorage.getItem("modelSearchQuery") || "";
//   fetchData();
// });

// // model_name이 변경될 때마다 이를 로컬 저장소에 저장합니다.
// watch(() => query.model_name, (newValue) => {
//   localStorage.setItem("modelSearchQuery", newValue);
// });

interface ApplicationItem {
  uuid: string;
  band: string;
  model_name: string;
  condition: string;
  designer: string;
  requester: string;
  product_type: string;
  wafer_type: string;
  status: string;
  sample_quantity: string;
  signal_type: string;
  request_number: string;
  target_position: string;
  date_of_created: string;
  date_of_finished: string;
}

const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "RF개발팀" : "RF개발팀";

const allData = ref<ApplicationItem[]>([]);
const tableData = ref<ApplicationItem[]>([]);
const pageTotal = ref(0);

const fetchData = async () => {
  loading.value = true;
  try {
    //props.status = 'finished'
    const response = await axios.post(
      
      "pdt_application/get_application_list_by_test_type",
      {
        status: props.status,
        test_type: props.testType,
        search_type: props.searchType,
        user_name: name,
      }
    );

    allData.value = response.data;
    listCache.set(stateKey, response.data);

    filterData();
  } catch (error) {
    ElMessage.error("데이터를 불러오는 데 실패했습니다.");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const filterData = () => {
  // 제품 이름으로 필터링
  const keyword = (appliedSearch.value || "").toLowerCase();
  const filtered = allData.value.filter((item) =>
    (item.model_name || "").toLowerCase().includes(keyword)
  );

  // 기억해 둔 페이지가 새 목록보다 뒤쪽이면 마지막 페이지로
  const lastPage = Math.max(1, Math.ceil(filtered.length / query.pageSize));
  if (query.pageIndex > lastPage) query.pageIndex = lastPage;

  // 페이지네이션을 위한 인덱스 계산
  const startIndex = (query.pageIndex - 1) * query.pageSize;
  const endIndex = startIndex + query.pageSize;

  // 현재 페이지에 표시될 데이터 슬라이스
  tableData.value = filtered.slice(startIndex, endIndex);
  pageTotal.value = filtered.length;
};

// 자동완성용: 모델 이름별 의뢰 건수 (목록이 바뀔 때만 다시 계산)
const modelCounts = computed(() => {
  const m = new Map<string, number>();
  for (const item of allData.value) {
    if (item.model_name) m.set(item.model_name, (m.get(item.model_name) ?? 0) + 1);
  }
  return [...m.entries()].map(([value, count]) => ({ value, count, lower: value.toLowerCase() }));
});

// 입력한 글자가 포함된 모델: 그 글자로 시작하는 모델을 먼저, 그다음 이름순. 최대 30개
const suggestModels = (text: string, cb: (items: { value: string; count: number }[]) => void) => {
  const kw = (text || "").trim().toLowerCase();
  if (!kw) return cb([]);
  const hits = modelCounts.value.filter((x) => x.lower.includes(kw));
  hits.sort((a, b) => {
    const sa = a.lower.startsWith(kw) ? 0 : 1;
    const sb = b.lower.startsWith(kw) ? 0 : 1;
    return sa - sb || a.value.localeCompare(b.value);
  });
  cb(hits.slice(0, 30).map(({ value, count }) => ({ value, count })));
};

const handleSearch = () => {
  appliedSearch.value = (query.model_name || "").trim();
  savedSearch[stateKey] = appliedSearch.value;
  query.pageIndex = 1;
  filterData();
};

const clearSearch = () => {
  query.model_name = "";
  handleSearch();
};

const handlePageChange = (val: number) => {
  query.pageIndex = val;
  filterData();
  multipleTable.value?.setScrollTop?.(0); // 새 페이지는 맨 위부터
};

// 건수를 바꿔도 보고 있던 첫 줄이 들어 있는 페이지로 이동
const handleSizeChange = (size: number) => {
  const firstRow = (query.pageIndex - 1) * query.pageSize;
  query.pageSize = size;
  savedPageSize.value = size;
  query.pageIndex = Math.floor(firstRow / size) + 1;
  filterData();
  multipleTable.value?.setScrollTop?.(0);
};
// (fetchData 는 위 onMounted 에서 이미 호출하므로 중복 호출 제거)
// 뒤로가기 시 페이지 전체 새로고침(popstate → reload)은 제거: 기억해 둔 목록을 바로 보여주고
// 뒤에서 새로 받아와 갱신하므로, 자세히 화면에서 바꾼 내용도 몇 초 뒤 반영됨.

// const visible = ref(false);
// const idEdit = ref(false);
// const rowData = ref({});
// const handleDetail = (row: ApplicationItem) => {
//   rowData.value = row;
//   visible1.value = true;
// };

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const handleDetail = (row: ApplicationItem) => {
  // `application/application_detail` 페이지로 리디렉트하면서 `uuid`를 파라미터로 전달합니다.

  // from: 의뢰서 화면의 "목록으로 돌아가기" 버튼이 돌아올 목록을 알 수 있도록
  router.push({
    name: "MeasurementInfo",
    params: { uuid: row.uuid },
    query: { from: props.status === "reserved" ? "reserved" : "finished" },
  });
};

const handleDelete = (row: ApplicationItem) => {
  deletePdtApplication(row.uuid);
};

// const visible1 = ref(false);
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
}

.in-progress {
  background-color: green; /* 녹색 배경 */
}

.waiting {
  background-color: grey; /* 회색 배경 */
}
.search-input :deep(.el-input) {
  width: 100%;
}
.page-total {
  margin-right: 12px;
  font-weight: normal;
  color: #606266;
}
.search-state {
  margin-left: 16px;
  padding: 4px 10px;
  border-radius: 4px;
  background: #ecf5ff;
  color: #303133;
  font-size: 13px;
}
.loading-space {
  height: 300px;
}
.search-input {
  width: 200px;
}
.mr10 {
  margin-right: 10px;
}
.pagination-margin {
  margin-top: 20px; /* 원하는 마진 값을 설정하세요 */
}
</style>

<style>
/* 자동완성 목록은 body 아래에 그려지므로 scoped 가 아닌 전역 스타일 (클래스 이름으로 범위 한정) */
.model-suggest li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.model-suggest .suggest-count {
  color: #909399;
  font-size: 12px;
}
</style>