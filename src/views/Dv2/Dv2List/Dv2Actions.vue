<template>
  <div class="actions-container">
    <el-button type="success" size="large" @click="isDialogVisible = true"
      >등록</el-button
    >
    <Dv2DialogToCreate v-model="isDialogVisible" :dv2="newDv2" @submit="handleSubmit" />
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

const handleCreateRow = () => {
  const a: Dv2 = {
    client: "",
    isFirstRow: true,
    dateOfFabIn: "",
    dateOfFabOut: "",
    dateOfMdr: "",
    isEditable: true,
    dateOfHqOut: "",
    dateOfWhcIn: "",
    dateOfAssyIn: "",
    dateOfDCOut: "",
    dateOfMeasIn: "",
    dateOfCer: "",
    supporter: "",
  };

  const b: Dv2 = {
    client: "",
    isFirstRow: false,
    dateOfFabIn: "",
    dateOfFabOut: "",
    dateOfMdr: "",
    isEditable: false,
    dateOfHqOut: "",
    dateOfWhcIn: "",
    dateOfAssyIn: "",
    dateOfDCOut: "",
    dateOfMeasIn: "",
    dateOfCer: "",
    supporter: "",
  };

  props.dv2TableData.unshift(a, b);
};

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
