<template>
  <div class="container">
    <!-- <h2 class="calendar-title">내전력 & 출하 담당자</h2> -->
    <el-calendar v-model="value">
      <template #date-cell="{ data }">
        <div>{{ data.date.getDate() }}</div>
        <div class="notes-container" v-if="notes[formatDate(data.date)]">
          <div
            class="notes"
            v-for="(note, index) in notes[formatDate(data.date)]"
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

const value = ref(new Date());

// Utility function to format date
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const notes: Record<string, { title: string; status: number }[]> = {
  "2025-01-10": [
    { title: "김동현", status: 1 },
    { title: "이동민", status: 1 },
  ],
  "2025-01-13": [
    { title: "주희선", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-01-14": [
    { title: "주희선", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-01-15": [
    { title: "주희선", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-01-16": [
    { title: "주희선", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-01-17": [
    { title: "주희선", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-01-20": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-01-21": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-01-22": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-01-23": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-01-24": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-02-03": [
    { title: "이주희", status: 1 },
    { title: "박범수", status: 1 },
    { title: "이동민", status: 1 },
  ],
  "2025-02-04": [
    { title: "이주희", status: 1 },
    { title: "박범수", status: 1 },
    { title: "이동민", status: 1 },
  ],
  "2025-02-05": [
    { title: "이주희", status: 1 },
    { title: "박범수", status: 1 },
    { title: "이동민", status: 1 },
  ],
  "2025-02-06": [
    { title: "이주희", status: 1 },
    { title: "박범수", status: 1 },
    { title: "이동민", status: 1 },
  ],
  "2025-02-07": [
    { title: "이주희", status: 1 },
    { title: "박범수", status: 1 },
    { title: "이동민", status: 1 },
  ],
  "2025-02-10": [
    { title: "고현승", status: 1 },
    { title: "김도현", status: 1 },
    { title: "주희선", status: 1 },
  ],
  "2025-02-11": [
    { title: "고현승", status: 1 },
    { title: "김도현", status: 1 },
    { title: "주희선", status: 1 },
  ],
  "2025-02-12": [
    { title: "고현승", status: 1 },
    { title: "김도현", status: 1 },
    { title: "주희선", status: 1 },
  ],
  "2025-02-13": [
    { title: "고현승", status: 1 },
    { title: "김도현", status: 1 },
    { title: "주희선", status: 1 },
  ],
  "2025-02-14": [
    { title: "고현승", status: 1 },
    { title: "김도현", status: 1 },
    { title: "주희선", status: 1 },
  ],
  "2025-02-17": [
    { title: "이주희", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-02-18": [
    { title: "이주희", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-02-19": [
    { title: "이주희", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-02-20": [
    { title: "이주희", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-02-21": [
    { title: "이주희", status: 1 },
    { title: "김수윤", status: 1 },
    { title: "채하람", status: 1 },
  ],
  "2025-02-24": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-02-25": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-02-26": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-02-27": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
  "2025-02-28": [
    { title: "임승희", status: 1 },
    { title: "박소연", status: 1 },
    { title: "엄정은", status: 1 },
  ],
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
