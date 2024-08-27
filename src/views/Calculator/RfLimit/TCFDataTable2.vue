<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="header" rowspan="2">-10dB Level</th>
          <th class="header" rowspan="2">Temp</th>
          <th
            class="header"
            :colspan="
              (props.tcfValues.length > 0 &&
                props.tcfValues[0].rightArr.length) ||
              0
            "
          >
            Frequency Measurement
          </th>
          <th class="header_red" rowspan="2" colspan="2">TCF</th>
        </tr>
        <tr>
          <th
            class="header"
            v-for="(temperature, index) in props.tcfValues[0].temperatures"
            :key="index"
          >
            {{ temperature }}
          </th>
        </tr>
      </thead>
      <tbody v-for="(tcfValue, index) in props.tcfValues" :key="index">
        <tr>
          <td :class="index % 2 === 0 ? 'freqType' : 'tcfValues'" rowspan="2">{{ tcfValue.graphName }}</td>
          <td :class="index % 2 === 0 ? 'freqType' : 'tcfValues'">LF</td>
          <td
            v-for="(leftVal, i) in tcfValue.leftArr"
            :key="i"
            :class="index % 2 === 0 ? 'freqType' : 'tcfValues'"
          >
            {{ leftVal }}
          </td>
          <td :class="index % 2 === 0 ? 'freqType' : 'tcfValues'" rowspan="1">{{ tcfValue.leftTcf }}</td>
          <td :class="index % 2 === 0 ? 'freqType' : 'tcfValues'" rowspan="1">Center</td>
        </tr>        
        <tr>
          <td :class="index % 2 === 0 ? 'freqType' : 'tcfValues'">RF</td>
          <td
            v-for="(leftVal, i) in tcfValue.rightArr"
            :key="i"
            :class="index % 2 === 0 ? 'freqType' : 'tcfValues'"
          >
            {{ leftVal }}
          </td>
          <td :class="index % 2 === 0 ? 'freqType' : 'tcfValues'" rowspan="1">{{ tcfValue.rightTcf }}</td>
          <td :class="index % 2 === 0 ? 'freqType' : 'tcfValues'" rowspan="1">{{ tcfValue.centerTcf }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { CalculatedTCFValues, CalculatedTCFValue } from "./sparameter";

const props = defineProps<{ tcfValues: CalculatedTCFValue[] }>();
</script>

<style scoped>
.el-table {
  margin: 20px 0;
}

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
</style>
