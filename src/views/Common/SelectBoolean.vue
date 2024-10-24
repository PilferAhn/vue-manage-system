<template>
    <el-form-item :label="label" :prop="prop" :rules="rules">
      <el-switch v-model="internalValue" @change="updateValue" :disabled="computedDisable" />
    </el-form-item>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, computed } from "vue";
  import { ElSwitch } from "element-plus";
  
  const props = defineProps({
    modelValue: Boolean,  // Expecting a boolean modelValue
    label: String,
    prop: String,
    rules: Array,
    placeholder: String,
    disable: Boolean
  });
  
  const emit = defineEmits(["update:modelValue"]);
  const internalValue = ref(props.modelValue);  // Initialize internalValue as a boolean
  
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== internalValue.value) {
        internalValue.value = newValue;
      }
    }
  );
  
  const computedDisable = computed(() => props.disable);
  
  const updateValue = () => {
    emit("update:modelValue", internalValue.value);
  };
  </script>
  
  <style scoped>
  /* Add your scoped styles here */
  </style>
  