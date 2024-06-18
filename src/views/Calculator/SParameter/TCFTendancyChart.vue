<template>
  <div class="chart-container">
    <canvas ref="scatterChart"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface DataPoint {
  x: number;
  y: number;
}

interface DataSet {
  label: string;
  data: DataPoint[];
  backgroundColor: string;
  borderColor: string;
  yAxisID: string;
}

interface Props {
  data1: DataSet[];
  data2: DataSet[];
  ilLevel: string;
  title: string;
}

const props = defineProps<Props>();

const scatterChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (scatterChart.value) {
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(scatterChart.value, {
      type: "line",
      data: {
        datasets: [...props.data1, ...props.data2],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              display: true,
              text: "Temperature",
            },
          },
          y1: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: props.title + " Left Value",
            },
          },
          y2: {
            type: "linear",
            position: "right",
            title: {
              display: true,
              text: props.title + " Right Value",
            },
            grid: {
              drawOnChartArea: false, // y2축의 그리드 라인을 차트 영역에 그리지 않음
            },
          },
        },
        plugins: {
          legend: {
            display: false, // 레이블 표시
          },
          title: {
            display: true,
            text: props.title,
            font: {
              size: 20,
              weight: "bold",
            },
            color: "#000",
          },
        },
      },
    });
  }
};

const updateChart = () => {
  if (chartInstance) {
    chartInstance.options.scales.y1.min = parseInt(props.ilLevel) - 5;
    chartInstance.options.scales.y2.min = parseInt(props.ilLevel) - 5;
    chartInstance.update();
  }
};

onMounted(createChart);

watch(() => [props.data1, props.data2], createChart, { deep: true });
watch(() => props.ilLevel, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    createChart();
  }
});

</script>

<style scoped>
.chart-container {
  max-width: 90%;
  margin: auto;
}
</style>
