<template>
  <div class="container">
    <!-- <h2 class="calendar-title">내전력 & 출하 담당자</h2> -->
    <el-calendar v-model="value">
      <template #date-cell="{ data }">
        <div>{{ data.date.getDate() }}</div>
        <div class="notes-container" v-if="operators[formatDate(data.date)]">
          <div
            class="notes"
            v-for="(note, index) in operators[formatDate(data.date)]"
            :key="index"
          >
            <span :class="note.status === 1 ? 'text-success' : 'text-danger'"
              >●</span
            >
            <div class="note-title">{{ note.title }}</div>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {operators} from "./Calender"
const value = ref(new Date());

// Utility function to format date
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


</script>

<style scoped>
.calendar-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.notes-container {
  height: 60px;
  overflow-y: auto;
}

.notes-container::-webkit-scrollbar {
  width: 0;
}

.notes {
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 12px;
}

.notes:hover {
  background-color: #eee;
}

.note-title {
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.notes span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.text-success {
  background-color: #5cb85c;
}

.text-danger {
  background-color: #d9534f;
}
</style>
