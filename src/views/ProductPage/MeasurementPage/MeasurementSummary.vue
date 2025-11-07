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
            v-if="!adminList.includes(getUserId())"
            prop="sampleNumber"
            label="Sample Number"
            width="180"
          ></el-table-column>
          <el-table-column label="Sample Number" v-else>
            <template #default="scope">
              <el-input v-model="scope.row.sampleNumber"></el-input>
            </template>
          </el-table-column>
          
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
          <el-table-column
            prop="p1Output"
            label="Pout@P1[dBm]"
          ></el-table-column>

          <el-table-column v-if="adminList.includes(getUserId())" label="Action">
            <template #default="scope">
              <el-button type="success" @click="handleSampleNumberUpdate(scope.row.pdtSampleUuid, scope.row.sampleNumber)"
                >업데이트</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="charts-container">
        <div class="charts-row">
          <div class="form-box">
            <LinveGraph
              :chartData="chartS21"
              :chartTitle="`PDT(${props.temperature})`"
              :reverseY="false"
              xAxisName="Frequency [Mhz]"
              yAxisName="IL[dBm]"
              v-bind:system-band-info="props.systemBandInfo"
              :target-freq="getTargetFreqArray()"
              :uuid="props.uuid"
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
              :uuid="props.uuid"
            />
          </div>
        </div>
        
        <div class="charts-row" v-if="hasENA">
          <div class="form-box">
            <LinveGraph
              :chartData="pdtVsEnaData"
              :chartTitle="`PDT(${props.temperature}) vs ENA`"
              :reverseY="false"
              xAxisName="Frequency [MHz]"
              yAxisName="IL [dB]"
              v-bind:system-band-info="props.systemBandInfo"
              :target-freq="combinedTargetFreq"
              :uuid="props.uuid"      
            />
          </div>
        </div>
        <div class="charts-row">
          <div class="form-box">
            <ScatterChart
              :chartData="chartDataRfLfDifference"
              chartTitle="Input vs BW [MHz]"
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
import { ref, watch, onMounted, computed } from "vue";
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
  getTargetFreqArray,
  handleSampleNumberUpdate,
} from "./MeasurementSummary.ts";
import LinveGraph from "./LinveGraph.vue";
import ScatterChart from "./ScatterChart.vue";
import { getUserId, getUserName } from "../../../utils/account-utils.js";

const props = defineProps<{
  uuid: string;
  systemBandInfo: Array<string>;
  targetPosition: string;
  temperature: string;
}>();

const adminList = ["admin", "wh2409001"]
const name = localStorage.getItem("ms_username");
const PDT_COLOR = "#1f77b4";
const ENA_COLOR = "#ff7f0e";

const pdtVsEnaData = computed(() => {
  const pdt = (chartS21?.value ?? []).map(ds => ({
    ...ds,
    backgroundColor: PDT_COLOR,
    borderColor: PDT_COLOR,
    label: ds.label?.startsWith("PDT-") ? ds.label : `PDT-${ds.label}`,
  }));

  const ena = (chartSPara?.value ?? []).map(ds => ({
    ...ds,
    backgroundColor: ENA_COLOR,
    borderColor: ENA_COLOR,
    label: ds.label?.startsWith("ENA-") ? ds.label : `ENA-${ds.label}`,
  }));

  return [...pdt, ...ena];
});

const hasENA = computed(() => {
  const dsList = chartSPara?.value ?? [];
  const isEna = dsList.some(ds =>
    Array.isArray(ds.data) &&
    ds.data.some(pt => pt && !Number.isNaN(pt.x) && !Number.isNaN(pt.y) && !(pt.x === 0 && pt.y === 0))
  );
  return isEna
})

const combinedTargetFreq = computed(() => {
  const tf = getTargetFreqArray() ?? [];
  return [...tf, ...tf];
});

function getSystemBand() {
  let systemBand = 0;
  if (props.targetPosition === undefined){
    systemBand = -999
  }
  else if (props.targetPosition.toUpperCase() === "HIGH") {
    systemBand = Number(props.systemBandInfo[1]);
  } else {
    systemBand = Number(props.systemBandInfo[0]);
  }
  return systemBand;
}

const systemBand = ref(0);

watch(
  [() => props.systemBandInfo, () => props.targetPosition],
  () => {
    systemBand.value = getSystemBand();
  },
  { immediate: true }
);

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
