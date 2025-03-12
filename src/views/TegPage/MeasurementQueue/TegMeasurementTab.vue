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
        {{ scope.row.currentStage }} <br />
        {{ scope.row.currentStageTime }}
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

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  TegApplication,
  getTegApplication,
  formatTime,
} from "../../../utils/waferMeasurementHelper";
import { formatDateTime } from "../../../utils/date-utils";
import type { FabApplicationForm } from "../../../interface/mes-interface";

const props = defineProps<{
  category: string;
  pageSize: number;
  fabApp: FabApplicationForm[];
}>();

const userType = localStorage.getItem("ms_username");

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = props.pageSize;
const applications = ref<TegApplication[]>([]);

onMounted(async () => {
  try {
    applications.value = await getTegApplication(props.category);

    for (let i = 0; i < applications.value.length; i++) {
      let isFound = false;
      for (let j = 0; j < props.fabApp.length; j++) {
        if (applications.value[i].productName === props.fabApp[j].modelName) {
          let isFound2 = false;
          let foundedIndex = -1;

          for (let k = 0; k <= props.fabApp[j].lotStatus.length; k++) {
            if (
              ![
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
              ].includes(props.fabApp[j].lotStatus[k].operation.name)
            ) {
              isFound2 = true;
              foundedIndex = k;
              break;
            }
          }

          if (
            props.fabApp[j].lotStatus !== undefined &&
            props.fabApp[j].lotStatus.length >= 1 &&
            isFound2
          ) {
            applications.value[i].currentStage =
              props.fabApp[j].lotStatus[foundedIndex].operation.name;
            applications.value[i].currentStageTime = formatDateTime(
              props.fabApp[j].lotStatus[foundedIndex].moveinDate
            );
            isFound = true;
          }
        }
        if (isFound) {
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching applications:", error);
  }
});

const filteredData = computed(() => {
  return applications.value.filter((item) =>
    (item.productName || "")
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

watch(
  () => props.fabApp,
  (newVal) => {
    if (newVal.length >= 1) {
      for (let i = 0; i < applications.value.length; i++) {
        let isFound = false;
        for (let j = 0; j < props.fabApp.length; j++) {
          if (applications.value[i].productName === props.fabApp[j].modelName) {
            let isFound2 = false;
            let foundedIndex = -1;

            for (let k = 0; k <= props.fabApp[j].lotStatus.length; k++) {
              if (
                ![
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
                ].includes(props.fabApp[j].lotStatus[k].operation.name)
              ) {
                isFound2 = true;
                foundedIndex = k;
                break;
              }
            }

            if (
              props.fabApp[j].lotStatus !== undefined &&
              props.fabApp[j].lotStatus.length >= 1 &&
              isFound2
            ) {
              applications.value[i].currentStage =
                props.fabApp[j].lotStatus[foundedIndex].operation.name;
              applications.value[i].currentStageTime = formatDateTime(
                props.fabApp[j].lotStatus[foundedIndex].moveinDate
              );
              isFound = true;
            }
          }
          if (isFound) {
            break;
          }
        }
      }
    }
  },
  {
    immediate: true,
  }
);

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

.high-priority {
  /* background-color: #ff6868; 밝은 빨간색 배경 */
  color: red; /* 흰색 글씨 */
  /* font-weight: bold; 굵은 글씨 */
}
</style>
