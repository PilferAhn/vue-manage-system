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
    useTemplate : Boolean,
    templateLabel : String,
  });
  
  const emit = defineEmits(["update:modelValue"]);
  const internalValue = ref(props.modelValue);
  
  const updateValue = (item: { value: string }) => {
    internalValue.value = item.value; // 🚀 내부 값만 저장
    emit("update:modelValue", item.value);
  };
  
  // 자동완성 기능을 위한 검색 함수
  const querySearch = (queryString: string, cb: (results: any[]) => void) => {
    const results =
      props.options
        ?.filter((option) => option.label.includes(queryString))
        .map((option) => ({ value: option.value })) || []; // value만 전달
    cb(results);
  };
  
  // Watch for external changes to modelValue and update internal state
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
  <script lang="ts">
  export default {};
  </script>