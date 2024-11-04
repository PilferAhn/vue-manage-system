<template>
  <div class="container">
    <el-table :data="materialData" style="width: 100%">
      <!-- 상위 레벨 주요 정보 -->
      <el-table-column prop="material_id" label="Material ID" width="180" />
      <!-- <el-table-column prop="site_id" label="Site ID" width="100" />
      <el-table-column prop="name" label="Name" width="300" />
      <el-table-column prop="category" label="Category" width="120" /> -->
      <el-table-column prop="package_type" label="Package Type" width="150" />
      <!-- <el-table-column prop="process_type" label="Process Type" width="150" /> -->
      <el-table-column label="Creation Date" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.creation_date) }}</template
        >
      </el-table-column>

      <!-- <el-table-column label="Lot Type">
        <template #default="scope">
          {{ scope.row.cassettes_member[0].lot_type }}</template
        >
      </el-table-column>
      <el-table-column label="LOT ID">
        <template #default="scope">
          {{ scope.row.cassettes_member[0].lot_id }}
        </template>
      </el-table-column> -->
      <el-table-column label="공정단계" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="fetchOperationDetails(scope.row.cassettes_member[0].lot_id)"
          >
            {{ scope.row.cassettes_member[0].operation.name }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 팝업 다이얼로그 -->
    <el-dialog v-model="isDialogVisible" title="Operation Details" width="50%">
      <div v-if="operationDetails">
        <p>
          <strong>Operation ID:</strong>
          {{ operationDetails.operation.operation_id }}
        </p>
        <p><strong>Name:</strong> {{ operationDetails.operation.name }}</p>
        <p>
          <strong>Site ID:</strong> {{ operationDetails.operation.site_id }}
        </p>

        <!-- History 테이블 -->
        <el-table
          :data="filteredHistory"
          style="width: 100%"
          v-if="filteredHistory.length"
        >
          <el-table-column prop="end_date" label="End Date" width="180" />
          <el-table-column
            prop="operation_name"
            label="Operation Name"
            width="200"
          />
        </el-table>
      </div>
      <span class="dialog-footer">
        <el-button @click="isDialogVisible = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import {
  getTodayAnd30DaysAgoDates,
  fetchMesDataForDateRange,
} from "./SampleStatus";
import { convertToCamelCase } from "../Common/Application"; // Assuming the utility is stored here
import type { ProcessData } from "../Interface/ApplicationInterface";
import type { MaterialData } from "./SampleStatusInterface";
import { formatDate } from "../Common/Application";
const applications = ref<ProcessData[]>([]); // For this week's data
const materialData = ref<MaterialData[]>([]);
const isDialogVisible = ref(false); // Dialog visibility
const operationDetails = ref<any | null>(null); // Operation details

// 버튼 클릭 시 POST 요청을 보내고, 응답을 받아 팝업을 표시하는 함수
const fetchOperationDetails = async (lotId: string) => {
  try {
    const url = "/mes/get_lot_by_id_with_history";
    const formData = new FormData();
    formData.append("lot_id", lotId);

    const response = await axios.post(url, formData);

    operationDetails.value = response.data; // 응답 데이터 설정
    isDialogVisible.value = true; // 다이얼로그 열기
  } catch (error) {
    console.error("Failed to fetch operation details:", error);
  }
};

onMounted(async () => {
  const dateInfo = getTodayAnd30DaysAgoDates();
  await fetchProcessData();
  console.log(applications.value)
  materialData.value = await fetchMesDataForDateRange(
    applications.value,
    dateInfo["startDate"],
    dateInfo["lastDate"]
  );

  console.log(materialData.value);
});

// computed를 사용하여 필요한 history 데이터를 필터링
const filteredHistory = computed(() => {
  return (
    operationDetails.value?.history?.map((item: any) => ({
      end_date: item.end_date,
      operation_name: item.operation.name,
    })) || []
  );
});

// Fetch data when the component is mounted
const fetchProcessData = async () => {
  try {
    const formData = new FormData();
    formData.append("order_by", "id");
    formData.append("order_dir", "asc");
    formData.append("designer_confirm", "false");

    const url = "/fab_monitoring/get_fab_request_list";
    const response = await axios.post(url, formData);
    applications.value = convertToCamelCase(response.data); // Convert fetched data to camelCase
  } catch (error) {
    console.error("Failed to fetch process data:", error);
  }
};
</script>

<style></style>
