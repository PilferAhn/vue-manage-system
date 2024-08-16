<template>
  <div class="container">
    <h1>CER0 Form Data</h1>
    <el-table
      v-if="cer0Forms && cer0Forms.length"
      :data="cer0Forms"
      style="width: 100%"
      class="cer0-table"
    >
      <!-- Expandable Row for Details -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-card class="box-card">
            <div class="clearfix">
              <span>Details for {{ scope.row.modelName }}</span>
            </div>
            <el-descriptions bordered column="2" class="expand-details">
              <el-descriptions-item label="Date of Wish to Finish">
                {{ scope.row.dateOfWishToFinish || "N/A" }}
              </el-descriptions-item>
              <el-descriptions-item label="Date of Completed">
                {{ scope.row.dateOfCompleted || "N/A" }}
              </el-descriptions-item>
              <el-descriptions-item label="M1 Thickness">
                {{ scope.row.m1Thick }}
              </el-descriptions-item>
              <el-descriptions-item label="Layer Stack">
                {{ scope.row.layerStack }}
              </el-descriptions-item>
              <el-descriptions-item label="Lot ID">
                {{ scope.row.lotId }}
              </el-descriptions-item>
              <el-descriptions-item label="Wafer ID">
                {{ scope.row.waferId }}
              </el-descriptions-item>
              <el-descriptions-item label="Shot">
                {{ scope.row.shot }}
              </el-descriptions-item>
              <el-descriptions-item label="Note">
                {{ scope.row.note }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </template>
      </el-table-column>

      <!-- Primary Columns -->
      <el-table-column type="index" label="#" width="50"> </el-table-column>
      <!-- Action Column -->
      <el-table-column label="Action" width="120">
        <template #default="scope">
          <el-button
            type="primary"
            
            @click="viewDetails(scope.row.id)"
          >
            자세히
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="requesterName" label="Requester Name" width="150">
      </el-table-column>
      <el-table-column prop="dateOfCreated" label="Date Created" width="180">
      </el-table-column>
      <!-- <el-table-column prop="dateOfStart" label="Date of Start" width="180">
      </el-table-column> -->
      <el-table-column prop="purpose" label="Purpose" width="200">
      </el-table-column>
      <el-table-column prop="modelName" label="Model Name" width="150">
      </el-table-column>
      <el-table-column prop="version" label="Version" width="100">
      </el-table-column>
      <el-table-column prop="m1Thick" label="M1" width="250"> </el-table-column>
      <el-table-column prop="layerStack" label="Layer" width="250">
      </el-table-column>
      <el-table-column prop="status" label="Status" width="120">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" effect="dark">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <p v-else>No data available</p>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import type { CER0Form } from "../cer0-types";
import { fetchCER0FormData } from "./cer0List";

const cer0Forms = ref<CER0Form[] | null>(null);
const router = useRouter();
// 상태에 따른 태그 유형을 반환하는 함수
function getStatusType(status: string): string {
  switch (status) {
    case "created":
      return "info";
    case "in progress":
      return "warning";
    case "finished":
      return "success";
    default:
      return "default";
  }
}

// 선택 가능한 컬럼들의 초기 상태
const selectedColumns = ref<string[]>([
  "id", // 기본적으로 보여질 컬럼들
  "requesterId",
  "handler_id",
  "handler_name",
  "status",
]);

onMounted(async () => {
  cer0Forms.value = await fetchCER0FormData();
});

// "자세히" 버튼 클릭 시 라우터 이동
const viewDetails = async (id: string) => {
  // router.push({ name: "cer0List", params: { applicationUuid } });
  console.log(id)
  try {
    await router.push({
      name: "loadCer0",
      params: { id: id },
    });
  } catch (error) {
    console.error("Routing error:", error);
  }
};


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

.box-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.expand-details {
  margin-top: 10px;
}

.expand-details .el-descriptions__label {
  font-weight: bold;
  color: #303133;
}

.expand-details .el-descriptions__content {
  color: #606266;
}
</style>
