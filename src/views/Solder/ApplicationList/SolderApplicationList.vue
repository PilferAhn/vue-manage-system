<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="Dashboard" name="dashboard">
        <Dashboard
        :total="applicationList"
        :wait="createdData"
        :in-progress="progressData"
        :fishied="finishedData"
        :wait-and-progress="waitAndProgress"></Dashboard>
      </el-tab-pane>
      <el-tab-pane label="Ongoing" name="created">
        <SolverApplicationListByStatus
          :applicationData="waitAndProgress"
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
import { ref, onMounted, onUnmounted } from "vue";
import SolverApplicationListByStatus from "./SolverApplicationListByStatus.vue";
import {
  modiMeasTypName,
  get_application_list,
  getMyApplicationList,
  findLotHistoryFromFabRequest,
  updateReelInfo
} from "./SolderApplicationList";
import Dashboard from "../DashBoard/SolderDashBoard.vue";
import type { ApplicationData } from "../../../interface/solderAppInterface";

const name = localStorage.getItem("ms_username");
const userId = localStorage.getItem("id");

// Tab management
const activeTab = ref("created");

// Data for each status
const finishedData = ref<ApplicationData[]>([]);
const progressData = ref<ApplicationData[]>([]);
const waitAndProgress = ref<ApplicationData[]>([]);
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
    modiMeasTypName(applicationList.value)
    applicationList.value = getMyApplicationList(applicationList.value)
    
    updateReelInfo(applicationList.value)            
    findLotHistoryFromFabRequest(applicationList.value)
    // findLots(applicationList.value);
    applicationList.value = sortByCreatedDateDesc(applicationList.value);

    createdData.value = applicationList.value.filter((app) => {
      return ["created"].includes(app.status);
    });

    progressData.value = applicationList.value.filter((app) => {
      return ["in progress"].includes(app.status);
    });

    waitAndProgress.value = applicationList.value.filter((app) => {
      return ["created", "in progress"].includes(app.status);
    });

    finishedData.value = applicationList.value.filter((app) => {
      return app.status === "finished";
    });
  } catch (error) {
    console.error("Error loading application data:", error);
  }
}


// Timer variable
const autoRefresh = ref(300);
let intervalId: ReturnType<typeof setInterval> | undefined;


// Interval logic
onMounted(() => {
  intervalId = setInterval(() => {
    autoRefresh.value--;

    // When timer reaches 0
    if (autoRefresh.value <= 0) {
      autoRefresh.value = 300; // Reset the timer
      refreshData()
    }
  }, 1000); // Interval every 1 second
});

// Cleanup interval on component unmount
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// Fetch the data on component mount
onMounted(refreshData);
</script>
