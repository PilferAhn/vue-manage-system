<template>
  <div>
    <canvas id="barChart" style="width: 800px; height: 600px;"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, defineProps } from "vue";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";

// Chart.js 모듈 등록
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);
Chart.register(ChartDataLabels);

// Props로 데이터를 받음
const props = defineProps<{
  data: Record<string, number[]>; // { measurement_type: [total_quantity, finished_quantity] }
}>();

// Chart 인스턴스
let chartInstance: Chart<"bar", number[], string> | null = null;

// Chart 생성 및 업데이트
const renderChart = () => {
  const ctx = document.getElementById("barChart") as HTMLCanvasElement;

  const labels = Object.keys(props.data); // X축 레이블
  const totalData = Object.values(props.data).map((item) => item[0]); // 총량 데이터
  const finishedData = Object.values(props.data).map((item) => item[1] || 0); // 완료량 데이터 (기본값 0)

  // 기존 Chart 제거
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Chart 구성
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "의뢰",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          data: totalData,
        },
        {
          label: "완료",
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          data: finishedData,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 비율 유지 비활성화
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (value) => value,
          font: {
            size: 12,
          },
        },
        title: {
          display: true, // 제목 표시
          text: "WHC 측정 현황(측정 종류별)", // 제목 내용
          font: {
            size: 18, // 글자 크기
            weight: "bold",
          },
          color: "#333", // 제목 색상
          padding: {
            top: 10,
            bottom: 20,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Measurement Types",
          },
        },
        y: {
          title: {
            display: true,
            text: "Quantity(Sample 수량)",
          },
          beginAtZero: true,
        },
      },
    },
  });
};

// 데이터 변경 감지 및 업데이트
watch(
  () => props.data,
  () => {
    renderChart();
  },
  { deep: true, immediate: true }
);

// 초기 렌더링
onMounted(() => {
  renderChart();
});
</script>
