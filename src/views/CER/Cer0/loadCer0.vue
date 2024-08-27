<template>
  <div class="container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card">
      <el-tab-pane label="의뢰서" name="request">
        <!-- 의뢰서 탭 콘텐츠 -->
        <div v-if="activeTab === 'request'">
          <load_cer0_form
          :id = "uuid"></load_cer0_form>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="Files" name="files">
        <div v-if="activeTab === 'files'">
          <load_cer0_files :id="uuid"></load_cer0_files>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import load_cer0_form from './loadCer0Form.vue';
import load_cer0_files from './loadCer0Files.vue'

// 현재 라우트 객체를 가져옵니다.
const route = useRoute();

// UUID 추출 및 반응형 관리
const uuid = ref(route.params.id);

// 현재 탭을 'request'로 기본 설정
const activeTab = ref('request');

// 탭 클릭 시 호출되는 함수
function handleTabClick(tab: any) {
  activeTab.value = tab.name;
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

watch(
  () => route.params.id,
  async (newUuid) => {
    uuid.value = newUuid; // id 값을 직접 업데이트
    
  },
  { immediate: true }
);


// applicationUuid 변경 감지 및 초기화
watch(() => route.params.applicationUuid, (newUuid) => {  
  loadRequestDetails();
});

// 초기 로드시 의뢰서 데이터 로드
loadRequestDetails();
</script>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
