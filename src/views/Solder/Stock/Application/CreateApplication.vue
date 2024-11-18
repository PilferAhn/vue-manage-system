<template>
    <ApplicationTemplate :stockInfo="stockInfo" :formType="'create'" />
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { initializeStockInfo } from './Application'; // Adjust the import path as necessary
  import ApplicationTemplate from './ApplicationTemplate.vue';
  // Initialize StockInfo
  const stockInfo = ref(initializeStockInfo());
  </script>
  