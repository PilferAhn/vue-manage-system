<template>
  <div>
    <div class="search-bar">
      <!-- <el-input v-model="searchTerms.fileName" placeholder="Search File Name" class="large-input" /> -->
      <el-input v-model="searchTerms.modelName" placeholder="Search Part Name" class="large-input" />
      <el-input v-model="searchTerms.revision" placeholder="Search Revision" class="large-input" />
      <el-input v-model="searchTerms.lot_id" placeholder="Search Lot ID" class="large-input" />
      <el-input v-model="searchTerms.wafer_id" placeholder="Search Wafer ID" class="large-input" />
      <el-button type="primary" @click="searchAll" class="large-button">Search</el-button>
    </div>
    <el-table :data="measurements" style="width: 100%">
      <el-table-column
        prop="fileName"
        label="File Name"
        :header-cell-class-name="'three-d-button'"
        width="800"
      >
        <template #default="{ row }">
          <span class="ellipsis" :title="row.fileName">{{ row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modelName"
        label="Model Name"
        :header-cell-class-name="'three-d-button'"
        min-width="100"
      />
      <el-table-column
        prop="revision"
        label="Revision"
        :header-cell-class-name="'three-d-button'"
        min-width="100"
      />
      <el-table-column
        prop="lot_id"
        label="Lot ID"
        :header-cell-class-name="'three-d-button'"
        min-width="100"
      />
      <el-table-column
        prop="wafer_id"
        label="Wafer ID"
        :header-cell-class-name="'three-d-button'"
        min-width="100"
      />
      <el-table-column
        label="Actions"
        :header-cell-class-name="'three-d-button'"
        min-width="150"
      >
        <template #default="{ row }">
          <!-- <el-button type="primary" @click="viewDetails(row.uuid)" size="small">
            자세히
          </el-button> -->
          <el-button
            type="success"
            @click="handleDownload(row.uuid)"
            size="small"
          >
            다운로드
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
//   import type { SParameterMeasurement } from './types';
import { downloadFile } from "./SParameterList"
import "element-plus/dist/index.css";

const searchTerms = ref({
  fileName: "",
  modelName: "",
  revision: "",
  lot_id: "",
  wafer_id: ""
});

// types.ts
export interface SParameterMeasurement {
  uuid: string;
  fileName: string;
  modelName: string;
  revision: string;
  lot_id: string;
  wafer_id: string;
}

const measurements = ref<SParameterMeasurement[]>([]);

// onMounted(async () => {
//   try {
//     const response = await axios.get<SParameterMeasurement[]>(
//       "/s-parameter/get-s-parameter-list"
//     );
//     measurements.value = response.data;
//   } catch (error) {
//     console.error("Failed to fetch measurements:", error);
//   }
// });

const searchAll = async () => {
  // 입력된 값만 필터링하여 객체 생성
  const filteredSearchTerms = Object.fromEntries(
    Object.entries(searchTerms.value).filter(([key, value]) => value !== "")
  );
  
  try {
    const response = await axios.post<SParameterMeasurement[]>(
      `/s-parameter/get-s-parameter-list-by-keyword`, 
      filteredSearchTerms
    );
    measurements.value = response.data;

    

  } catch (error) {
    console.error("Failed to search measurements:", error);
  }
};

const handleDownload = async (uuid: string) => {
  await downloadFile(uuid);
};

</script>

<style scoped>
.search-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.large-input .el-input__inner {
  font-size: 18px;
  padding: 12px 20px;
}

.large-button {
  font-size: 18px;
  padding: 12px 20px;
}

.table-container {
  margin-top: 20px;
}

.three-d-button {
  background-color: #f8f8f8 !important;
  border: none;
  color: #333 !important;
  text-align: center;
  padding: 8px 16px;
  display: inline-block;
  font-size: 16px;
  box-shadow: 0 4px #999 !important;
  background-image: linear-gradient(to bottom, #fff, #ddd) !important;
  cursor: pointer;
  border-radius: 5px;
}

.three-d-button:active {
  background-image: linear-gradient(to bottom, #ddd, #fff) !important;
  box-shadow: 0 2px #666 !important;
  transform: translateY(4px);
}

.ellipsis {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
