<template>
    <div>
      <el-form-item label="Wafer 수량">
        <el-select v-model="waferQuantity" placeholder="Select a number">
          <el-option
            v-for="i in 30"
            :key="i"
            :label="String(i)"
            :value="i"
          ></el-option>
        </el-select>
      </el-form-item>
  
      <!-- Dynamic input fields for Wafer IDs based on selected quantity -->
      <el-row v-for="rowIndex in Math.ceil(parseInt(waferQuantity) / 2)" :key="rowIndex">
        <el-col :span="10" v-for="index in getIndices(rowIndex)" :key="index">
          <el-form-item>
            <el-input
              v-model="waferNames[index - 1]"
              placeholder="Enter Wafer ID"
              @input="updateWaferData"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </template>

<script setup>
import { ref, watch } from "vue";
import { defineEmits } from "vue";
// Defines the types of events this component might emit
const emit = defineEmits(['updateWaferData']);

// Reactive references for wafer quantity and names
const waferQuantity = ref(1);
const waferNames = ref([]);

// Watch the wafer quantity and adjust the wafer names array accordingly
watch(waferQuantity, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    waferNames.value = waferNames.value.slice(0, newValue);
    for (let i = waferNames.value.length; i < newValue; i++) {
      waferNames.value.push('');  // Initialize new entries with empty string
    }
  }
  updateWaferData();  // Emit an event whenever the quantity changes
}, { immediate: true });

// Watch the wafer names for changes to emit an update event
watch(waferNames, () => {
  updateWaferData();  // Emit an event whenever the wafer names change
}, { deep: true });

// Function to emit an update event with current wafer data
function updateWaferData() {
  emit('updateWaferData', {
    quantity: waferQuantity.value,
    ids: waferNames.value.filter(name => name.trim() !== '')  // Exclude empty strings
  });
}

// Helper function to calculate indices for each row
function getIndices(rowIndex) {
  const start = 2 * rowIndex - 2;
  const end = start + 2;
  return Array.from({ length: Math.min(end, parseInt(waferQuantity.value)) - start }, (_, i) => start + i + 1);
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>
