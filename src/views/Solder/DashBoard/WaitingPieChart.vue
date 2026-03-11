<template>
  <div>
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Chart.js 요소 등록
Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Props 선언: 부모로부터 데이터를 받음
const props = defineProps<{
  measurements: Array<{
    type: string;
    cnt: number;
    measurements: Array<{ status: string; cnt: number }>;
  }>;
  maxY: number;
}>();

const barChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null; // 기존 차트 인스턴스를 저장

// Chart.js 데이터 생성 함수
const createChart = () => {
  if (barChart.value) {
    const labels = props.measurements.map((item) => item.type);

    const statusList = ["In Progress", "Waiting Sample"];
    const barDatasets = statusList.map((status, index) => {
      return {
        label: status,
        type: "bar" as const, // 막대그래프
        data: props.measurements.map((item) =>
          item.measurements.find((m) => m.status === status)?.cnt || 0
        ),
        backgroundColor: index === 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)",
        stack: "stack1", // 스택 그룹 지정
      };
    });

    const totalData = props.measurements.map((item) =>
      item.measurements.reduce((sum, m) => sum + m.cnt, 0)
    );

    const lineDataset = {
      label: "Total Trend",
      type: "line" as const, // 선 그래프
      data: totalData,
      borderColor: "rgba(75, 192, 192, 1)", // 선 색상
      borderWidth: 2,
      tension: 0.3, // 선의 부드러움
      fill: false, // 아래 채우기 비활성화
      pointBackgroundColor: "rgba(75, 192, 192, 1)", // 점 색상
    };

    const datasets = [...barDatasets, lineDataset]; // 막대 그래프 + 선 그래프 데이터셋

    // 기존 차트 파괴 (중복 렌더링 방지)
    if (chartInstance) {
      chartInstance.destroy();
    }

    // 새 차트 생성
    chartInstance = new Chart(barChart.value, {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          datalabels: {
            formatter: (value) => value,
            anchor: "center",
            align: "center",
            font: {
              size: 12,
            },
            color: "black",
          },
        },
        scales: {
          x: {
            stacked: true, // 스택 모드 활성화
            ticks: {
              font: { size: 7 },
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            stacked: true, // 스택 모드 활성화
            beginAtZero: true,
            max: props.maxY * 2.5,
          },
        },
      },
    });
  }
};

// props.measurements 변경 감지 시 차트 재생성
watch(
  () => props.measurements,
  () => {
    createChart();
  },
  { deep: true, immediate: true } // 깊은 감지 및 초기 실행
);
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
canvas {
  width: 100% !important; /* canvas를 부모 영역에 꽉 차게 설정 */
  height: 100% !important;
}
</style>
