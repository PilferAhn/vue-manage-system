<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card v-if="machine">
        <h2>{{ machine.modelName }}</h2>
        <el-descriptions title="기종 정보" :border="true" :column="1">
          <el-descriptions-item label="Request Number">{{
            machine.requestNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="Model Name">{{
            machine.modelName
          }}</el-descriptions-item>
          <el-descriptions-item label="Sample Number">{{
            machine.sampleNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="Status">{{
            machine.status
          }}</el-descriptions-item>
          <el-descriptions-item label="Start TIme">{{
            machine.testType
          }}</el-descriptions-item>
          <el-descriptions-item label="Machine Name">{{
            machine.machineName
          }}</el-descriptions-item>
          <el-descriptions-item label="소요시간">{{
            totalTime
          }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <MachineChart v-if="machine" :machine="machine" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import type { Machine } from "./MachineType";
import MachineChart from "./MachineChart.vue";
import { useRoute } from "vue-router";
import { fetchMachine } from "./MachineList";

// useRoute 훅을 사용하여 현재 라우트 객체를 가져옵니다.
const route = useRoute();
const machine = ref<Machine | null>(null);

// route.params.uuid가 변경될 때마다 fetchMachine 함수를 호출
watch(
  () => route.params.uuid,
  async (newUuid, oldUuid) => {
    const singleUuid = Array.isArray(newUuid) ? newUuid[0] : newUuid;
    
    if (singleUuid) {
      machine.value = await fetchMachine(singleUuid);
      
    }
  },
  { immediate: true }  // 초기 로드 시에도 fetchMachine 함수를 호출
);

// 아래의 totalTime computed를 활성화하고 machine 데이터를 사용하여 계산
const totalTime = computed(() => {
  if (machine.value) {
    if (machine.value.status === "FINISHED") {
      const startTime = new Date(machine.value.startTime);
      const endTime = new Date(machine.value.endTime);
      const diffMs = endTime.getTime() - startTime.getTime();
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.round((diffMs % 3600000) / 60000);
      return `${diffHrs} hrs ${diffMins} mins`;
    } else {
      const startTime = new Date(machine.value.startTime);
      const currentTime = new Date();
      const diffMs = currentTime.getTime() - startTime.getTime();
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.round((diffMs % 3600000) / 60000);
      return `${diffHrs} hrs ${diffMins} mins`;
    }
  }
  return "";
});
</script>

<style scoped>
.machine-container {
  display: flex;
}

.el-card {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
