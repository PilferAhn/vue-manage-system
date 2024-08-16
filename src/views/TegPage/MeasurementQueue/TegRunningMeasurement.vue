<template>
  <div>
    <div class="measurement-header">
      측정 현황 
    </div>
    <el-table :data="filteredMea" class="table">
      <el-table-column label="Model Name" prop="productName"></el-table-column>
      <el-table-column label="Wafer ID" prop="waferID"></el-table-column>
      <el-table-column label="진행도">
        <template #default="scope">
          <span>{{ scope.row.shot }} / {{ scope.row.shots }}</span>
        </template>        
      </el-table-column>
      <el-table-column label="측정 구분" prop="measType"></el-table-column>      
      <el-table-column label="측정 장비" prop="machine_name"></el-table-column>     
      <el-table-column label="상태">
        <template #default="scope">
          <span>{{ getStatus(scope.row.dateOfUpdate) }}</span>
        </template>
      </el-table-column>     
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { TegRunningMeas } from "./../../../utils/waferMeasurementHelper";
import { ref, onMounted, onUnmounted, computed } from 'vue';
const props = defineProps<{
  runningMea: TegRunningMeas[];
}>();

const getStatus = (dateOfUpdate: string) => {
  const now = new Date();
  const updateDate = new Date(dateOfUpdate);
  const diff = (now.getTime() - updateDate.getTime()) / 1000 / 60; // Difference in minutes
  return diff > 5 ? '측정 종료' : '측정 진행중';
};

const currentTime = ref('');

const updateTime = () => {
  const now = new Date();
  const formattedTime = now.toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  currentTime.value = formattedTime;
};

const filteredMea = computed(() => {
  const now = new Date();
  return props.runningMea.filter(mea => {
    const updateDate = new Date(mea.dateOfUpdate);
    const diff = (now.getTime() - updateDate.getTime()) / 1000 / 60; // Difference in minutes
    return diff <= 5;
  });
});

onMounted(() => {
  updateTime(); // Update immediately on mount
  const intervalId = setInterval(updateTime, 1000); // Update every second

  onUnmounted(() => {
    clearInterval(intervalId); // Clear the interval on unmount
  });
});

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


<!-- <template>
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

</style> -->
