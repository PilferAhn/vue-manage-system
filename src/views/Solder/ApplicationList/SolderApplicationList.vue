<template>
  <div class="container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Created" name="created">
        <SolverApplicationListByStatus
          :applicationData="createdData"
          @status-updated="refreshData"
        />
      </el-tab-pane>
      <el-tab-pane label="Finished" name="finished">
        <SolverApplicationListByStatus
          :applicationData="finishedData"
          @status-updated="refreshData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SolverApplicationListByStatus from "./SolverApplicationListByStatus.vue";
import { get_application_list_by_status } from "./SolderApplicationList";
import type { ApplicationData } from "../../../interface/solderAppInterface";

// Tab management
const activeTab = ref("created");

// Data for each status
const finishedData = ref<ApplicationData[]>([]);
const createdData = ref<ApplicationData[]>([]);

// Function to fetch the data again
async function refreshData() {
  try {
    createdData.value = await get_application_list_by_status("created");
    finishedData.value = await get_application_list_by_status("finished");

    // Filter data based on status
    // finishedData.value = data.filter((item) => item.status === "finished");
    // createdData.value = data.filter((item) => item.status === "created");
    // console.log(finishedData.value)
  } catch (error) {
    console.error("Error loading application data:", error);
  }
}

// Fetch the data on component mount
onMounted(refreshData);
</script>
