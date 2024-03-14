<!-- PieChart.vue -->

<template>
  <div class="container">
    <div class="schart-box">
      <schart class="schart" canvasId="bar" :options="options1"></schart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, computed } from "vue";
import Schart from "vue-schart";
import axios from "../../utils/request";

interface testType {
  max: string[];
  life: string[];
  aging: string[];
  amr: string[];
  month: string[];
}

const testTypes = ref<testType>({
  max: [],
  life: [],
  aging: [],
  amr: [],
  month: [],
});

// 데이터를 가져오는 함수 정의
const fetchData = async () => {
  try {
    const response = await axios.get(
      "pdt_measurement/get_compeleted_mesurement_bar"
    );
    // 응답 데이터를 반응형 참조 변수에 저장

    testTypes.value = response.data; // .value 사용 제거
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(async () => {
  // getProductData 호출
  await fetchData();
});


const options1 = computed(() => {
  if (!testTypes.value) {
    return null; // 또는 초기 차트 데이터 구조
  }

  return {
    type: "bar",
    title: {
    text: "Product 의뢰 비율 (CHIP 기준)",
  },
  bgColor: "#fbfbfb",
  labels: testTypes.value.month,
  datasets: [
    {
      label: "MAX",
      fillColor: "rgba(241, 49, 74, 0.5)",
      data: testTypes.value.max,
    },
    {
      label: "Aging",
      data: testTypes.value.aging,
    },
    {
      label: "AMR",
      data: testTypes.value.amr,
    },
    {
      label: "Life Time",
      data: testTypes.value.life,
    },    
  ],
  };
});

const prop = defineProps(["tegTypes", "tegCount"]);

const tegTypes = prop.tegTypes;
const count = prop.tegCount;


</script>

<style scoped>
.schart {
  width: 100%;
  height: 300px;
}
</style>
