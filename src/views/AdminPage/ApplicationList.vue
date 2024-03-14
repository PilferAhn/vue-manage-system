<template>
  <div class="request-list-container">
    <ApplicationRow :status="'reserved'"> </ApplicationRow>
    <ApplicationRow :status="'created'"> </ApplicationRow>
  </div>
</template>

<script lang="ts" setup>
import ApplicationRow from "./ApplicationRow.vue";
</script>

<style>
/* 리스트 간의 간격과 스타일링을 위한 CSS */
.request-list-container {
  display: flex;
  flex-direction: column;
  gap: 40px; /* 각 RequestList 사이에 20px의 간격을 추가 */
}

.list-spacing {
  margin-bottom: 20px; /* 필요에 따라 조정 */
}
</style>
