<template>
    <div>
      <el-card>
        <h2>Weekly Task Summary</h2>
        <canvas ref="chartCanvas"></canvas>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import Chart from "chart.js/auto";
  import { processWeeklyData, WeeklyResult, sortMeasurementTypes } from "./temp";
  import { rawData } from "../../../../utils/Solder/demo-data";
  import { ElCard } from "element-plus";
  

  
  const chartCanvas = ref<HTMLCanvasElement | null>(null);
  
  onMounted(() => {
    renderChart();
  });
  
  function renderChart() {
    let processedData: WeeklyResult[] = processWeeklyData(rawData);
    processedData = sortMeasurementTypes(processedData); // 정렬된 데이터 적용
  
    // 차트 데이터 가공
    const weeks = Array.from(new Set(processedData.map((item) => item.week)));
    const measurementTypes = Array.from(
      new Set(processedData.map((item) => item.measurement_type))
    );
  
    const datasets = measurementTypes.map((type) => {
      return {
        label: type,
        data: weeks.map((week) => {
          const weekData = processedData.find(
            (item) => item.week === week && item.measurement_type === type
          );
          return weekData ? weekData.finished_task : 0;
        }),
      };
    });
  
    // Chart.js 차트 생성
    if (chartCanvas.value) {
      new Chart(chartCanvas.value, {
        type: "bar",
        data: {
          labels: weeks,
          datasets: datasets,
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Weekly Finished Tasks by Measurement Type",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
  </script>
  