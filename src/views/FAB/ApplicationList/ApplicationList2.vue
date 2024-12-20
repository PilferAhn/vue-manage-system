<template>
  <div>
    <el-tabs
      v-model="activeTab"
      type="border-card"
      @tab-click="handleTabClick" 
    >
      <el-tab-pane :label="cspLabel" name="csp">
        <ApplicationsByWeek :processData="whcCsp" />
      </el-tab-pane>
      <el-tab-pane :label="wlpLabel" name="wlp">
        <ApplicationsByWeek :processData="whcWlp" />
      </el-tab-pane>
      <el-tab-pane :label="'ETC'" name="etc">
        <ApplicationsByWeek :processData="etc" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { fetchProcessData, getApplicationByUserName } from "./ApplicationList";
import { getUserName, getRole } from "../../../utils/account-utils";
import ApplicationsByWeek from "./ApplicationsByWeek2.vue";
import type { FabApplicationForm } from "../../../interface/mes-interface";

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
const etc  = ref<FabApplicationForm[]>([]); // For next week's data

let tempName = "";
onMounted(async () => {
  // fetchProcessData 함수로 데이터 가져오기

  if(getUserName() === "admin"){
    processDataArray.value = await fetchProcessData(processDataArray.value);
  }
  else if(getRole() === "group leader"){
    processDataArray.value = await fetchProcessData(processDataArray.value);
  }
  else{
    processDataArray.value = await getApplicationByUserName(getUserName() , processDataArray.value)
  }
  
  // processDataArray.value.forEach((processData, index) => {
  //   if(processData.modelName === "XM03ATJ@2A"){
  //     console.log(processData)
  //   }
  // })
  // getMaxHistorySeqAndIndexFromProcessData(processDataArray.value);
  // showInfoByWeek(processDataArray.value)

  processDataArray.value.forEach((processData, index) => {
    if (["WHC_CSP", "WHC-CSP"].includes(processData["destination"])) {
      whcCsp.value.push(processData);
    } else if (processData["destination"] === "WHC_WLP") {
      whcWlp.value.push(processData);
    } else {
      etc.value.push(processData)
    }
  });
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
