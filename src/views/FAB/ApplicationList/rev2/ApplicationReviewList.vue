<template>
  <div class="container">
    <!-- Tabs for This Week, Last Week, and Next Week -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="priviousWeekLabel" name="lastWeek">
        <ApplicationsByWeek
          v-if="activeTab === 'lastWeek'"
          :processData="lastWeekDataArray"
          :week-number="currentWeekNumber - 1"
        />
      </el-tab-pane>

      <el-tab-pane :label="currentWeekLabel" name="thisWeek">
        <ApplicationsByWeek
          v-if="activeTab === 'thisWeek'"
          :processData="applications"
          :week-number="currentWeekNumber"
        />
      </el-tab-pane>
      <el-tab-pane :label="nextWeekLabel" name="nextWeek">
        <ApplicationsByWeek
          v-if="activeTab === 'nextWeek'"
          :processData="nextWeekDataArray"
          :week-number="currentWeekNumber + 1"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { convertToCamelCase } from "../../Common/Application"; // Assuming the utility is stored here
import { getCurrentWeekNumber } from "../../../../utils/date-utils";
import { fetchProcessData } from ".././ApplicationList";
import ApplicationsByWeek from "./ApplicationTable.vue";
import type { ProcessData } from "../../Interface/ApplicationInterface";
import {
  FabRequestForm,
  FabRequest,
} from "../../../../interface/fab-application-rev2";
import {
  getApplicationList,
  getApplicationListByDict,
} from "../../../../utils/Fab/fab-application-utils";
import { getUserId } from "../../../../utils/account-utils";

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
const processDataArray = ref<FabRequest[]>([]); // For this week's data
const thisWeekDataArray = ref<FabRequest[]>([]); // For this week's data
const lastWeekDataArray = ref<FabRequest[]>([]); // For last week's data
const nextWeekDataArray = ref<FabRequest[]>([]); // For next week's data
const isLoad = ref<boolean>(false);
const applications = reactive<FabRequest[]>([]);


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
