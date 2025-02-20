<template>
    <div style="margin-bottom: 10px; display: flex; gap: 10px;">
      <el-button 
        :type="props.application.isNa ? 'primary' : 'default'"
        @click="toggleNa"
      >
        NA 의뢰서
      </el-button>
  
      <el-button 
        :type="props.application.isNf ? 'primary' : 'default'"
        @click="toggleNf"
      >
        NF 의뢰서
      </el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from "vue";
  import type { Application } from "../../../interface/Modules/Application/application";
  
  const props = defineProps<{
    application: Application;
  }>();
  
  // 🔹 NA 의뢰서 버튼 클릭 시 (독립적으로 작동)
  const toggleNa = () => {
    props.application.isNa = !props.application.isNa; // 현재 값 반전
  };
  
  // 🔹 NF 의뢰서 버튼 클릭 시 (독립적으로 작동)
  const toggleNf = () => {
    props.application.isNf = !props.application.isNf; // 현재 값 반전
  };
  </script>
  