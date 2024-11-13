<template>
  <div>
    <SolderApplicationTemplate
      :application-data="applicationData"
      :application-type="'create'"
    ></SolderApplicationTemplate>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { initializeApplicationData, initializeApplicationData2 } from "../../../utils/solderApplicationUtil";
import SolderApplicationTemplate from "./SolderApplicationTemplate.vue";
const applicationData = reactive(initializeApplicationData2());
</script>

<style></style>
