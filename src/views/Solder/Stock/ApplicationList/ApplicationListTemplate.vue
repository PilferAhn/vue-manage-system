<template>
  <div>
    <!-- Search Input -->
    <!-- <div style="margin-bottom: 20px; display: flex; justify-content: flex-start; align-items: center;">
      <el-input
        v-model="searchTerm"
        placeholder="Model Name 검색"
        clearable
        style="width: 300px;"
        @clear="handleClear"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>
    </div> -->

    <!-- Table -->
    <el-table
      :data="filteredData"
      style="width: 100%; font-size: 16px; padding: 20px"
      :border="true"
      :header-cell-style="{
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
        fontSize: '18px',
      }"
      :row-style="{ height: '50px' }"
    >
      <el-table-column label="No" width="50">
        <template #default="scope">
          <!-- Sequential index -->
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="modelName"
        label="Model Name"
        width="170"
      ></el-table-column>

      <el-table-column
        prop="designer"
        label="Designer"
        width="110"
        :align="'center'"
      ></el-table-column>

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
        width="150"
      ></el-table-column>

      <el-table-column label="Received Date" width="200">
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
        prop="quantity"
        label="Total Quantity"
        width="150"
      ></el-table-column>
      <el-table-column label="Remaining Quantity" width="200">
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import type { StockInfo } from "../../../../interface/stock";
import { formatDate } from "../../../../utils/date-utils";
import { useRouter } from "vue-router";

const props = defineProps<{
  stockInfoList: StockInfo[];
  operationType: string;
}>();

const searchTerm = ref(""); // 검색어
const router = useRouter();

// 필터링된 데이터 계산
const filteredData = computed(() => {
  if (!searchTerm.value) {
    return props.stockInfoList;
  }

  // 검색 필터
  return props.stockInfoList.filter((item) =>
    item.modelName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

function handleClear() {
  searchTerm.value = ""; // 검색어 초기화
}

function handleDetail(row: StockInfo) {
  router.push({
    name: "LoadLotStock",
    params: { reelId: row.reelId },
  });
}
</script>
