<template>
  <el-form-item
    :label="label"
    :prop="prop"
    :rules="rules"
    :class="{ 'required-label': props.needBold }"
  >
    <el-select
      v-model="internalValue"
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

    <!-- 기타 선택 시 텍스트박스 표시 -->
    <el-input
      v-if="enableOthers && internalValue === othersValue"
      v-model="internalOthers"
      :placeholder="othersPlaceholder || '기타 목적을 입력하세요.'"
      style="margin-top: 8px"
    />
  </el-form-item>
  
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from "vue";
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
  enableOthers: Boolean,
  othersValue: String,
  othersPlaceholder: String,
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
const internalValue = ref<string | null>(props.modelValue ?? null);

// 기타 텍스트 입력값
const internalOthers = ref<string>("");

const updateValue = () => {
  emit("update:modelValue", internalValue.value);
};

// Watch for external changes to modelValue and update internal state
watch(
  () => props.modelValue,
  (newVal) => {
    if (!props.enableOthers) {
    internalValue.value = newVal;
    return;
  }
  // modelValue가 옵션 value 중 하나면 일반 옵션
    const existsInOptions =
      !!newVal && props.options?.some((opt) => opt.value === newVal);

    if (existsInOptions) {
      internalValue.value = newVal as string;
      internalOthers.value = "";
    } else if (newVal) {
      // 옵션에 없는 값이면 '기타'로 간주해서 텍스트 박스로 복원
      internalValue.value = props.othersValue;
      internalOthers.value = newVal;
    } else {
      internalValue.value = null;
      internalOthers.value = "";
    }
  },
  { immediate: true }
);

watch(
  [internalValue, internalOthers],
  ([sel, others]) => {
    if (!props.enableOthers) {
      emit("update:modelValue", sel ?? "");
      return;
    }

    if (sel === props.othersValue) {
      // 기타 선택 시
      if (others && others.trim() !== "") {
        // 텍스트가 실제로 들어온 경우에만 그걸 최종 값으로 사용
        emit("update:modelValue", others);
      } else {
        // 아직 텍스트 안 썼으면, modelValue는 'others' 그대로 유지
        emit("update:modelValue", sel ?? "");
      }
    } else {
      // 일반 옵션
      emit("update:modelValue", sel ?? "");
    }
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