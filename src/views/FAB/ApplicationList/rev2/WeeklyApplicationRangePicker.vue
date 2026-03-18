<template>
    <div class="date-picker-container">
      <el-date-picker
        v-model="start"
        type="date"
        placeholder="시작 날짜 선택"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
      />
      ~
      <el-date-picker
        v-model="end"
        type="date"
        placeholder="종료 날짜 선택"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
      />
    </div>
    
  </template>
  
  <script lang="ts" setup>
  const start = defineModel<string>("start");
  const end = defineModel<string>("end");
  </script>
  <script lang="ts">
  export default {};
  </script>
  <style scoped>
  .date-picker-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  </style>