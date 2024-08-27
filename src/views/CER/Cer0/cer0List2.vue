<template>
  <div class="cer0-container">
    <h1>CER0 Form Data</h1>
    <el-table
      v-if="cer0Forms && cer0Forms.length"
      :data="cer0Forms"
      style="width: 100%"
      class="cer0-table"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <el-card class="box-card">
            <div class="clearfix">
              <span>{{ scope.row.modelName }}</span>
            </div>

            <el-divider></el-divider>

            <!-- 사용자 정의 flex 레이아웃을 적용 -->
            <div class="row">
              <div class="column">
                <strong>Date of Wish to Finish:</strong>
                {{ scope.row.dateOfWishToFinish || "N/A" }}
              </div>
              <div class="column">
                <strong>Date of Completed:</strong>
                {{ scope.row.dateOfCompleted || "N/A" }}
              </div>
            </div>

            <el-divider></el-divider>

            <div class="row">
              <div class="column">
                <strong>M1 Thickness:</strong> {{ scope.row.m1Thick }}
              </div>
              <div class="column">
                <strong>Layer Stack:</strong> {{ scope.row.layerStack }}
              </div>
            </div>

            <el-divider></el-divider>

            <div class="row">
              <div class="column">
                <strong>Lot ID:</strong> {{ scope.row.lotId }}
              </div>
              <div class="column">
                <strong>Wafer ID:</strong> {{ scope.row.waferId }}
              </div>
            </div>

            <el-divider></el-divider>

            <div class="row">
              <div class="column">
                <strong>Shot:</strong> {{ scope.row.shot }}
              </div>
              <div class="column">
                <strong>Note:</strong> {{ scope.row.note }}
              </div>
            </div>
          </el-card>
        </template>
      </el-table-column>

      <el-table-column
        prop="requesterName"
        label="Requester"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="handlerName"
        label="Handler"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="dateOfCreated"
        label="Date Created"
        width="170"
      ></el-table-column>
      <el-table-column
        prop="purpose"
        label="Purpose"
        width="190"
      ></el-table-column>
      <el-table-column
        prop="modelName"
        label="Model Name"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="version"
        label="Version"
        width="100"
      ></el-table-column>
      <el-table-column prop="m1Thick" label="M1" width="250"></el-table-column>
      <el-table-column
        prop="layerStack"
        label="Layer"
        width="250"
      ></el-table-column>
      <el-table-column prop="status" label="Status" width="120">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" effect="dark">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Action" width="120">
        <template #default="scope">
          <el-button type="primary" round @click="viewDetails(scope.row.id)">
            자세히
          </el-button>
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

// cer0Forms 초기화
const cer0Forms = ref<CER0Form[] | null>(null);

// Vue Router 사용
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
    case "error":
      return "danger";
    default:
      return "info";
  }
}

// "자세히" 버튼 클릭 시 라우터 이동 함수
const viewDetails = async (id: string) => {
  try {
    await router.push({
      name: "loadCer0",
      params: { id: id },
    });
  } catch (error) {
    console.error("Routing error:", error);
  }
};

// 데이터를 가져오는 함수
async function fetchData() {
  try {
    const data = await fetchCER0FormData();
    cer0Forms.value = data;
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
}

// 컴포넌트가 마운트될 때 실행
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* 전역 스타일 초기화 */

.cer0-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  /* max-width: 1200px; */
  /* margin: 0 auto; */
  width: 100%;
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

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  padding: 0 10px;
}
</style>
