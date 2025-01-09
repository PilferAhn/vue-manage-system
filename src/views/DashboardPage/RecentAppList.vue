<template>
  <div class="application-header">
    <h2 class="title">바로가기</h2>
    <div class="button-group">
      <!-- <el-button size="small" type="primary" @click="writeApplicationForm">
        의뢰서 작성
      </el-button> -->
      <el-button size="small" type="success" @click="viewMyApplicationForm">
        작성된 의뢰 항목
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const writeApplicationForm = () => {
  router.push({ name: "PDTApplication" });
};

const viewMyApplicationForm = () => {
  router.push({ name: "MyApplications" });
};
</script>

<style scoped>
.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 10px;
}

.el-button {
  font-size: 14px;
}
</style>
