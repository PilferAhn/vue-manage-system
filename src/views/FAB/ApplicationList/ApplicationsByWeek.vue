<template>
  <div class="container">
    <!-- Element Plus Table -->
    <el-table
      :data="processData"
      class="custom-table"
      style="width: 100%"
      
    >
      <el-table-column
        prop="group"
        label="Group"
        width="100"
        :align="'center'"
      />
      <!-- Process column where the text will be transformed to uppercase -->
      <el-table-column
        prop="process"
        label="Process"
        width="100"
        :align="'center'"
      >
        <template #default="scope">
          <span class="uppercase">{{ scope.row.process }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="priority"
        label="Priority"
        width="80"
        :align="'center'"
      />
      <el-table-column
        prop="packageType"
        label="Package Type"
        width="150"
        :align="'center'"
      />
      <el-table-column
        prop="modelName"
        label="Model Name"
        width="150"
        :align="'center'"
      />
      <el-table-column
        prop="purpose"
        label="목적"
        width="400"
        :align="'center'"
      />
      <el-table-column prop="is_aoi" label="AOI" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.is_aoi" type="success">Yes</el-tag>
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="수량"
        width="100"
        :align="'center'"
      />
      <el-table-column
        prop="destination"
        label="출하"
        width="150"
        :align="'center'"
      />
      <el-table-column prop="code" label="Code" width="80" :align="'center'" />
      <!-- Format FAB Insert Date -->
      <el-table-column label="FAB Insert Date" width="150" :align="'center'">
        <template #default="scope">
          <span>{{ formatDate(scope.row.fabInsertDate) }}</span>
        </template>
      </el-table-column>

      <!-- Format FAB Finish Date -->
      <el-table-column label="FAB Finish Date" width="150" :align="'center'">
        <template #default="scope">
          <span>{{ formatDate(scope.row.fabFinishDate) }}</span>
        </template> </el-table-column
      >lumn prop="wafer_company" label="Wafer Company" width="150"
      :align="'center'" />
      <el-table-column
        prop="waferAngle"
        label="Wafer Angle"
        width="150"
        :align="'center'"
      />
      <el-table-column
        prop="waferThickness"
        label="Wafer Thickness"
        width="150"
        :align="'center'"
      />
      <el-table-column
        prop="waferType"
        label="Wafer Type"
        width="100"
        :align="'center'"
      />
      <el-table-column
        prop="machineName"
        label="Machine Name"
        width="150"
        :align="'center'"
      />
      <el-table-column
        prop="condition"
        label="Condition"
        width="500"
        :align="'center'"
      />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import type { ProcessData } from "../Interface/ApplicationInterface";
import {formatDate} from "../Common/Application"
// Define props to receive the processData array from the parent component
const props = defineProps<{
  processData: ProcessData[]; // ProcessData is expected as an array
}>();
</script>

<style scoped>
.container {
  padding-right: 30px;
}

.custom-table {
  box-sizing: border-box;
  padding-right: 20px;
  margin-right: 10px;
}
</style>
