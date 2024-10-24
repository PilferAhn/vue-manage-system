<template>
  <div class="container">
    <canvas id="pieChart1"></canvas>
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
  TEG1_5 : number[];
  TCF: number[];
}

const testTypes = ref<TestType>({
  date_list: [],
  TEG1: [],
  TEG2: [],
  TEG3: [],
  TEG1_5 : [],
  TCF: [],
});

// 데이터를 가져오는 함수
const fetchData = async () => {
  try {
    const response = await axios.get("measurement/get_weekly_progress2");
    testTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

let myChart: Chart | null = null;

onMounted(async () => {
  await fetchData();

  // 각 배열의 합계를 계산
  const sumTEG1 = testTypes.value.TEG1.reduce((acc, cur) => acc + cur, 0);
  const sumTEG2 = testTypes.value.TEG2.reduce((acc, cur) => acc + cur, 0);
  const sumTEG1_5 = testTypes.value.TEG1_5.reduce((acc, cur) => acc + cur, 0);
  const sumTCF = testTypes.value.TCF.reduce((acc, cur) => acc + cur, 0);
  const sumTEG3  = testTypes.value.TEG3.reduce((acc, cur) => acc + cur, 0);

  const totalWafer = sumTCF + sumTEG1 + sumTEG1_5 + sumTEG2 + sumTEG3;

  const ctx = document.getElementById("pieChart1") as HTMLCanvasElement;
  if (ctx) {
    myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["TEG1", "TEG1_5", "TEG2", "TEG3", "TCF"],
        datasets: [
          {
            data: [sumTEG1, sumTEG1_5, sumTEG2, sumTEG3 ,sumTCF],
            backgroundColor: [
              "rgba(241, 89, 74, 0.8)",
              "rgba(255, 215, 0, 0.8)",
              "rgba(76, 175, 80, 0.8)",
              "rgba(63, 81, 181, 0.8)",
              "rgba(3, 169, 244, 0.8)" 
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "TEG 측정 일간 측정 현황 (Wafer 기준) - " + totalWafer + "장",
            font : {
              size : 25
            }
          },
          // 데이터 포인트 위에 값을 표시하는 커스텀 플러그인 추가
          datalabels: {
            display: true,
            color: "#444",
            font: {
              weight: "bold",
              size : 15
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
