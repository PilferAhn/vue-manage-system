<template>
  <div>
    <Chart type="line" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Chart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Chart.js 플러그인 등록
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, annotationPlugin);

// 차트 데이터
const chartData = ref({
  labels: ['January', 'February', 'March', 'April'],
  datasets: [
    {
      label: 'Sales',
      data: [10, 20, 15, 30],
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    },
  ],
});

// 선택한 데이터 포인트를 표시하기 위한 상태
const selectedPoint = ref({ x: null, y: null });

// 차트 옵션
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: false, // 기본 툴팁 비활성화
    },
    annotation: {
      annotations: {
        arrow: {
          type: 'line',
          xMin: selectedPoint.value.x,
          xMax: selectedPoint.value.x,
          yMin: selectedPoint.value.y,
          yMax: selectedPoint.value.y !== null ? selectedPoint.value.y + 10 : null,
          borderColor: 'red',
          borderWidth: 2,
          label: {
            enabled: true,
            content: (ctx) => {
              return `x: ${selectedPoint.value.x}, y: ${selectedPoint.value.y}`;
            },
            position: 'end',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: 'black',
          },
        },
      },
    },
  },
});

// 클릭 이벤트 핸들러
const handleChartClick = (event, elements) => {
  if (elements.length > 0) {
    const chartElement = elements[0];
    const index = chartElement.index;
    const datasetIndex = chartElement.datasetIndex;
    selectedPoint.value.x = chartData.value.labels[index];
    selectedPoint.value.y = chartData.value.datasets[datasetIndex].data[index];

    // 차트 업데이트
    chartOptions.value.plugins.annotation.annotations.arrow.xMin = index;
    chartOptions.value.plugins.annotation.annotations.arrow.xMax = index;
    chartOptions.value.plugins.annotation.annotations.arrow.yMin = selectedPoint.value.y;
    chartOptions.value.plugins.annotation.annotations.arrow.yMax = selectedPoint.value.y + 10;

    // 차트가 동적으로 다시 그려질 수 있도록 Vue의 반응형 시스템을 사용
    chartOptions.value = { ...chartOptions.value };
  }
};

// Chart.js의 "click" 이벤트 리스너 등록
watch(() => chartOptions.value, (newOptions) => {
  const chartInstance = ChartJS.getChart(newOptions);
  chartInstance?.canvas?.addEventListener('click', (event) => {
    const elements = chartInstance?.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
    handleChartClick(event, elements);
  });
});
</script>
