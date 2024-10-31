<template>
  <div class="container"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import {
  getTodayAnd30DaysAgoDates,
  fetchMesDataForDateRange,
} from "./SampleStatus";
import {
  convertToCamelCase,  
} from "../Common/Application"; // Assuming the utility is stored here
import type { ProcessData } from "../Interface/ApplicationInterface";

const applications = ref<ProcessData[]>([]); // For this week's data

onMounted(async() => {
  const dateInfo = getTodayAnd30DaysAgoDates();
  await fetchProcessData()
  fetchMesDataForDateRange(applications.value, dateInfo["startDate"], dateInfo["lastDate"]);
  
});

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

    applications.value = convertToCamelCase(response.data); // Convert fetched data to camelCase
        
  } catch (error) {
    console.error("Failed to fetch process data:", error);
  }
};

</script>

<style></style>
