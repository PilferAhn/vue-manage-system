<template>
  <div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th class="header" rowspan="2">-10dB Level</th>
            <th class="header" rowspan="2">Temp</th>
            <th class="header" :colspan="props.calSPara.length">
              Frequency Measurement
            </th>
            <th class="header_red" rowspan="2" colspan="2">TCF</th>
          </tr>
          <tr>
            <td
              class="header"
              v-for="(freq, index) in temperatureList"
              :key="'tx-lf-' + index"
            >
              {{ freq }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="freqType" rowspan="2">TX</td>
            <td class="freqType">LF</td>
            <td
              class="freqType"
              v-for="(freq, index) in txLF"
              :key="'tx-lf-' + index"
            >
              {{ freq }}
            </td>
            
            <td class="freqType">{{ props.tcfValues.txLfTcf }}</td>
            <td class="freqType">Center</td>            
          </tr>
          <tr>
            <td class="freqType">RF</td>
            <td
              class="freqType"
              v-for="(freq, index) in txRF"
              :key="'tx-rf-' + index"
            >
              {{ freq }}
            </td>
            
            <td class="freqType">{{ props.tcfValues.txRfTcf }}</td>
            <td class="freqType">{{ props.tcfValues.txCenterTcf }}</td>
          </tr>
          <tr>
            <td class="tcfValues" rowspan="2">RX</td>
            <td class="tcfValues">LF</td>
            <td
              class="tcfValues"
              v-for="(freq, index) in rxLF"
              :key="'rx-lf-' + index"
            >
              {{ freq }}
            </td>
            
            <td class="tcfValues">{{ props.tcfValues.rxLfTcf }}</td>
            <td class="tcfValues">Center</td>
          </tr>
          <tr>
            <td class="tcfValues">RF</td>
            <td
              class="tcfValues"
              v-for="(freq, index) in rxRF"
              :key="'rx-rf-' + index"
            >
              {{ freq }}
            </td>            
            <td class="tcfValues">{{ props.tcfValues.rxRfTcf }}</td>
            <td class="tcfValues">{{ props.tcfValues.rxCenterTcf }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CalculatedSParameters, TCFValues } from "./sparameter";

const props = defineProps<{
  calSPara: CalculatedSParameters[];
  tcfValues: TCFValues;
}>();

const temperatureList = computed(() =>
  props.calSPara.map((sParam) => sParam.temperature)
);
const txLF = computed(() => props.calSPara.map((sParam) => sParam.txLeftVal));
const txRF = computed(() => props.calSPara.map((sParam) => sParam.txRightVal));
const rxLF = computed(() => props.calSPara.map((sParam) => sParam.rxLeftVal));
const rxRF = computed(() => props.calSPara.map((sParam) => sParam.rxRightVal));

const txLF_TCF = computed(() => {
  // Calculate TCF for TX LF
  return calculateTCF(txLF.value);
});
const txRF_TCF = computed(() => {
  // Calculate TCF for TX RF
  return calculateTCF(txRF.value);
});
const rxLF_TCF = computed(() => {
  // Calculate TCF for RX LF
  return calculateTCF(rxLF.value);
});
const rxRF_TCF = computed(() => {
  // Calculate TCF for RX RF
  return calculateTCF(rxRF.value);
});

function calculateTCF(freqs: number[]): string {
  // Implement the TCF calculation logic here
  // For demonstration, return a dummy value
  return freqs[0] ? "Dummy" : "Center";
}
</script>

<style scoped>
.table-container {
  margin: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

/* th {
  background-color: #f2f2f2;
} */

.header {
  background-color: #f2f2f2;
}

.header_red {
  background-color: red;
}

.freqType {
  background-color: #ffffcc;
}

.tcfValues {
  background-color: #e0f7fa;
}
/* td:nth-child(1),
td:nth-child(2) {
  background-color: #ffffcc;
}

td:nth-child(n + 3):nth-child(-n + 9) {
  background-color: #e0f7fa;
}

td:nth-child(10) {
  background-color: #ffccbc;
} */
</style>
