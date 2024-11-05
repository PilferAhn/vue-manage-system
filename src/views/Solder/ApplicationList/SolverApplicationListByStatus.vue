<template>
  <div>
    <div class="search-box">
      <el-input
        v-model="searchTerm"
        placeholder="Lot ID 검색"
        class="search-input mr10"
        clearable
        @clear="handleClear"
      ></el-input>
      <el-button type="primary" @click="handleSearch">검색</el-button>

      <div class="legend">
        <div class="legend-item">
          <el-button class="btn-in-progress" disabled>진행 중</el-button>
          <span>진행 중</span>
        </div>
        <div class="legend-item">
          <el-button class="btn-finished" disabled>완료</el-button>
          <span>완료</span>
        </div>
        <div class="legend-item">
          <el-button class="btn-waiting" disabled>대기 중</el-button>
          <span>대기 중</span>
        </div>
      </div>
    </div>
    <el-table
      :data="filteredApplicationData"
      border
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header"
      style="width: 100%"
      height="700px"
    >
      <el-table-column
        prop="modelName"
        label="Product Name"
        width="150"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        prop="lotId"
        label="FAB Lot ID"
        :align="'center'"
        width="150"
      ></el-table-column>

      <el-table-column        
        prop="assayLotId"
        label="Assay LOT ID"
        width="150"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        v-if="isIdIncluded"
        prop="designer"
        label="Assay LOT ID"
        width="300"
        :align="'center'"
      >
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-input
              v-model="scope.row.assayLotId"
              placeholder="Enter Assay LOT ID"
              width="150"
            ></el-input>
            <el-button
              type="primary"
              @click="handleUpdate(scope.row.uuid, scope.row.assayLotId)"
            >
              Update
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="designer"
        label="Designer"
        width="150"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        prop="requester"
        label="Requester"
        width="150"
        :align="'center'"
      ></el-table-column>

      <el-table-column label="Date Of Reqeust" width="150" :align="'center'">
        <template #default="scope">
          {{ convertPythonTimeToVue(scope.row.createdDate) }}
        </template>
      </el-table-column>

      <el-table-column label="Date Of Received" width="150" :align="'center'">
        <template #default="scope"> - </template>
      </el-table-column>

      <el-table-column label="Stage" :align="'center'" width="500">
        <template #default="scope">
          <div>
            <el-button
              v-for="(measurement, index) in scope.row.measurements"
              :key="index"
              :class="getStatusClass(measurement.status)"
              size="small"
              class="mr5"
              disabled
              plain
            >
              <i
                v-if="measurement.status === 'in progress'"
                class="el-icon-loading mr5"
              ></i>
              <i
                v-if="measurement.status === 'finished'"
                class="el-icon-check mr5"
              ></i>
              {{
                measurement.measurementType.toUpperCase() === "비선형"
                  ? "Non-Linearity"
                  : measurement.measurementType.toUpperCase() === "PS 신뢰성"
                  ? "ESD"
                  : measurement.measurementType.toUpperCase() === "내전력"
                  ? "PDT"
                  : measurement.measurementType.toUpperCase() === "특성 평가"
                  ? "Solder Measurement"
                  : measurement.measurementType.toUpperCase()
              }}
            </el-button>
          </div>
        </template>
      </el-table-column>

      <!-- <div v-if="!isIdIncluded "> -->

      <!-- </div> -->
      <el-table-column label="Detail" :align="'center'" width="200">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            @click="handleDetail(scope.row)"
          >
            Details
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            :disabled="!isIdIncluded"
          >
            삭제
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ApplicationData } from "../../../interface/solderAppInterface";
import { useRouter } from "vue-router";
import { updateStatusByUuid } from "../Application/SolderApplication";
import SelectOptions from "../../Common/SelectOptions.vue";
import { statusList, confirmDelete } from "./SolderApplicationList";
import { convertPythonTimeToVue } from "../../Common/utility";
import axios from "axios";

const props = defineProps<{
  applicationData: ApplicationData[];
}>();

// Search term for filtering Lot ID
const searchTerm = ref("");
const filteredApplicationData = computed(() =>
  props.applicationData.filter((data) =>
    data.lotId.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

// Method to handle the search button click
function handleSearch() {
  // Already filtered via the computed property
}

// Clear the search input
function handleClear() {
  searchTerm.value = ""; // Reset search term
}

function handleDelete(row: ApplicationData) {
  // 삭제 확인 팝업을 띄운 후 콜백으로 삭제 처리를 넘깁니다
  confirmDelete(row, (uuid: string) => {
    emit("status-updated", uuid); // 삭제 처리
  });
}

function getStatusClass(status: string) {
  switch (status) {
    case "in progress":
      return "btn-in-progress";
    case "finished":
      return "btn-finished";
    case "created":
      return "btn-waiting";
    default:
      return "";
  }
}

// w2150704, admin // wh2409001

const name = localStorage.getItem("ms_username");
const idArray = ["w2150704", "admin", "wh2409001"];
// id가 배열에 포함되어 있는지 확인
const isIdIncluded = idArray.includes(localStorage.id);

const router = useRouter();
function handleDetail(row: ApplicationData) {
  router.push({
    name: "loadSolderApplication",
    params: { applicationUuid: row.uuid },
  });
}
const emit = defineEmits(["status-updated"]);

const handleUpdate = async (uuid, assayLotId) => {

  const form = new FormData()
  form.append("application_uuid", uuid)
  form.append("assay_lot_id", assayLotId)

  try {
    const response = await axios.post('/solder/update_assay_lot_id', form);
    console.log('Update successful:', response.data);
    // 성공 메시지 표시 또는 다른 후속 작업 수행
  } catch (error) {
    console.error('Error updating data:', error);
    // 에러 메시지 표시
  }
};
</script>

<style scoped>
/* Add any additional styles here */
.table {
  min-height: 300px;
}
</style>

<style scoped>
/* Adjusted styles */
.container {
  margin: 20px;
  min-height: 400px;
  padding: 10px;
}

.search-box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.search-input {
  width: 200px;
  margin-right: 10px; /* Ensures proper spacing between search input and button */
}

.legend {
  display: flex;
  margin-left: auto; /* Pushes the legend to the right side */
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.legend-item span {
  margin-left: 5px;
  font-size: 14px;
}

.table {
  min-height: 300px;
  width: 100%; /* Ensure table width fits its container */
}

.pagination-margin {
  margin-top: 20px;
}

/* Button styles based on status */
.btn-in-progress {
  background-color: #007bff !important; /* Bright blue */
  border-color: #007bff !important;
  color: #fff !important;
}

.btn-finished {
  background-color: #28a745 !important; /* Bright green */
  border-color: #28a745 !important;
  color: #fff !important;
}

.btn-waiting {
  background-color: grey !important;
  border-color: grey !important;
  color: #fff !important;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
