<script lang="ts" setup>
import { PropType } from 'vue';

// Props로 다이얼로그 상태와 데이터를 받음
const props = defineProps<{
  visible: boolean;
}>();

// Emit 이벤트 정의
const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

// Emit을 사용하여 다이얼로그 상태 변경
function closeDialog() {
  emit('update:visible', false);
}

const gridData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
]

</script>

<template>
  <el-dialog v-model="visible" title="Shipping address" width="800">
    <el-table :data="gridData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
    <template #footer>
      <el-button @click="closeDialog">Close</el-button>
    </template>
  </el-dialog>
</template>
