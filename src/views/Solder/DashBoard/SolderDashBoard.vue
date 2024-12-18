<template>
  <div class="container">
    <!-- WaitTask 영역: 30% -->
    <!-- <div class="wait-task-area">
      
    </div> -->

    <!-- Progress 영역: 40% -->
    <div class="progress-area">
      <Progress v-model:applications="props.waitAndProgress"></Progress>
    </div>

    <!-- Finished 영역: 30% -->
    <div class="finished-area">
      <Waiting v-model:applications="props.waitAndProgress"></Waiting>
      <br>
      <Finished v-model:applications="props.fishied"></Finished>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApplicationData } from "../../../interface/solderAppInterface";
import Waiting from "./Waiting.vue"; // WaitTask 컴포넌트 추가
import Progress from "./Progress.vue";
import Finished from "./Finished.vue";

const props = defineProps<{
  total: ApplicationData[];
  wait: ApplicationData[];
  inProgress: ApplicationData[];
  waitAndProgress: ApplicationData[];
  fishied: ApplicationData[];
}>();
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 65% 35%;
  gap: 16px; /* 컴포넌트 간 여백 */
  height: 100%;
}

.wait-task-area,
.progress-area,
.finished-area {
  border: 1px solid #ddd; /* 시각적 구분을 위해 */
  padding: 8px;
  box-sizing: border-box;
}

.wait-task-area {
  background-color: #f9f9f9;
}

.progress-area {
  background-color: #e6f7ff;
}

.finished-area {
  background-color: #f6ffed;
}
</style>
