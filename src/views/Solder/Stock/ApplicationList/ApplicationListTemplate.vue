<template>
  <div>
    <!-- Table -->
    <el-table
      :data="paginatedData"
      style="width: 100%; font-size: 16px; padding: 20px"
      :border="true"
      :header-cell-style="{
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
        fontSize: '18px',
      }"
      height="770"
      :row-style="{ height: '50px' }"
    >
      <el-table-column type="index" label="No" width="50"></el-table-column>

      <el-table-column
        v-if="props.operationType === 'reel'"
        prop="reelId"
        label="Reel ID"
        width="200"
      ></el-table-column>
      <el-table-column
        v-else
        prop="reelId"
        label="Assay ID"
        width="200"
      ></el-table-column>

      <el-table-column
        prop="location"
        label="Location"
        width="200"
      ></el-table-column>

      <el-table-column
        label="Received Date"
        width="200"
      >
        <template #default="scope">{{
          formatDate(scope.row.dateOfCreated)
        }}</template>
      </el-table-column>
      <el-table-column
        label="Receiver"
        width="200"
        prop="receiver"
      ></el-table-column>
      <el-table-column
        v-if="props.operationType === 'reel'"
        prop="quantity"
        label="Total Quantity"
        width="200"
      ></el-table-column>
      <el-table-column
        v-if="props.operationType === 'reel'"
        label="Remaining Quantity"
        width="200"
      >
        <template #default="scope">
          {{ scope.row.quantity - scope.row.assumedQuantity }}
        </template>
      </el-table-column>

      <!-- Button Column -->
      <el-table-column label="Actions" :align="'center'" width="150">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(scope.row)"
          >
            View Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="props.stockInfoList.length"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import type { StockInfo } from "../Common/ApplicationInterface";
import { formatDate } from "../../../../utils/date-utils";
import { useRouter } from "vue-router";

const props = defineProps<{
  stockInfoList: StockInfo[];
  operationType: string;
}>();

const router = useRouter();
const currentPage = ref(1); // 현재 페이지
const pageSize = 14; // 한 페이지당 행 수

// 현재 페이지 데이터 계산
const paginatedData = computed(() =>
  props.stockInfoList.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

function handlePageChange(page: number) {
  currentPage.value = page; // 페이지 변경
}

function handleDetail(row: StockInfo) {
  router.push({
    name: "LoadLotStock",
    params: { reelId: row.reelId },
  });
}
</script>

<style scoped>
.el-table th {
  background-color: #f7f7f7;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
}

.el-table td {
  text-align: center;
  font-size: 16px;
}

.el-table__row {
  height: 50px;
}
</style>
