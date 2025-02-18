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
import { getUserName } from "../../../../utils/account-utils";

const stockInfoList = ref<StockInfo[]>([]);
onMounted(async () => {
  // Fetch StockInfo data on component mount
  stockInfoList.value = await fetchStockInfo("reel");
  console.log(getUserName())
  if(getUserName() !== "admin"){
    const temp = ref<StockInfo[]>([]);
    for(let i = 0 ; i < stockInfoList.value.length; i++){
      if(stockInfoList.value[i].designer === getUserName()){
        temp.value.push(stockInfoList.value[i])
      }
    }
    stockInfoList.value = temp.value
  }

});
</script>
