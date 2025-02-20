<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <!-- <el-checkbox
        v-model="internalValue"
        @change="updateValue"
        :disabled="computedDisable"
        size="large"
      /> -->
    <el-button size="small" :class="{
    'active-button': internalValue }" @click="toggleButton">{{ props.buttonName }}</el-button>
  </el-form-item>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { ElSwitch } from "element-plus";


const props = defineProps({
  modelValue: Boolean, // Expecting a boolean modelValue
  label: String,
  prop: String,
  rules: Array,
  placeholder: String,
  disable: Boolean,
  buttonColor: String,
  buttonName : String,
});


const emit = defineEmits(["update:modelValue"]);
const internalValue = ref(props.modelValue); // Initialize internalValue as a boolean

const toggleButton = () => {
    internalValue.value = !internalValue.value
    emit("update:modelValue", internalValue.value); // 🔹 부모에게 값 업데이트 전달
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue;
    }
  }
);

const computedDisable = computed(() => props.disable);

const updateValue = () => {
  emit("update:modelValue", internalValue.value);
};

</script>

<script lang="ts">
export default {};
</script>

<style scoped>
.active-button {
  background-color: #409EFF !important; /* 눌린 상태의 색상 */
  color:black
}
</style>
