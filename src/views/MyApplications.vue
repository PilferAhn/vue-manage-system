<template>
  <div class="container">
    <el-tabs v-model="activeTabMain" type="border-card" class="demo-tabs">
      <el-tab-pane label="PDT" name="main1">
        <template v-if="activeTabMain === 'main1'">
          <MyProductApplicationList></MyProductApplicationList>
        </template>
      </el-tab-pane>
      <el-tab-pane label="TEG" name="main2">
        <template v-if="activeTabMain === 'main2'">
          <!-- 여기에 main2가 활성화 될 때 렌더링할 컴포넌트 또는 코드를 추가 -->
          <MyTegApplicationList
          :category="'reserved'"
          :page-size="10"
          ></MyTegApplicationList>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import MyProductApplicationList from "./ProductPage/ApplicationPage/MyProductApplicationList.vue";
import MyTegApplicationList from "./TegPage/Application/MyTegApplicationList.vue"
// 탭 상태를 로컬 스토리지에서 불러오거나 기본값 설정
const activeTabMain = ref(localStorage.getItem("activeTabMain") || "main1");

// 탭 상태가 변경될 때마다 로컬 스토리지에 저장
watch(activeTabMain, (newValue) => {
  localStorage.setItem("activeTabMain", newValue);
});
</script>
