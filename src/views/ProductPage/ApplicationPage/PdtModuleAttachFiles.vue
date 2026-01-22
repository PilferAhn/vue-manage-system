<!-- PdtModuleAttachFiles.vue -->
<script lang="ts">
export default {};
</script>

<template>
  <div>
    <el-divider content-position="center">PDT Module 첨부파일</el-divider>

    <el-row :gutter="20" style="margin-top: 8px">
      <el-col :span="24">
        <!-- 서버에 저장된 파일 보여주는 테이블이 PDT용이면 PDT용 FileTable로 -->
        <file-table
          :app-file="props.form.pdtModule?.rffeFileList"
          file_type="pdt_module_rffe"
        />

        <el-upload
          drag
          :auto-upload="false"
          :multiple="true"
          :on-remove="handleRffeRemove"
          :on-change="(file, fileList) => handleRffeChange(file, fileList)"
          :show-file-list="true"
          :file-list="props.files.pdtModuleRffeFileList"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text"><em>RFFE 파일 선택 (PDT Module)</em></div>
        </el-upload>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 16px">
      <el-col :span="24">
        <file-table
          :app-file="props.form.pdtModule?.configFileList"
          file_type="pdt_module_config"
        />

        <el-upload
          drag
          :auto-upload="false"
          :multiple="true"
          :on-remove="handleConfigRemove"
          :on-change="(file, fileList) => handleConfigChange(file, fileList)"
          :show-file-list="true"
          :file-list="props.files.pdtModuleConfigFileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text"><em>Config 파일 선택 (PDT Module)</em></div>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { UploadProps, UploadFile } from "element-plus";
import FileTable from "../../Modules/Application/FileTable.vue";
import type { PDTRequestFormType } from "./Application.ts";
import type { PdtFiles } from "./Application.ts";

const props = defineProps<{
  form: PDTRequestFormType;
  files: PdtFiles;
}>();

const handleRffeChange: UploadProps["onChange"] = (
  file: UploadFile,
  fileList: UploadFile[]
) => {
  props.files.pdtModuleRffeFileList = [...fileList];
};
const handleRffeRemove: UploadProps["onRemove"] = () => {
  props.files.pdtModuleRffeFileList = [];
};

const handleConfigChange: UploadProps["onChange"] = (
  file: UploadFile,
  fileList: UploadFile[]
) => {
  props.files.pdtModuleConfigFileList = [...fileList];
};
const handleConfigRemove: UploadProps["onRemove"] = () => {
  props.files.pdtModuleConfigFileList = [];
};
</script>

<style>
.el-upload__text {
  border: 1px dashed #409eff;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
}
</style>
