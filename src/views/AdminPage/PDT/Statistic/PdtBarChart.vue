<template>
  <div>
    <canvas ref="barChartCanvas"></canvas>
    <!-- Bar chart를 그릴 canvas -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js"; // Chart.js 요소들 import
import { chartColors } from './Common'; // 공통 색상 불러오기
import axios from "axios"; // HTTP 요청을 위해 axios 사용

// Chart.js에 필요한 구성 요소를 등록
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

// 부모 컴포넌트로부터 date를 props로 전달받음
const props = defineProps<{
  graphName: string;
  dateFrom: number;
  dateEnd: number;
}>();

const chartInstance = ref<Chart | null>(null); // Chart.js 인스턴스를 참조
const barChartCanvas = ref<HTMLCanvasElement | null>(null); // 차트를 그릴 canvas 참조

// 페이지 로드 시 자동으로 바 차트 렌더링
onMounted(async () => {
  const chartData = await fetchData(props.dateFrom, props.dateEnd);
  if (chartData) {
    renderBarChart(chartData);
  }
});

// API로부터 데이터 가져오는 함수
const fetchData = async (dateFrom: number, dateEnd: number) => {
  try {
    const response = await axios.post(
      "/pdt_application/get_finished_task_cnt_bar",
      {
        date_from: dateFrom,
        date_end: dateEnd,
      }
    );

    // 서버로부터 받은 데이터를 반환 (데이터 형식은 예시로 받은 데이터 형태)
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return null;
  }
};

// Bar Chart 그리기 함수
const renderBarChart = (data: any) => {
  if (!barChartCanvas.value) return;

  // 데이터셋 설정
  const labels = data.label; // X축 레이블 (날짜)
  const datasets = [
    {
      label: "AGING",
      data: data.AGING,
      backgroundColor: chartColors.AGING,
    },
    {
      label: "AMR",
      data: data.AMR,
      backgroundColor: chartColors.AMR,
    },
    {
      label: "FUSE",
      data: data.FUSE,
      backgroundColor: chartColors.FUSE,
    },
    {
      label: "Life",
      data: data.Life,
      backgroundColor: chartColors.Life,
    },    
    {
      label: "Max Fuse",
      data: data["Max Fuse"],
      backgroundColor: chartColors.Max_Fuse,
    },
    {
      label: "STEP",
      data: data.STEP,
      backgroundColor: chartColors.STEP,
    },
  ];

  // 기존 차트가 있으면 삭제
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  // Bar chart 생성
  chartInstance.value = new Chart(barChartCanvas.value, {
    type: "bar",
    data: {
      labels: labels, // X축 레이블 (날짜)
      datasets: datasets, // 각 데이터셋 (AGING, AMR 등)
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: props.graphName,
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          stacked: false, // 데이터를 그룹별로 나란히 표시 (누적하지 않음)
        },
        y: {
          beginAtZero: true, // Y축이 0부터 시작
        },
      },
    },
  });
};
</script>

<style scoped>
/* 차트의 크기를 지정 */
canvas {
  max-width: 100%; /* 화면에 꽉 차도록 설정 */
  height: 400px; /* 원하는 차트 높이 */
}
</style>
