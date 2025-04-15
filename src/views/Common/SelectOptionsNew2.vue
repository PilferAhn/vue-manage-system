<template>
  <el-form-item
    :label="label"
    :prop="prop"
    :rules="rules"
    :class="{ 'required-label': props.needBold }"
  >
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
import type { OptionInterface } from "../../interface/option";
// Define the OptionItem interface with all properties as strings
import type { FormRules } from "element-plus";
import { ElInput, FormItemRule } from "element-plus";  // FormItemRule 타입 가져오기

const props = defineProps({
  modelValue: String,
  label: String,
  prop: String,
  rules: {
    type: [Object, Array] as PropType<FormItemRule | FormItemRule[]>,
    default: () => [],
  },
  placeholder: String,
  options: Array as PropType<OptionInterface[]>,
  disable: Boolean,
  needBold: Boolean,
});

// const props = defineProps<{
//   modelValue: string | any;
//   label: string;
//   prop: string;
//   rules: FormItemRule | FormItemRule[] | null;  // FormItemRule 또는 배열로 명시
//   placeholder: string;
//   needBold : boolean;
//   options : OptionInterface[];
//   disable : boolean
// }>();

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

<script lang="ts">
export default {};
</script>

<style scope>
.required-label > .el-form-item__label {
  font-weight: bold;
  color: rgb(0, 0, 0);
  font-size: 1.1em;
}
</style>