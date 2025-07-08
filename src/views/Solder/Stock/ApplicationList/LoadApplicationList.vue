<!-- LoadApplicationList.vue -->
<template>
  <div>
    <ApplicationListTemplate :stockInfoList="stockInfoList" :operationType="'reel'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { StockInfo } from "../../../../interface/stock";
import ApplicationListTemplate from "./ApplicationListTemplate.vue";
import { fetchStockInfo } from "./ApplicationList"; // Import the fetch function
import { getDepartment, getUserId, getUserName } from "../../../../utils/account-utils";


const stockInfoList = ref<StockInfo[]>([]);
onMounted(async () => {
  
  // console.log("UserName:",getUserName())  
  // console.log("UserId:", getUserId())  
  // console.log("Department:", getDepartment())  

  // Fetch StockInfo data on component mount
  if(["admin"].includes(getUserName()) || getDepartment() === "whc" || ["w2240310", "w2171209", "w2150708"].includes(getUserId()) ){
    stockInfoList.value = await fetchStockInfo("reel");
  }
  else{
    stockInfoList.value = await fetchStockInfo("reel",getUserId());
}});
</script>
