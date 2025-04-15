<template>
    <div>
      <el-button
        v-for="(measType, index) in props.measurements"
        :key="index"
        @click="handleClick(index)"
        :class="{ 'active-button': measType.isMeasured }"
      >
        {{ measType.measurementType }}
      </el-button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import type {
    ApplicationData,
    SolderFile,
    Measurement,
  } from "../../../interface/solderAppInterface";
  // Define props to receive processData
  
  const props = defineProps<{
    measurements: Measurement[];
    applicationType: string;
  }>();
  
  const handleClick = (index: number) => {
    props.measurements[index].isMeasured = !props.measurements[index].isMeasured;
  };
  
  </script>
  <script lang="ts">
  export default {};
  </script>
  
  <style>
  .active-button {
    background-color: #409eff;
    color: white !important;
    border-color: #409eff;
  }
  </style>