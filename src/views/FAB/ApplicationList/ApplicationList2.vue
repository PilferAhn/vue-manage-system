<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane :label="cspLabel" name="csp">
        <ApplicationsByWeek :processData="whcCsp" :teg-app="tegApp" />
      </el-tab-pane>
      <el-tab-pane :label="wlpLabel" name="wlp">
        <ApplicationsByWeek :processData="whcWlp" :teg-app="tegApp" />
      </el-tab-pane>
      <el-tab-pane :label="'ETC'" name="etc">
        <ApplicationsByWeek :processData="etc" :teg-app="tegApp" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { fetchProcessData, getApplicationByUserName } from "./ApplicationList";
import {
  getUserName,
  getRole,
  getDepartment,
} from "../../../utils/account-utils";
import ApplicationsByWeek from "./ApplicationsByWeek2.vue";
import type { FabApplicationForm } from "../../../interface/mes-interface";
import { getTegApplicationsByFinishDateStatus } from "../../../utils/tegUtility";
import { TegApplication } from "../../../interface/Teg/teg";
const cspLabel = "CSP";
const wlpLabel = "WLP(BDMP)";

// Define the active tab, default is 'thisWeek'
const activeTab = ref("csp");
// Handle tab click if you need any additional logic
const handleTabClick = (tab: any) => {
  // console.log("Active Tab:", tab.name);
};

// Define processData arrays for different tabs
const processDataArray = ref<FabApplicationForm[]>([]); // For this week's data
const whcCsp = ref<FabApplicationForm[]>([]); // For last week's data
const whcWlp = ref<FabApplicationForm[]>([]); // For next week's data
const etc = ref<FabApplicationForm[]>([]); // For next week's data
const tegApp = ref<TegApplication[]>([]);
let tempName = "";
onMounted(async () => {
  // fetchProcessData 함수로 데이터 가져오기

  tegApp.value = await getTegApplicationsByFinishDateStatus(
    "2024-02-14 00:00:00",
    "finished"
  );

  if (getUserName() === "admin") {
    processDataArray.value = await fetchProcessData(processDataArray.value);
  } else if (getRole() === "요소기술그룹") {
    processDataArray.value = await fetchProcessData(processDataArray.value);
  } else if (getRole() === "group leader") {
    processDataArray.value = await fetchProcessData(processDataArray.value);
  } else {
    processDataArray.value = await getApplicationByUserName(
      getUserName(),
      processDataArray.value
    );
  }

  const startTime = performance.now(); // 시작 시간 측정
  processDataArray.value.forEach((processData, index) => {
    for (let i = 0; i < tegApp.value.length; i++) {
      if (processData.modelName === tegApp.value[i].modelName) {
        processData.tegFinishedDate = tegApp.value[i].dateOfFinish;
        processData.measType = tegApp.value[i].measType;
      }
    }

    if (["WHC_CSP", "WHC-CSP"].includes(processData["destination"])) {
      whcCsp.value.push(processData);
    } else if (
      processData["destination"] === "WHC" &&
      processData["packageType"] === "CSP"
    ) {
      whcCsp.value.push(processData);
    } else if (
      ["WHC_WLP", "WHC-WLP", "WHC_BDMP", "WHC-BDMP", "BDMP"].includes(
        processData["destination"]
      )
    ) {
      whcWlp.value.push(processData);
    } else if (
      processData["destination"] === "WHC" &&
      processData["packageType"] === "WLP"
    ) {
      whcWlp.value.push(processData);
    } else if (
      processData["destination"] === "WHC" &&
      processData["packageType"] === "BDMP"
    ) {
      whcWlp.value.push(processData);
    } else {
      etc.value.push(processData);
    }
  });
  const endTime = performance.now(); // 종료 시간 측정
  console.log(
    `processDataArray 실행 시간: ${((endTime - startTime) / 1000).toFixed(2)}s`
  );
});
</script>

<style scoped>
/* Add margin or padding to give extra space for the scrollbar */
.container {
  padding-right: 30px; /* Increases space between the scroll bar and the table */
}

.custom-table {
  box-sizing: border-box;
  padding-right: 20px; /* Adds padding inside the table for extra space */
  margin-right: 10px; /* Adds a margin outside the table */
}

.uppercase {
  text-transform: uppercase;
}
</style>
