<template>
  <ApplicationTemplate :stockInfo="stockInfo" :formType="'load'"/>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { convertToCamelCase, convertToPep8 } from "../../../../utils/Common";
const route = useRoute(); // Access the route
import { initializeStockInfo } from "./Application"; // Adjust the import path as necessary
import ApplicationTemplate from "./ApplicationTemplate.vue";

// Initialize StockInfo
const stockInfo = ref(initializeStockInfo());

// Function to fetch the application data from the server
const fetchApplication = async (reel_id: string) => {
  try {
    const form = new FormData();
    form.append("reel_id", reel_id);

    const response = await axios.post(`/reel/get_reel_request_by_id`, form);
    
    const convertedData = convertToCamelCase(response.data);
    // Assign the converted data to processData
    Object.assign(stockInfo.value, convertedData);    
  } catch (error) {
    console.error("Error fetching application:", error);
  }
};

// Watch the `uuid` route parameter, fetch data immediately and when it changes
watch(
  () => route.params.reelId, // Watching route parameter change
  (id) => {
    if (id) {
      ``;
      fetchApplication(id as string); // Fetch data when uuid changes
    }
  },
  { immediate: true } // Trigger immediately on component mount
);
</script>

<style></style>
