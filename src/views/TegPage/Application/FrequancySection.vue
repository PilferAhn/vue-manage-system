<template>
  <div class="frequency-settings">
    <el-form-item label="Section Count">
      <el-input-number
        v-model="numberSelected"
        :min="1"
        :max="6"
      ></el-input-number>
    </el-form-item>
    <el-table :data="generatedFreqSections" style="width: 100%">
      <el-table-column prop="start" label="Start" width="150">
        <template #default="{ row }">
          <el-input v-model="row.start" placeholder="Start" />
        </template>
      </el-table-column>
      <el-table-column prop="stop" label="stop" width="150">
        <template #default="{ row }">
          <el-input v-model="row.stop" placeholder="Stop" />
        </template>
      </el-table-column>
      <el-table-column prop="point" label="Point" width="150">
        <template #default="{ row }">
          <el-input v-model="row.point" placeholder="Point" />
        </template>
      </el-table-column>
      <el-table-column prop="ifbw" label="IFBW" width="150">
        <template #default="{ row }">          
          <el-input v-model="row.ifbw" placeholder="IFBW" disabled/>
        </template>
      </el-table-column>
      <!-- Other columns similarly... -->
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, watch, defineEmits } from 'vue';

const emit = defineEmits(['updateFreqInfo']);
const props = defineProps({
  info: Object,
  index: Number
});

const numberSelected = ref(3); // Default section count
// Use reactive to ensure each object in the array is reactive
const generatedFreqSections = reactive(Array.from({ length: numberSelected.value }, () => ({
  start: "",
  stop: "",
  point: "",
  ifbw: "10"
})));

watch(numberSelected, (newValue) => {
  for (let i = 0; i < newValue; i++) {
    if (!generatedFreqSections[i]) {
      generatedFreqSections[i] = { start: "", stop: "", point: "", ifbw: "10" };
    }
  }
  generatedFreqSections.length = newValue; // Adjust the length of the array
  emit('updateFreqInfo', generatedFreqSections, props.index);
}, { immediate: true });

// Watch the generatedFreqSections array for deep changes
watch(() => generatedFreqSections.map(section => ({...section})), (newSections) => {
  props.info.freqSectionInfo = newSections;
  emit('updateFreqInfo', newSections, props.index);
}, { deep: true });
</script>


<style scoped>
/* CSS 생략 */
</style>
