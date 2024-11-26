<template>
  <div>
    <div class="search-box">
      <el-select
        v-model="searchCategory"
        placeholder="검색 기준"
        class="search-dropdown"
        style="width: 150px"
      >
        <el-option label="Designer" value="designer"></el-option>
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
      class="custom-table"
      ref="multipleTable"
      height="700px"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="index"
        label="No"
        :align="'center'"
        width="70"
      ></el-table-column>

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

      <el-table-column
        sortable
        label="Request"
        width="130"
        :align="'center'"
        prop="createdDate"
      >
        <template #default="scope">
          {{ convertPythonTimeToVue(scope.row.createdDate) }}
        </template>
      </el-table-column>

      <el-table-column label="Finish" width="130" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.completionDate) }}
        </template>
      </el-table-column>

      <el-table-column label="Location" :align="'center'" width="150">
        <template #default="scope">
          {{ scope.row.childStageName }} <br />
          {{ scope.row.childOperation }}
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

      <el-table-column label="STOCK" width="300" :align="'center'">
        <el-table-column label="JIG용 Solder관리" width="150" :align="'center'">
          <template #default="scope">
            {{ scope.row.jigSolderId }}
            <br />
            {{ scope.row.jigSolderLoc }}
          </template>
        </el-table-column>
        <el-table-column label="완제품(Reel)" width="150" :align="'center'">
          <template #default="scope">
            {{ scope.row.reelId }}
            <br />
            {{ scope.row.reelLoc }}
          </template>
        </el-table-column>
      </el-table-column>

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
            @click="
              downloadSolderApplicationXlsx(
                scope.row,
                `/solder/download_solder_application_file3`
              )
            "
          >
            Excel
          </el-button>

          <el-button
            type="warning"
            size="small"
            @click="
              sendApplicationData2(scope.row, [], [], '/solder/update', 'load')
            "
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
import {
  sendApplicationData2,
  downloadSolderApplicationXlsx,
} from "../Application/SolderApplication";
import axios from "axios";
import { formatDate, formatDateTime } from "../../FAB/Common/Application";

const props = defineProps<{
  applicationData: ApplicationData[];
}>();

// 라우터 및 현재 경로 가져오기
const searchTerm = ref("");
const searchCategory = ref("modelName"); // 기본 검색 기준을 "Lot ID"로 설정
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

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: ApplicationData
  rowIndex: number
}) => {
  if (row.reelId !== undefined || row.jigSolderId !== undefined) {    
    
    return "el-warning"; // Ensure this matches your CSS class
  }
  return ''
}

// 셀에 적용할 클래스 반환
const cellClass = ({ row, rowIndex, column, columnIndex }) => {
  // 예: 짝수 행에만 스타일을 적용

  if (row.reelId !== undefined || row.jigSolderId !== undefined) {    
    
    if ([0].includes(columnIndex)) {
      return "even-row";
    }
  }

  return "";
};

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
    // console.log("Update successful:", response.data);
    // 성공 메시지 표시 또는 다른 후속 작업 수행
  } catch (error) {
    console.error("Error updating data:", error);
    // 에러 메시지 표시
  }
};
</script>

<style lang="scss" scoped>
/* 글로벌 적용 */

.custom-table ::v-deep(.el-warning) {
  background-color: hsl(
    0,
    76%,
    23%
  ) !important; /* Ensure the background changes */
  color: hsl(0, 68%, 12%) !important;
  font-size: 30px !important;
}

/* 헤더 스타일 */
.custom-table ::v-deep(.el-table__header-wrapper th) {
  font-weight: bold;
  font-size: 14px;
  background-color: #f1f5f9;
  color: #333;
  border: 1px solid #d1d5db;
}

/* 셀 스타일 */
.custom-table ::v-deep(.el-table__cell) {
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  font-size: 13px;
  color: #4b5563;
}

/* Hover 효과 */
.custom-table ::v-deep(.el-table__row:hover .el-table__cell) {
  background-color: #f3f4f6;
}

.custom-table ::v-deep(.even-row) {
  box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: rgb(243, 235, 235);
  border-radius: 1px;

  // padding: 4px;
}

.custom-table ::v-deep(.el-table__row.el-warning .el-table__cell) {
  background-color: hsl(0, 61%, 90%) !important;
  color: hsl(0 75% 7%) !important;
  
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

.pagination-margin {
  margin-top: 20px;
}

/* Button styles based on status */
.btn-in-progress {
  background-color: #007bff; /* Bright blue */
  /* border-color: #007bff !important; */
  color: #fff !important;
}

.btn-finished {
  background-color: #28a745; /* Bright green */
  /* border-color: #28a745 !important; */
  color: #fff !important;
}

/* Waiting 버튼 스타일 */
.btn-waiting {
  background-color: #d3d3d3; /* 밝은 회색 */
  color: #555 !important; /* 중간 회색 텍스트 */
  border: 1px solid #c0c0c0; /* 연한 회색 테두리 */
}

.button-grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3열로 고정 */
  gap: 10px; /* 버튼 간격 */
  justify-items: center; /* 버튼을 셀 중앙에 정렬 */
  align-items: center; /* 수직 방향으로도 중앙 정렬 */
  width: 100%; /* 컨테이너 너비를 100%로 설정 */
  margin: 0;
  padding: 0;
}

.fixed-size {
  width: 140px; /* 고정된 버튼 너비 */
  margin: 0;
  padding: 0;
}
</style>
