<template>
  <el-form-item :label="label" :prop="prop">
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
import { defineProps, defineEmits, ref, watch } from 'vue';
import { ElSelect, ElOption } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  label: String,
  prop: String,
  placeholder: String,
  options: {
    type: Array as () => number[],
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
const internalValue = ref(props.modelValue);

const updateValue = () => {
  emit('update:modelValue', internalValue.value);
};

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  }
);
</script>


<!-- <template>
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
  modelValue: [Number, String], // 여러 타입 지원
  label: String,
  prop: String,
  rules: Array,
  placeholder: String,
  options: Array, // 추가: 옵션 리스트
});


console.log(props)

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
</script> -->
