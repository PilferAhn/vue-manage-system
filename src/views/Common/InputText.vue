<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-input v-model="internalValue" @input="updateValue" :placeholder="placeholder" :disabled="props.disable"/>
  </el-form-item>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
  modelValue: String,
  label: String,
  prop: String,
  rules: Array,
  placeholder: String,
  disable: Boolean
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

const computedDisable = computed(() => props.disable);

watch(
  () => props.disable,
  (newValue) => {
    // console.log(`disable changed to ${newValue}`);
  }
);

const updateValue = () => {
  emit("update:modelValue", internalValue.value);
};
</script>
