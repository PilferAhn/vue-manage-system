<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-input
      v-model="internalValue"
      @input="updateValue"
      :placeholder="placeholder"
      :disabled="props.disable"
    />
  </el-form-item>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
  modelValue: [Number, String], // ✅ 숫자 또는 문자열 허용
  label: String,
  prop: String,
  rules: Array,
  placeholder: String,
  disable: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const internalValue = ref(props.modelValue?.toString() || ""); // ✅ 문자열로 초기화

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue?.toString() !== internalValue.value) {
      internalValue.value = newValue?.toString() || "";
    }
  }
);

const computedDisable = computed(() => props.disable);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  internalValue.value = target.value; // ✅ 문자열 그대로 유지하여 입력 방해 X
};

const updateValue = () => {
  const numValue = parseFloat(internalValue.value);
  emit("update:modelValue", isNaN(numValue) ? "" : numValue); // ✅ 블러 시 숫자로 변환
};
</script>

<script lang="ts">
export default {};
</script>
