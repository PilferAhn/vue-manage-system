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
    const datasets = statusList.map((status, index) => {
      return {
        label: status,
        data: props.measurements.map((item) => {
          const measurement = item.measurements.find(
            (m) => m.status === status
          );
          return measurement ? measurement.cnt : 0;
        }),
        backgroundColor:
          index === 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)",
      };
    });

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
            anchor: "end", // 라벨 위치
            align: "top", // 바 위에 위치
            font: {
              size: 12, // 라벨 폰트 크기              
            },
            color: "black", // 라벨 색상
          },
        },
        scales: {
          x: {
            ticks: {
              font: { size: 10 },
              maxRotation: 0, // X축 라벨을 수평으로 유지
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            max: props.maxY + 3,
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

<style scoped>
.container {
  display: grid;
  grid-template-columns: 65% 35%;
  gap: 16px; /* 컴포넌트 간 여백 */
  height: 100%;
}

.wait-task-area,
.progress-area,
.finished-area {
  border: 1px solid #ddd; /* 시각적 구분을 위해 */
  box-sizing: border-box;
  display: flex; /* 내부 콘텐츠를 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  justify-content: center; /* 수평 가운데 정렬 */
  overflow: hidden; /* 넘치는 부분 감춤 */
}

.wait-task-area {
  background-color: #f9f9f9;
}

.progress-area {
  background-color: #e6f7ff;
}

.finished-area {
  background-color: #f6ffed;
}

canvas {
  width: 100% !important; /* canvas를 부모 영역에 꽉 차게 설정 */
  height: 100% !important;
}
</style>
