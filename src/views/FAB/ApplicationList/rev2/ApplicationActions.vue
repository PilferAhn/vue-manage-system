<template>
  <el-row class="actions-container">
    <el-button type="primary" @click="refreshList"> 🔄 새로고침 </el-button>

    <el-button type="success" @click="downloadExcel">
      ⬇️ 엑셀 다운로드
    </el-button>

    <el-button
      type="danger"
      :disabled="selectedItems.length === 0"
      @click="deleteSelected"
    >
      ❌ 선택 삭제
    </el-button>

    <el-button type="warning" @click="addNewApplication">
      ✏️ 신청 추가
    </el-button>
  </el-row>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from "vue";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import { convertPep8ToCamelCase2, convertKeysToPEP8 } from "../../../../utils/key-converter";
import { TempTegApplicationForm } from "../../../../utils/tegTypes";

const props = defineProps<{
  applications: FabRequestForm[];
}>();

const applicationDictList = ref<Object[]>([])

// 부모로 이벤트 전달
const emit = defineEmits([
  "refresh",
  "download-excel",
  "delete-selected",
  "add-application",
]);

// 선택된 항목을 관리하는 변수 (예제)
const selectedItems = ref<string[]>([]);

const refreshList = () => {
  emit("refresh");
};

const downloadExcel = () => {
  console.log("EHRE?");

  applicationDictList.value.length = 0
  props.applications.forEach((app) => {
    applicationDictList.value.push(convertKeysToPEP8(app))
  })

  console.log(applicationDictList.value)

  emit("download-excel");
};

const deleteSelected = () => {
  emit("delete-selected", selectedItems.value);
};

const addNewApplication = () => {
  emit("add-application");
};
</script>

<style scoped>
.actions-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
}
</style>
