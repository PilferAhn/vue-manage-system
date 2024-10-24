<template>
  <div class="container">
    <canvas id="barChart1"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
import axios from "../../utils/request";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.js에 필요한 모든 차트 타입과 기능을 등록
Chart.register(...registerables);

interface TestType {
  month_list: string[];
  teg1_list: number[];
  teg15_list : number[];
  teg2_list: number[];
  teg3_list : number[];
  tcf_list: number[];
}

const testTypes = ref<TestType>({
  month_list: [],
  teg1_list: [],
  teg15_list : [],
  teg2_list: [],
  teg3_list : [],
  tcf_list: [],
});

// 데이터를 가져오는 함수
const fetchData = async () => {
  try {
    const response = await axios.get("wafer/get_wafer_count_by_meas_type");
    testTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

let myChart: Chart | null = null;

onMounted(async () => {
  await fetchData();

  const ctx1 = document.getElementById("barChart1") as HTMLCanvasElement;
  if (ctx1) {
    myChart = new Chart(ctx1, {
      type: "bar",

      data: {
        labels: testTypes.value.month_list,
        datasets: [
          {
            label: "TEG1",
            backgroundColor: "rgba(241, 89, 74, 0.8)",   /* 빨강 */
            data: testTypes.value.teg1_list,
          },
          {
            label: "TEG1.5",
            backgroundColor: "rgba(76, 175, 80, 0.8)", /* 주황 */
            data: testTypes.value.teg15_list,
          },
          {
            label: "TEG2",
            backgroundColor: "rgba(63, 81, 181, 0.8)", /* 노랑 */
            data: testTypes.value.teg2_list,
          },
          {
            label: "TEG3",
            backgroundColor: "rgba(255, 193, 7, 0.8)",   /* 주황 계열 */
            data: testTypes.value.teg3_list,
          },
          {
            label: "TCF",
            backgroundColor: "rgba(3, 169, 244, 0.8)" ,   /* 파랑 계열 */
            data: testTypes.value.tcf_list,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'TEG 월간 측정 현황 (Wafer 기준)',
            font : {
              size : 25
            }          
          },
          // 데이터 포인트 위에 값을 표시하는 커스텀 플러그인 추가
          datalabels: {
            display: true,
            align: 'center',
            anchor: 'end',
            color: '#444',
            font: {
              weight: 'bold'
            },
            formatter: (value, context) => {
              return value;
            }
          }
        },
        maintainAspectRatio : false,
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
