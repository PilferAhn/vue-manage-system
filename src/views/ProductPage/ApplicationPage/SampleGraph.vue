<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

interface Point {
  x: number;
  y: number;
}

const props = defineProps<{ points: Point[] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Sample Data',
      backgroundColor: '#f87979',
      borderColor: '#f87979',
      fill: false,
      data: [] as number[],
      pointRadius: 1,
      pointBorderWidth: 1.5,
      borderWidth: 1.5,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {

      max: 0,
      ticks: {
        stepSize: 1, // Y축 간격을 1로 설정
      },
    },
  },
};

watch(
  () => props.points,
  (newPoints) => {
    updateChartData(newPoints);
    if (chart) {
      chart.update();
    }
  },
  { immediate: true }
);

function updateChartData(points: Point[]) {
  chartData.value.labels = points.map((point) => point.x.toString());
  chartData.value.datasets[0].data = points.map((point) => point.y);
}

onMounted(async () => {
  await nextTick(); // Ensure the DOM is updated
  if (canvas.value) {
    chart = new Chart(canvas.value, {
      type: 'line',
      data: chartData.value,
      options: chartOptions,
    });
    resizeChart(); // Initial resize
  }
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
});

function resizeChart() {
  if (chart) {
    chart.resize();
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
