<script lang="ts">
export default {};
</script>
<!-- components/SearchBar.vue -->
<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'search', type: 'userId' | 'userName', keyword: string): void;
}>();

const searchType = ref<'userId' | 'userName'>('userId');
const keyword = ref('');

const handleSearch = () => {
  emit('search', searchType.value, keyword.value.trim());
};
</script>

<template>
  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px;">
    <el-select v-model="searchType" placeholder="검색 기준" style="width: 150px;">      
      <el-option label="사용자명" value="userName" />
      <el-option label="사용자 ID" value="userId" />
    </el-select>

    <el-input
      v-model="keyword"
      placeholder="검색어를 입력하세요"
      clearable
      @keyup.enter="handleSearch"
      style="width: 240px;"
    />

    <el-button type="primary" @click="handleSearch">검색</el-button>
  </div>
</template>
