<template>
  <div style="max-width: 500px; max-height: 400px;">
    <canvas ref="chartCanvas" width="500" height="400"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const props = defineProps<{
  data: Record<string, number[]>; 
  title: string;
}>();

let pieChartInstance: Chart<"pie", number[], string> | null = null;

// Canvas 참조용 ref
const chartCanvas = ref<HTMLCanvasElement | null>(null);

const renderPieCharts = () => {
  if (!chartCanvas.value) {
    console.error("Canvas element not found");
    return;
  }

  if (pieChartInstance) {
    pieChartInstance.destroy();
    pieChartInstance = null;
  }

  const labels = Object.keys(props.data);
  const completedData = Object.values(props.data).map((item) => item[1] || 0);

  pieChartInstance = new Chart(chartCanvas.value, {
    type: "pie",
    data: {
      labels,
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
        legend: { display: true, position: "top" },
        tooltip: { enabled: true },
        title: { display: true, text: props.title + " 합산", font: { size: 25, weight: "bold" } },
      },
    },
  });
};

watch(
  () => props.data,
  () => renderPieCharts(),
  { deep: true } // immediate: true 제거
);

onMounted(renderPieCharts);

onUnmounted(() => {
  if (pieChartInstance) {
    pieChartInstance.destroy();
  }
});
</script>
