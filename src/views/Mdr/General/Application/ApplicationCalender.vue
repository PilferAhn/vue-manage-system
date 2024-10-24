<template>
    <div class="custom-calendar">
      <el-calendar v-model="value">
        <template #date-cell="{ data }">
          <div>
            <span>{{ data.day }}</span>
            <!-- 원하는 내용을 여기에 추가 -->
            <p v-if="isSpecificDate(data.date)">안지민 MDR 외 3건 ...</p>
            
          </div>
        </template>
      </el-calendar>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  const value = ref(new Date())
  
  // 특정 날짜인 10월 22일을 체크하는 함수
  const isSpecificDate = (date: Date) => {
    return date.getFullYear() === 2024 && date.getMonth() === 9 && date.getDate() === 22
  }
  </script>
  
  <style scoped>
  .custom-calendar {
    width: 100%;
    height: 600px; /* 높이를 조정하여 달력을 크게 만듭니다 */
  }
  
  .el-calendar {
    font-size: 20px; /* 텍스트 크기 증가 */
  }
  </style>
  