<template>
    <div>
      <h2>Child Component</h2>
      <el-date-picker
        v-model="localDate"
        type="date"
        placeholder="Select a date"
        format="YYYY-MM-DD"
        @change="updateParent"
      />
      <p>Selected Date in Child: {{ formatDate(localDate) }}</p>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch } from 'vue';
  import dayjs from 'dayjs';
  
  // Props for v-model (string date)
  const props = defineProps<{ modelValue: string }>();
  
  // Emit event for v-model
  const emit = defineEmits(['update:modelValue']);
  
  // Local copy of the date for v-model
  const localDate = ref<string | null>(
    props.modelValue ? dayjs(props.modelValue, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') : null
  );
  
  // Watch for changes in props.modelValue and sync to localDate
  watch(
    () => props.modelValue,
    (newValue) => {
      localDate.value = newValue
        ? dayjs(newValue, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
        : null;
    }
  );
  
  // Function to format date as 'YYYY-MM-DD 00:00:00'
  const formatDate = (date: string | null): string =>
    date ? `${date} 00:00:00` : '';
  
  // Emit formatted date to parent
  const updateParent = () => {
    const formatted = formatDate(localDate.value);
    emit('update:modelValue', formatted);
  };
  </script>
  