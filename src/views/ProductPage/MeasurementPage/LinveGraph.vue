<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>

    <div class="controls">
      <div class="input-group">
        <label class="input-label">Scale 초기화:</label>
        <button class="input-button" @click="resetScale">Reset Scale</button>
      </div>
      <div class="input-group">
        <label class="input-label">Spec 숨기기:</label>
        <button class="input-button" @click="toggleCustomPlugin" disabled>
          비활성화
        </button>
      </div>
    </div>

    <div class="controls">
      <div class="input-group">
        <label class="input-label">Y축 최소값:</label>
        <input
          type="number"
          id="minYValue"
          class="input-field"
          v-model.number="minYValue"
          @change="updateChart"
        />
      </div>

      <div class="input-group">
        <label class="input-label">Y축 최대값:</label>
        <input
          type="number"
          id="maxYValue"
          class="input-field"
          v-model.number="maxYValue"
          @change="updateChart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { customPlugin, getSpecPoint, drawLineGraph } from "./LinveGraph";

const props = defineProps({
  chartData: Array,
  chartTitle: String,
  yAxisName: String,
  xAxisName: String,
  reverseY: Boolean, // x축 반전을 위한 새 prop
  systemBandInfo: Array,
  targetFreq: Array,
  uuid: String,
});



const applicationUuid = ref(props.uuid)
const minYValue = ref(-5); // y축 최소값을 위한 ref, 기본값 -5로 설정
const maxYValue = ref(0); // y축 최대값을 위한 ref, 기본값 1로 설정
const startX = Number(props.systemBandInfo[0]);
const endX = Number(props.systemBandInfo[1]);

const specInfoList = [];
props.chartData.map((dataset, index) => {
  const specInfo = getSpecPoint(dataset, props.targetFreq[index]);
  specInfo["lineColor"] = dataset.backgroundColor;
  specInfo["targetFreq"] = props.targetFreq[index];
  specInfoList.push(specInfo);
});

let customPluginEnabled = ref(true);
const buttonLabel = ref("비활성화"); // 버튼 레이블을 위한 ref

Chart.register(
  ...registerables,
  zoomPlugin,
  customPlugin(startX, endX, specInfoList)
);

const chartCanvas = ref(null);
let myChart = null;

const drawChart = () => {
  if (myChart) {
    myChart.destroy();
  }

  const datasets = props.chartData.map((dataset, index) => {
    const lastIndex = dataset.data.length - 1;

    const specInfo = specInfoList[index]; //getSpecPoint(dataset, props.targetFreq[index]);

    const indexList = [specInfo["rightIndex"], specInfo["leftIndex"]];

    return {
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.backgroundColor,
      borderWidth: 2,
      fill: false,
      tension: 0,
      pointRadius: dataset.data.map((_, index) =>
        indexList.includes(index) ? 7 : 0.5
      ),
      pointBackgroundColor: dataset.data.map((_, index) =>
        index === lastIndex ? "black" : dataset.backgroundColor
      ),
      pointBorderColor: dataset.data.map((_, index) =>
        indexList.includes(index) ? "black" : dataset.backgroundColor
      ),
      pointBorderWidth: dataset.data.map((_, index) =>
        indexList.includes(index) ? 3 : 0.5
      ),
      pointStyle: dataset.data.map((_, index) =>
        indexList.includes(index) ? "crossRot" : "circle"
      ),
    };
  });

  myChart = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: props.xAxisName,
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#000",
          },
        },
        y: {
          reverse: props.reverseY,
          min: minYValue.value, // Use minYValue ref
          max: maxYValue.value, // Use maxYValue ref
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

      responsive: true,
      maintainAspectRatio: false,
      plugins: {
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
    },
  });
};

const updateChart = () => {
  if (myChart) {
    myChart.options.scales.y.min = minYValue.value;
    myChart.options.scales.y.max = maxYValue.value;
    myChart.update();
  }
};

const resetScale = () => {
  minYValue.value = -5;
  maxYValue.value = 1;
  updateChart();
};

const toggleCustomPlugin = () => {
  customPluginEnabled.value = !customPluginEnabled.value;
  drawChart(); // Redraw chart to apply the plugin change
};

onMounted(() => {
  // updateSpecInfoList();
  // console.log("여기만 되는거 같은데 ")
  drawChart();
});
// watch(() => props.chartData, () => {
//   drawChart();
//   console.log("여기도 실행됨? ")
// },{ deep: true });

// watch(applicationUuid, (newValue, oldValue) => {
//   if( newValue !== oldValue){
//     console.log(`UUID ${oldValue} to ${newValue} has been changed`)
//   }
// })

// watch(()=>props.uuid, () => {
//   console.log("??"), {deep:true}
// })
</script>

<style scoped>
@import "../../../assets/css/LinveGraph.css";
</style>
