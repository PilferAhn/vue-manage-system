<template>
  <div class="container">
    <div class="grid-container">
      <div
        v-for="(item, index) in filteredData"
        :key="index"
        class="grid-item"
        @click="openDialog(item)"
      >
        <div><strong>Lot ID:</strong> {{ item.lotId }}</div>
        <div><strong>Model Name:</strong> {{ item.modelName }}</div>
        <div><strong>EVB Type:</strong> {{ item.evbType }}</div>
        
      </div>
    </div>

    <!-- Popup Dialog -->
    <el-dialog
      title="Matching and Segment Information"
      v-model="dialogVisible"
      width="50%"
    >
      <template v-if="selectedItem">
        <h3>Matching Information</h3>
        <el-table :data="selectedItem.matching" style="width: 100%">
          <!-- selectedItem.matching 사용 -->
          <el-table-column prop="number" label="Number">
            <template #default="scope">
              <el-input v-model="scope.row.number"></el-input>
              <!-- scope.row.number -->
            </template>
          </el-table-column>
          <el-table-column prop="port" label="Port">
            <template #default="scope">
              <el-input v-model="scope.row.port"></el-input>
              <!-- scope.row.port -->
            </template>
          </el-table-column>
          <el-table-column prop="ind.series" label="Ind Series">
            <template #default="scope">
              <el-input v-model="scope.row.ind.series"></el-input>
              <!-- scope.row.ind.series -->
            </template>
          </el-table-column>
          <el-table-column prop="ind.shunt" label="Ind Shunt">
            <template #default="scope">
              <el-input v-model="scope.row.ind.shunt"></el-input>
              <!-- scope.row.ind.shunt -->
            </template>
          </el-table-column>
          <el-table-column prop="cap.series" label="Cap Series">
            <template #default="scope">
              <el-input v-model="scope.row.cap.series"></el-input>
              <!-- scope.row.cap.series -->
            </template>
          </el-table-column>
          <el-table-column prop="cap.shunt" label="Cap Shunt">
            <template #default="scope">
              <el-input v-model="scope.row.cap.shunt"></el-input>
              <!-- scope.row.cap.shunt -->
            </template>
          </el-table-column>
        </el-table>
        <h3>Segment Information</h3>
        <el-table
          v-if="selectedItem.segments && selectedItem.segments.length"
          :data="selectedItem.segments"
          style="width: 100%"
        >
          <el-table-column prop="number" label="Number"></el-table-column>
          <el-table-column prop="start" label="Start"></el-table-column>
          <el-table-column prop="stop" label="Stop"></el-table-column>
          <el-table-column prop="points" label="Points"></el-table-column>
          <el-table-column prop="ifwb" label="IFBW"></el-table-column>
        </el-table>
      </template>

      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ApplicationData } from "../../../interface/solderAppInterface";
import { get_application_list_by_status } from "../ApplicationList/SolderApplicationList";

// Popup 관련 변수
const dialogVisible = ref(false);
const selectedItem = ref<ApplicationData | null>(null);

// 데이터 로딩 로직
const tableData = ref<ApplicationData[]>([]);
//   const filteredData = ref<ApplicationData[]>([]);

// State for filtered data
const filteredData = ref<ApplicationData[]>([...tableData.value]);

onMounted(async () => {
  try {
    const data = await get_application_list_by_status("created");
    console.log(data)
    tableData.value = data;
    filteredData.value = data;
  } catch (error) {
    console.error("Error loading application data:", error);
  }
});

// Popup Dialog를 여는 함수
const openDialog = (item: ApplicationData) => {
  console.log("Dialog opening with item:", item); // 디버그용
  selectedItem.value = item;
  dialogVisible.value = true;
  console.log("Dialog visibility:", dialogVisible.value); // 다이얼로그 열리는지 확인
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* 한 줄에 3개의 칸 */
  gap: 20px;
  padding: 20px;
  width: 100%;
}

.grid-item {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: left;
  width: 100%;
  cursor: pointer; /* 클릭 가능하도록 포인터 설정 */
}

.grid-item:hover {
  background-color: #e0e0e0; /* 마우스 오버 시 색상 변경 */
}
</style>
