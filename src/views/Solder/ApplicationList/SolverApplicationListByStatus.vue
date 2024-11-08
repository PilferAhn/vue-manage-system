<template>
  <div>
    <div class="search-box">
      <el-select
        v-model="searchCategory"
        placeholder="검색 기준"
        class="search-dropdown"
        style="width: 150px"
      >
        <el-option label="Lot ID" value="lotId"></el-option>
        <el-option label="Designer" value="designer"></el-option>
        <el-option label="Requester" value="requester"></el-option>
        <el-option label="Product Name" value="modelName"></el-option>
      </el-select>

      <!-- 검색어 입력 필드 -->
      <el-input
        v-model="searchTerm"
        :placeholder="`검색할 ${searchCategory} 입력`"
        class="search-input mr10"
        clearable
        @clear="handleClear"
        style="width: 300px"
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
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header"
      :row-class-name="tableRowClassName"
      height="700px"
    >
      <el-table-column
        prop="modelName"
        label="Product Name"
        width="120"
        :align="'center'"
      ></el-table-column>
      <el-table-column label="Stage" :align="'center'" width="460">
        <template #default="scope">
          <div class="button-grid-container">
            <el-button
              v-for="(measurement, index) in scope.row.measurements"
              :key="index"
              :class="getStatusClass(measurement.status)"
              size="small"
              class="fixed-size"
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

      <el-table-column label="Reqeust" width="87" :align="'center'">
        <template #default="scope">
          {{ convertPythonTimeToVue(scope.row.createdDate) }}
        </template>
      </el-table-column>

      <el-table-column label="Received" width="170" :align="'center'">
        <template #default="scope">
          <el-date-picker
            v-model="scope.row.receivedDate"
            type="date"
            placeholder="Select Date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DDTHH:mm:ss"
            style="width: 140px"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="lotId"
        label="FAB Lot ID"
        :align="'center'"
        width="110"
      ></el-table-column>

      <!-- <el-table-column
        prop="assayLotId"
        label="Assay LOT ID"
        width="130"
        :align="'center'"
      ></el-table-column> -->

      <el-table-column label="Assay LOT ID" width="170" :align="'center'">
        <template #default="scope">
          <div>
            <el-input
              v-model="scope.row.assayLotId"
              placeholder="Enter Assay LOT ID"
              style="width: 150px"
            ></el-input>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="designer"
        label="Designer"
        width="150"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.designer }} / {{ scope.row.requester }}</template
        >
      </el-table-column>

      <el-table-column label="Measurer" width="180" :align="'center'">
        <template #default="scope">
          <div>
            <el-input
              v-model="scope.row.measurer"
              placeholder=""
              style="width: 150px"
            ></el-input>
          </div>
        </template>
      </el-table-column>

      <!-- <div v-if="!isIdIncluded "> -->

      <el-table-column
        label="Detail"
        fixed="right"
        :align="'center'"
        width="290"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.files.length != 0"
            type="primary"
            size="small"
            @click="downloadFileByUrl(scope.row.uuid, scope.row.files[0].uuid)"
          >
            Excel
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            @click="downloadFileByUrl(scope.row.uuid, null)"
          >
            Excel
          </el-button>

          <el-button
            type="warning"
            size="small"
            @click="
              sendApplicationData2(scope.row, [], '/solder/update', 'load')
            "
            :disabled="!isIdIncluded"
          >
            Update
          </el-button>
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
          >
            삭제
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { ApplicationData } from "../../../interface/solderAppInterface";
import { useRouter, useRoute } from "vue-router";
import { downloadFileByUrl } from "../Application/LoadSolderApplication";
import { updateStatusByUuid } from "../Application/SolderApplication";
import SelectOptions from "../../Common/SelectOptions.vue";
import { statusList, confirmDelete } from "./SolderApplicationList";
import { convertPythonTimeToVue } from "../../Common/utility";
import { sendApplicationData2 } from "../Application/SolderApplication";
import axios from "axios";

const props = defineProps<{
  applicationData: ApplicationData[];
}>();

// 라우터 및 현재 경로 가져오기
const searchTerm = ref("");
const searchCategory = ref("lotId"); // 기본 검색 기준을 "Lot ID"로 설정
const route = useRoute();

onMounted(() => {
  // 쿼리 파라미터에 값이 있으면 사용, 없으면 localStorage 값 사용
  if (route.query.search) {
    searchTerm.value = route.query.search as string;
  } else if (localStorage.getItem("searchTerm")) {
    searchTerm.value = localStorage.getItem("searchTerm") as string;
  }
});

// 검색어가 변경될 때마다 `localStorage`에 저장
watch(searchTerm, (newTerm) => {
  localStorage.setItem("searchTerm", newTerm);
});

// Search term for filtering Lot ID

// props.applicationData.filter((application, index) => {
//   console.log(application.receivedDate)
// });

// 필터링 로직
// Lot ID, Designer, 또는 Requester로 검색 기능 추가
// 필터링 로직 - 선택된 검색 기준에 따라 필터링
const filteredApplicationData = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return props.applicationData.filter((item) => {
    // 선택한 검색 기준을 기준으로 필터링
    const field = item[searchCategory.value] as string;
    return field && field.toLowerCase().includes(term);
  });
});

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
const userId = localStorage.getItem("id");
const idArray = ["w2150704", "admin", "wh2409001"];
// id가 배열에 포함되어 있는지 확인
const isIdIncluded = idArray.includes(localStorage.id);

// 내가 이 Application 의 주인인지 아닌지를 결정
function isMyApplication(row: ApplicationData) {
  if (name === row.requester || name === row.designer) {
    return true;
  } else {
    return false;
  }
}

const router = useRouter();
function handleDetail(row: ApplicationData) {
  router.push({
    name: "CallSolderApplication",
    params: { applicationUuid: row.uuid },
  });
}
const emit = defineEmits(["status-updated"]);

const handleUpdate = async (uuid, assayLotId) => {
  const form = new FormData();
  form.append("application_uuid", uuid);
  form.append("assay_lot_id", assayLotId);

  try {
    const response = await axios.post("/solder/update_assay_lot_id", form);
    console.log("Update successful:", response.data);
    // 성공 메시지 표시 또는 다른 후속 작업 수행
  } catch (error) {
    console.error("Error updating data:", error);
    // 에러 메시지 표시
  }
};

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: ApplicationData;
  rowIndex: number;
}) => {
  if (row.receivedDate) {
    return "warning-row";
  }
  return;
};
</script>

<style>
/* Add any additional styles here */

.el-table__row.warning-row {
  background-color: rgb(255, 166, 0);
}

.table {
  min-height: 300px;
}
</style>

<style>
/* Adjusted styles */

.el-table__cell {
  font-size: 12px; /* 원하는 크기로 조정 */
  border: 1px solid #dcdfe6; /* 셀에 경계선 추가 */
  font-weight: 600; /* 글씨를 더 두껍게 설정 */
}

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
  /* border-color: #007bff !important; */
  color: #fff !important;
}

.btn-finished {
  background-color: #28a745 !important; /* Bright green */
  /* border-color: #28a745 !important; */
  color: #fff !important;
}

.btn-waiting {
  background-color: #918e8e !important;
  /* border-color: grey !important; */
  color: #fff !important;
  /* font-weight: bold;
  text-transform: uppercase; */
}

.button-grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개의 열로 배열 */
  justify-items: center;
}

.fixed-size {
  width: 130px; /* 고정된 버튼 너비 */
  text-align: center;
}
</style>
