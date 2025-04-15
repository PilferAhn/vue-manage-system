<script lang="ts">
export default {
  components: {},
};
</script>
<template>
    <div class="unavailable-container">
      <div class="unavailable-card">
        <h2>작성할 수 없는 시간입니다</h2>
        <p>현재는 Fab 의뢰서를 작성할 수 없습니다.</p>
        <p>자세한 사항은 관리자에게 문의하세요.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // 따로 props는 필요 없음
  </script>
  
  <style scoped>
  .unavailable-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    padding: 20px;
  }
  
  .unavailable-card {
    background-color: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 12px;
    padding: 30px 40px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: #b91c1c;
  }
  
  .unavailable-card h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .unavailable-card p {
    margin: 5px 0;
  }
  </style>
  