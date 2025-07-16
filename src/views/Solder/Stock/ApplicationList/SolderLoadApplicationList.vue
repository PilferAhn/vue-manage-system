<!-- LoadApplicationList.vue -->
<template>
    <div>
      <ApplicationListTemplate :stockItems="stockItems" :operationType="'sample'"/>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import type { StockItem } from "../../../../interface/stock";
  import ApplicationListTemplate from "./ApplicationListTemplate.vue";
  import { fetchStockItems } from "./ApplicationList"; // Import the fetch function
  
  const stockItems = ref<StockItem[]>([]);
  
  onMounted(async () => {
    // Fetch StockInfo data on component mount
    stockItems.value = await fetchStockItems("sample");
  });
  </script>
  