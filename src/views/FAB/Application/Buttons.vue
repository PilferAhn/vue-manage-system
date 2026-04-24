<template>
  <div class="form-container">
    <section class="form-section">
      <!-- Submit Section -->
      <!-- endTime = 2025-01-02 -->
      <div class="button-container">
        <el-form-item v-if="props.applicationType === 'create'">
          <el-button

            type="primary"
            class="action-button"
            @click="submitForm('submit')"
          >
            제출
          </el-button>
        </el-form-item>
                
        <el-form-item v-else-if="props.applicationType === 'load'">
          <el-button
          :disabled="!excludeList.includes(getUserId())"
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
          >
            재투입
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
import { sendingForm, ValChkBeforeSending } from "../../../utils/Fab/fab-application-utils";
import { getUserId } from "../../../utils/account-utils";
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCurrentWeekNumber } from "../../../utils/date-utils";
import { sendPostRequest } from "../../../utils/httpProtocol";
import { uploadPackageEvidence } from "../../../utils/Fab/fab-application-utils";

const props = defineProps<{
  fabApplication: FabRequestForm;
  fabFormRef: FormInstance | null;
  applicationType: string;
  packageEvidenceFile?: File | null;
  refreshPackageEvidence?: () => void;
}>();

const emit = defineEmits<{
  (e: "update:fabApplication", value: FabRequestForm): void;
  (e: "clear-package-evidence-file"): void;
}>();

const excludeList = ["admin", "w220112", "w2180511", "w223051", "w2220606", "w2150305"]; 

// Submit 함수
const submitForm = async (type: string) => {
  const isValid = await props.fabFormRef?.validate();
    if (!isValid) {
      console.error("폼 유효성 검사 실패: 필수 항목을 확인해주세요.");
      return;
    }
    const resultApplication = await ValChkBeforeSending(props.fabApplication, type)
    if (!resultApplication) return;

    //1) 의뢰서 생성/업데이트
    const savedApp = await sendingForm(resultApplication, type);
    if (!savedApp) return;

    emit("update:fabApplication", savedApp as any);

    //2) create + 사진 선택되어 있으면 업로드까지 이어서 처리
    if (type === "submit" && props.packageEvidenceFile) {
      const productName =
        (savedApp as any).productName || resultApplication.productName;
        if (!productName) {
          ElMessage.error("productName이 없어서 evidence 업로드를 할 수 없습니다.");
          return;
        }
        
        try {      
      await uploadPackageEvidence(productName, props.packageEvidenceFile);
      props.refreshPackageEvidence?.();
      //부모가 들고 있는 file ref 비우기
      emit("clear-package-evidence-file");

      ElMessage.success("의뢰서 제출 + Package Evidence 업로드 완료!");
    } catch (e: any) {
      console.error(e);
      ElMessage.error(e?.response?.data?.detail ?? "Evidence 업로드 실패");
    }
  }
};




const resetForm = async () => {
  try {
    await ElMessageBox.confirm(
      '...', // 제목 또는 간단한 안내
      '알림',
      {
        confirmButtonText: '예',
        cancelButtonText: '아니오',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        message: `
          <div style="line-height: 1.6;">
            <p><strong>해당 의뢰서를 초기화하여 재사용합니다.</strong></p>
            <p>투입일, 수량 등의 항목을 수정한 후 <strong>업데이트 버튼</strong>을 눌러 저장해주세요.</p>
            <p style="margin-top: 1em;">의뢰서를 재사용하시겠습니까?</p>
          </div>
        `
      }
    );

    props.fabApplication.wantedFabStartDate = null
    props.fabApplication.wantedFabFinishDate = null
    props.fabApplication.quantity = 0

    const currentWeekNum = getCurrentWeekNumber()
    props.fabApplication.weekNumber = currentWeekNum
    props.fabApplication.isPending = false
      
    console.log('재투입 실행');
    // 재투입 처리 로직

  } catch {
    console.log('재투입 취소');
  }
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
