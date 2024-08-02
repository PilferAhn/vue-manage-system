<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const chartCanvas = ref(null);

const chartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sample Data',
      backgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

onMounted(() => {
  new Chart(chartCanvas.value, {
    type: 'line',
    data: chartData,
    options: chartOptions,
  });
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
