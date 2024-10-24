<template>
    <div class="container">
        
      <!-- Pass processData to the child component -->
      <Application :processData="processData"
      :applicationType="'create'" />
    </div>
  </template>

<script lang="ts" setup>
import type { ProcessData } from '../Interface/ApplicationInterface';

import {processData} from "../Common/Application"
import Application from './Application.vue';

console.log(processData)

</script>

<style>

</style>