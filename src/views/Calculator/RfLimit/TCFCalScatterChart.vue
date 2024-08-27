<template>
  <div class="chart-container">
    <canvas ref="scatterChart"></canvas>
    <!-- <div class="controls">
      <div class="input-group">
        <label class="input-label">IL Level</label>
        <input
          type="number"
          id="minYValue"
          class="input-field"
          v-model="props.ilLevel"
        />
      </div>
    </div> -->
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
}

interface Props {
  data: DataSet[];
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
        datasets: props.data,
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              display: true,
              text: "Frequency",
            },
          },
          y: {
            type: "linear",
            min: parseInt(props.ilLevel) -5,
            title: {
              display: true,
              text: "dBm",
            },
          },
        },
        plugins: {
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



onMounted(createChart);

watch(() => props.data, createChart, { deep: true });

watch(() => props.ilLevel, (newVal , oldVal) => {
    if (newVal !== oldVal){
        createChart()
    }
})

</script>

<style scoped>
@import "../../../assets/css/TCFLineGraph.css";
</style>
