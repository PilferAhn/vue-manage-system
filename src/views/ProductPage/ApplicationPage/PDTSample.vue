<template>
  <div class="container">
    <el-table
      :data="samples"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column
        prop="sampleNumber"
        label="Sample Number"
        class="seventy-percent-width"
      >
        <template #default="{ row, $index }">
          <el-input v-model="row.sampleNumber"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="defaultFreq"
        label="System (A)"
        class="seventy-percent-width"
      >
        <template #default="{ row, $index }">
          <el-input
            v-model="row.defaultFreq"
            @input="updateSample($index, 'defaultFreq', row.defaultFreq)"
            :disabled="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="offset"
        label="ΔFreq (B)"
        class="seventy-percent-width"
      >
        <template #default="{ row, $index }">
          <el-input
            v-model="row.offset"
            @input="updateSample($index, 'offset', row.offset)"
            :disabled="row.useDefaultFreq"
          />
        </template>
      </el-table-column>
      <el-table-column label="Input Freq (A + B)" class="seventy-percent-width">
        <template #default="{ row, $index }">
          <span> {{ Number(row.defaultFreq) + Number(row.offset) }} </span>
        </template>
      </el-table-column>
      <el-table-column label="수정" class="seventy-percent-width">
        <template #default="{ row, $index }">
          <el-switch
            v-model="row.useDefaultFreq"
            @input="updateSample($index, 'useDefaultFreq', row.useDefaultFreq)"
            class="input-field"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Port" class="wide-column">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.sOutput"
            @input="updateSample($index, 'sOutput', row.sOutput)"
            class="half-width-input"
          />
          <el-input
            v-model="row.sInput"
            @input="updateSample($index, 'sInput', row.sInput)"
            class="half-width-input"
          />
        </template>
      </el-table-column>
      <el-table-column label="SPL SnP 파일" class="seventy-percent-width">
        <template #default="{ row, $index }">
          <el-button
            size="default"
            type="primary"
            @click="handleFileSelect(row)"
            >파일 선택</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="SnP 파일명"
        prop="sParaFileName"
        class="seventy-percent-width"
      >
      </el-table-column>
      <!-- <el-table-column label="상태">
        <template #default="{ row, $index }">
          <el-col>
            <el-select v-model="row.status" placeholder="상태 선택">
              <el-option label="투입 대기" value="waiting"></el-option>
              <el-option label="측정 완료" value="finished"></el-option>
              <el-option label="측정 진행중" value="in progress"></el-option>
            </el-select>
          </el-col>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Action">
        <template #default="{ row, $index }">
          <el-button
            type="success"
            @click="
              handleSampleStatus(row.sampleNumber, row.sampleUuid, row.status)
            "
            >업데이트</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import type { SampleInformation } from "./Application";
import { handleFileSelect, updateSampleStatus } from "./PDTSample";

const props = defineProps<{
  samples: SampleInformation[];
}>();

const emits = defineEmits(["update:samples"]);

function updateSample(index: number, key: keyof SampleInformation, value: any) {
  const updatedSamples = [...props.samples];
  updatedSamples[index][key] = value;

  if (key === "useDefaultFreq") {
    updatedSamples[index]["offset"] = "0";
  }

  emits("update:samples", updatedSamples);
}

function handleSampleStatus(
  sampleNumber: string,
  sampleUuid: string,
  status: string
) {
  updateSampleStatus(sampleNumber, sampleUuid, status);
}

const tableRowClassName = ({ row }: { row: SampleInformation }) => {
  if (row.status === "in progress") {
    return "row-in-progress";
  } else if (row.status === "finished") {
    return "row-finished";
  } else if (row.status === "waiting") {
    // Ensure the status name matches
    return "row-waiting";
  }
  return "";
};
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto; /* Center the container */
  margin-bottom: 10px;
}

.el-table {
  margin-top: 20px;
}

.half-width-input {
  width: 40%;
}

.seventy-percent-width {
  width: 70%;
}

.wide-column {
  width: 200px; /* Adjust the width as needed */
}

.row-in-progress {
  background-color: #f0f9ff; /* 측정 진행중 - 연한 파란색 */
}
.row-finished {
  background-color: #e0ffe0; /* 측정 완료 - 연한 녹색 */
}
.row-waiting {
  background-color: #fff9e0; /* 측정 대기 - 연한 노란색 */
}
</style>
