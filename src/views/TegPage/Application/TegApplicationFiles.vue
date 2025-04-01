<script lang="ts">
export default {};
</script>

<template>
  <el-table :data="props.applicationData.files">
    <el-table-column label="File Name" prop="name">
      <template #default="scope">
        {{ scope.row.name }}{{ scope.row.ext }}
      </template>
    </el-table-column>
    <el-table-column label="Action">
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="() => TegApplicationFileAction('download', scope.row, props.applicationData.files, emit)"
        >
          Download
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="() => TegApplicationFileAction('delete', scope.row, props.applicationData.files, emit)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-upload
    class="upload-demo"
    drag
    multiple
    :auto-upload="false"
    :show-file-list="true"
    :on-remove="handleFileRemove"
    :on-change="handleFileChange"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">CER 0 관련 파일을 선택하세요</div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { UploadProps } from "element-plus";
import { ref } from "vue";
import type {
  TegApplication as TegApplicationInterface,
  TestTypeOptions as TestTypeOptionsInterface,
  TegApplicationFile
} from "../Common/ApplicationTypes";
import { TegApplicationFileAction } from "../../../utils/teg/teg-files-utils";

// Define props to receive processData
const props = defineProps<{
  applicationData: TegApplicationInterface;
  applicationType: string;
  files: File[];
}>();

const emit = defineEmits<{
  (e: "update:files", value: TegApplicationFile[]): void;
}>();

const handleFileChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  // uploadFiles는 현재까지 선택된 모든 파일 배열
  const files = uploadFiles.map((f) => f.raw!).filter((f) => f !== undefined);
  emit("update:files", files);
};

const handleFileRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  const files = uploadFiles.map((f) => f.raw!).filter((f) => f !== undefined);
  emit("update:files", files);
};
</script>

<style></style>
