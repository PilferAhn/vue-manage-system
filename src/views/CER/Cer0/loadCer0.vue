<template>
  <div class="container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card">
      <el-tab-pane label="의뢰서" name="request">
        <!-- 의뢰서 탭 콘텐츠 -->
        <div v-if="activeTab === 'request'">
          <loadCer0Form></loadCer0Form>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="Files" name="files">
        <!-- Files 탭 콘텐츠 -->
        <div v-if="activeTab === 'files'">
          <loadCer0Files :id = "uuid"></loadCer0Files>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import loadCer0Form from './loadCer0Form.vue';
import loadCer0Files from './loadCer0Files.vue';

// 현재 라우트 객체를 가져옵니다.
const route = useRoute();

// UUID 추출 및 반응형 관리
const uuid = ref(route.params.id);

// 현재 탭을 localStorage에서 불러오거나 기본값을 request로 설정
const activeTab = ref(localStorage.getItem('activeTab') || 'request');

// 탭 클릭 시 호출되는 함수
function handleTabClick(tab: any) {
  activeTab.value = tab.name;
  localStorage.setItem('activeTab', tab.name); // 현재 탭 상태를 localStorage에 저장
  
  if (tab.name === 'files') {
    loadFiles();
  }
}

// 의뢰서 탭 관련 기능
function loadRequestDetails() {  
  // 의뢰서 관련 데이터 로드 또는 기능 호출
}

// Files 탭 관련 기능
function loadFiles() {
  console.log('Files tab activated. Loading files for UUID:', uuid.value);
  // Files 관련 데이터 로드 또는 기능 호출
}

// applicationUuid 변경 감지 및 초기화
watch(() => route.params.applicationUuid, (newUuid) => {
  uuid.value = newUuid;
  console.log('Application UUID changed:', newUuid);

  // applicationUuid가 변경되면 request 탭으로 이동
  activeTab.value = 'request';
  localStorage.setItem('activeTab', 'request');
  loadRequestDetails();
});

// 초기 로드시 의뢰서 데이터 로드
loadRequestDetails();
</script>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
