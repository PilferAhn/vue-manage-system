<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card>
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
          <!-- 추가된 필드 -->
        </el-descriptions>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <MachineChart :machine="machine" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import type { Machine } from "./MachineType";
import MachineChart from "./MachineChart.vue";

const props = defineProps<{ machine: Machine }>();

const totalTime = computed(() => {
  if (props.machine.status === "FINISHED") {
    const startTime = new Date(props.machine.startTime);
    const endTime = new Date(props.machine.endTime);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round((diffMs % 3600000) / 60000);
    return `${diffHrs} hrs ${diffMins} mins`;
  } else {
    const startTime = new Date(props.machine.startTime);
    const currentTime = new Date();
    const diffMs = currentTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round((diffMs % 3600000) / 60000);
    return `${diffHrs} hrs ${diffMins} mins`;
  }
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
