<template>
  <div>
    <el-table :data="props.stock" style="width: 100%">
      <el-table-column
        label="Mat ID"
        prop="MaterialId"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Desc"
        prop="Description"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="OnHand Date"
        prop="OnHandDate"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="OnHand(Stock SAP)"
        prop="StockSap"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Qty Input"
        prop="QtyInput"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Stock"
        prop="Stock"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Unit"
        prop="Unit"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Base Chip(EA/1SH)"
        prop="DEFAULT_QTY"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Stock (SH)"
        prop="StockSH"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Date"
        prop="DateCheck"
        :align="'center'"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type { MaterialStock } from "./Package.vue";
const props = defineProps<{ stock: MaterialStock[] }>();
</script>

<script lang="ts">
export default { components: {} };
</script>

<style></style>
