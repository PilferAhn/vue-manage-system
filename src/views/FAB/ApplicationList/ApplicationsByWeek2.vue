<template>
  <!-- Element Plus Table -->
  <div class="group-count">
    <div v-for="(count, group) in groupCounts" :key="group" class="group-box">
      <span>{{ group }}: {{ count }}개</span>
    </div>
  </div>
  <!-- :border="true" -->
  <div class="table-wrapper">
    <el-table
      :data="props.processData"
      class="custom-table"
      style="min-width: 1000px"
      height="640"
      :row-style="{ height: '30px' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="index"
        label="No"
        width="50"
        :align="'center'"
      ></el-table-column>

      <!-- <el-table-column
        type="id"
        label="No"
        width="50"
        prop="id"
        :align="'center'"
      ></el-table-column> -->

      <el-table-column
        prop="modelName"
        label="Model Name"
        width="150"
        :align="'center'"
      />

      <!-- <el-table-column
        prop="group"
        label="Group"
        width="80"
        :align="'center'"
      /> -->
      <!-- <el-table-column
        prop="process"
        label="Process"
        width="80"
        :align="'center'"
      >
        <template #default="scope">
          <span class="uppercase">{{ scope.row.process }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="priority"
        label="Priority"
        width="70"
        :align="'center'"
      /> -->
      <el-table-column label="담당자" width="100" :align="'center'">
        <template #default="scope">
          {{ scope.row.designer }} <br />
          {{ scope.row.requester }}
        </template>
      </el-table-column>
      <el-table-column
        prop="packageType"
        label="Package Type"
        width="80"
        :align="'center'"
      />

      <el-table-column label="HQ" :align="'center'">
        <el-table-column label="FAB In" :align="'center'" width="130">
          <template #default="scope">
            <span v-if="scope.row.maxHistorySeq !== undefined">
              {{
                formatDate(
                  scope.row.lotStatus[scope.row.feIndex]["creation_date"]
                )
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="현위치(투입시간)" :align="'center'" width="130">
          <template #default="scope">
            <span v-if="scope.row.maxHistorySeq !== undefined">
              {{ scope.row.feOperation }}
              <br />
              {{ formatDateTime(scope.row.feOperationStart) }}
              <br />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="To WHC" :align="'center'" width="130">
          <template #default="scope">
            <span v-if="scope.row.feOperation === 'Transit 공정'">
              {{
                formatDate(
                  scope.row.lotStatus[scope.row.feIndex][
                    "movein_date"
                  ]
                )
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="WHC" :align="'center'">
        <el-table-column label="WHC In" :align="'center'" width="130">
          <template #default="scope">
            <span v-if="scope.row.hanoiSiteIn !== undefined">{{
              formatDate(scope.row.hanoiSiteIn)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="현위치(투입시간)" :align="'center'" width="200"
          ><template #default="scope">
            <span v-if="scope.row.hanoiOperation !== undefined">
              {{ scope.row.hanoiOperation }}
              <br />
              {{ formatDateTime(scope.row.hanoiOperationStart) }}
            </span>
          </template></el-table-column
        >
      </el-table-column>

      <!-- <el-table-column
        prop="purpose"
        label="목적"
        width="300"
        :align="'center'"
      /> -->
      <el-table-column prop="is_aoi" label="AOI" width="70" :align="'center'">
        <template #default="scope">
          <el-tag v-if="scope.row.isAoi" type="success">Yes</el-tag>
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="quantity"
        label="수량"
        width="80"
        :align="'center'"
      /> -->
      <el-table-column
        prop="destination"
        label="출하"
        width="120"
        :align="'center'"
      />
      <!-- <el-table-column prop="code" label="Code" width="80" :align="'center'" /> -->
      <!-- FAB Insert Date를 날짜 선택기로 수정 -->
      <!-- @change="handleDateChange(scope.row)" -->
      <el-table-column label="FAB In Date" width="150" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.wantedFabStartDate) }}
        </template>
      </el-table-column>
      <el-table-column label="FAB Out Date" width="120" :align="'center'">
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.wantedFabFinishDate) }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="waferCompany"
        label="Wafer Company"
        width="120"
        :align="'center'"
      />
      <el-table-column
        prop="waferAngle"
        label="Wafer Angle"
        width="100"
        :align="'center'"
      />
      <el-table-column
        prop="waferThickness"
        label="Wafer Thickness"
        width="100"
        :align="'center'"
      />
      <el-table-column
        prop="waferType"
        label="Wafer Type"
        width="80"
        :align="'center'"
      />
      <el-table-column
        prop="machineName"
        label="Machine Name"
        width="120"
        :align="'center'"
      />
      <el-table-column
        prop="idtThickness"
        label="막두께"
        width="300"
        :align="'center'"
      />

      <el-table-column label="비고" prop="note" width="300" :align="'center'" />
      <el-table-column
        label="HS W/F 조건"
        prop="hsWaferInfo"
        width="300"
        :align="'center'"
      /> -->
      <!-- <el-table-column
        fixed="right"
        label="Action"
        min-width="200"
        :align="'center'"
      >
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="updateStatus(scope.row, 'confirm')"
          >
            확정
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="updateStatus(scope.row, 'delay')"
            >지연</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="updateStatus(scope.row, 'cancel')"
          >
            취소
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
  <div class="buttun-section">
    <el-button type="primary" @click="downloadExcel(props.processData)"
      >Export to Excel</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed } from "vue";
import type { ProcessData } from "../Interface/ApplicationInterface";
import {
  handleDateChange as externalHandleDateChange,
  updateStatus,
} from "./ApplicationsByWeek";
import { downloadExcel } from "./ApplicationList";
import { formatDate, formatDateTime } from "../Common/Application";

const props = defineProps<{
  processData: ProcessData[];
}>();

// emit 정의
const emit = defineEmits<{
  (e: "update:processData", updatedData: ProcessData[]): void;
}>();

const idList = ref<number[]>([]);

const tableRowClassName = ({ row }: { row: ProcessData }) => {
  if (row.status === "cancel") {
    return "danger-row";
  } else if (row.status === "delay") {
    return "warning-row";
  }

  return "";
};

// const tableRowClassName = (row: ProcessData) => {
//   console.log(row)
//   // 예: 만약 row의 특정 조건에 따라 줄을 긋고 싶다면
//   return row.status === 'created' ? 'row-strikethrough' : '';
// };

const groupCounts = computed(() => {
  return props.processData.reduce((acc, item) => {
    acc[item.group] = (acc[item.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
});
</script>

<style scope>
.table-wrapper {
  max-width: 100%;
}

.custom-table {
  font-size: 12px;
  padding-right: 10px;
  margin-right: 10px;
}

.group-count {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.group-box {
  background-color: #f0f9ff;
  border: 1px solid #dbeafe;
  padding: 5px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 12px;
  color: #1e40af;
}

.buttun-section {
  margin-top: 15px;
}

.el-table__row.important-row {
  background-color: rgb(0, 255, 0);
}

.el-table__row.warning-row {
  background-color: rgb(233, 215, 181);
}

.el-table__row.danger-row {
  background-color: rgb(250, 214, 214);
}
</style>
