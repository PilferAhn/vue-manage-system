<template>
    <canvas ref="chart"></canvas>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import type { Machine } from './MachineType';
  
  Chart.register(...registerables);
  
  const props = defineProps<{ machine: Machine }>();
  const chart = ref<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;
  
  const createChart = () => {
    if (chart.value) {
      chartInstance = new Chart(chart.value, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Reference',
              data: props.machine.s21Points,
              borderColor: 'red',
              borderWidth: 1,
              pointRadius : 1,
              fill: false,
              parsing: {
                xAxisKey: 'x',
                yAxisKey: 'y'
              }
            },
            {
              label: 'Measurement',
              data: props.machine.measurementPoints,
              borderColor: 'blue',
              borderWidth: 1,
              pointRadius : 1,
              fill: false,
              parsing: {
                xAxisKey: 'x',
                yAxisKey: 'y'
              }
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom'
            }
          }
        }
      });
    }
  };
  
  onMounted(() => {
    createChart();
  });
  
  watch(() => props.machine, () => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    createChart();
  });
  </script>
  
  <style scoped>
  canvas {
    width: 100%;
    height: 400px;
  }
  </style>
  