<!-- LoadApplicationList.vue -->
<template>
  <div>
    <StockItemListTemplate :stockItems="stockItems" :operationType="'reel'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { StockItem } from "../../../../interface/stock";
import StockItemListTemplate from "./StockItemListTemplate.vue";
import { fetchStockItems } from "./StockItemList"; // Import the fetch function
import { getDepartment, getUserId, getUserName } from "../../../../utils/account-utils";


const stockItems = ref<StockItem[]>([]);
onMounted(async () => {
  
  // console.log("UserName:",getUserName())  
  // console.log("UserId:", getUserId())  
  // console.log("Department:", getDepartment())  

  // Fetch StockInfo data on component mount
  if(["admin"].includes(getUserName()) || getDepartment() === "whc" || ["w2240310", "w2171209", "w2150708"].includes(getUserId()) ){
    stockItems.value = await fetchStockItems("reel");
  }
  else{
    stockItems.value = await fetchStockItems("reel",getUserId());
}});
</script>
