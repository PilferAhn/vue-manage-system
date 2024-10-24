<template>
  <el-table
    :data="mdrApplications"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column
      prop="moduleName"
      label="Module명"
      width="150"
      :align="'center'"
    ></el-table-column>
    <el-table-column
      prop="category"
      :align="'center'"
      label="구분"
      width="120"
    ></el-table-column>
    <el-table-column
      prop="packageType"
      label="Type"
      width="70"
    ></el-table-column>
    <el-table-column
      prop="waferType"
      :align="'center'"
      label="Tech"
      width="70"
    ></el-table-column>
    <el-table-column
      prop="band"
      :align="'center'"
      label="밴드명"
      width="70"
    ></el-table-column>
    <el-table-column
      prop="productName"
      label="기종명"
      width="150"
      :align="'center'"
    ></el-table-column>
    <el-table-column
      prop="designer"
      :align="'center'"
      label="PL"
      width="100"
    ></el-table-column>
    <el-table-column
      prop="group"
      :align="'center'"
      label="그룹"
      width="150"
    ></el-table-column>
    <el-table-column
      prop="psNumber"
      :align="'center'"
      label="그룹"
      width="100"
    ></el-table-column>
    <!-- <el-table-column prop="ganttPlanDate" label="Gantt Plan Date" width="150">
        <template #default="scope">
          <el-tooltip content="Gantt Plan Date">
            <span>{{ formatDate(scope.row.ganttPlanDate) }}</span>
          </el-tooltip>
        </template>
      </el-table-column> -->
    <el-table-column
      prop="executionDate"
      :align="'center'"
      label="실계획"
      width="150"
    >
      <template #default="scope">
        <el-tooltip content="Execution Date">
          <span>{{ formatDate(scope.row.executionDate) }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="result" label="Result" :align="'center'" width="100">
      <template #default="scope">
        <el-tag type="success" v-if="scope.row.result === 'pass'">PASS</el-tag>
        <el-tag type="danger" v-else-if="scope.row.result === 'fail'"
          >FAIL</el-tag
        >
        <el-tag v-else>Pending</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Action" :align="'center'" width="250">
      <div v-if="props.userType === 'user'">
        <el-button type="primary" size="small"> 자세히 </el-button>
        <el-button type="primary" size="small"> 확정 </el-button>
        <el-button type="warning" size="small"> 삭제 </el-button>
      </div>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import dayjs from "dayjs";
import type { MdrApplication } from "../../Common/Interface";

// 부모 컴포넌트에서 전달된 props 정의
const props = defineProps<{
  mdrApplications: MdrApplication[];
  userType: string;
}>();

// 날짜 포맷팅 함수
const formatDate = (date: string | undefined) => {
  return date ? dayjs(date).format("YYYY-MM-DD") : "N/A";
};

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: MdrApplication;
  rowIndex: number;
}) => {
  if (row.result === "fail") {
    return "warning-row";
  } else if (row.result === "success") {
    return "success-row";
  }
  return "";
};
</script>

<style>
/* scoped 제거 후 전역 스타일로 지정 */
.el-table__row.warning-row {
  background-color: var(--el-color-warning-light-9);
}

.el-table__row.success-row {
  background-color: var(--el-color-success-light-9);
}
</style>
