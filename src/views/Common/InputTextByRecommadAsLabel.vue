<template>
    <el-form-item
      :label="label"
      :prop="prop"
      :rules="rules"
      :class="{ 'required-label': props.needBold }"
    >
      <el-autocomplete
        v-model="internalValue"
        :fetch-suggestions="querySearch"
        @select="updateValue"
        :placeholder="placeholder"
        :disabled="props.disable"
      >
        <template v-if="props.useTemplate" #prepend>{{ props.templateLabel }}</template>
      </el-autocomplete>
    </el-form-item>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch, PropType } from "vue";
  import type { OptionInterface } from "../../interface/option";
  import type { FormRules } from "element-plus";
  
  const props = defineProps({
    modelValue: String,
    label: String,
    prop: String,
    rules: Object as PropType<FormRules>,
    placeholder: String,
    options: Array as PropType<OptionInterface[]>,
    disable: Boolean,
    needBold: Boolean,
    useTemplate: Boolean,
    templateLabel: String,
  });
  
  const emit = defineEmits(["update:modelValue"]);
  const internalValue = ref(props.modelValue);
  
  // 선택된 값 업데이트 (label은 추천 목록, value는 실제 값)
  const updateValue = (item: { value: string }) => {
    const selectedOption = props.options.find(option => option.label === item.value);
    internalValue.value = selectedOption ? selectedOption.value : ""; // 🚀 value 값을 저장
    emit("update:modelValue", internalValue.value);
  };
  
  // 자동완성 추천 목록 (label 기준으로 표시)
  const querySearch = (queryString: string, cb: (results: any[]) => void) => {
    const results = props.options
      ?.filter(option => option.label.includes(queryString))
      .map(option => ({ value: option.label })); // label만 표시
    cb(results);
  };
  
  // modelValue가 변경되었을 때 내부 값도 업데이트
  watch(
    () => props.modelValue,
    (newVal) => {
      internalValue.value = newVal;
    }
  );
  </script>
  
  <style scoped>
  .required-label > .el-form-item__label {
    font-weight: bold;
    color: rgb(0, 0, 0);
    font-size: 1.1em;
  }
  </style>