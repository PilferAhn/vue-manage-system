<template>
  <div style="max-width: 500px; max-height: 400px;">
    <canvas :id="canvasId" width="500" height="400"></canvas>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from "chart.js";


// Register Chart.js modules
Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const props = defineProps<{
  data: Record<string, number[]>; // { measurement_type: [total_quantity, finished_quantity] }
  title: string;
}>();

let pieChartInstance: Chart<"pie", number[], string> | null = null;

// Generate a unique ID for the canvas
const canvasId = ref(`pieChart-${Math.random().toString(36).substr(2, 9)}`);

const renderPieCharts = () => {
  const ctx = document.getElementById(canvasId.value) as HTMLCanvasElement;

  // Check if the canvas context exists
  if (!ctx) {
    console.error("Canvas element not found");
    return;
  }

  // Destroy the previous chart instance if it exists
  if (pieChartInstance) {
    pieChartInstance.destroy();
    pieChartInstance = null;
  }

  // Data preparation
  const labels = Object.keys(props.data);
  const completedData = Object.values(props.data).map((item) => item[1] || 0);

  // Create the chart instance
  pieChartInstance = new Chart(ctx, {
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
        tooltip: {
          enabled: true,
        },
        title: {
          display: true,
          text: props.title + " 합산",
          font: {
              size: 25,
              weight: "bold",
            },
        },
      },
    },
  });
};

// Re-render the chart when `props.data` changes
watch(
  () => props.data,
  () => {
    renderPieCharts();
  },
  { deep: true, immediate: true }
);

// Lifecycle hooks
onMounted(() => {
  renderPieCharts();
});

onUnmounted(() => {
  if (pieChartInstance) {
    pieChartInstance.destroy();
    pieChartInstance = null;
  }
});
</script>
