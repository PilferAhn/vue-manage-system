<template>
  <div class="container">
    <div class="chart-container">
      <!-- 첫 번째 차트 -->
      <PdtPieChart :graphName="'Last Week'" :dateFrom="14" :dateEnd="8" />
      <!-- 두 번째 차트 -->
      <PdtPieChart :graphName="'This Week'" :dateFrom="7" :dateEnd="1" />
    </div>
    <div class="chart-container">
      <PdtBarChart :graphName="'Last Week'" :dateFrom="13" :dateEnd="8"/>
      <PdtBarChart :graphName="'This Week'" :dateFrom="6" :dateEnd="1"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PdtPieChart from "./PdtPieChart.vue"; // PdtPieChart 자식 컴포넌트 import
import PdtBarChart from "./PdtBarChart.vue";
</script>

<style scoped>
.chart-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 두 열로 나눠서 차트 표시 */
  gap: 20px; /* 두 차트 간의 간격 */
  max-width: 100%; /* 화면 크기에 맞춰 최대 너비 */
  margin-bottom : 50px
}

.chart-container > * {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
