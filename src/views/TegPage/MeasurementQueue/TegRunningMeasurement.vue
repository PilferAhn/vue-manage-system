<template>
  <div>
    <div class="measurement-header">
      측정 진행중
    </div>
    <el-table :data="props.runningMea" class="table">
      <el-table-column label="Model Name" prop="productName"></el-table-column>
      <el-table-column label="Wafer ID" prop="waferID"></el-table-column>
      <el-table-column label="진행도">
        <template #default="scope">
          <span>{{ scope.row.shot }} / {{ scope.row.shots }}</span>
        </template>        
      </el-table-column>
      <el-table-column label="측정 구분" prop="measType"></el-table-column>      
      <el-table-column label="측정 장비" prop="machine_name"></el-table-column>      
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { TegRunningMeas } from "./../../../utils/waferMeasurementHelper";

const props = defineProps<{
  runningMea: TegRunningMeas[];
}>();
</script>

<style scope>

.measurement-header {
  font-size: 24px;
  color: #333;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

</style>
