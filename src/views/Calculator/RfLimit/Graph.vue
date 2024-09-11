<template>
    <div class="graph-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
  import { Chart, ScatterController, LineController, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
  
  // Register Chart.js components
  Chart.register(ScatterController, LineController, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  
  const props = defineProps({
    dataSets: {
      type: Array,
      required: true,
    },
  });
  
  const chartCanvas = ref<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;
  
  const createChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    if (chartCanvas.value) {
      chartInstance = new Chart(chartCanvas.value, {
        type: 'scatter', // Scatter Chart
        data: {
          datasets: props.dataSets,
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
            },
            y: {
              type: 'linear',
              beginAtZero: true,
            },
          },
        },
      });
    }
  };
  
  // Watch for changes in dataSets and update the chart
  watch(() => props.dataSets, createChart, { deep: true });
  
  // Create the chart on mount
  onMounted(() => {
    createChart();
  });
  
  // Destroy the chart instance on unmount
  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
  </script>
  
  <style scoped>
  .graph-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  </style>
  