<template>
  <div class="actions-container">
    <el-button type="success" size="large" 
      >등록</el-button
    >
    <el-button type="success" size="large" @click="handleExcelDownload">Excel 다운로드</el-button>
  
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ApplicationData } from "../../../interface/cspRequestFormInterface";

import { convertKeysToPEP8 } from "../../../utils/key-converter";
import { sendPostAndDownloadExcel } from "../../../utils/httpProtocol";

const props = defineProps<{
  dv2TableData: ApplicationData[];
}>();

// 📌 모달 상태 관리



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
