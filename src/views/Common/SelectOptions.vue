<template>
    <el-form-item :label="label" :prop="prop" :rules="rules">
      <el-select
        v-model="internalValue"
        @change="updateValue"
        :placeholder="placeholder"
        :disabled="props.disable"
      >
        <el-option
          v-for="option in options"
          :key="option.key"
          :label="option.label"
          :value="option.value"
        ></el-option>
      </el-select>
    </el-form-item>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch, PropType } from "vue";
  import { ElSelect, ElOption } from "element-plus";
  
  // Define the OptionItem interface with all properties as strings
  interface OptionItem {
    key: string;
    label: string;
    value: string;
  }
  
  const props = defineProps({
    modelValue: String, // modelValue is now a string
    label: String,
    prop: String,
    rules: Array,
    placeholder: String,
    options: Array as PropType<OptionItem[]>, // Array of OptionItem objects with string properties
    disable: Boolean,
  });
  
  const emit = defineEmits(["update:modelValue"]);
  const internalValue = ref(props.modelValue);
  
  const updateValue = () => {
    emit("update:modelValue", internalValue.value);
  };
  
  // Watch for external changes to modelValue and update internal state
  watch(
    () => props.modelValue,
    (newVal) => {
      internalValue.value = newVal;
    }
  );
  </script>
  