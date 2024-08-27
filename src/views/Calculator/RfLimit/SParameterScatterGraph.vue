<template>
    <canvas ref="scatterChart"></canvas>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, watch } from "vue";
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineController,
    LineElement,
    LinearScale,
  } from "chart.js";
  
  import { Graphs } from "./sparameter";
  import { colorList } from "../../../utils/utility";
  
  // Register Chart.js components
  Chart.register(
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineController,
    LineElement,
    LinearScale
  );
  
  const props = defineProps<{ graphData: Graphs }>();
  
  const scatterChart = ref<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;
  
  const createChart = () => {
    if (scatterChart.value) {
      const ctx = scatterChart.value.getContext("2d");
      if (ctx) {
        if (chartInstance) {
          chartInstance.destroy();
        }
        chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            datasets: props.graphData.coordinates.map((coordinateSet, index) => ({
              label: `${props.graphData.labels[index]}`,
              data: coordinateSet.map((point) => ({
                x: point.x,
                y: point.y,
                radius: point.y === props.graphData.ilLevel ? 3 : 0.1,
              })),
              backgroundColor: colorList[index % colorList.length],
              borderColor: colorList[index % colorList.length],
              showLine: true,
              fill: false,
              borderWidth: 1,
              pointRadius: (context) => context.raw.radius, // pointRadius는 각 데이터의 radius 속성에 따라 동적으로 설정됩니다.
            })),
          },
          options: {
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                title: {
                  display: true,
                  text: "Frequency[MHz]",
                },
              },
              y: {
                type: "linear",
                min: props.graphData.ilLevel - 5,
                title: {
                  display: true,
                  text: "dBm",
                },
              },
            },
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: props.graphData.graphName,
              },
            },
          },
        });
      }
    }
  };
  
  onMounted(createChart);
  console.log(props.graphData);
  watch(() => props.graphData, createChart, { deep: true });
  </script>
  
  <style>
  .el-card {
    padding: 20px;
  }
  </style>
  