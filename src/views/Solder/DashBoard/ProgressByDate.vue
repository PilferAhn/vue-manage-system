<template>
  <div>
    <el-table
      :data="sortedData"
      border
      style="width: 100%"
      :span-method="spanMethod"
    >
      <!-- 날짜 Column -->
      <el-table-column label="완료 희망일" prop="wantedFinishedDate" :align="'center'">
      </el-table-column>

      <!-- Model Name Column -->
      <el-table-column label="Model Name" prop="modelName" :align="'center'">
      </el-table-column>

      <!-- Measurement Type Column -->
      <el-table-column
        label="Measurement Type"
        prop="measurementType"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Quantity"
        prop="quantity"
        width="100"
        :align="'center'"
      >
        <!-- Dynamic Measurer Columns -->

        <el-table-column
          v-for="(tempMeasurer, index) in measurers"
          :key="index"
          :label="tempMeasurer"
          :align="'center'"
          width="80"
        >
          <template #default="scope">
            <span v-if="scope.row.measurer === tempMeasurer">
              {{ scope.row.quantity }}
            </span>
            <!-- {{scope.row.quantity}} -->
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Sample 유무" :align="'center'" width="80">
        <template #default="scope">
            <span v-if="scope.row.isSample">O</span>
            <span v-else>X</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProgressMeasType } from "./Progress";

const props = defineProps<{
  measTypes: ProgressMeasType[];
  measurers: String[];
}>();

// 데이터를 정렬 (날짜 → modelName 순서)
const sortedData = computed(() => {
  return [...props.measTypes].sort((a, b) => {
    if (!a.wantedFinishedDate) return 1;
    if (!b.wantedFinishedDate) return -1;
    if (a.wantedFinishedDate !== b.wantedFinishedDate) {
      return a.wantedFinishedDate.localeCompare(b.wantedFinishedDate);
    }
    return a.modelName.localeCompare(b.modelName);
  });
});

// span-method를 사용한 rowspan 설정
const spanMethod = ({ row, columnIndex, rowIndex }: any) => {
  const currentRow = sortedData.value[rowIndex];
  const prevRow = sortedData.value[rowIndex - 1];

  if (columnIndex === 0) {
    // 날짜 컬럼(rowspan 적용)
    if (
      rowIndex === 0 ||
      currentRow.wantedFinishedDate !== prevRow.wantedFinishedDate
    ) {
      const sameDateCount = sortedData.value.filter(
        (item) => item.wantedFinishedDate === currentRow.wantedFinishedDate
      ).length;
      return { rowspan: sameDateCount, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }

  if (columnIndex === 1) {
    // modelName 컬럼(rowspan 적용)
    if (
      rowIndex === 0 ||
      currentRow.modelName !== prevRow.modelName ||
      currentRow.wantedFinishedDate !== prevRow.wantedFinishedDate
    ) {
      const sameModelCount = sortedData.value.filter(
        (item) =>
          item.wantedFinishedDate === currentRow.wantedFinishedDate &&
          item.modelName === currentRow.modelName
      ).length;
      return { rowspan: sameModelCount, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
  font-size: 12px; /* 전체 글자 크기 설정 */
}


</style>
