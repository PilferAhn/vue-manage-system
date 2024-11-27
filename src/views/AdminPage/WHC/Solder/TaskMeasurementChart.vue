<template>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <!-- Bar Charts Row -->
    <div style="display: flex; justify-content: space-between; gap: 20px;">
      <div style="flex: 1">
        <BarChart class="bar-container" v-if="isLoad" :title="'24년 11월 이후'" :y_max="1100" :data="measurementData" />
      </div>
    </div>

    <!-- Last Week and This Week Bar Charts Row -->
    <div style="display: flex; justify-content: space-between; gap: 20px;">
      <div  style="flex: 1">
        <BarChart2 class="bar-container" v-if="isLoad" :title="'Last Week'" :y_max="300" :data="lastWeek" />
      </div>
      <div  style="flex: 1">
        <BarChart2 class="bar-container" v-if="isLoad" :title="'This Week'" :y_max="300" :data="thisWeek" />
      </div>
    </div>

    <!-- Pie Charts Row -->
    <div style="display: flex; justify-content: space-between; gap: 20px;">
      <div class="pie-container">
        <pieChart v-if="isLoad" :title="'Last Week'" :data="lastWeek" />
      </div>
      <div class="pie-container">
        <pieChart v-if="isLoad" :title="'This Week'" :data="thisWeek" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import BarChart from "./BarChart.vue";
import BarChart2 from "./BarChart2.vue";
import pieChart from "./pie.vue"
import {
  getThisMonday,
  formatDate,
  adjustDate,
  getThisSunday
} from "../../../../utils/date-utils";
import axios from "axios";
import { format } from "path";

// Define the type for measurement data
type MeasurementData = Record<string, [number, number]>;
const thisWeek = ref<MeasurementData>({});
const lastWeek = ref<MeasurementData>({});

// Reactive variables to hold the fetched data and transformed data
const measurementData = ref<MeasurementData>({});
const transformedData = ref<MeasurementData>({});
const isLoad = ref(false);

// Function to fetch measurement history quantity
async function getWhcMeasurementHistoryQuantity(): Promise<MeasurementData> {
  const url = "/solder/get_measured_vs_requested";
  try {
    const response = await axios.get(url);
    // return prioritizeCharacteristicEvaluation(response.data);
    // return prioritizeKeys(response.data);
    return response.data
  } catch (error) {
    console.error("Error fetching measurement data:", error);
    return {};
  }
}

// Function to fetch measurement history quantity
async function getWhcMeasurementHistoryQuantityByDate(
  date: string
): Promise<MeasurementData> {
  const url = "/solder/get_measured_vs_requested_by_date/" + date;
  try {
    const response = await axios.get(url);
    return response.data
    // return prioritizeKeys(response.data);
  } catch (error) {
    console.error("Error fetching measurement data:", error);
    return {};
  }
}

function prioritizeCharacteristicEvaluation(data: Record<string, number[]>): Record<string, number[]> {
  const prioritizedKey = "특성 평가";

  // 특성 평가 데이터를 맨 앞에 배치
  const sortedData: Record<string, number[]> = {
    [prioritizedKey]: data[prioritizedKey], // 특성 평가를 먼저 추가
    ...Object.keys(data)
      .filter((key) => key !== prioritizedKey) // 나머지 키를 필터링
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {} as Record<string, number[]>),
  };

  return sortedData;
}

function prioritizeKeys(data: Record<string, number[]>): Record<string, number[]> {
  const prioritizedKey = "특성 평가";
  const psKey = "PS 신뢰성";

  // 필터링된 나머지 키
  const remainingKeys = Object.keys(data).filter((key) => key !== prioritizedKey && key !== psKey);

  // 결과를 구성
  const sortedData: Record<string, number[]> = {
    [prioritizedKey]: data[prioritizedKey], // 특성 평가를 먼저 추가
    ...remainingKeys.slice(0, 3).reduce((acc, key) => {
      acc[key] = data[key]; // 첫 3개 항목 추가
      return acc;
    }, {} as Record<string, number[]>),
    [psKey]: data[psKey], // PS 신뢰성을 4번째에 추가
    ...remainingKeys.slice(3).reduce((acc, key) => {
      acc[key] = data[key]; // 나머지 항목 추가
      return acc;
    }, {} as Record<string, number[]>),
  };

  console.log(sortedData)
  return sortedData;
}

function processMeasurementData(data: Record<string, number[]>): Record<string, number[]> {
  if (!data) return {};

  // 1. "PS 신뢰성" 값을 저장
  const value = data["PS 신뢰성"];
  const solderMes = data["특성 평가"]
  // 기존 키 삭제
  delete data["PS 신뢰성"];    
    delete data["내전력"];
  if (value) {
    // 객체를 배열로 변환하여 순서 조작
    const entries = Object.entries(data);

    // 새로운 키를 추가 및 삽입
    const targetIndex = 2; // 원하는 인덱스 설정
    entries.splice(targetIndex, 0, ["ESD", value]);
    
    entries.splice(0, 0, ["특성 평가", solderMes]);

        
    const updatedData = Object.fromEntries(entries);

    return updatedData
  }

  return data;
}


// Fetch data on component mount
onMounted(async () => {
  console.log(getThisMonday())
  measurementData.value = processMeasurementData(await getWhcMeasurementHistoryQuantity());
  thisWeek.value = processMeasurementData(await getWhcMeasurementHistoryQuantityByDate(formatDate(adjustDate(getThisMonday(), 7))));
  lastWeek.value = processMeasurementData(await getWhcMeasurementHistoryQuantityByDate(formatDate(getThisMonday())));

  // Generate transformed data for the second chart
  // transformedData.value = transformData(lastWeek.value);

  isLoad.value = true;
});
</script>


<style scoped>
.pie-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 50%; /* Ensure each pie chart takes half the width */
  /* background-color: #f9f9f9; */
  border: 1px solid #ddd; /* Optional: Border for better visual separation */
  padding: 10px;
  border-radius: 10px; /* Optional: Rounded corners */
}

.bar-container {
  
  border: 1px solid #ddd; /* Optional: Border for better visual separation */
  padding: 10px;
  border-radius: 10px; /* Optional: Rounded corners */
}
</style>

