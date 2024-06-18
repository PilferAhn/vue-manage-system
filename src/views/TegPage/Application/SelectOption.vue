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

const props = defineProps({
  modelValue: String,
  label: String,
  prop: String,
  rules: Array,
  placeholder: String,
  options: Array, // 추가: 옵션 리스트
});

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
