<template class="test">
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
    <div class="controls">
      <div class="input-group">
        <label class="input-label">X축 최소값:</label>
        <input
          type="number"
          id="minYValue"
          class="input-field"
          v-model.number="xMin"
          @change="updateChart"
        />
      </div>

      <div class="input-group">
        <label class="input-label">X축 최대값:</label>
        <input
          type="number"
          id="maxYValue"
          class="input-field"
          v-model.number="xMax"
          @change="updateChart"
        />
      </div>
    </div>
    <div class="controls">
      <div class="input-group">
        <label class="input-label">Y축 최소값:</label>
        <input
          type="number"
          id="minYValue"
          class="input-field"
          v-model.number="yMin"
          @change="updateChart"
        />
      </div>

      <div class="input-group">
        <label class="input-label">Y축 최대값:</label>
        <input
          type="number"
          id="maxYValue"
          class="input-field"
          v-model.number="yMax"
          @change="updateChart"
        />
      </div>
    </div>
    <div class="controls">
      <div class="input-group">
        <label class="input-label">Scale 초기화:</label>
        <button class="input-button" @click="resetScale">Reset Scale</button>        
      </div>      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

import { getMinMax } from "./ScatterChart";

// Chart.js에 zoom 플러그인을 등록합니다.
Chart.register(zoomPlugin);

const props = defineProps({
  chartData: Array,
  chartTitle: String,
  yAxisName: String,
  xAxisName: String,
  reverseY: Boolean, // x축 반전을 위한 새 prop
  yAxisMin: Number,
});

const xMax = ref(0);
const yMax = ref(0);
const xMin = ref(0);
const yMin = ref(0);

const chartCanvas = ref(null);
let myChart = null;


console.log(props.chartData)

const drawChart = () => {
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      datasets: props.chartData.map((dataset) => {
        const lastIndex = dataset.data.length - 1; // 마지막 인덱스 계산

        return {
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.backgroundColor,
          borderColor: dataset.backgroundColor,
          borderWidth: 1, // 선의 두께를 줄임
          fill: false,
          tension: 0,
          pointRadius: dataset.data.map((_, index) =>
            index === lastIndex ? 3 : 2
          ), // 마지막 포인트의 크기를 더 크게 설정
          pointBackgroundColor: dataset.data.map((_, index) =>
            index === lastIndex
              ? dataset.backgroundColor
              : dataset.backgroundColor
          ), // 마지막 포인트의 배경 색상 변경
          pointBorderColor: dataset.data.map((_, index) =>
            index === lastIndex
              ? dataset.backgroundColor
              : dataset.backgroundColor
          ),
          pointBorderWidth: dataset.data.map((_, index) =>
            index === lastIndex ? 3 : 2
          ), // 마지막 포인트의 테두리 두께를 더 크게 설정
        };
      }),
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          min: xMin.value - 0.2,
          max: xMax.value + 0.2,
          title: {
            display: true,
            text: "Input Power[dBm]",
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#000",
          },
        },
        y: {
          reverse: props.reverseY,
          // min: props.yAxisMin || undefined, // x축 최소값을 props에서 가져와 설정
          min: yMin.value,
          title: {
            display: true,
            text: props.yAxisName,
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#000",
          },
        },
      },
      plugins: {
        // zoom: {
        //   zoom: {
        //     wheel: {
        //       enabled: true, // 마우스 휠을 통한 zoom 활성화
        //     },
        //     pinch: {
        //       enabled: true, // 핀치 제스처를 통한 zoom 활성화 (모바일 기기에서 유용)
        //     },
        //     mode: "y", // x축과 y축 모두에서 zoom을 활성화
        //   },
        //   pan: {
        //     enabled: true, // 드래그를 통한 pan 활성화
        //     mode: "y", // x축과 y축 모두에서 pan을 활성화
        //   },
        // },
        title: {
          display: true,
          text: props.chartTitle,
          font: {
            size: 20,
            weight: "bold",
          },
          color: "#000",
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

const resetScale = () => {
  const minMax = getMinMax(props.chartData, props.chartTitle);
  xMax.value = minMax.xMax;
  yMax.value = minMax.yMax;
  xMin.value = minMax.xMin;
  yMin.value = minMax.yMin;
  console.log(minMax);
  // getMinMax의 결과를 받은 후 차트를 그립니다.
  drawChart();
};

const updateChart = () => {
  if (myChart) {
    myChart.options.scales.y.min = yMin.value;
    myChart.options.scales.y.max = yMax.value;
    myChart.options.scales.x.min = xMin.value;
    myChart.options.scales.x.max = xMax.value;
    myChart.update();
  }
};

onMounted(async () => {
  const minMax = await getMinMax(props.chartData, props.chartTitle);
  xMax.value = minMax.xMax;
  yMax.value = minMax.yMax;
  xMin.value = minMax.xMin;
  yMin.value = minMax.yMin;
  
  // getMinMax의 결과를 받은 후 차트를 그립니다.
  drawChart();
});

watch(() => props.chartData, drawChart, { deep: true });
</script>

<style scoped>
@import "../../../assets/css/LinveGraph.css";
</style>
