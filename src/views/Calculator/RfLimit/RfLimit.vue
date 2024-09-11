<template>
  <div class="container">
    <el-table
      :data="tableData"
      style="width: 100%"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      height="150"
    >
      <!-- File Name Column -->
      <el-table-column prop="fileName" label="File Name">
        <template #default="scope">
          <span>{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>

      <!-- Type Column (Dropdown) -->
      <el-table-column prop="type" label="Type" width="120px">
        <template #default="scope">
          <el-select v-model="scope.row.type" placeholder="Type" size="small">
            <el-option label="JIG" value="JIG"></el-option>
            <el-option label="SOLDER" value="SOLDER"></el-option>
          </el-select>
        </template>
      </el-table-column>

      <!-- Port Out Column -->
      <el-table-column prop="portOut" label="Port Out" width="120px">
        <template #default="scope">
          <el-input
            v-model="scope.row.portOut"
            placeholder="Port Out"
            size="small"
          />
        </template>
      </el-table-column>

      <!-- Port In Column -->
      <el-table-column prop="portIn" label="Port In" width="120px">
        <template #default="scope">
          <el-input
            v-model="scope.row.portIn"
            placeholder="Port In"
            size="small"
          />
        </template>
      </el-table-column>

      <!-- File Upload Column -->
      <el-table-column label="Select File" width="150px">
        <template #default="scope">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            :on-change="(file) => onFileSelect(file, scope.row)"
            action=""
          >
            <el-button type="primary" size="small">Select File</el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>

    <!-- Buttons Section -->
    <div class="buttons">
      <el-button type="primary" size="small" @click="addRow">Add Row</el-button>
      <el-button type="danger" size="small" @click="resetTable"
        >Reset</el-button
      >
    </div>

  </div>
  <div class="app-container">
      <div class="grid-container">
        <!-- 4개의 그래프 컴포넌트 호출 -->
        <Graph :dataSets="scatterDataSet1" />
        <Graph :dataSets="scatterDataSet2" />
        <Graph :dataSets="scatterDataSet3" />
        <Graph :dataSets="scatterDataSet4" />
      </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Graph from "./Graph.vue";
import {
  scatterDataSet1,
  scatterDataSet2,
  scatterDataSet3,
  scatterDataSet4,
} from "./demoData";
import type { UploadFile } from "element-plus";

// Table row interface
interface TableRow {
  fileName: string;
  type: string;
  portOut: string;
  portIn: string;
  file: UploadFile | null;
}

// Initial data for the table
const initialData: TableRow[] = [
  { fileName: "", type: "", portOut: "", portIn: "", file: null },
  { fileName: "", type: "", portOut: "", portIn: "", file: null },
];

// Reactive table data
const tableData = ref<TableRow[]>([...initialData]);

// Add row function
const addRow = () => {
  if (tableData.value.length <= 4) {
    tableData.value.push({
      fileName: "",
      type: "",
      portOut: "",
      portIn: "",
      file: null,
    });
  }
};

// File selection handler
const onFileSelect = (file: UploadFile, row: TableRow) => {
  row.file = file;
  row.fileName = file.name;
};

// Reset table to initial state
const resetTable = () => {
  tableData.value = [...initialData]; // Reset table to initial data
};

const cellStyle = {
  padding: "8px",
  fontSize: "14px",
};

const headerCellStyle = {
  padding: "8px",
  fontSize: "14px",
};
</script>

<style scoped>
.container {
  margin: 10px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.buttons > .el-button {
  margin-left: 10px;
}

.el-table th,
.el-table td {
  padding: 8px !important;
}

.el-input,
.el-select,
.el-button {
  font-size: 14px;
}

.app-container {
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
}

.grid-container > * {
  aspect-ratio: 1 / 1; /* 정사각형 유지 */
  background-color: #f5f5f5;
}
</style>
