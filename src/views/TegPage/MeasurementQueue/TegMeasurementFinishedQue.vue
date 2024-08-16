<template>
  <div class="container">
    <el-table
      :data="
        filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      border
      class="table"
      header-cell-class-name="table-header"
      :row-class-name="getRowClass"
    >
      
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
      <el-table-column v-if="userType === 'admin'" label="Action" width="330">
        <template #default="scope">
          <el-button
            type="primary"
            class="small-button"
            @click="openPathDialog(scope.row.applicationID)"
            :disabled="scope.row.applicationVersion === '1'"
            >데이터 복사</el-button
          >

          <el-button
            type="warning"
            class="small-button"
            @click="downloadZip(scope.row.applicationID)"
            :disabled="scope.row.applicationVersion === '1'"
            >zip 다운로드</el-button
          >

          <el-button
            type="success"
            class="small-button"
            @click="
              downloadPpt(scope.row.applicationID)
            "
            :disabled="scope.row.applicationVersion === '1'"
            >CER 다운로드</el-button
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

    <el-dialog :visible="dialogVisible" title="경로">
      <span>{{ path }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">닫기</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getNewTegApplication } from "../../../utils/tegUtility";
import { TegApplication } from "../../../utils/tegTypes";
import { logSearchQuery } from "../../AdminPage/TEG/TegApplicationListTable";
import {
  getTegApplication,
  formatTime,
} from "../../../utils/waferMeasurementHelper";
import { ElMessage } from "element-plus";
import { openPathDialog, downloadZip, downloadPpt } from "./TegMeasurementFinishedQue";

const userType = localStorage.getItem("ms_username");

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 10;
const applications = ref<TegApplication[]>([]);
const newApplications = ref<TegApplication[]>([]);
const dialogVisible = ref(false);
const path = ref("");

async function sendToServer() {
  logSearchQuery(searchQuery.value, "reserved");
}

onMounted(async () => {
  try {
    newApplications.value = await getNewTegApplication("finished");

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
  return applications.value.filter((item) =>
    item.applicationID.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

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

<style scoped>
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

.el-button {
  margin: 0 2px; /* 버튼 사이 여백 최소화 */
}

.table {
  table-layout: fixed; /* 테이블 레이아웃 고정 */
}

.el-button.small-button {
  padding: 5px 10px; /* 버튼 내부 여백 줄이기 */
  font-size: 12px; /* 폰트 크기 줄이기 */
  height: auto; /* 버튼 높이 자동 조절 */
  line-height: normal; /* 라인 높이 조절 */
  margin: 0 2px; /* 버튼 간 여백 최소화 */
}
</style>
