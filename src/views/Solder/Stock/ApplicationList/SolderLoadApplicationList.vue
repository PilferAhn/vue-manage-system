<!-- LoadApplicationList.vue -->
<template>
    <div>
      <ApplicationListTemplate :stockInfoList="stockInfoList" :operationType="'sample'"/>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import type { StockInfo } from "../Common/ApplicationInterface";
  import ApplicationListTemplate from "./ApplicationListTemplate.vue";
  import { fetchStockInfo } from "./ApplicationList"; // Import the fetch function
  
  const stockInfoList = ref<StockInfo[]>([]);
  
  onMounted(async () => {
    // Fetch StockInfo data on component mount
    stockInfoList.value = await fetchStockInfo("sample");
  });
  </script>
  