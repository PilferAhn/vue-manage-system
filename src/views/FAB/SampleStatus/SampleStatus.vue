<template>
  <div class="container">
    <!-- 시작 날짜와 끝 날짜 입력 필드 -->
    <el-form :inline="true">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="Select start date"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="End Date">
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="Select end date"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="filterFabData">Filter</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 필터링된 데이터가 표시되는 테이블 -->
    <el-table
      :data="paginatedData"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="idx" label="Index" width="80" sortable="custom" />
     
      <el-table-column
        prop="fabGroup"
        label="Fab Group"
        width="150"
        sortable="custom"
      />
      <el-table-column
        prop="productName"
        label="Product Name"
        width="200"
        sortable="custom"
      />
      <el-table-column prop="pl" label="PL" width="100" sortable="custom" />
      <el-table-column prop="spl" label="SPL" width="100" sortable="custom" />
      <el-table-column
        prop="lotId"
        label="Lot ID"
        width="150"
        sortable="custom"
      />
      <el-table-column
        prop="nowProcessPosition"
        label="Process Position"
        width="200"
        sortable="custom"
      />
    </el-table>

    <!-- 페이지네이션 컴포넌트 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="filteredFabData.length"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import type { FabData } from "./SampleStatusInterface";
import { getTodayAsString, getPastDateString } from "./SampleStatus";
import axios from "axios";

const fabData = ref<FabData[]>([]); // 전체 데이터를 저장
const filteredFabData = ref<FabData[]>([]); // 필터링된 데이터를 저장
const startDate = ref<Date | null>(null); // 시작 날짜
const endDate = ref<Date | null>(null); // 끝 날짜

// 페이지네이션 관련 변수
const currentPage = ref(1);
const pageSize = ref(20); // 한 페이지에 표시할 항목 수
// 정렬 처리 함수
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  if (order === "ascending") {
    paginatedData.value.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
  } else if (order === "descending") {
    paginatedData.value.sort((a, b) => (a[prop] < b[prop] ? 1 : -1));
  }
};
const url =
  "http://10.20.10.114/bfsm2/splPlanOfCommitment?hideCheck=false&searchStartTime=2024-09-18&searchEndTime=" +
  getTodayAsString();

// 현재 날짜와 한 달 전 날짜를 설정하는 함수
const setInitialDates = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  startDate.value = lastMonth;
  endDate.value = today;
};

const fetchFabData = async () => {
  try {
    const response = await axios.get<FabData[]>(url);
    fabData.value = response.data;
    filteredFabData.value = fabData.value; // 초기에는 모든 데이터를 표시
    filterFabData(); // 데이터를 가져온 후 필터링 한 번 실행
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// fabIn 날짜 기준으로 데이터를 필터링하고 정렬하는 함수
const filterFabData = () => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value).getTime();
    const end = new Date(endDate.value).getTime();

    // 먼저 realFabIn이 null인 항목을 먼저 찾고 idx로 내림차순 정렬
    const nullRealFabIn = fabData.value
      .filter((item) => item.realFabIn === null)
      .sort((a, b) => b.idx - a.idx);

    // realFabIn이 null이 아닌 항목을 startDate와 endDate로 필터링 후 idx로 내림차순 정렬
    const filteredByDate = fabData.value
      .filter(
        (item) =>
          item.realFabIn !== null &&
          new Date(item.realFabIn).getTime() >= start &&
          new Date(item.realFabIn).getTime() <= end
      )
      .sort((a, b) => b.idx - a.idx);

    // 두 배열을 합쳐서 필터링된 데이터를 생성
    filteredFabData.value = [...nullRealFabIn, ...filteredByDate];
  } else {
    // 날짜가 선택되지 않으면 모든 데이터를 표시하고 정렬
    filteredFabData.value = fabData.value.sort((a, b) => b.idx - a.idx);
  }
};

// 페이지네이션에 맞춰 데이터를 자르는 계산 속성
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFabData.value.slice(start, end);
});

// 페이지 변경 시 호출되는 함수
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 컴포넌트가 마운트될 때 데이터 가져오기 및 날짜 설정
onMounted(() => {
  setInitialDates(); // 시작 날짜와 끝 날짜를 설정
  fetchFabData(); // 데이터를 가져온 후 필터링을 자동으로 실행
});
</script>

<style>
.container {
  padding: 20px;
}
</style>
