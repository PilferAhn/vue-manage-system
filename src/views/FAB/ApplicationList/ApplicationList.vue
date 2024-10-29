<template>
  <div class="container">
    <!-- Tabs for This Week, Last Week, and Next Week -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="이번 주" name="thisWeek">
        <ApplicationsByWeek :processData="processDataArray" />
      </el-tab-pane>

      <el-tab-pane label="지난 주" name="lastWeek">
        <ApplicationsByWeek :processData="lastWeekDataArray" />
      </el-tab-pane>

      <el-tab-pane label="다음 주" name="nextWeek">
        <ApplicationsByWeek :processData="nextWeekDataArray" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import {
  convertToCamelCase,
  getCurrentWeekNumber,
} from "../Common/Application"; // Assuming the utility is stored here
import ApplicationsByWeek from "./ApplicationsByWeek.vue";
import type { ProcessData } from "../Interface/ApplicationInterface";

// Define the active tab, default is 'thisWeek'
const activeTab = ref("thisWeek");
// Handle tab click if you need any additional logic
const handleTabClick = (tab: any) => {
  console.log("Active Tab:", tab.name);
};

// Define processData arrays for different tabs
const processDataArray = ref<ProcessData[]>([]); // For this week's data
const lastWeekDataArray = ref<ProcessData[]>([]); // For last week's data
const nextWeekDataArray = ref<ProcessData[]>([]); // For next week's data

// Reactive array to hold processData
const processData = ref<ProcessData[]>([]);

// Fetch data when the component is mounted
const fetchProcessData = async () => {
  try {
    // const response = await axios.get("/fab/get_all_application"); // Replace with your API endpoint

    const formData = new FormData();
    formData.append("order_by", "id");
    formData.append("order_dir", "asc");
    // formData.append("limit", "0");
    // formData.append("page", "1");
    formData.append("designer_confirm", "false");


    const url = "/fab_monitoring/get_fab_request_list";
    const response = await axios.post(url, formData);

    processData.value = convertToCamelCase(response.data); // Convert fetched data to camelCase
    

    processDataArray.value = processData.value;
  } catch (error) {
    console.error("Failed to fetch process data:", error);
  }
};

// Call fetchProcessData when the component is mounted
onMounted(() => {
  fetchProcessData();
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
