<script lang="ts">
export default {};
</script>
<template>
  <el-form-item :label="props.label" :prop="props.prop">
    <el-select
      v-model="internalValue"
      @change="updateValue"
      :placeholder="props.placeholder"
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
import { ref, watch } from "vue";
import { OptionNumberInterface } from "../../interface/option";

const props = defineProps<{
  modelValue: number;
  label: string;
  prop: string;
  placeholder: string;
  options: OptionNumberInterface[];
}>();

// 부모 컴포넌트에게 자식 컴포넌트의 값을 알려주는 이벤트
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

<style></style>
