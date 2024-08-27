<template>
  <div>
    <div class="charts-container">
      <div class="charts-row">
        <div class="form-box-wide">
          <ScatterChart
            :data="txChartData"
            :ilLevel="txIlLevel"
            :title="'TX'"
          />
        </div>
        <div class="form-box-wide">
          <ScatterChart
            :data="rxChartData"
            :ilLevel="rxIlLevel"
            :title="'RX'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, computed } from "vue";
// import ScatterChart from "../../ProductPage/MeasurementPage/ScatterChart.vue";
import ScatterChart from "./TCFCalScatterChart.vue";
import { CalculatedSParameters } from "./sparameter";
import { colorList } from "../../../utils/utility";

interface Props {
  calSPara: CalculatedSParameters[];
  rxIlLevel: string;
  txIlLevel: string;
  roundingPoint : number;
}
const props = defineProps<Props>();

const colors = colorList;
// Compute RX Chart Data
const rxChartData = computed(() => {
  return props.calSPara.map((item, i) => ({
    label: item.temperatureStr,

    leftIndex: 0,
    leftValue: 0,
    rightIndex: 0,
    rightValue: 0,

    data: item.rxDbm.map((rx, index) => ({
      x: item.rxFreq[index],
      y: rx,
    })),
    tension: 0,
    borderWidth: 1,
    pointBorderWidth: 0.5,
    pointRadius: item.rxDbm.map((rx, index) => 
    rx === parseInt(props.rxIlLevel) ? 3 : 0.1),
    fill: false,
    backgroundColor: colors[i],
    borderColor: colors[i],
  }));
});

// Compute TX Chart Data
const txChartData = computed(() => {
  return props.calSPara.map((item, i) => ({
    label: item.temperatureStr,

    leftIndex: 0,
    leftValue: 0,
    rightIndex: 0,
    rightValue: 0,

    data: item.txDbm.map((tx, index) => ({
      x: item.txFreq[index],
      y: tx,
    })),
    tension: 0,
    borderWidth: 1,
    pointBorderWidth: 0.5,
    pointRadius: item.txDbm.map((tx, index) => 
    tx === parseInt(props.txIlLevel) ? 3 : 0.1),
    fill: false,
    backgroundColor: colors[i],
    borderColor: colors[i],
  }));
});

watch(
  () => props.calSPara.length,
  (newVal, oldVal) => {
    //   console.log('calSPara changed:', { newVal, oldVal });
    // console.log(props.calSPara);
  }
);
</script>

<style scoped>
.container {
  max-width: 90%;
  margin: auto;
}

.table-container {
  margin-bottom: 3cm;
}

.charts-container {
  display: flex;
  flex-direction: column;
  margin-top: 1.5cm;
}

.charts-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.form-box,
.form-box-wide {
  flex: 1;
}

.form-box {
  margin-right: 20px;
}

.form-box:last-child,
.form-box-wide:last-child {
  margin-right: 0;
}

.form-box-wide {
  margin-bottom: 1rem;
}
</style>
