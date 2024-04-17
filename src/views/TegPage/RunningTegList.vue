<template>
    <div class="container">
      <el-table :data="tegItems" style="width: 100%">
        <el-table-column prop="productName" label="Product Name" width="180"></el-table-column>
        <el-table-column prop="shot" label="Shot" width="100"></el-table-column>
        <el-table-column prop="shots" label="Shots" width="100"></el-table-column>
        <el-table-column prop="waferId" label="Wafer ID" width="180"></el-table-column>
        <el-table-column prop="measType" label="Measurement Type" width="180"></el-table-column>
      </el-table>
    </div>
  </template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';

interface TegItem {
  productName: string;
  shot: number;
  shots: number;
  waferId: string;
  measType: string;
}

const tegItems = ref<TegItem[]>([]);

const fetchData = async () => {
  try {
    const response = await axios.get('/measurement/get_running_meas');
    tegItems.value = response.data.map((item: any) => ({
      productName: item.product_name,
      shot: item.shot,
      shots: item.shots,
      waferId: item.wafer_id,
      measType: item.meas_type,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();
</script>

<style>
.container {
  margin: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>