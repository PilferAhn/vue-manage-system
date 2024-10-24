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
          <el-button class="btn-in-progress" size="mini" disabled
            >진행 중</el-button
          >
          <span>진행 중</span>
        </div>
        <div class="legend-item">
          <el-button class="btn-finished" size="mini" disabled>완료</el-button>
          <span>완료</span>
        </div>
        <div class="legend-item">
          <el-button class="btn-waiting" size="mini" disabled
            >대기 중</el-button
          >
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
    >
      <el-table-column
        prop="modelName"
        label="Product Name"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="lotId"
        label="Lot ID"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="designer"
        label="개발자"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="requester"
        label="의뢰자"
        align="center"
      ></el-table-column>

      <el-table-column label="진행도" align="center" width="400">
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
              {{ measurement.measurementType.toUpperCase() }}
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Action" align="center" width="250">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(scope.row)"
          >
            Details
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="handleUpdate(scope.row)"
          >
            Complete
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
import { updateStatusToComplete } from "../Application/SolderApplication";

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
    name: "loadSolderApplication",
    params: { applicationUuid: row.uuid },
  });
}
const emit = defineEmits(["status-updated"]);
function handleUpdate(row: ApplicationData) {
  updateStatusToComplete(row.uuid).then(() => {
    row.status = "finished";
    emit("status-updated");
  });
}
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
