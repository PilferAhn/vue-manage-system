<template>
  <div>
    <div class="charts-container">
      <div class="charts-row">
        <div class="form-box-wide">
          <TCFTendancyChart
            :data1="txLeftChartData"
            :data2="txRightChartData"
            :ilLevel="txIlLevel"
            :title="'TX'"
          />
        </div>
        <div class="form-box-wide">
          <TCFTendancyChart
            :data1="rxLeftChartData"
            :data2="rxRightChartData"
            :ilLevel="rxIlLevel"
            :title="'RX'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TCFTendancyChart from "./TCFTendancyChart.vue";
import { CalculatedSParameters } from "./sparameter";
import { colorList } from "../../../utils/utility";

interface Props {
  calSPara: CalculatedSParameters[];
  rxIlLevel: string;
  txIlLevel: string;
}

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

const props = defineProps<Props>();
const colors = colorList;

// Compute TX Left Chart Data
const txLeftChartData = computed<DataSet[]>(() =>
  props.calSPara.map((sParam, index) => ({
    label: `${sParam.fileName} TX Left`,
    data: [
      {
        x: parseFloat(sParam.temperature ?? "0"),
        y: sParam.txLeftVal,
      },
    ],
    
    backgroundColor: colors[1],
    borderColor: colors[1],
    yAxisID: "y1", // 지정된 y축 ID
  }))
);

// Compute TX Right Chart Data
const txRightChartData = computed<DataSet[]>(() =>
  props.calSPara.map((sParam, index) => ({
    label: `${sParam.fileName} TX Right`,
    data: [
      {
        x: parseFloat(sParam.temperature ?? "0"),
        y: sParam.txRightVal,
      },
    ],

    backgroundColor: colors[0],
    borderColor: colors[0],
    yAxisID: "y2", // 지정된 y축 ID
  }))
);

// Compute RX Left Chart Data
const rxLeftChartData = computed<DataSet[]>(() =>
  props.calSPara.map((sParam, index) => ({
    label: `${sParam.fileName} RX Left`,
    data: [
      {
        x: parseFloat(sParam.temperature ?? "0"),
        y: sParam.rxLeftVal,
      },
    ],
    backgroundColor: colors[1],
    borderColor: colors[1],
    yAxisID: "y1", // 지정된 y축 ID
  }))
);

// Compute RX Right Chart Data
const rxRightChartData = computed<DataSet[]>(() =>
  props.calSPara.map((sParam, index) => ({
    label: `${sParam.fileName} RX Right`,
    data: [
      {
        x: parseFloat(sParam.temperature ?? "0"),
        y: sParam.rxRightVal,
      },
    ],
    backgroundColor: colors[0],
    borderColor: colors[0],
    yAxisID: "y2", // 지정된 y축 ID
  }))
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
  /* margin-top: 1.5cm; */
}

.charts-row {
  display: flex;
  justify-content: space-between;
  /* margin-bottom: 1rem; */
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
