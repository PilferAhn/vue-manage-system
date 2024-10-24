<template>
  <div class="container">
    <canvas id="barChart1"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

import axios from "../../../utils/request";

import ChartDataLabels from "chartjs-plugin-datalabels";

// Chart.js에 필요한 모든 차트 타입과 기능을 등록
Chart.register(...registerables);

interface TestType {
  date_list: string[];
  TEG1: number[];
  TEG2: number[];
  TEG3: number[];
  TEG1_5: number[];
  TCF: number[];
}

const testTypes = ref<TestType>({
  date_list: [],
  TEG1: [],
  TEG2: [],
  TEG3: [],
  TEG1_5: [],
  TCF: [],
});

// 데이터를 가져오는 함수
const fetchData = async () => {
  try {
    const response = await axios.get("measurement/get_weekly_progress");
    testTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

let myChart: Chart | null = null;

onMounted(async () => {
  await fetchData();

  // Calculate the maximum value from all the lists and add 2
  const maxValues = [
    ...testTypes.value.TEG1,
    ...testTypes.value.TEG2,
    ...testTypes.value.TEG1_5,
    ...testTypes.value.TEG3,
    ...testTypes.value.TCF,
  ];
  const max = Math.max(...maxValues) + 2;
  // Function to sum all numbers in the teg1_list, teg2_list, and tcf_list arrays and return the result as a string
  const sumAllNumbersAsString = (): string => {
    const totalSum = [
      ...testTypes.value.TEG1,
      ...testTypes.value.TEG2,
      ...testTypes.value.TEG1_5,
      ...testTypes.value.TEG3,
      ...testTypes.value.TCF,
    ].reduce((acc, cur) => acc + cur, 0);
    return totalSum.toString();
  };

  const ctx = document.getElementById("barChart1") as HTMLCanvasElement;
  if (ctx) {
    myChart = new Chart(ctx, {
      type: "bar",

      data: {
        labels: testTypes.value.date_list,
        datasets: [
          {
            label: "TEG1",
            backgroundColor: "rgba(241, 89, 74, 0.8)" /* 빨강 */,
            data: testTypes.value.TEG1,
          },
          {
            label: "TEG1_5",
            backgroundColor: "rgba(76, 175, 80, 0.8)" /* 주황 */,
            data: testTypes.value.TEG1_5,
          },
          {
            label: "TEG2",
            backgroundColor: "rgba(63, 81, 181, 0.8)" /* 노랑 */,
            data: testTypes.value.TEG2,
          },
          {
            label: "TEG3",
            backgroundColor: "rgba(255, 193, 7, 0.8)" /* 주황 계열 */,
            data: testTypes.value.TEG3,
          },
          {
            label: "TCF",
            backgroundColor: "rgba(3, 169, 244, 0.8)" /* 파랑 계열 */,
            data: testTypes.value.TCF,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: max, // Set the computed max value as the maximum for the y-axis
          },
        },
        plugins: {
          title: {
            display: true,
            text:
              "TEG 측정 일간 측정 현황 (Wafer 기준) - " +
              sumAllNumbersAsString() +
              "장",
            font: {
              size: 25,
            },
          },
          // 데이터 포인트 위에 값을 표시하는 커스텀 플러그인 추가
          datalabels: {
            display: true,
            align: "center",
            anchor: "end",
            color: "#444",
            font: {
              weight: "bold",
            },
            formatter: (value, context) => {
              return value;
            },
          },
        },
        maintainAspectRatio: false,
      },
      plugins: [ChartDataLabels],
    });
  }
});
</script>

<style scoped>
.container {
  width: 90%;
  height: 300px;
}
</style>
