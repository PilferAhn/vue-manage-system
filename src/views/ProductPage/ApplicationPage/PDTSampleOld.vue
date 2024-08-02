<template>
    <div class="sample-row">
      <el-input
        v-model="sampleData.sampleNumber"
        placeholder="Sample Number"
        :key="index + '-sampleNumber'"
        class="input-field"
      ></el-input>
      <el-input
        v-model="sampleData.defaultFreq"
        placeholder="System Frequancy"
        :key="index + '-defaultFreq'"
        class="input-field"
        :disabled="true"
      ></el-input>
      <el-input
        v-model="sampleData.defaultFreq"
        placeholder="System Frequancy"
        :key="index + '-defaultFreq'"
        class="input-field"
        :disabled="sampleData.useDefaultFreq"
      ></el-input>
      <!-- <el-input-number
        v-model="sampleData.targetFreq"
        placeholder="Target Frequency"
        :key="index + '-targetFreq'"
        class="input-field"
      ></el-input-number> -->
      <el-switch
        v-model="sampleData.useDefaultFreq"
        :key="index + '-useDefaultFreq'"
        class="input-field"
      ></el-switch>
      <!-- <el-input-number
        v-model="sampleData.offset"
        placeholder="Offset"
        :key="index + '-offset'"
        class="input-field"
      ></el-input-number>
      <el-input
        v-model="sampleData.sParaFileName"
        placeholder="S-Parameter File Name"
        :key="index + '-sParaFileName'"
        class="input-field"
      ></el-input>
      <el-input
        v-model="sampleData.fileContent"
        placeholder="File Content"
        :key="index + '-fileContent'"
        class="input-field"
      ></el-input> -->
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch } from 'vue';
  import type { SampleInformation } from './Application'; // Import the interface
  
  const props = defineProps({
    modelValue: Object as () => SampleInformation,
    index: Number
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const sampleData = ref({ ...props.modelValue });


  watch(sampleData, (newVal) => {
    emit('update:modelValue', newVal);
  }, { deep: true });
  </script>
  

  <style scoped>
.sample-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-field {
  flex: 1;
}
  </style>
  ./Application1