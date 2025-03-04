<template>
  <div class="actions-container">
    <el-button type="success" size="large" @click="isDialogVisible = true"
      >등록</el-button
    >
    <el-button type="success" size="large" @click="handleExcelDownload">Excel 다운로드</el-button>
    <Dv2DialogToCreate
      v-model="isDialogVisible"
      :dv2="newDv2"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Dv2 } from "../../../interface/Dv2/dv2-list-interface";
import {
  checkDv2ListToCreate,
  initDv2,
} from "../../../utils/Dv2/dv2-list-utils";
import Dv2DialogToCreate from "./Dv2DialogToCreate.vue";
import { convertKeysToPEP8 } from "../../../utils/key-converter";
import { sendObjPostRequest, sendPostAndDownloadExcel } from "../../../utils/httpProtocol";

const props = defineProps<{
  oldDvList: Dv2[];
  dv2TableData: Dv2[];
}>();

// 📌 모달 상태 관리
const isDialogVisible = ref(false);
const newDv2 = ref<Dv2>({});
watch(
  () => isDialogVisible.value,
  (newVal) => {
    if (isDialogVisible) {
      newDv2.value = initDv2();
    }
  }
);

const handleExcelDownload = async  () => {
  // console.log(props.dv2TableData)
  const temp = []

  props.dv2TableData.forEach((dv2) => {
    temp.push(convertKeysToPEP8(dv2))
  })
  try {
    await sendPostAndDownloadExcel("/dv2/create_dv2_plan_list_to_excel", temp);
  } catch (error) {
    console.error("엑셀 다운로드 실패:", error);
  }
}

// 📌 등록 버튼 클릭 시 (기능 미구현)
const handleSubmit = () => {
  isDialogVisible.value = false; // 모달 닫기
};

const handleCreate = () => {
  checkDv2ListToCreate(props.oldDvList, props.dv2TableData);
};

// 📌 다이얼로그 닫기
const handleClose = () => {
  isDialogVisible.value = false;
};
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
.actions-container {
  display: flex;
  justify-content: flex-start; /* 버튼을 오른쪽에 배치 */
  padding-top: 0px;
  padding-left: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}
</style>
