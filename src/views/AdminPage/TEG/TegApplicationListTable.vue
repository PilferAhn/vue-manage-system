<template>
  <div class="search-panel">
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        class="search-input mr10"
        placeholder="QR Code를 스켄하세요"
      ></el-input>
      <el-button @click="filterTable">Search</el-button>

      <!-- 접수 버튼 추가 -->
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
    <el-table-column label="UUID" prop="applicationID"></el-table-column>
    <el-table-column label="Model Name" prop="productName"></el-table-column>
    <el-table-column label="LOT ID" prop="lotId"></el-table-column>
    <el-table-column label="Test Type" prop="measType"></el-table-column>
    <el-table-column label="개발자 / 의뢰자">
      <template #default="scope">
        <span>{{ scope.row.designer }}</span>
      </template>
    </el-table-column>
    <el-table-column label="의뢰서 작성일">
      <template #default="scope">
        <span>{{ formatTime(scope.row.dateOfCreated) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="완료일">
      <template #default="scope">
        <span>{{ formatTime(scope.row.dateOfFinished) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="진행도">
      <template #default="scope">
        <span>{{ scope.row.progress }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="우선순위"
      prop="priority"
      width="100px"
    ></el-table-column>
    <el-table-column v-if="userType === 'admin'" label="Action" width="300">
      <!-- 추가된 '자세히' 버튼 컬럼 -->

      <template #default="scope">
        <el-button type="success" @click="sendToServer(scope.row.applicationID)"
          >접수</el-button
        >
        <el-button
          type="primary"
          @click="
            viewDetail(scope.row.applicationID, scope.row.applicationType)
          "
          :disabled="scope.row.applicationVersion === '1'"
          >자세히</el-button
        >
        <el-button
          type="danger"
          @click="
            viewDetail(scope.row.applicationID, scope.row.applicationType)
          "
          :disabled="scope.row.applicationVersion === '1'"
          >삭제</el-button
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
  <div style="margin-top: 30px">
    <div class="search-panel">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          class="search-input mr10"
          placeholder="QR Code를 스켄하세요"
        ></el-input>
        <el-button @click="filterTable">Search</el-button>

        <!-- 접수 버튼 추가 -->
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
      <el-table-column label="UUID" prop="applicationID"></el-table-column>
      <el-table-column label="Model Name" prop="productName"></el-table-column>
      <el-table-column label="LOT ID" prop="lotId"></el-table-column>
      <el-table-column label="Test Type" prop="measType"></el-table-column>
      <el-table-column label="개발자 / 의뢰자">
        <template #default="scope">
          <span>{{ scope.row.designer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="의뢰서 작성일">
        <template #default="scope">
          <span>{{ formatTime(scope.row.dateOfCreated) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="완료일">
        <template #default="scope">
          <span>{{ formatTime(scope.row.dateOfFinished) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="진행도">
        <template #default="scope">
          <span>{{ scope.row.progress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="우선순위"
        prop="priority"
        width="100px"
      ></el-table-column>
      <el-table-column v-if="userType === 'admin'" label="Action" width="300">
        <!-- 추가된 '자세히' 버튼 컬럼 -->

        <template #default="scope">
          <el-button
            type="success"
            @click="sendToServer(scope.row.applicationID)"
            >접수</el-button
          >
          <el-button
            type="primary"
            @click="
              viewDetail(scope.row.applicationID, scope.row.applicationType)
            "
            :disabled="scope.row.applicationVersion === '1'"
            >자세히</el-button
          >
          <el-button
            type="danger"
            @click="
              viewDetail(scope.row.applicationID, scope.row.applicationType)
            "
            :disabled="scope.row.applicationVersion === '1'"
            >삭제</el-button
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { getNewTegApplication } from "../../../utils/tegUtility";
import { TegApplication as newTegApplications } from "../../../utils/tegTypes";
// import { logSearchQuery } from "./TegApplicationListTable";
import { updateApplicationStatus } from "./TegApplicationListTable";

import {
  TegApplication,
  getTegApplication,
  formatTime,
} from "../../../utils/waferMeasurementHelper";

const props = defineProps<{
  category: string;
  pageSize: number;
}>();

const userType = localStorage.getItem("ms_username");

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = props.pageSize;
const applications = ref<TegApplication[]>([]);
const newApplications = ref<TegApplication[]>([]);

async function sendToServer(uuid: string) {
  updateApplicationStatus(uuid, "reserved");
}

onMounted(async () => {
  try {
    newApplications.value = await getNewTegApplication(props.category);
    // applications.value = await getTegApplication(props.category);

    const combinedApplications = [
      ...newApplications.value,
      ...applications.value,
    ];
    applications.value = combinedApplications; // 원래의 applications ref를 업데이트
  } catch (error) {
    console.error("Error fetching applications:", error);
  }
});

const filteredData = computed(() => {
  return applications.value.filter(
    (item) =>
      item.applicationID
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      item.lotId.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const viewDetail = async (uuid: string, applicationType: string) => {
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

/* 추가된 버튼 스타일 */
.el-button--warning {
  background-color: #f1c40f;
  border-color: #f1c40f;
  color: #fff;
}
</style>
./TegApplicationListTable
