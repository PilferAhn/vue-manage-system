<template>
  <div style="height: 300px; width: 100%; margin: auto">
    <el-table
      :data="data"
      style="width: 100%"
      :row-style="{ paddingBottom: '10px' }"
    >
      <el-table-column
        v-for="columnIndex in 9"
        :key="`column-${columnIndex}`"
        :label="'　'"
      >
        <template #default="{ row, $index }">
          <el-button
            :class="{
              'button-disabled': isDisabled($index + 1, columnIndex),
              'button-active': row.status[columnIndex - 1],
              'button-inactive': !row.status[columnIndex - 1],
            }"
            @click="toggleStatus($index, columnIndex - 1)"
            :disabled="isDisabled($index + 1, columnIndex)"
            style="width: 66.67%; height: 120%; border-radius: 0"
          >
            {{ columnIndex }},{{ $index + 1 }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const data = ref([...Array(9)].map(() => ({ status: Array(9).fill(false) })));
const selectedPositions = ref([]);

const emit = defineEmits(['updateSelected']);

function isDisabled(rowIndex, columnIndex) {
  // Define your disabled logic here
  return false;
}

function toggleStatus(rowIndex, columnIndex) {
  data.value[rowIndex].status[columnIndex] = !data.value[rowIndex].status[columnIndex];
  if (data.value[rowIndex].status[columnIndex]) {
    selectedPositions.value.push([columnIndex + 1, rowIndex + 1]);
  } else {
    const index = selectedPositions.value.findIndex(pos => pos[0] === columnIndex + 1 && pos[1] === rowIndex + 1);
    selectedPositions.value.splice(index, 1);
  }
  emit('updateSelected', selectedPositions.value);
}
</script>
