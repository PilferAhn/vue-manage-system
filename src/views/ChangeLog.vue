<template>
  <!-- 변경 이력: 사이드바 맨 아래 "변경 이력" 에서 이동. 내용은 src/data/changelog.ts -->
  <div class="changelog">
    <div class="cl-head">
      <h2>변경 이력</h2>
      <span class="cl-sub">개선 요청사항은 언제든 환영합니다 🙂</span>
    </div>
    <el-card v-for="entry in CHANGELOG" :key="entry.date" shadow="never" class="cl-card">
      <template #header>
        <div class="cl-date">
          <span class="date">{{ entry.date }}</span>
          <span class="author">개발자 {{ entry.author }}</span>
          <span class="count">{{ entry.items.length }}건</span>
        </div>
      </template>
      <table class="cl-table">
        <tbody>
          <tr v-for="(item, i) in entry.items" :key="i">
            <td class="area"><el-tag size="small" effect="plain">{{ item.area }}</el-tag></td>
            <td class="text">{{ item.text }}</td>
          </tr>
        </tbody>
      </table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { CHANGELOG } from "../data/changelog";
</script>

<style scoped>
.changelog {
  max-width: 1200px;
}
.cl-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 4px 0 14px;
}
.cl-head h2 {
  margin: 0;
  font-size: 20px;
}
.cl-sub {
  color: #909399;
  font-size: 13px;
}
.cl-card {
  margin-bottom: 16px;
}
.cl-date {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.cl-date .date {
  font-size: 16px;
  font-weight: 700;
}
.cl-date .author,
.cl-date .count {
  font-size: 12px;
  color: #909399;
}
.cl-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.cl-table td {
  padding: 7px 8px;
  border-bottom: 1px solid #f0f2f5;
  vertical-align: top;
}
.cl-table td.area {
  width: 150px;
  white-space: nowrap;
}
.cl-table td.text {
  line-height: 1.6;
  color: #303133;
}
</style>
