<template>
  <div>
    <canvas :id="canvasId"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { DailyMeasInfo } from "../../../../interface/solderAppInterface";
// Chart.js와 플러그인 등록
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Props로 serverData를 수신
const props = defineProps<{
  serverData: DailyMeasInfo[];
  title: string;
}>();

// 고유한 canvasId 생성
const canvasId = `bar-chart-${Math.random().toString(36).substr(2, 9)}`; // 랜덤 문자열 생성

// Chart 인스턴스 관리
let chartInstance: Chart | null = null;

// 동적 색상 생성 함수
const generateColors = (count: number) => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count; // 고유한 색상 생성
    colors.push(`hsl(${hue}, 70%, 60%)`); // HSL 형식 색상
  }
  return colors;
};

// 서버 데이터 처리 함수
const processServerData = (serverData: any[]) => {
  const groupedByDate = serverData.reduce((acc, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = {};
    }
    acc[curr.date][curr.measurement_type] = curr.finished_task;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const measurementTypes = Array.from(
    new Set(serverData.map((item) => item.measurement_type))
  );

  const rawDatasets = measurementTypes.map((type) => ({
    label: type,
    data: Object.keys(groupedByDate).map(
      (date) => groupedByDate[date][type] || 0
    ),
  }));

  const labels = Object.keys(groupedByDate);

  return { labels, rawDatasets };
};

// Chart.js 옵션
const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: " 일별 누계(" + props.title + ")",
      font: {
        size: 25,
        weight: "bold",
      },
      color: "#333",
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      enabled: true,
    },
    legend: {
      position: "top",
    },
    datalabels: {
      anchor: "end",
      align: "top",
      
      color: "black",
      formatter: (value: number) => `${value}`,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        // text: "요일별 측정 항목",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    y: {
      title: {
        display: true,
        text: "EA(측정 횟수)",
        font: {
          size: 18,
          weight: "bold",
        },
      },
      beginAtZero: true,
      ticks: {
        stepSize: 10, // Y축의 단위를 10으로 고정
      },
    },
  },
};

// Chart.js 생성 함수
const createChart = (serverData: any[]) => {
  const { labels, rawDatasets } = processServerData(serverData);

  // 기존 Chart 인스턴스가 있으면 제거
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Canvas ID를 통해 DOM 요소 찾기
  const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;

  if (canvasElement) {
    chartInstance = new Chart(canvasElement, {
      type: "bar",
      data: {
        labels: labels,
        datasets: rawDatasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: generateColors(rawDatasets.length)[index],
        })),
      },
      options: options,
    });
  } else {
    console.error(`Canvas element with id "${canvasId}" not found.`);
  }
};

// Props 변경 감지 및 차트 업데이트
watch(
  () => props.serverData,
  async (newData) => {
    await nextTick(); // DOM 렌더링 완료 후 실행
    createChart(newData);
  },
  { immediate: true }
);

// 초기 렌더링 시 차트 생성
onMounted(async () => {
  await nextTick(); // DOM 렌더링 완료 후 실행
  createChart(props.serverData);
});
</script>

<style scoped>
/* 원하는 스타일 추가 가능 */
</style>
