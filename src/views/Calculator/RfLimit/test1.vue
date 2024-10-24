<template>
  <div class="container">
    <testGraph
      :sParaData="sParaData"
      :ilLevel="ilLevel"
      :start="start"
      :stop="stop"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { loadTestData, sParaData } from "./test1"; // 적절한 import
import testGraph from "./testGraphPloty.vue";

// 추가로 전달할 값들
const ilLevel = ref(-15);
const start = ref(2350);
const stop = ref(2550);

onMounted(() => {
  loadTestData(); // 데이터를 불러와 sParaData 배열에 추가
});
</script>
