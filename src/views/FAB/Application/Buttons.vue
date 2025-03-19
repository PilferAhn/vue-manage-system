<template>
  <div class="form-container">
    <section class="form-section">
      <!-- Submit Section -->
      <div class="button-container">
        <el-form-item v-if="props.applicationType === 'create'">
          <el-button
            :disabled="!['admin', 'w2150108'].includes(getUserId())"
            type="primary"
            class="action-button"
            @click="submitForm('submit')"
          >
            제출
          </el-button>
        </el-form-item>
        <el-form-item v-else-if="props.applicationType === 'load'">
          <el-button
            :disabled="!['admin', 'w2150108'].includes(getUserId())"
            type="primary"
            class="action-button"
            @click="submitForm('update')"
          >
            업데이트
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            class="action-button"
            @click="resetForm"
            disabled
          >
            초기화
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            class="action-button"
            @click="cancelForm"
            disabled
          >
            삭제
          </el-button>
        </el-form-item>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { FabRequestForm } from "../../../interface/fab-application-rev2";
import type { FormInstance } from "element-plus";
import { sendingForm } from "../../../utils/Fab/fab-application-utils";
import { getUserId } from "../../../utils/account-utils";
const props = defineProps<{
  fabApplication: FabRequestForm;
  fabFormRef: FormInstance | null;
  applicationType: string;
}>();

// Submit 함수
const submitForm = (type: string) => {
  props.fabFormRef?.validate((valid) => {
    if (valid) {
      sendingForm(props.fabApplication, type);
      console.log(props.fabApplication);
    } else {
      console.error("폼 유효성 검사 실패: 필수 항목을 확인해주세요.");
    }
  });
};

// Reset 함수
const resetForm = () => {
  props.fabFormRef?.resetFields();
  console.log("폼 리셋 완료");
};

// Cancel 함수
const cancelForm = () => {
  console.log("폼 취소");
};
</script>
<script lang="ts">
export default {};
</script>

<style scoped>
/* 전체 폼 컨테이너 */
.form-container {
  max-width: 765px;
  display: flex;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

/* 폼 섹션 */
.form-section {
  margin-bottom: 1px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1px;
  text-align: center;
}

.form-description {
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin-bottom: 1px;
}

/* 버튼 컨테이너 */
.button-container {
  display: flex;
  justify-content: flex-end; /* 버튼 우측 정렬 */
  gap: 12px;
  margin-top: 1px;
}

/* 버튼 스타일 */
.action-button {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.action-button[type="primary"] {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.action-button[type="primary"]:hover {
  background-color: #0056b3;
}

.action-button[type="warning"] {
  background-color: #ffc107;
  color: #212529;
}

.action-button[type="danger"] {
  background-color: #dc3545;
  color: #fff;
}

.action-button[type="danger"]:hover {
  background-color: #c82333;
}
</style>
