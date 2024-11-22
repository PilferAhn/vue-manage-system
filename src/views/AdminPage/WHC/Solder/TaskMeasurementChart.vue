<template>
  <div>
    <BarChart v-if="isLoad" :data="measurementData" />
    <PeiChart  v-if="isLoad"></PeiChart>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import BarChart from "../../../Chart/BarChart.vue";
import PeiChart from "./pie.vue"
import axios from "axios";

// Define the type for measurement data
type MeasurementData = Record<string, [number, number]>;

// Reactive variable to hold the fetched data with initial empty object
const measurementData = ref<MeasurementData>({});
const isLoad = ref(false);
// Function to fetch measurement history quantity
async function getWhcMeasurementHistoryQuantity(): Promise<MeasurementData> {
  const url = "/solder/get_measured_vs_requested";
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("Error fetching measurement data:", error);
    return {};
  }
}

// Fetch data on component mount
onMounted(async () => {
  measurementData.value = await getWhcMeasurementHistoryQuantity();
  if (measurementData.value && measurementData.value["PS 신뢰성"]) {
    // 1. 기존 키의 값을 저장
    const value = measurementData.value["PS 신뢰성"];

    // 2. 새로운 키를 추가하고 기존 값을 할당
    measurementData.value["PS 신뢰성(ESD)"] = value;

    // 3. 기존 키를 삭제
    delete measurementData.value["PS 신뢰성"];
  }
  isLoad.value = true;
});
</script>
