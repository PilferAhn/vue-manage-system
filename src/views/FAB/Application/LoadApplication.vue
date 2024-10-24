<template>
  <div class="container">
    <!-- Pass processData to the child component -->
    <Application :processData="processData"
    :applicationType="'load'" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from "vue";
import type { ProcessData } from "../Interface/ApplicationInterface";
import axios from "axios";
import { processData, convertToCamelCase } from "../Common/Application";
import Application from "./Application.vue";
import { useRoute } from "vue-router";

const route = useRoute(); // Access the route

// Function to fetch the application data from the server
const fetchApplication = async (uuid: string) => {
  try {
    const response = await axios.get(`/fab/get_application/${uuid}`);

    const convertedData = convertToCamelCase(response.data["data"]);
    // Assign the converted data to processData
    Object.assign(processData, convertedData);
  } catch (error) {
    console.error("Error fetching application:", error);
  }
};

// Watch the `uuid` route parameter, fetch data immediately and when it changes
watch(
  () => route.params.uuid, // Watching route parameter change
  (newUuid) => {
    if (newUuid) {
      fetchApplication(newUuid); // Fetch data when uuid changes
    }
  },
  { immediate: true } // Trigger immediately on component mount
);
</script>

<style></style>
