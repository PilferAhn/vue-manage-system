<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
    <!-- Pie chart를 그릴 canvas -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 플러그인 추가
import { chartColors } from "./Common"; // 공통 색상 불러오기
import { postChartData } from "./PdtPieChart";
import axios from "axios";

// Chart.js에 필요한 구성 요소를 등록
Chart.register(
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

const props = defineProps<{
  graphName: string;
  dateFrom: number;
  dateEnd: number;
}>();

const chartInstance = ref<Chart | null>(null);
const chartCanvas = ref<HTMLCanvasElement | null>(null);

// 페이지 로드 시 자동으로 요청 보내기
onMounted(async () => {
  const chartData = await postChartData(props.dateFrom, props.dateEnd);
  if (chartData) {
    renderPieChart(chartData);
  }
});

// API로부터 데이터 가져오는 함수
const fetchData = async (dateFrom: number, dateEnd: number) => {
  try {
    const response = await axios.post("/api/get_chart_data", {
      date_from: dateFrom,
      date_end: dateEnd,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return null;
  }
};

// Pie Chart 그리기 함수
const renderPieChart = (data: any) => {
  if (!chartCanvas.value) return;

  const labels = Object.keys(chartColors); // AGING, AMR 등
  const values = [
    data.AGING.reduce((a: number, b: number) => a + b, 0),
    data.AMR.reduce((a: number, b: number) => a + b, 0),
    data.FUSE.reduce((a: number, b: number) => a + b, 0),
    data.Life.reduce((a: number, b: number) => a + b, 0),
    data["Max_Fuse"].reduce((a: number, b: number) => a + b, 0),
    data.STEP.reduce((a: number, b: number) => a + b, 0),
  ];

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  // Pie chart 생성
  chartInstance.value = new Chart(chartCanvas.value, {
    type: "pie",
    data: {
      labels: labels, // key 값들
      datasets: [
        {
          data: values, // value 값들
          backgroundColor: Object.values(chartColors),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: props.graphName,
        },
        datalabels: {
          color: "#fff", // 텍스트 색상
          formatter: (value: number) => {
            return value; // 섹션 안에 실제 값을 표시
          },
          font: {
            weight: "bold",
            size: 14, // 글자 크기 조정
          },
        },
      },
    },
  });
};
</script>

<style scoped>
/* 차트의 크기를 지정 */
canvas {
  max-width: 100%;
  max-height: 500px;
  margin: auto;
}
</style>
