<template>
  <div>
    <canvas ref="scatterChart"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted, watch } from "vue";
import { Scatter } from "vue-chartjs";
import { CalculatedTCFValue } from "./sparameter";
import { colorList } from "../../../utils/utility";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LinearScale,
  CategoryScale,
  ScatterController,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LinearScale,
  CategoryScale,
  ScatterController
);

const props = defineProps<{ calculatedTcfValues: CalculatedTCFValue }>();

const scatterChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: ChartJS | null = null;

const chartData = computed(() => {
  return {
    datasets: [
      {
        label: "LF",
        data: props.calculatedTcfValues.leftCoordinates,
        backgroundColor: colorList[0],
        yAxisID: "yLeft",
      },
      {
        label: "RF",
        data: props.calculatedTcfValues.rightCoordinates,
        backgroundColor: colorList[1],
        yAxisID: "yRight",
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<"scatter">>(() => {
  return {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Temperature[˚C]",
        },
      },
      yLeft: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "LF[MHz]",
          showLine: true,
        },
      },
      yRight: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "RF[MHz]",
          showLine: true,
        },
        grid: {
          drawOnChartArea: false, // yRight 축의 그리드 라인을 차트 영역에 그리지 않음
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: props.calculatedTcfValues.graphName,
        // font: {
        //   size: 20,
        //   weight: "bold",
        // },
        // color: "#000",
      },
    },
  };
});

const createChart = () => {
  if (scatterChart.value) {
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new ChartJS(scatterChart.value, {
      type: "scatter",
      data: chartData.value,
      options: chartOptions.value,
    });
  }
};

onMounted(() => {
  createChart();
});

watch(
  () => props.calculatedTcfValues,
  () => {
    createChart();
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
  height: 40vh;
  width: 80vw;
}
</style>
