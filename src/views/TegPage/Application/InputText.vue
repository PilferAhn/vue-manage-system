<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-input v-model="internalValue" @input="updateValue" :placeholder="placeholder"/>
  </el-form-item>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
  modelValue: String,
  label: String,
  prop: String,
  rules: Array,
  placeholder : String,
});


const emit = defineEmits(["update:modelValue"]);
const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue;
    }
  }
);

const updateValue = () => {
  emit("update:modelValue", internalValue.value);
};
</script>
