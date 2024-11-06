<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Created" name="created">
        <SolverApplicationListByStatus
          :applicationData="progressData"
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
const progressData = ref<ApplicationData[]>([]);
const createdData = ref<ApplicationData[]>([]);

function sortByCreatedDateDesc(applicationDataArray: ApplicationData[]): ApplicationData[] {
  return applicationDataArray.sort((a, b) => {
    const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
    const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
    return dateB - dateA; // Sort in descending order
  });
}

// Function to fetch the data again
async function refreshData() {
  try {
    createdData.value = await get_application_list_by_status("created");
    progressData.value = await get_application_list_by_status("in progress");
    finishedData.value = await get_application_list_by_status("finished");

    // progressData.value = [...progressData.value.reverse(), ...createdData.value.reverse()];
    progressData.value = [...progressData.value, ...createdData.value];
    progressData.value = sortByCreatedDateDesc(progressData.value)
    // finishedData.value = finishedData.value

    // const matchingItems = finishedData.value.filter((item1) =>
    //   createdData.value.some((item2) => item2.uuid === item1.uuid)
    // );

    // console.log(matchingItems);
    console.log("여기서 발생? ")

  } catch (error) {
    console.error("Error loading application data:", error);
  }
}

// Fetch the data on component mount
onMounted(refreshData);
</script>
