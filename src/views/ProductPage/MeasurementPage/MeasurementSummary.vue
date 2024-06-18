<template>
  <div class="container">
    <div v-if="calculatedSummaries.length == 0">
      <el-empty description="진행중인 측정 의뢰가 없습니다."></el-empty>
    </div>
    <div v-else>
      <el-button
        v-if="application_status === 'finished'"
        @click="downloadReport(props.uuid)"
        style="margin-bottom: 20px"
        >리포트 다운로드</el-button
      >

      <div>
        <el-table :data="calculatedSummaries" border style="width: 100%">
          <el-table-column
            prop="sampleNumber"
            label="Sample Number"
            width="180"
          ></el-table-column>

          <!-- <el-table-column prop="dbm3" :label="db3Label"></el-table-column> -->

          <el-table-column label="System Freq (A)">
            <template #default="scope">
               <span> {{ systemBand }} </span>
            </template>
          </el-table-column>
          
          <el-table-column label="Δf [MHz] (B)">
            <template #default="scope">
              {{ (-1 * (systemBand - scope.row.targetFreq)).toFixed(2) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="targetFreq"
            label="Target Freq (A + B)"
          ></el-table-column>

          <el-table-column prop="p1Input" label="P1[dBm]"></el-table-column>
          <el-table-column prop="p2Input" label="P2[dBm]"></el-table-column>
          <el-table-column prop="p1Output" label="Pout@P1[dBm]"></el-table-column>

          <!-- <el-table-column prop="rf1" label="RF1 (MHz)"></el-table-column>
          <el-table-column prop="lf1" label="LF1 (MHz)"></el-table-column>
          <el-table-column prop="rf2" label="RF2 (MHz)"></el-table-column>
          <el-table-column prop="lf2" label="LF2 (MHz)"></el-table-column> -->
        </el-table>
      </div>

      <div class="charts-container">
        <div class="charts-row">
          <div class="form-box">
            <LinveGraph
              :chartData="chartS21"
              chartTitle="PDT"
              :reverseY="false"
              xAxisName="Frequency [Mhz]"
              yAxisName="IL[dBm]"
              v-bind:system-band-info="props.systemBandInfo"
              :target-freq="getTargetFreqArray()"
              :uuid = props.uuid
            />
          </div>
          <div class="form-box">
            <LinveGraph
              :chartData="chartSPara"
              chartTitle="ENA"
              :reverseY="false"
              xAxisName="Frequency [Mhz]"
              yAxisName="IL[dB]"
              v-bind:system-band-info="props.systemBandInfo"
              :target-freq="getTargetFreqArray()"
              :uuid = props.uuid
            />
          </div>
        </div>
        <div class="charts-row">
          <div class="form-box">
            <ScatterChart
              :chartData="chartDataRfLfDifference"
              chartTitle="Input vs BW [Mhz]"
              :reverseY="true"
              xAxisName="Input Power[dBm]"
              yAxisName="BW [Mhz]"
            />
          </div>
          <div class="form-box">
            <ScatterChart
              :chartData="chartDataPout"
              chartTitle="Input vs Output"
              :reverseY="false"
              xAxisName="Input Power[dBm]"
              yAxisName="Power[dBm]"
            />
          </div>
        </div>
        <div class="charts-row">
          <div class="form-box-wide">
            <ScatterChart
              :chartData="chartDataLf1Mhz"
              chartTitle="Input vs LF [MHz] @ -10dB"
              :reverseY="false"
              xAxisName="Input Power[dBm]"
              yAxisName="LF [Mhz] @-10dB"
            />
          </div>
          <div class="form-box-wide">
            <ScatterChart
              :chartData="chartDataRf1Mhz"
              chartTitle="Input vs RF [MHz] @ -10dB"
              :reverseY="true"
              xAxisName="Input Power[dBm]"
              yAxisName="RF [MHz] @-10dB"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import {
  getSummaryData,
  application_status,
  calculatedSummaries,
  chartS21,
  chartSPara,
  chartDataPout,
  chartDataRf1Mhz,
  chartDataLf1Mhz,
  chartDataRfLfDifference,
  downloadReport,
  getTargetFreqArray
} from './MeasurementSummary.ts';
import LinveGraph from "./LinveGraph.vue";
import ScatterChart from "./ScatterChart.vue";

const props = defineProps<{
  uuid: string;
  systemBandInfo: Array<string>;
  targetPosition : string;
  temperature: string;
}>();


const targetFreq = ref<string[]>([]);
const db3Label = "𝒇 -3dB @" + props.temperature;

function getSystemBand(){

  let systemBand = 0
  if(props.targetPosition === "HIGH"){
    systemBand = Number(props.systemBandInfo[1])
  }
  else{
    systemBand = Number(props.systemBandInfo[0])
  }
  return systemBand
}

const systemBand = ref(0);

// onMounted(() => {
//   systemBand.value = getSystemBand()
// });

watch([() => props.systemBandInfo, () => props.targetPosition], () => {
  systemBand.value = getSystemBand();
}, { immediate: true });

// Watch for changes in UUID and fetch summary data
watch(
  () => props.uuid,
  (newUuid, oldUuid) => {
    getSummaryData(newUuid);  
  },
  { immediate: true }
);
</script>

<style>
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
