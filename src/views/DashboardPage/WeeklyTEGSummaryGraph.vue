<template>
  <div class="container">
    <canvas id="barChart"></canvas>
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
  teg2_list: number[];
  tcf_list: number[];
}

const testTypes = ref<TestType>({
  month_list: [],
  teg1_list: [],
  teg2_list: [],
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

  const ctx = document.getElementById("barChart") as HTMLCanvasElement;
  if (ctx) {
    myChart = new Chart(ctx, {
      type: "bar",

      data: {
        labels: testTypes.value.month_list,
        datasets: [
          {
            label: "TEG1",
            backgroundColor: "rgba(241, 89, 74, 0.8)",
            data: testTypes.value.teg1_list,
          },
          {
            label: "TEG2",
            backgroundColor: "rgba(76, 175, 80, 0.8)",
            data: testTypes.value.teg2_list,
          },
          {
            label: "TCF",
            backgroundColor: "rgba(63, 81, 181, 0.8)",
            data: testTypes.value.tcf_list,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'TEG 월간 의뢰 비율 (Wafer 기준)',
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
