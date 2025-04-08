<template>
  <div class="container">
    <div v-if="runningMeas.length >= 1">
      <div class="meas-types-container">
        <TegRunningMeasurement :running-mea="runningMeas" />
      </div>
    </div>
    <div class="meas-types-container">
      <el-tabs v-model="activeTabMain" type="border-card" class="demo-tabs">
        <el-tab-pane label="Upcomming List (Priority)" name="main1">
          <template v-if="activeTabMain === 'main1'">
            <TegMeasurementTab
              :category="'next'"
              key="next"
              :page-size="5"
              :fab-app="fabAppList"
            />
          </template>
        </el-tab-pane>
        <el-tab-pane label="Delay List (Date)" name="main2">
          <template v-if="activeTabMain === 'main2'">
            <TegMeasurementTab
              :category="'delay'"
              key="delay"
              :page-size="5"
              :fab-app="fabAppList"
            />
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="meas-types-container">
      <el-tabs v-model="activeTabSub" type="border-card" class="demo-tabs">
        <el-tab-pane label="TEG - Product" name="sub1">
          <template v-if="activeTabSub === 'sub1'">
            <TegMeasurementTab
              :category="'product'"
              key="product"
              :page-size="10"
              :fab-app="fabAppList"
            />
          </template>
        </el-tab-pane>
        <el-tab-pane label="TEG - Normal" name="sub2">
          <template v-if="activeTabSub === 'sub2'">
            <TegMeasurementTab
              :category="'model'"
              key="model"
              :page-size="10"
              :fab-app="fabAppList"
            />
          </template>
        </el-tab-pane>
        <el-tab-pane label="TCF" name="sub3">
          <template v-if="activeTabSub === 'sub3'">
            <TegMeasurementTab
              :category="'tcf'"
              key="tcf"
              :page-size="10"
              :fab-app="fabAppList"
            />
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import TegMeasurementTab from "./TegMeasurementTab.vue";
import TegRunningMeasurement from "./TegRunningMeasurement.vue";
import { formatDateTime } from "../../../utils/date-utils";
import {
  getRunningMeasurement,
  TegRunningMeas,
} from "./../../../utils/waferMeasurementHelper";
import type { FabApplicationForm } from "../../../interface/mes-interface";
import { fetchProcessData } from "../../FAB/ApplicationList/ApplicationList";
import { getApplicationListByDictRev2 } from "../../../utils/Fab/fab-application-utils";
import { FabRequest } from "../../../interface/fab-application-rev2";

const activeTabMain = ref("main1");
const activeTabSub = ref("sub1");
const fabApp = ref<FabApplicationForm[]>([]);
const fabAppList = ref<FabRequest[]>([])
const runningMeas = ref<TegRunningMeas[]>([]);

onMounted(async () => {
  try {

    runningMeas.value = await getRunningMeasurement();
    // fabApp.value = await fetchProcessData(fabApp.value);

    let tempNames = ""

    let para = {
      users: true,
      wafer: true,
      idt_type: true,
      hs_type: true,
      idt_layers: false,
      lot_status: true,
      is_pending: false,      
    };

    for(let i = 0 ; i < runningMeas.value.length; i++){
      tempNames += runningMeas.value[i].productName + ","
    }

    // para["product_names"] = tempNames

    fabAppList.value = await getApplicationListByDictRev2(para)
    console.log(fabAppList.value.length)

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
