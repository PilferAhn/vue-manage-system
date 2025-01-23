<template>
    <div>
      <el-table :data="aggregatedList" style="width: 100%">
        <el-table-column type="index" label="Index" width="100" />
        <el-table-column prop="position" label="Position" width="300" />
        <el-table-column prop="materialCode" label="Material Code" width="500" />        
        <el-table-column prop="quantity" label="Total Quantity" width="150" />
      </el-table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from "vue";
  import type { EvbSheetInfo } from "./EvbStocks.vue";
  
  // Props 선언
  const props = defineProps<{
    evbSheetList: EvbSheetInfo[];
  }>();
  
  // Aggregated data를 계산
  const aggregatedList = computed(() => {
    const materialMap: Record<string, { quantity: number; position: string }> = {};
  
    // 같은 materialCode를 합산하고 position 갱신
    props.evbSheetList.forEach((item) => {
      if (item.materialCode) {
        if (!materialMap[item.materialCode]) {
          materialMap[item.materialCode] = {
            quantity: 0,
            position: "",
          };
        }
  
        materialMap[item.materialCode].quantity += item.quantity || 0;
        materialMap[item.materialCode].position = item.position || ""; // 항상 최신 position으로 업데이트
      }
    });
  
    // materialMap을 배열로 변환
    return Object.entries(materialMap).map(([materialCode, { quantity, position }], index) => ({
      index: index + 1, // 1부터 시작하는 index
      materialCode,
      position,
      quantity,
    }));
  });
  </script>
  
  <style></style>
  