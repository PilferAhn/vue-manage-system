<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-select
      v-model="internalValue"
      @change="updateValue"
      :placeholder="placeholder"
    >
      <el-option
        v-for="option in options"
        :key="option"
        :label="option"
        :value="option"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import { ElSelect, ElOption } from "element-plus";
import type { FormItemRule } from "element-plus"; // Element Plus의 FormItemRule 타입 가져오기

const props = defineProps<{
  modelValue: string;
  label: string;
  prop: string;
  rules: FormItemRule | FormItemRule[] | null;  // FormItemRule 또는 FormItemRule 배열로 지정
  placeholder: string;
  options: string[]; // options는 문자열 배열로 지정
}>();

const emit = defineEmits(["update:modelValue"]);
const internalValue = ref(props.modelValue);

const updateValue = () => {
  
  emit("update:modelValue", internalValue.value);
};

watch(
  () => props.modelValue,
  (newVal) => {

    internalValue.value = newVal;
  }
);
</script>

<script lang="ts">
export default {};
</script>