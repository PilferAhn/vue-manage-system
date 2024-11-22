<template>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <!-- Total Pie Chart -->
    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
      
      <canvas id="totalPieChart" style="max-width: 300px; max-height: 300px;"></canvas>
    </div>

    <!-- Completed Pie Chart -->
    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
      
      <canvas id="completedPieChart" style="max-width: 300px; max-height: 300px;"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from "chart.js";

// Chart.js 모듈 등록
Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const measurementData = ref({
  "PDT(Manual_수탑)": [449, 210],
  "PDT(SMT)": [32, 0],
  "PS 신뢰성(ESD)": [570, 480],
  "TCF": [85, 58],
  "내전력": [320, 320],
  "비선형": [31, 23],
  "특성 평가": [2252, 2137],
});

let totalPieChartInstance: Chart<"pie", number[], string> | null = null;
let completedPieChartInstance: Chart<"pie", number[], string> | null = null;

const renderPieCharts = () => {
  const totalCtx = document.getElementById("totalPieChart") as HTMLCanvasElement;
  const completedCtx = document.getElementById("completedPieChart") as HTMLCanvasElement;

  const labels = Object.keys(measurementData.value);
  const totalData = Object.values(measurementData.value).map((item) => item[0]); // Total quantities
  const completedData = Object.values(measurementData.value).map((item) => item[1] || 0); // Completed quantities

  // 기존 Chart 제거
  if (totalPieChartInstance) totalPieChartInstance.destroy();
  if (completedPieChartInstance) completedPieChartInstance.destroy();

  // Total Pie Chart
  totalPieChartInstance = new Chart<"pie", number[], string>(totalCtx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: totalData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(100, 200, 100, 0.6)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "의뢰",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });

  // Completed Pie Chart
  completedPieChartInstance = new Chart<"pie", number[], string>(completedCtx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: completedData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(100, 200, 100, 0.6)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "완료",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
};

// Pie Chart 렌더링
onMounted(() => {
  renderPieCharts();
});
</script>
