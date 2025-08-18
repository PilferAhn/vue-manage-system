<template>
  <StockItemTemplate v-if="isLoaded" v-model="stockItem" formType="load" :itemType="stockItem.operationType" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getStockItem } from "./StockItem";
import StockItemTemplate from "./StockItemTemplate.vue";
import { StockItem } from "../../../../interface/stock";
import { ElMessage } from "element-plus";


const route = useRoute();
const stockItem = ref<StockItem>({} as StockItem);

const isLoaded = ref(false);

async function fetchStockItem(id: string | number) {
  isLoaded.value = false; // Reset before fetching
  const result = await getStockItem(Number(id));
  if (result) {
    Object.assign(stockItem.value, result);
    isLoaded.value = true; // Set to true after loading
  } else {
    ElMessage.error("Failed to load stock item.");
  }
}

// Watch for id changes and load new stock item
watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      await fetchStockItem(id as string);
    }
  },
  { immediate: true }
);
</script>

<style></style>
