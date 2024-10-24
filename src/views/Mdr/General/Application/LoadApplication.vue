<template>
    <div class="container">
      <Application :mdrApplicationData="mdrApplicationData" :workType="'load'"/>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { initializeMdrApplication } from "../../Common/utility";
  import Application from "./Application.vue";
  
  const mdrApplicationData = ref(initializeMdrApplication());
  </script>
  