<template>
    <div>
      <el-table :data="evbList" style="width: 100%">
        <el-table-column type="index" label="Index" width="100" />
        <!-- <el-table-column prop="productType" label="Product Type" width="150" /> -->
        <el-table-column prop="position" label="Position" width="100" />
        <el-table-column prop="materialCode" label="Material Code" width="500" />
        <!-- <el-table-column prop="lotNo" label="Lot No" width="250" /> -->
        <el-table-column prop="quantity" label="Quantity" width="100" />
        <el-table-column prop="unit" label="Unit" width="100" />
        <el-table-column prop="size" label="Size" width="100" />
        <el-table-column prop="materialType" label="Material Type" width="150" />
        <el-table-column prop="description" label="Description" width="250" />
        <!-- <el-table-column prop="inputTime" label="Input Time" width="150" />
        <el-table-column prop="actualDate" label="Actual Date" width="150" />
        <el-table-column prop="expiryDate" label="Expiry Date" width="150" /> -->
        <!-- <el-table-column
          prop="daysExpiryRemain"
          label="Days Expiry Remain"
          width="150"
        />
        <el-table-column prop="useStatus" label="Use Status" width="150" /> -->
      </el-table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from "vue";
  import type { EvbInfo } from "./EvbStocks.vue";
  
  // Props 선언
  defineProps<{
    evbList: EvbInfo[];
  }>();
  </script>
  
  <style></style>
  