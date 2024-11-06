<template>
  <div class="container">
    <!-- Tabs for This Week, Last Week, and Next Week -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="currentWeekLabel" name="thisWeek">
        <ApplicationsByWeek :processData="thisWeekDataArray" />
      </el-tab-pane>

      <el-tab-pane :label="priviousWeekLabel" name="lastWeek">
        <ApplicationsByWeek :processData="lastWeekDataArray" />
      </el-tab-pane>

      <el-tab-pane :label="nextWeekLabel" name="nextWeek">
        <ApplicationsByWeek :processData="nextWeekDataArray" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { convertToCamelCase } from "../Common/Application"; // Assuming the utility is stored here
import { getCurrentWeekNumber } from "../../../utils/date-utils";
import { fetchProcessData } from "./ApplicationList";
import ApplicationsByWeek from "./ApplicationsByWeek.vue";
import type { ProcessData } from "../Interface/ApplicationInterface";

const currentWeekNumber: number = getCurrentWeekNumber();
const currentWeekLabel =
  currentWeekNumber.toString() +
  "주 - (" +
  (currentWeekNumber + 1).toString() +
  "투입)";
const priviousWeekLabel =
  (currentWeekNumber - 1).toString() +
  "주 - (" +
  currentWeekNumber.toString() +
  "투입)";
const nextWeekLabel =
  (currentWeekNumber + 1).toString() +
  "주 - (" +
  (currentWeekNumber + 1).toString() +
  "투입)";

// Define the active tab, default is 'thisWeek'
const activeTab = ref("thisWeek");
// Handle tab click if you need any additional logic
const handleTabClick = (tab: any) => {
  console.log("Active Tab:", tab.name);
};

// Define processData arrays for different tabs
const processDataArray = ref<ProcessData[]>([]); // For this week's data
const thisWeekDataArray = ref<ProcessData[]>([]); // For this week's data
const lastWeekDataArray = ref<ProcessData[]>([]); // For last week's data
const nextWeekDataArray = ref<ProcessData[]>([]); // For next week's data

onMounted(async () => {
  // fetchProcessData 함수로 데이터 가져오기
  processDataArray.value = await fetchProcessData();

  for (let i = 0; i < processDataArray.value.length; i++) {
    const item = processDataArray.value[i];
    if (item.weekNumber === currentWeekNumber) {
      thisWeekDataArray.value.push(item);
    } else if (item.weekNumber === currentWeekNumber - 1) {
      lastWeekDataArray.value.push(item);
    } else if (item.weekNumber === currentWeekNumber + 1) {
      // 다음 주 데이터 조건 수정
      nextWeekDataArray.value.push(item);
    }
  }
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
