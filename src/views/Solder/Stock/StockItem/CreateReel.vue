<template>
  <StockItemTemplate v-model="reel" formType="create" itemType="reel" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { initializeStockItem } from './StockItem';
import StockItemTemplate from './StockItemTemplate.vue';
// Initialize StockInfo
const reel = ref(initializeStockItem("reel"));
</script>