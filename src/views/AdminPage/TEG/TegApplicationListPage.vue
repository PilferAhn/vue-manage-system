<template>
  <div class="container">
    <el-tabs v-model="activeTabMain" type="border-card" class="demo-tabs">
      <el-tab-pane label="측정 대기" name="main1"> 
        <TegRunningMeasurement></TegRunningMeasurement>
      </el-tab-pane>
      <el-tab-pane label="접수 대기" name="main2">
        <template v-if="activeTabMain === 'main2'">
          <TegMeasurementTab
            :category="'created'"
            key="created"
            :page-size="5"
          />          
        </template>        
      </el-tab-pane>
      <el-tab-pane label="측정 완료" name="main3">
        <template v-if="activeTabMain === 'main3'">
          <TegMeasurementTab
            :category="'finished'"
            key="finished"
            :page-size="15"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import TegMeasurementTab from "./TegApplicationListTable.vue";
import TegRunningMeasurement from "../../TegPage/MeasurementQueue/TegMeasurementQue.vue";

// 탭 상태를 로컬 스토리지에서 불러오거나 기본값 설정
const activeTabMain = ref(localStorage.getItem("activeTabMain") || "main1");

// 탭 상태가 변경될 때마다 로컬 스토리지에 저장
watch(activeTabMain, (newValue) => {
  localStorage.setItem("activeTabMain", newValue);
});

</script>

<style>
.meas-types-container {
  max-width: 100%;
  margin: 10px 0;
  background-color: #fff; /* Light background for better visibility */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}
</style>
