<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="Ongoing" name="created">
        <SolverApplicationListByStatus
          :applicationData="progressData"
          :applicationType="'created'"
          @status-updated="refreshData"
        />
      </el-tab-pane>
      <el-tab-pane label="Finished" name="finished">
        <SolverApplicationListByStatus
          :applicationData="finishedData"
          :applicationType="'finished'"
          @status-updated="refreshData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SolverApplicationListByStatus from "./SolverApplicationListByStatus.vue";
import {
  get_application_list_by_status,
  get_application_list,
  getMyApplicationList,
  findLotHistoryFromFabRequest,
  updateReelInfo
} from "./SolderApplicationList";
import type { ApplicationData } from "../../../interface/solderAppInterface";

const name = localStorage.getItem("ms_username");
const userId = localStorage.getItem("id");

// Tab management
const activeTab = ref("created");

// Data for each status
const finishedData = ref<ApplicationData[]>([]);
const progressData = ref<ApplicationData[]>([]);
const createdData = ref<ApplicationData[]>([]);
const filteredData = ref<ApplicationData[]>([]);

function sortByCreatedDateDesc(
  applicationDataArray: ApplicationData[]
): ApplicationData[] {
  return applicationDataArray.sort((a, b) => {
    const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
    const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
    return dateA - dateB; // Sort in descending order
  });
}

const applicationList = ref<ApplicationData[]>([]);

// Function to fetch the data again
async function refreshData() {
  try {

    applicationList.value = await get_application_list();
        
    applicationList.value = getMyApplicationList(applicationList.value)
    

    updateReelInfo(applicationList.value)    

    // applicationList.value.forEach((app, index) => {
    //   if (app.modelName === "DG45FA4@2A") {
    //     console.log(app)
    //   }
    // });
    
    findLotHistoryFromFabRequest(applicationList.value)
    // findLots(applicationList.value);
    applicationList.value = sortByCreatedDateDesc(applicationList.value);

    progressData.value = applicationList.value.filter((app) => {
      return ["created", "in progress"].includes(app.status);
    });

    finishedData.value = applicationList.value.filter((app) => {
      return app.status === "finished";
    });
  } catch (error) {
    console.error("Error loading application data:", error);
  }
}

// Fetch the data on component mount
onMounted(refreshData);
</script>
