<template>
  <div>
    <!-- Section Title -->
    <div class="section-header">
      <h3 class="section-title">대기 중인 작업 테이블</h3>
      <p class="section-description">
        이 테이블은 대기 중인 작업 목록을 나타냅니다.
      </p>
    </div>
    <WaitingPieChart :measurements="measurements" :maxY = maxY></WaitingPieChart>
    <!-- <WaitingPieChart :data="data"></WaitingPieChart> -->
    <!-- <el-table
      :data="measurements"
      border
      style="width: 100%"
      :table-layout="'auto'"
    >
    
      <el-table-column
        label="Types"
        prop="type"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        v-for="status in uniqueStatuses"
        :key="status"
        :label="status"
        :align="'center'"
      >
        <template #default="scope">
          {{
            scope.row.measurements.find((m) => m.status === status)?.cnt || 0
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="Total"
        prop="cnt"
        :align="'center'"
      ></el-table-column>

    
      <template #append>
        <div style="text-align: center; padding: 10px; font-weight: bold">
          In Progress : {{ inProgressCnt }}  /  Waiting Sample : {{ waitingCnt }}
        </div>
        <el-table-column label="합산">{{ 11 }}</el-table-column>
      </template>
    </el-table> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { ApplicationData } from "../../../interface/solderAppInterface";
import { Measurement, analizeData, getSumByMeasStatus } from "./Waiting";
import WaitingPieChart from "./WaitingPieChart.vue";

// props로 ApplicationData 배열 받음
const props = defineProps<{
  applications: ApplicationData[];
}>();



// 테이블에 사용할 복사본 데이터

const newTableData = ref<ApplicationData[]>([]);
const measurements = ref<Measurement[]>([]);
const uniqueStatuses = ref([]);
const inProgressCnt = ref(0);
const waitingCnt = ref(0);
const maxY = ref(0);
// watch를 사용해 props.applications의 변화를 감지
watch(
  () => props.applications,
  (newVal) => {
    // 새로운 배열 생성 (깊은 복사)
    newTableData.value = newVal.map((app) => ({ ...app }));
    measurements.value.length = 0;
    analizeData(newVal, measurements.value);

    // uniqueStatuses를 수동으로 업데이트
    const statuses = new Set();
    measurements.value.forEach((item) => {
      item.measurements.forEach((measurement) => {
        statuses.add(measurement.status);
        maxY.value = Math.max(maxY.value , measurement.cnt)
      });
    });
    uniqueStatuses.value = Array.from(statuses);

    inProgressCnt.value = getSumByMeasStatus(
      measurements.value,
      "Waiting Sample"
    );
    waitingCnt.value = getSumByMeasStatus(measurements.value, "In Progress");
  },
  { immediate: true, deep: true }
);
console.log(measurements.value)
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
.section-header {
  margin-bottom: 12px; /* 제목과 테이블 사이 여백 */
  text-align: left;
}

.section-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.section-description {
  font-size: 0.9em;
  color: #666;
  margin: 4px 0 0;
}
</style>
