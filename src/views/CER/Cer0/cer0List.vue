<template>
  <div class="container">
    <h1>CER0 Form Data</h1>
    <el-table
      v-if="cer0Forms && cer0Forms.length"
      :data="cer0Forms"
      style="width: 100%"
      class="cer0-table"
    >
      <el-table-column type="index" label="#" width="50"> </el-table-column>
      <!-- <el-table-column prop="applicationUuid" label="Application UUID" width="200">
        </el-table-column> -->
      <el-table-column prop="requesterId" label="Requester ID" width="150">
      </el-table-column>
      <el-table-column prop="requesterName" label="Requester Name" width="150">
      </el-table-column>
      <el-table-column prop="dateOfCreated" label="Date Created" width="180">
      </el-table-column>
      <el-table-column prop="dateOfStart" label="Date of Start" width="180">
      </el-table-column>
      <el-table-column
        prop="dateOfWishToFinish"
        label="Date of Wish to Finish"
        width="180"
      >
        <template #default="scope">
          {{ scope.row.dateOfWishToFinish || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="dateOfCompleted"
        label="Date of Completed"
        width="180"
      >
        <template #default="scope">
          {{ scope.row.dateOfCompleted || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column prop="purpose" label="Purpose" width="200">
      </el-table-column>
      <el-table-column prop="modelName" label="Model Name" width="150">
      </el-table-column>
      <el-table-column prop="version" label="Version" width="100">
      </el-table-column>
      <el-table-column prop="m1Thick" label="M1 Thickness" width="200">
      </el-table-column>
      <el-table-column prop="layerStack" label="Layer Stack" width="200">
      </el-table-column>
      <el-table-column prop="lotId" label="Lot ID" width="150">
      </el-table-column>
      <el-table-column prop="waferId" label="Wafer ID" width="200">
      </el-table-column>
      <el-table-column prop="shot" label="Shot" width="100"> </el-table-column>
      <el-table-column prop="note" label="Note" width="300"> </el-table-column>
      <el-table-column prop="handler_id" label="Handler ID" width="150">
        <template #default="scope">
          {{ scope.row.handler_id || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column prop="handler_name" label="Handler Name" width="150">
        <template #default="scope">
          {{ scope.row.handler_name || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="100">
        <template #default="scope">
          {{ scope.row.status || "N/A" }}
        </template>
      </el-table-column>
    </el-table>
    <p v-else>No data available</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { CER0Form } from "../cer0-types";
import { fetchCER0FormData } from "./cer0List";

const cer0Forms = ref<CER0Form[] | null>(null);

// 선택 가능한 컬럼들의 초기 상태
const selectedColumns = ref<string[]>([
  "applicationUuid", // 기본적으로 보여질 컬럼들
  "requesterId",
  "handler_id",
  "handler_name",
  "status",
]);

onMounted(async () => {
  cer0Forms.value = await fetchCER0FormData();
});
</script>

<style scoped>
.cer0-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.column-selector {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.cer0-table {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
  text-align: center;
}

.el-table td {
  text-align: center;
  color: #606266;
  padding: 12px;
}

.el-table-column--selection .el-checkbox {
  display: flex;
  justify-content: center;
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.el-checkbox-group .el-checkbox {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
