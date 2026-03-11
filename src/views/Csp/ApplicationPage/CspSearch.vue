<template>
  <div class="search-container">
    <!-- 검색 기준 선택 Dropdown -->
    <el-select v-model="searchType" class="search-select" size="large">
      <el-option label="Product Name" value="productName" />
      <el-option label="Requester" value="requester" />
    </el-select>

    <!-- 검색 입력 필드 -->
    <el-input
      v-model="searchQuery"
      class="search-input"
      :placeholder="getPlaceholder"
      size="large"
      clearable
      @keydown.enter.prevent="handleEnter"
    />
    <el-text class="mx-1" type="info">
      전체조회 ==> 공백 엔터
    </el-text>
    <!-- <CspActions ></CspActions> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";


const searchType = ref("productName"); // 기본 검색 기준
const searchQuery = ref("");

const emit = defineEmits(["updateSearchQuery"]);

// Placeholder 동적 변경
const getPlaceholder = computed(() => {
  return searchType.value === "productName"
    ? "제품명을 입력하세요"
    : "관리자를 입력하세요";
});

 
const handleEnter =() =>{
  emit("updateSearchQuery", {
    searchType: searchType.value,
    searchQuery: searchQuery.value,
  });
}

</script>

<script lang="ts">
export default {};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.search-select {
  width: 150px;
}

.search-input {
  width: 200px;
}
</style>
