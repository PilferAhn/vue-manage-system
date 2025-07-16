<template>
  <StockItemTemplate v-model="solder" formType="create" itemType="sample" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { initializeStockItem } from './StockItem';
import StockItemTemplate from './StockItemTemplate.vue';
// Initialize StockInfo
const solder = ref(initializeStockItem("sample"));
</script>

