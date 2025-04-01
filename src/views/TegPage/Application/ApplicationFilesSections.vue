<script lang="ts">
export default {};
</script>
<template>
  <el-row :gutter="20">
    <!-- Reference 특성 업로드 -->
    <el-col :span="12">
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="handleMaskLayoutFileRemove"
        :on-change="handleReferenceFileChange"
        :show-file-list="true"
        :file-list="maskLayoutFileLIst"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          CER 0 Mask Layout <em>click to upload</em>
        </div>
      </el-upload>
      <!-- <div v-if="props.application.referenceFile" class="file-info">
          <p>파일명: {{ props.application.referenceFile.name }}</p>
          <p>파일 크기: {{ props.application.referenceFile.size }} bytes</p>
          <p>파일 타입: {{ props.application.referenceFile.type }}</p>
        </div> -->
    </el-col>

    <!-- EVB 조립 메뉴얼 업로드 -->
    <el-col :span="12">
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="handleCerTxtFileRemove"
        :on-change="handleEvbAssembleManualChange"
        :show-file-list="true"
        :file-list="cerTxtFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          CER 0 TXT File <em>click to upload</em>
        </div>
      </el-upload>
      <!-- <div v-if="props.application.evbAssembleManual" class="file-info">
          <p>파일명: {{ props.application.evbAssembleManual.name }}</p>
          <p>파일 크기: {{ props.application.evbAssembleManual.size }} bytes</p>
          <p>파일 타입: {{ props.application.evbAssembleManual.type }}</p>
        </div> -->
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import type {
  TegApplication as TegApplicationInterface,
  TestTypeOptions as TestTypeOptionsInterface,
} from "../Common/ApplicationTypes";
import { ref } from "vue";
import { UploadProps } from "element-plus";

const props = defineProps<{
  applicationData: TegApplicationInterface;
  applicationType: string;
}>();

const maskLayoutFileLIst = ref<{ name: string }[]>([]);
const cerTxtFileList = ref<{ name: string }[]>([]);

// Reference 파일 선택 핸들러
const handleReferenceFileChange: UploadProps["onChange"] = (file) => {
  // 기존 파일을 삭제하고 새로운 파일을 할당
  props.applicationData.maskLayoutFile = undefined;
  maskLayoutFileLIst.value = [];
  props.applicationData.maskLayoutFile = {
    name: file.name,
    size: file.size,
    type: file.raw.type,
    rawFile: file.raw,
  };
  maskLayoutFileLIst.value.push({ name: file.name });
};

// EVB 조립 메뉴얼 파일 선택 핸들러
const handleEvbAssembleManualChange: UploadProps["onChange"] = (file) => {
  props.applicationData.cerTxtFile = undefined;
  cerTxtFileList.value = [];
  props.applicationData.cerTxtFile = {
    name: file.name,
    size: file.size,
    type: file.raw.type,
    rawFile: file.raw,
  };
  cerTxtFileList.value.push({ name: file.name });
};

// Reference 파일 삭제 핸들러
const handleMaskLayoutFileRemove: UploadProps["onRemove"] = () => {
  props.applicationData.maskLayoutFile = undefined;
};

// EVB 조립 메뉴얼 파일 삭제 핸들러
const handleCerTxtFileRemove: UploadProps["onRemove"] = () => {
  props.applicationData.cerTxtFile = undefined;
};
</script>

<style></style>
