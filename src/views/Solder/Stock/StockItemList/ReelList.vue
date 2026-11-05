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
import { usePermissStore } from "../../../../store/permiss";


const stockItems = ref<StockItem[]>([]);
onMounted(async () => {
  
  // console.log("UserName:",getUserName())  
  // console.log("UserId:", getUserId())  
  // console.log("Department:", getDepartment())  

  // Fetch StockInfo data on component mount
  // 전체 조회 권한: 권한관리 > solder.reel.view_all
  if (usePermissStore().hasPerm("solder.reel.view_all")) {
    stockItems.value = await fetchStockItems("reel");
  }
  else{
    stockItems.value = await fetchStockItems("reel",getUserId());
}});
</script>
