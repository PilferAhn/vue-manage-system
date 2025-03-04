<template>
    <el-form-item :label="label" :prop="prop" :rules="rules"  :class="{'required-label' : props.needBold}">
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
  import { ElSelect, ElOption, FormItemRule } from "element-plus";
  import type { OptionInterface } from "../../interface/option";
  // Define the OptionItem interface with all properties as strings

  
  const props = defineProps({
  modelValue: String,
  label: String,
  prop: String,
  rules: {
    type: [Object, Array] as PropType<FormItemRule | FormItemRule[] | null>,
    default: null,
  },
  placeholder: String,
  options: Array as PropType<OptionInterface[]>,
  disable: Boolean,
  needBold: Boolean,
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

<style scope>
.required-label > .el-form-item__label {
  font-weight: bold;
  color: rgb(0, 0, 0);
  font-size: 1.1em;
}
</style>

<script lang="ts">
export default {};
</script>