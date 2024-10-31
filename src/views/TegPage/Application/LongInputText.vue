<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-input v-model="internalValue" @input="updateValue" :placeholder="placeholder" type="textarea" rows="15"/>
  </el-form-item>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElInput, FormItemRule } from "element-plus";  // FormItemRule 타입 가져오기

// Props 정의
const props = defineProps<{
  modelValue: string;
  label: string;
  prop: string;
  rules: FormItemRule | FormItemRule[] | null;  // FormItemRule 또는 배열로 명시
  placeholder: string;
}>();


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

<script lang="ts">
export default {};
</script>