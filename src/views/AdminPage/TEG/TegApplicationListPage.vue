<template>
    <div class="container">

      <div class="meas-types-container">
        <el-tabs v-model="activeTabMain" type="border-card" class="demo-tabs">
          <el-tab-pane label="의뢰서 작성 완료 항목" name="main1">
            <template v-if="activeTabMain === 'main1'">
              <TegMeasurementTab :category="'created'" key="created" :page-size="15" />
            </template>
          </el-tab-pane>
          <!-- <el-tab-pane label="지연 리스트(접수 오래된 순)" name="main2">
            <template v-if="activeTabMain === 'main2'">
              <TegMeasurementTab :category="'delay'" key="delay" :page-size="5" />
            </template>
          </el-tab-pane> -->
        </el-tabs>
      </div>
      <!-- <div class="meas-types-container">
        <el-tabs v-model="activeTabSub" type="border-card" class="demo-tabs">
          <el-tab-pane label="TEG(제품)" name="sub1">
            <template v-if="activeTabSub === 'sub1'">
              <TegMeasurementTab
                :category="'product'"
                key="product"
                :page-size="10"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="TEG(일반)" name="sub2">
            <template v-if="activeTabSub === 'sub2'">
              <TegMeasurementTab
                :category="'model'"
                key="model"
                :page-size="10"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="TCF" name="sub3">
            <template v-if="activeTabSub === 'sub3'">
              <TegMeasurementTab :category="'tcf'" key="tcf" :page-size="10" />
            </template>
          </el-tab-pane>
        </el-tabs>
      </div> -->
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import TegMeasurementTab from "./TegApplicationListTable.vue"

  import {
    getRunningMeasurement,
    TegRunningMeas,
  } from "./../../../utils/waferMeasurementHelper";
  
  const activeTabMain = ref("main1");
  const activeTabSub = ref("sub1");
  
  const runningMeas = ref<TegRunningMeas[]>([]);
  
  onMounted(async () => {
    try {
      runningMeas.value = await getRunningMeasurement();
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
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
  