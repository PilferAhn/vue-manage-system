<template>
  <div class="request-list-container">
    <el-tabs type="border-card" class="demo-tabs" v-model="activeTabName">
      <el-tab-pane label="측정 진행중" name="reserved">
        <!-- MAX FUSE 탭 내용 -->
        <template v-if="activeTabName === 'reserved'">
          <ApplicationByStatus :status="'reserved'"> </ApplicationByStatus>
        </template>
      </el-tab-pane>

      <el-tab-pane label="예약 대기" name="created">
        <!-- MAX FUSE 탭 내용 -->
        <template v-if="activeTabName === 'created'">
          <ApplicationByStatus :status="'created'"> </ApplicationByStatus>
        </template>
      </el-tab-pane>

      <el-tab-pane label="측정 완료" name="finished">
        <!-- MAX FUSE 탭 내용 -->
        <template v-if="activeTabName === 'finished'">
          <ApplicationByStatus :status="'finished'"> </ApplicationByStatus>
        </template>
      </el-tab-pane>

      <!-- 여기에 다른 탭들을 추가할 수 있습니다. -->
    </el-tabs>
    <!-- <ApplicationByStatus :status="'created'"> </ApplicationByStatus>
    <ApplicationByStatus :status="'finished'"> </ApplicationByStatus> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import ApplicationByStatus from "./ApplicationByStatus.vue";

const activeTabName = ref("reserved");

onMounted(() => {
  const reloadOnBack = () => {
    window.location.reload();
  };

  window.addEventListener("popstate", reloadOnBack);

  // 페이지를 벗어날 때 이벤트 리스너 제거
  onUnmounted(() => {
    window.removeEventListener("popstate", reloadOnBack);
  });
});
</script>

<style>
/* 리스트 간의 간격과 스타일링을 위한 CSS */
.request-list-container {
  display: flex;
  flex-direction: column;
  gap: 40px; /* 각 RequestList 사이에 20px의 간격을 추가 */
}

.list-spacing {
  margin-bottom: 20px; /* 필요에 따라 조정 */
}
</style>
