<script lang="ts">
export default {};
</script>
<template>
  <div class="button-group">
    <button
      v-if="!['load'].includes(props.applicationType)"
      class="btn create"
      type="button"
      @click="handleButtons('create')"
    >
      생성
    </button>
    <button class="btn update" type="button" @click="handleButtons('update')">
      업데이트
    </button>
    <button class="btn delete" type="button" @click="handleButtons('delete')">
      삭제
    </button>
    <!-- <button class="btn clone">복제</button> -->
  </div>
</template>

<script lang="ts" setup>
import type {
  ModuleMeasurementApp,
  ModuleFiles,
} from "../../../interface/module_group/application/application";
import {
  checkFiles,
  submitApplication,
} from "../../../utils/module_group/application-utils";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList: ModuleFiles;
}>();

const handleButtons = async (buttonType: string) => {
  if (buttonType === "create" && props.application.id === null) {
    if (checkFiles(props.application, props.fileObjList)) {
      
      const respose = await submitApplication(
        props.application,
        props.fileObjList,
        buttonType
      );
      if (respose) {
        ElNotification({
          title: "성공",
          message: "✅ 의뢰서가 정상적으로 생성되었습니다.",
          type: "success",
          duration: 3000, // 3초 후 자동 닫힘
          position: "top-right",
        });

        // 1초 후 페이지 이동 (예: 리스트 페이지로)
        setTimeout(() => {
          router.push({ name: "ModuleApplicationList" }); // 라우트 이름에 맞게 수정
        }, 1000);
      }
    }
  } else if (buttonType === "create" && props.application.id !== null) {
    // do somethings for update
  } else if (buttonType === "update") {
    const respose = await submitApplication(
      props.application,
      props.fileObjList,
      buttonType
    );
    if (respose) {
      ElNotification({
        title: "성공",
        message: "✅ 의뢰서가 정상적으로 업데이트되었습니다.",
        type: "success",
        duration: 3000, // 3초 후 자동 닫힘
        position: "top-right",
      });
    }
  } else if (buttonType === "delete") {
    const respose = await submitApplication(
      props.application,
      props.fileObjList,
      buttonType
    );
    if (respose) {
      ElNotification({
        title: "성공",
        message: "✅ 의뢰서가 정상적으로 삭제되었습니다..",
        type: "success",
        duration: 3000, // 3초 후 자동 닫힘
        position: "top-right",
      });

      // 1초 후 페이지 이동 (예: 리스트 페이지로)
      setTimeout(() => {
        router.push({ name: "ModuleApplicationList" }); // 라우트 이름에 맞게 수정
      }, 1000);
    }
  }
};
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 0.5rem;
}

/* 공통 버튼 스타일 */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* 버튼 별 색상 */
.create {
  background-color: #4caf50; /* 초록 */
}

.update {
  background-color: #2196f3; /* 파랑 */
}

.delete {
  background-color: #f44336; /* 빨강 */
}

.clone {
  background-color: #9e9e9e; /* 회색 */
}
</style>
