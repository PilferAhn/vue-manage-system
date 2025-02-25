<template>
  <div class="container">
    <el-table
      :data="formattedData"
      :span-method="tableSpanMethod"
      class="custom-table"
    >
      <el-table-column
        label="P/N"
        prop="partName"
        :align="'center'"
        width="165"
        fixed="left"
      >
        <template #default="scope">
          <el-input v-model="scope.row.partName" class="table-input" />
        </template>
      </el-table-column>

      <el-table-column
        label="관리자"
        prop="user"
        :align="'center'"
        width="100"
        fixed="left"
      >
        <template #default="scope">
          <el-input v-model="scope.row.userOfSupporter" class="table-input1" />
        </template>
      </el-table-column>

      <!--el-table-column
        label="Status"
        prop="status"
        :align="'center'"
        width="100"
      >
      
        <template #default="scope">
          <el-input v-model="scope.row.status" class="table-input" />
        </template>
      </el-table-column-->

      <el-table-column label="現段階 現 단계" :align="'center'">
        <!-- FAB IN / FAB ESTIMATED IN 같은 Column 내에서 2줄 배치 -->
        <el-table-column label="차수" prop="turn" :align="'center'" width="85">
          <template #default="scope">
            <el-input v-model="scope.row.turn" class="table-input" />
          </template>
        </el-table-column>

        <el-table-column
          label="MDR"
          prop="dateOfMdr"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <el-input v-model="scope.row.dateOfMdr" class="table-input1" />
          </template>
        </el-table-column>

        <el-table-column
          label="FAB IN"
          prop="dateOfFab"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.isEditable">
              <el-input v-model="scope.row.dateOfFabIn" class="table-input1"
            /></span>
            <span v-else>{{ scope.row.dateOfFabIn }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="현재공정"
          prop="currentStage"
          :align="'center'"
          width="150"
        >
          <!-- <template #default="scope">
            <el-input v-model="scope.row.turn" class="table-input" />
          </template> -->
        </el-table-column>

        <el-table-column
          label="FAB OUT"
          prop="dateOfFabOut"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.isEditable">
              <el-input v-model="scope.row.dateOfFabOut" class="table-input1"
            /></span>
            <span v-else>{{ scope.row.dateOfFabOut }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="HQ OUT"
          prop="dateOfHqOut"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.isEditable">
              <el-input v-model="scope.row.dateOfHqOut" class="table-input1"
            /></span>
            <span v-else>{{ scope.row.dateOfHqOut }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="WHC IN"
          prop="dateOfWhcIn"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.isEditable">
              <el-input v-model="scope.row.dateOfWhcIn" class="table-input1"
            /></span>
            <span v-else>{{ scope.row.dateOfWhcIn }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="Assy In"
          prop="dateOfAssyIn"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.isEditable">
              <el-input v-model="scope.row.dateOfAssyIn" class="table-input1"
            /></span>
            <span v-else>{{ scope.row.dateOfAssyIn }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="D/C OUT"
          prop="dateOfDCOut"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.isEditable">
              <el-input v-model="scope.row.dateOfDCOut" class="table-input1"
            /></span>
            <span v-else>{{ scope.row.dateOfDCOut }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="Meas In"
          prop="dateOfMeasIn"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.isEditable">
              <el-input v-model="scope.row.dateOfMeasIn" class="table-input1"
            /></span>
            <span v-else>{{ scope.row.dateOfMeasIn }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="CER"
          prop="dateOfCer"
          :align="'center'"
          width="110"
        >
          <template #default="scope">
            <el-input v-model="scope.row.dateOfCer" class="table-input1" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="영업"
        prop="salesTerritory"
        :align="'center'"
        width="80"
      >
        <template #default="scope">
          <el-input v-model="scope.row.salesTerritory" class="table-input" />
        </template>
      </el-table-column>
      <!-- TECH 관련 (rowSpan=2) -->
      <el-table-column label="TECH" :align="'center'">
        <el-table-column label="CHIP" prop="chip" :align="'center'" width="80">
          <template #default="scope">
            <el-input v-model="scope.row.chip" class="table-input" />
          </template>
        </el-table-column>
        <el-table-column label="PKG" prop="pkg" :align="'center'" width="80">
          <template #default="scope">
            <el-input v-model="scope.row.pkg" class="table-input" />
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 프로젝트 관련 (rowSpan=2) -->
      <el-table-column label="Project" :align="'center'">
        <el-table-column label="Main" prop="main" :align="'center'" width="70">
          <template #default="scope">
            <el-input v-model="scope.row.main" class="table-input" />
          </template>
        </el-table-column>
        <el-table-column label="Sub" prop="sub" :align="'center'" width="70">
          <template #default="scope">
            <el-input v-model="scope.row.sub" class="table-input" />
          </template>
        </el-table-column>
        <el-table-column
          label="고객"
          prop="client"
          :align="'center'"
          width="80"
        >
          <template #default="scope">
            <el-input v-model="scope.row.client" class="table-input" />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="Type" prop="category" :align="'center'">
        <template #default="scope">
          <el-input v-model="scope.row.category" class="table-input" />
        </template>
      </el-table-column>

      <el-table-column label="Band" prop="band" :align="'center'" width="100">
        <template #default="scope">
          <el-input v-model="scope.row.band" class="table-input" />
        </template>
      </el-table-column>
      <el-table-column
        label="FAB P/N"
        prop="fabPartNumber"
        :align="'center'"
        width="140"
      >
        <template #default="scope">
          <el-input v-model="scope.row.fabPartNumber" class="table-input" />
        </template>
      </el-table-column>

      <el-table-column label="Priority" prop="dvrPriority" :align="'center'">
        <template #default="scope">
          <el-input v-model="scope.row.dvrPriority" class="table-input" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { fetchProcessData } from "../../FAB/ApplicationList/ApplicationList";
import type { FabApplicationForm } from "../../FAB/Interface/mes-interface";
import { dv2Data } from "../../../utils/Dv2/demo-data";
import { formatDate } from "../../../utils/date-utils";
import TableActions from "./TableActions.vue";
import { updateDv2TableData } from "../../../utils/Dv2/dv2-list-utils";
import { Dv2 } from "../../../interface/Dv2/dv2-list-interface";

// 📌 기존 데이터 저장 (ref 사용)
const fabApp = ref<FabApplicationForm[]>([]);
const dv2TableData = ref<Dv2[]>([]); // 원본 데이터를 저장할 ref

// 📌 onMounted에서 데이터 로드 및 업데이트
onMounted(async () => {
  fabApp.value = await fetchProcessData(fabApp.value);

  nextTick(() => {
    dv2TableData.value = dv2Data.flatMap((row) => [
      {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: true,
        dateOfFabIn: row.dateOfEstimatedFabIn, // 두 번째 줄: 예상 FAB IN 값
        dateOfFabOut: row.dateOfEstimatedFabOut, // 두 번째 줄: 예상 FAB OUT 값
        dateOfMdr: row.dateOfEstimatedMdr,
        isEditable: true,
        dateOfHqOut: row.dateOfEstimatedHqOut,
        dateOfWhcIn: row.dateOfEstimatedWhcIn,
        dateOfAssyIn: row.dateOfEstimatedAssyIn,
        dateOfDCOut: row.dateOfEstimatedDCOut,
        dateOfMeasIn: row.dateOfEstimatedMeasIn,
        dateOfCer: row.dateOfEstimatedCer,
        userOfSupporter: row.userOfSupporter,
      },
      {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: false,
        dateOfFabIn: row.dateOfFabIn, // 첫 번째 줄: 실제 FAB IN 값
        dateOfFabOut: row.dateOfFabOut, // 첫 번째 줄: 실제 FAB OUT 값
        dateOfMdr: row.dateOfMdr,
        isEditable: false,
        dateOfHqOut: row.dateOfHqOut,
        dateOfWhcIn: row.dateOfWhcIn,
        dateOfAssyIn: row.dateOfAssyIn,
        dateOfDCOut: row.dateOfDCOut,
        dateOfMeasIn: row.dateOfMeasIn,
        dateOfCer: row.dateOfCer,
        userOfSupporter: row.userOfDesigner,
      },
    ]);

    updateDv2TableData(dv2TableData.value , fabApp.value)
    
  });
});


// 📌 computed를 사용하여 반응형 데이터 제공 (rowSpan 기능 유지)
const formattedData = computed(() => {
  return dv2TableData.value;
});

/**
 * 📌 행 병합(span) 메서드
 * Element Plus에서는 `span-method`를 사용하여 `rowspan`을 적용해야 함.
 */
const tableSpanMethod = ({ row, column, rowIndex }: any) => {
  if (
    [
      "salesTerritory",
      "fabPartNumber",
      "main",
      "sub",
      "client",
      "category",
      "band",
      "partName",
      "chip",
      "pkg",
      "group",
      "status",
      "dvrPriority",
      "turn",
      "currentStage",
      "dateOfConfirm",
    ].includes(column.property)
  ) {
    return row.isFirstRow ? [2, 1] : [0, 0]; // 첫 번째 줄만 rowSpan=2
  }
  return [1, 1]; // 기본적으로 rowSpan=1
};
</script>

<style lang="scss" scoped>
.custom-table ::v-deep(.el-warning) {
  background-color: hsl(
    0,
    76%,
    23%
  ) !important; /* Ensure the background changes */
  color: hsl(0, 68%, 12%) !important;
  font-size: 30px !important;
}

/* 헤더 스타일 */
.custom-table ::v-deep(.el-table__header-wrapper th) {
  font-weight: bold;
  font-size: 14px;
  background-color: #f1f5f9;
  color: #333;
  border: 1px solid #d1d5db;
  height: 20px;
}

/* 셀 스타일 */
.custom-table ::v-deep(.el-table__cell) {
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  font-size: 13px;
  color: #4b5563;
  height: 40px;
}

/* Hover 효과 */
.custom-table ::v-deep(.el-table__row:hover .el-table__cell) {
  background-color: #f3f4f6;
}

.custom-table ::v-deep(.even-row) {
  box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: rgb(243, 235, 235);
  border-radius: 1px;

  // padding: 4px;
}

.custom-table ::v-deep(.el-table__row.el-warning .el-table__cell) {
  background-color: hsl(0, 61%, 90%) !important;
  color: hsl(0 75% 7%) !important;
}

/* Vue 3 (Scoped 스타일 사용 시) */
::v-deep(.table-input .el-input__inner) {
  width: 100%;
  /* padding: 2px 4px; */
  border: none;
  background: transparent;
  text-align: center;
  font-size: 14px;
  height: 40px;
}

/* Vue 3 (Scoped 스타일 사용 시) */
::v-deep(.table-input1 .el-input__inner) {
  width: 100%;
  /* padding: 2px 4px; */
  border: none;
  background: transparent;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  height: 20px;
}

/* 입력창이 focus되었을 때 테두리 추가 */
/* .table-input:focus,
.table-input:focus-within {
  border: 1px solid #409eff;
  background: #ffffff;
} */
</style>
