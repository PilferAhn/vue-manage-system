<template>
  <div class="container">
    <canvas id="pieChart2"></canvas>
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
  TEG0: number[];
  TEGP: number[];
  TEG1: number[];
  TEG2: number[];
  TEG3: number[];
  TEG1_5: number[];
  TCF: number[];
}

const testTypes = ref<TestType>({
  date_list: [],
  TEG0: [],
  TEGP: [],
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

  // 각 데이터 유형의 합계를 계산
  const sumTEG1 = testTypes.value.TEG1.reduce((acc, cur) => acc + cur, 0);
  const sumTEG2 = testTypes.value.TEG2.reduce((acc, cur) => acc + cur, 0);
  const sumTEG1_5 = testTypes.value.TEG1_5.reduce((acc, cur) => acc + cur, 0);
  const sumTCF = testTypes.value.TCF.reduce((acc, cur) => acc + cur, 0);
  const sumTEG3  = testTypes.value.TEG3.reduce((acc, cur) => acc + cur, 0);  
  const sumTEG0 = testTypes.value.TEG0.reduce((acc, cur) => acc + cur, 0);
  const sumTEGP = testTypes.value.TEGP.reduce((acc, cur) => acc + cur, 0);
  const totalWafer = sumTCF + sumTEG1 + sumTEG1_5 + sumTEG2 + sumTEG3 + sumTEG0 + sumTEGP;

  const ctx = document.getElementById("pieChart2") as HTMLCanvasElement;
  if (ctx) {
    myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["TEG0", "TEGP", "TEG1", "TEG1_5", "TEG2", "TEG3", "TCF"],
        datasets: [
          {
            data: [sumTEG0, sumTEGP, sumTEG1, sumTEG1_5, sumTEG2, sumTEG3 ,sumTCF],
            backgroundColor: [
              "rgba(255, 99, 132, 0.9)",
              "rgba(255, 159, 64, 0.9)", // 밝은 주황 계열
              "rgba(255, 205, 86, 0.9)", // 노랑 계열
              "rgba(75, 192, 192, 0.9)", // 민트 계열
              "rgba(54, 162, 235, 0.9)", // 파랑 계열
              "rgba(153, 102, 255, 0.9)", // 보라 계열
              "rgba(201, 203, 207, 0.9)", // 회색 계열
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "TEG 일간 측정 현황 (Wafer 기준) - " + totalWafer + "장",
            font : {
              size : 25
            }
          },
          datalabels: {
            display: true,
            color: "#444",
            font: {
              weight: "bold",
              size : 15
            },
            formatter: (value, context) => value.toString(),
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
