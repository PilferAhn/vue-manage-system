<script lang="ts">
export default {};
</script>
<template>
  <div style="margin-bottom: 10px; display: flex; gap: 10px">
    <el-button :type="isNa ? 'primary' : 'default'" @click="toggleNa">
      NA 의뢰서
    </el-button>

    <el-button :type="isNF ? 'primary' : 'default'" @click="toggleNf">
      NF 의뢰서
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from "vue";
import type { ModuleMeasurementApp } from "../../../interface/module_group/application/application";

const props = defineProps<{
  application: ModuleMeasurementApp;
}>();

const isNa = ref<boolean>(false);
const isNF = ref<boolean>(false);

// 🔹 NA 의뢰서 버튼 클릭 시 (독립적으로 작동)
const toggleNa = () => {
  // props.application.isNa = !props.application.isNa; // 현재 값 반전
  isNa.value = !isNa.value;
  props.application.isNa = isNa.value;
};

// 🔹 NF 의뢰서 버튼 클릭 시 (독립적으로 작동)
const toggleNf = () => {
  // props.application.isNf = !props.application.isNf; // 현재 값 반전
  isNF.value = !isNF.value;
  props.application.isNf = isNF.value;
};

const trackedValues = computed(() => ({
  na: props.application.isNa,
  nf: props.application.isNf,
}));

watch(
  trackedValues,
  (newValues) => {
    // console.log(newValues);
    isNa.value = newValues.na;
    isNF.value = newValues.nf;
  },
  { deep: true, immediate: true }
);
</script>
