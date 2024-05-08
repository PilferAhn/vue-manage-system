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
    <el-table-column label="Model Name" prop="productName"></el-table-column>
    <el-table-column label="LOT ID" prop="lotId"></el-table-column>
    <el-table-column label="Test Type" prop="measType"></el-table-column>
    <el-table-column label="개발자 / 의뢰자">
      <template #default="scope">
        <span>{{ scope.row.designer }}</span>
      </template>
    </el-table-column>
    <el-table-column label="예약일">
      <template #default="scope">
        <span>{{ formatTime(scope.row.dateOfReserve) }}</span>
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
    <el-table-column v-if="userType === 'admin'" label="Action">
      <!-- 추가된 '자세히' 버튼 컬럼 -->

      <template #default="scope">
        <el-button type="primary" @click="viewDetail(scope.row.applicationID)"
          >자세히</el-button
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
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

onMounted(async () => {
  try {
    applications.value = await getTegApplication(props.category);
    console.log(applications.value)
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

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const viewDetail = async (uuid: string) => {
  try {
    await router.push({ name: "TegApplicationDetail", params: { uuid: uuid } });
  } catch (error) {
    console.error("Routing error:", error);
  }
};

function getRowClass({ row }: { row: TegApplication }) {
    
  const priority = Number(row.priority)
  return priority === 5 ? 'high-priority' : '';
}

function filterTable() {
  currentPage.value = 1;
}
</script>

<style>
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
