<template>
  <div>
    <h1 class="page-header">Machine List</h1>
    <el-table :data="machines" style="width: 100%" stripe border>
      <el-table-column prop="modelName" label="Model Name" width="180" sortable align="center"></el-table-column>
      <el-table-column prop="machineName" label="Machine Name" :min-width="180" sortable align="center"></el-table-column>
      <el-table-column prop="requestNumber" label="Request Number" width="180" sortable align="center"></el-table-column>
      <el-table-column prop="sampleNumber" label="Sample Number" width="180" sortable align="center"></el-table-column>
      <el-table-column prop="status" label="Status" width="180" align="center" sortable>
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.status)" effect="plain">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="testType" label="Test Type" width="180" align="center"></el-table-column>
      <el-table-column label="Actions" width="240" align="center">
        <template #default="scope">
          <el-button type="primary" plain @click="navigateToUrl(scope.row)">측정현황</el-button>
          <el-button type="success" plain @click="viewDetail(scope.row)">의뢰서</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="machines.length"
        :page-size="20"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchMachines } from './MachineList';
import type { Machine } from './MachineList';
import 'element-plus/dist/index.css';

const machines = ref<Machine[]>([]);
const currentPage = ref(1);
const router = useRouter();

onMounted(async () => {
  machines.value = await fetchMachines();
});

const getTagType = (status: string) => {
  switch (status) {
    case 'FINISHED':
      return 'success';
    case 'Inactive':
      return 'info';
    case 'Error':
      return 'danger';
    default:
      return 'warning';
  }
};

const navigateToUrl = async (machine: Machine) => {

  try {
    await router.push({ name: "MachineComponent", params: { uuid: machine.pdtSampleUuid } });
  } catch (error) {
    console.error("Routing error:", error);
  }
};

const viewDetail = async (machine: Machine) => {
  try {
    await router.push({ name: "ViewApplication", params: { uuid: machine.applicationUuid } });
  } catch (error) {
    console.error("Routing error:", error);
  }
};

</script>



<style scoped>
.page-header {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.el-table {
  background-color: #fafafa;
  color: #333;
}

.el-table th {
  background-color: #f5f5f5;
  color: #333;
}

.el-table td {
  background-color: #ffffff;
  color: #333;
}

.el-table-column {
  padding: 10px;
}

.el-tag {
  font-size: 12px;
  padding: 5px 10px;
}

.el-button {
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
