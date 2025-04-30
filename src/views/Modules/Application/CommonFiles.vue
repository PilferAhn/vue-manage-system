<script lang="ts">
export default {};
</script>

<template>
  <el-row
    :gutter="20"
    style="
      background-color: #f1f1f1;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    "
  >
    <!-- Reference 특성 업로드 -->

    <el-col :span="12">
      <file-table
        :app-file="props.application.xmlFile"
        file_type="xml"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="(file, fileList) => handleFileRemove('xml')"
        :on-change="(file, fileList) => handleFileChnage('xml', file, fileList)"
        :show-file-list="true"
        :file-list="props.fileObjList.xmlFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">XML File 파일 선택</div>
      </el-upload>
    </el-col>

    <!-- EVB 조립 메뉴얼 업로드 -->
    <el-col :span="12">
      <file-table
        :app-file="props.application.configFile"
        file_type="config"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="true"
        :on-remove="(file, fileList) => handleFileRemove('config')"
        :on-change="
          (file, fileList) => handleFileChnage('config', file, fileList)
        "
        :show-file-list="true"
        :file-list="props.fileObjList.configFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          <em>Config 파일 선택</em>
        </div>
      </el-upload>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="
      background-color: #f1f1f1;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    "
  >
    <!-- Reference 특성 업로드 -->

    <el-col :span="12">
      <file-table
        :app-file="props.application.referenceFile"
        file_type="reference"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="(file, fileList) => handleFileRemove('reference')"
        :on-change="
          (file, fileList) => handleFileChnage('reference', file, fileList)
        "
        :show-file-list="true"
        :file-list="props.fileObjList.referenceFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Reference 특성 파일 선택</div>
      </el-upload>
    </el-col>

    <!-- EVB 조립 메뉴얼 업로드 -->
    <el-col :span="12">
      <file-table
        :app-file="props.application.evbAssembleManual"
        file_type="evb_assemble"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="(file, fileList) => handleFileRemove('evb_assemble')"
        :on-change="
          (file, fileList) => handleFileChnage('evb_assemble', file, fileList)
        "
        :show-file-list="true"
        :file-list="props.fileObjList.evbAssembleFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          <em>EVB 조립 메뉴얼 파일 선택</em>
        </div>
      </el-upload>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="
      background-color: #f1f1f1;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    "
  >
    <!-- Reference 특성 업로드 -->

    <el-col :span="12">
      <file-table
        :app-file="props.application.rffeFile"
        file_type="reference"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="(file, fileList) => handleFileRemove('rffe')"
        :on-change="
          (file, fileList) => handleFileChnage('rffe', file, fileList)
        "
        :show-file-list="true"
        :file-list="props.fileObjList.rffeFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">RFFE 파일 선택</div>
      </el-upload>
    </el-col>

    <!-- EVB 조립 메뉴얼 업로드 -->
    <el-col :span="12"> </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadProps } from "element-plus";
import type { UploadFile } from "element-plus";
import FileTable from "./FileTable.vue";
import type {
  ModuleMeasurementApp,
  ModuleFiles,
} from "../../../interface/module_group/application/application";

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList: ModuleFiles;
}>();

const handleFileChnage = (
  fileType: string,
  file: UploadFile,
  filesList: UploadFile[]
) => {
  if (fileType === "config") {
    props.fileObjList.configFileList = [...filesList];
  } else if (fileType === "reference") {
    props.fileObjList.referenceFileList = [file];
  } else if (fileType === "xml") {
    props.fileObjList.xmlFileList = [file];
  } else if (fileType === "evb_assemble") {
    props.fileObjList.evbAssembleFileList = [file];
  } else if (fileType === "rffe") {
    props.fileObjList.rffeFileList = [file];
  }
};

const handleFileRemove = (fileType: string) => {
  if (fileType === "config") {
    props.fileObjList.configFileList = [];
  } else if (fileType === "reference") {
    props.fileObjList.referenceFileList = [];
  } else if (fileType === "xml") {
    props.fileObjList.xmlFileList = [];
  } else if (fileType === "evb_assemble") {
    props.fileObjList.evbAssembleFileList = [];
  } else if (fileType === "rffe") {
    props.fileObjList.rffeFileList = [];
  }
};
</script>

<style scoped>
.el-upload__text {
  border: 1px dashed #409eff;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
}

.file-info {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #4d3636;
}
</style>
