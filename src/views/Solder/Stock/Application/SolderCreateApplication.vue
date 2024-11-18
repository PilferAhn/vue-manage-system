<template>
    <ApplicationTemplate :stockInfo="stockInfo" :formType="'create'" />
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { initializeSampleInfo } from './Application'; // Adjust the import path as necessary
  import ApplicationTemplate from './SampleApplicationTemplate.vue';
  // Initialize StockInfo
  const stockInfo = ref(initializeSampleInfo());
  </script>
  