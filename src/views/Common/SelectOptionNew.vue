<template>
    <el-form-item :label="label" :prop="prop" :rules="rules">
      <el-select
        v-model="internalValue"
        @change="updateValue"
        :placeholder="placeholder"
        :disabled="disable"
      >
        <el-option
          v-for="option in options"
          :key="option[keyField]"
          :label="option[labelField]"
          :value="option[valueField]"
        ></el-option>
      </el-select>
    </el-form-item>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch } from "vue";
  import { ElSelect, ElOption } from "element-plus";
  
  // props 정의
  const props = defineProps({
    modelValue: [String, Number],  // 모델 값은 문자열이나 숫자일 수 있음
    label: String,
    prop: String,
    rules: Array,
    placeholder: String,
    options: Array, // 객체 배열을 받을 옵션 리스트
    keyField: { type: String, default: "key" },  // key 필드 이름
    labelField: { type: String, default: "label" },  // label 필드 이름
    valueField: { type: String, default: "value" },  // value 필드 이름
    disable: Boolean,
  });
  
  const emit = defineEmits(["update:modelValue"]);
  const internalValue = ref(props.modelValue);
  
  const updateValue = () => {
    emit("update:modelValue", internalValue.value);
  };
  
  // 모델 값이 변경될 때 내부 값을 업데이트
  watch(
    () => props.modelValue,
    (newVal) => {
      internalValue.value = newVal;
    }
  );
  </script>
  