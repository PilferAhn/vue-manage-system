<template>
    <ChildComponent :data="testData" />
  </template>
  
  <script lang="ts" setup>
  import { testData } from './test_data';
  import ChildComponent from './testGraphPloty3.vue';
  </script>
  