<template>
  <el-form-item :prop="prop" :rules="rules">
    <template #label>
      <div>
        {{ label }}
        <br v-if="subLabel" />
        <span v-if="subLabel">{{ subLabel }}</span>
      </div>
    </template>
    <el-input
      v-model="internalValue"
      @input="updateValue"
      :placeholder="placeholder"
      :disabled="props.disable"
      :maxlength="maxlength"
    />
  </el-form-item>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
  modelValue: String,
  label: String,
  subLabel: String,
  prop: String,
  rules: Array,
  placeholder: String,
  disable: Boolean,
  maxlength: Number,
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

<script lang="ts">
export default {  
};
</script>