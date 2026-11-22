<template>
  <div class="search-panel">
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        class="search-input mr10"
        placeholder="Search by Model Name"
      ></el-input>
      <el-button @click="filterTable">Search</el-button>
    </div>
  </div>
  <el-table
    :data="
      filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    "
    border
    class="table"
    header-cell-class-name="table-header"
    :row-class-name="getRowClass"
  >
    <el-table-column
      label="Model Name"
      prop="productName"
      :align="'center'"
      width="180"
    ></el-table-column>
    <el-table-column
      label="LOT ID"
      prop="lotId"
      :align="'center'"
      width="150"
    ></el-table-column>
    <el-table-column
      label="Test Type"
      prop="measType"
      :align="'center'"
      width="100"
    ></el-table-column>
    <el-table-column label="Designer / Requester" :align="'center'">
      <template #default="scope">
        {{ scope.row.designer }} / {{ scope.row.requester }}
      </template>
    </el-table-column>
    <el-table-column label="Created Date" :align="'center'" width="150">
      <template #default="scope">
        <span>{{ formatDateTime(scope.row.dateOfCreated) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Reserved Date" :align="'center'" width="150">
      <template #default="scope">
        <span>{{ formatDateTime(scope.row.dateOfReserve) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Location" :align="'center'" width="150">
      <template #default="scope">
        <template v-if="scope.row.currentStage">
          {{ scope.row.currentStage }} <br />
          {{ scope.row.currentStageTime }}
        </template>
        <span v-else class="location-empty">{{ locationLoading ? "…" : "-" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Progress" :align="'center'" width="100">
      <template #default="scope">
        <span>{{ scope.row.progress }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="props.category !== 'product'"
      label="Priority"
      prop="priority"
      width="100"
      :align="'center'"
    ></el-table-column>
    <el-table-column
      v-if="userType === 'admin'"
      label="Action"
      :align="'center'"
    >
      <template #default="scope">
        <el-button
          type="primary"
          @click="viewDetail(scope.row.applicationID)"
          :disabled="scope.row.applicationVersion !== '2'"
          >Detail</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    layout="prev, pager, next"
    :total="filteredData.length"
    :page-size="pageSize"
    v-model:current-page="currentPage"
    class="pagination-margin"
  ></el-pagination>
</template>

<script lang="ts">
// 모델(P/N)별 FAB 의뢰서 (Location 계산용). 탭/재방문 사이에 공유, F5 하면 비워짐
const fabCache = new Map<string, any[]>();
</script>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { getApplicationListByDictRev2 } from "../../../utils/Fab/fab-application-utils";
import { useRouter } from "vue-router";
import {
  TegApplication,
  getTegApplication,
  formatTime,
} from "../../../utils/waferMeasurementHelper";
import { formatDateTime } from "../../../utils/date-utils";
import type { FabApplicationForm } from "../../../interface/mes-interface";
import { FabRequest } from "../../../interface/fab-application-rev2";

const props = defineProps<{
  category: string;
  pageSize: number;
}>();

const userType = localStorage.getItem("ms_username");

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = props.pageSize;
const applications = ref<TegApplication[]>([]);

// Location 에서 제외할 공정 (출하/후공정). 이 공정에 있는 lot 은 건너뛰고 아직 FAB 진행 중인 lot 위치를 보여준다
const EXCLUDED_OPERATIONS = new Set([
  "Transit 공정",
  "출하",
  "포장",
  "전수검사",
  "AOI",
  "IDT 프로브",
  "LTE 외검",
  "LTE 깊이",
  "LTE S L/O",
  "LTE 에칭",
  "LTE 현상외검",
  "LTE 현상",
  "LTE 노광",
  "LTE 코팅",
]);

const locationLoading = ref(false);

/**
 * Location 계산에 쓰는 FAB 의뢰서(lot 위치)를 이 탭 목록에 있는 모델만 서버에서 받아온다.
 * (예전에는 부모 화면이 FAB 의뢰서 전체 2천여 건/약 42MB 를 받아 35초 이상 걸렸음 → 필요한 모델만 약 1초)
 * 한 번 받은 모델은 fabCache 에 기억해 다른 탭/재방문 때 다시 요청하지 않는다.
 */
async function loadFabForProducts(productNames: string[]) {
  const missing = [...new Set(productNames.filter((n) => n && !fabCache.has(n)))];
  const CHUNK = 100;
  for (let i = 0; i < missing.length; i += CHUNK) {
    const chunk = missing.slice(i, i + CHUNK);
    const list = await getApplicationListByDictRev2({
      users: false,
      wafer: false,
      idt_type: false,
      customer: false,
      hs_type: false,
      idt_layers: false,
      lot_status: true,
      is_pending: false,
      product_names: chunk.join(","),
    });
    for (const n of chunk) fabCache.set(n, []);
    for (const fr of list as any[]) {
      if (fr?.productName) {
        if (!fabCache.has(fr.productName)) fabCache.set(fr.productName, []);
        fabCache.get(fr.productName)!.push(fr);
      }
    }
  }
}

/**
 * TEG 의뢰마다 같은 P/N 의 FAB 의뢰서 lot 중 제외 공정이 아닌 lot 의 공정/투입시간을 Location 으로 채운다.
 * TEG LOT ID 와 같은 계열의 lot (예: NCKK90080 → NCKK9008x) 을 먼저 찾고, 없으면 같은 P/N 의 다른 lot 을 쓴다.
 * (이전 코드는 lot 이 없거나 모두 제외 공정이면 배열 끝을 넘어 읽다가 오류가 나서, 그 뒤 의뢰 전부 Location 이 비었음)
 */
function applyLocations() {
  const usable = (l: any) => l?.operation?.name && !EXCLUDED_OPERATIONS.has(l.operation.name);
  for (const app of applications.value as any[]) {
    const frs = fabCache.get(app.productName) ?? [];
    const lots = frs.flatMap((fr: any) => fr.lotStatus ?? []);
    const family = (app.lotId || "").slice(0, -1);
    const lot =
      (family.length >= 5 ? lots.find((l: any) => usable(l) && (l.lotId || "").startsWith(family)) : undefined) ??
      lots.find(usable);
    if (lot) {
      app.currentStage = lot.operation.name;
      app.currentStageTime = formatDateTime(lot.moveinDate);
    }
  }
}

onMounted(async () => {
  try {
    applications.value = await getTegApplication(props.category);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return;
  }
  // 목록은 먼저 보여주고 Location 은 뒤에서 채움
  applyLocations(); // 이미 받아 둔 모델은 바로 표시
  locationLoading.value = true;
  try {
    await loadFabForProducts(applications.value.map((a: any) => a.productName));
    applyLocations();
  } catch (error) {
    console.error("Location(FAB lot 위치) 조회 실패:", error);
  } finally {
    locationLoading.value = false;
  }
});

const filteredData = computed(() => {
  return applications.value.filter((item) =>
    (item.productName || "")
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});


// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const viewDetail = async (uuid: string) => {
  try {
    await router.push({ name: "LoadTegApplication", params: { uuid: uuid } });
  } catch (error) {
    console.error("Routing error:", error);
  }
};

function getRowClass({ row }: { row: TegApplication }) {
  const priority = Number(row.priority);
  return priority === 5 ? "high-priority" : "";
}

function filterTable() {
  currentPage.value = 1;
}
</script>

<style scope>
.search-box {
  margin-bottom: 10px;
}

.search-input {
  width: 200px;
}
.mr10 {
  margin-right: 10px;
}
.pagination-margin {
  margin-top: 20px;
}

.location-empty {
  color: #c0c4cc;
}

.high-priority {
  /* background-color: #ff6868; 밝은 빨간색 배경 */
  color: red; /* 흰색 글씨 */
  /* font-weight: bold; 굵은 글씨 */
}
</style>
