<template>
  <el-table
    :data="measTypes"
    :span-method="spanMethod"
    :table-layout="'auto'"
    style="width: 100%"
    border
  >
    <!-- modelName Column -->
    <el-table-column
      label="Product Name"
      prop="modelName"
      width="100"
      :align="'center'"
    ></el-table-column>

    <!-- measurementType Column -->
    <el-table-column label="Measurement Type" width="150" :align="'center'">
      <template #default="scope">
        <!-- measurements 배열의 현재 인덱스 값만 표시 -->
        {{ scope.row.measurementType }}
      </template>
    </el-table-column>
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
      >
        <template #default="scope">
          <span v-if="scope.row.measurer === tempMeasurer">
            {{ scope.row.quantity }}
          </span>
          <!-- {{scope.row.quantity}} -->
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column
      label="완료 희망일"
      prop="wantedFinishedDate"
      :align="'center'"
    ></el-table-column>
    <el-table-column label="Sample 유무" :align="'center'" width="80">
      <template #default="scope">
        <span v-if="scope.row.isSample">O</span>
        <span v-else>X</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { ProgressMeasType } from "./Progress";
const props = defineProps<{
  measTypes: ProgressMeasType[];
  measurers: String[];
}>();

// span-method를 이용해 modelName의 rowspan 처리
const spanMethod = ({ row, columnIndex, rowIndex }: any) => {
  if (columnIndex === 0) {
    // 첫 번째 열(modelName): 첫 번째 행에만 rowspan 적용
    if (
      rowIndex === 0 ||
      row.modelName !== props.measTypes[rowIndex - 1].modelName
    ) {
      return {
        rowspan: row.rowspan,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
  // measurementType 열(row 하나씩 사용)
  return {
    rowspan: 1,
    colspan: 1,
  };
};
</script>

<style scope>
.el-table {
  margin-top: 20px;
  font-size: 12px; /* 전체 글자 크기 설정 */
}
</style>
