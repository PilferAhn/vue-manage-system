<template>
  <CspFormListTemplate />
</template>

<script lang="ts" setup>

import CspFormListTemplate from './CspFormListTemplate.vue';

</script>

<style scope>
.search-box {
  margin-bottom: 10px;
}

.search-input {
  width: 200px;
}
.mr10 {
  margin-right: 10px;
}
.pagination-margin {
  margin-top: 20px;
}

.high-priority {
  /* background-color: #ff6868; 밝은 빨간색 배경 */
  color: red; /* 흰색 글씨 */
  /* font-weight: bold; 굵은 글씨 */
}
</style>
