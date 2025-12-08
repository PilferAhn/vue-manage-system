<template>
  <div class="container" v-if="props.application.isNf && props.application.nfApp">
    <el-divider content-position="center">측정 정보 (NF)</el-divider>
    <el-row :gutter="20">
      <!-- <el-col :span="12"> -->
        <!-- <el-form-item  
          v-if="props.application.nfApp" 
          label="De-embedding 방식"
        >
          <el-select v-model="props.application.nfApp.deMethod">
            <el-option :value="'Offset Value'" label="Offset Value"></el-option>
            <el-option :value="'Offset Table'" label="Offset Table"></el-option>
          </el-select>
        </el-form-item> -->
      <!-- </el-col> -->
      <el-col :span="12">
        <el-form-item label="Capture">
          <el-select v-model="props.application.nfApp.capture">
            <el-option :value="true" label="O"></el-option>
            <el-option :value="false" label="X"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="NF-Parameter (MDF) 전달">
          <el-select v-model="props.application.nfApp.nfParameterMdf">
            <el-option :value="true" label="O"></el-option>
            <el-option :value="false" label="X"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12"
        ><el-form-item label="Matching(Real)">
          <el-select v-model="props.application.nfApp.isRealMatching">
            <el-option :value="true" label="O"></el-option>
            <el-option :value="false" label="X"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12"> 
      <long-input-text-2
      v-if="props.application.nfApp"
      v-model="props.application.nfApp.note"
      label="NF 특이사항"
      prop="note"
      placeholder=""
      row-cnt="3"
    />
    </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 16px">
      <el-col :span="24">
        <file-table
          :app-file="props.application.nfApp?.nfRffeFile"
          file_type="nf_rffe"
        ></file-table>
      
        <el-upload
          drag
          :auto-upload="false"
          :multiple="true"
          :on-remove="handleNfRffeFileRemove"
          :on-change="(file, fileList) => handleNfRffeFileChange(file, fileList)"
          :show-file-list="true"
          :file-list="props.fileObjList.nfRffeFileList" 
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            <em>RFFE 파일 선택 (NF)</em>
          </div>
        </el-upload>
      </el-col>
     </el-row>

      <el-row :gutter="20" style="margin-top: 16px">
       <el-col :span="24">
        <file-table
          :app-file="props.application.nfApp?.nfConfigFile"
          file_type="nf_config"
        ></file-table>

        <el-upload
          drag
          :auto-upload="false"
          :multiple="true"
          :on-remove="handleNfConfigFileRemove"
          :on-change="(file, fileList) => handleNfConfigFileChange(file, fileList)"
          :show-file-list="true"
          :file-list="props.fileObjList.nfConfigFileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            <em>Config 파일 선택 (NF)</em>
          </div>
          </el-upload>
        </el-col>
      </el-row>
    <!-- <el-col :span="24" v-if="props.application.nfApp?.deMethod === 'Offset Table'">
    <file-table :app-file="props.application.nfApp.offsetFile" file_type="offset"></file-table>
    <el-upload
      drag
      :auto-upload="false"
      :multiple="false"
      :on-remove="handleOffsetFileRemove"
      :on-change="handleOffsetFileChange"
      :show-file-list="true"
      :file-list="props.fileObjList.offsetFileList"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"><em>Offset 테이블 파일 선택</em></div>
    </el-upload>  
    </el-col> -->
    <!-- <file-table :app-file="props.application.nfApp?.matchingFile" file_type="matching"></file-table>
    <el-upload
      v-if="props.application.nfApp?.isRealMatching"
      drag
      :auto-upload="false"
      :multiple="false"
      :on-remove="handleMatchingFileRemove"
      :on-change= "(file, fileList) => handleMatchingFileChange(file ,fileList)"
      :show-file-list="true"
      :file-list="props.fileObjList.matchingFileList"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"><em>Matching 특성 파일 선택</em></div>
    </el-upload> -->
    
    <el-row :gutter="20" style="margin-top: 16px">
      <el-col :span="24">
        <file-table
          :app-file="props.application.nfApp?.nfReferenceFile"
          file_type="nf_reference"
        ></file-table>
      
        <el-upload
          drag
          :auto-upload="false"
          :multiple="false"
          :on-remove="handleNfReferenceFileRemove"
          :on-change="(file, fileList) => handleNfReferenceFileChange(file, fileList)"
          :show-file-list="true"
          :file-list="props.fileObjList.nfReferenceFileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Reference 특성 파일 선택 (NF)</div>
        </el-upload>
      </el-col>
    </el-row>

     <file-table :app-file="props.application.nfApp?.nfSpecialFile" file_type="nf_special"></file-table>
    <el-upload
      drag
      :auto-upload="false"
      :multiple="true"
      :on-remove="handleSpecialFileRemove"
      :on-change= "(file, fileList) => handleSpecialFileChange(file ,fileList)"
      :show-file-list="true"
      :file-list="props.fileObjList.nfSpecialFileList"
    >
  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"><em>NF 이미지 File 선택</em></div></el-upload>
  </div>
</template>

<script lang="ts" setup>
import type {
  ModuleMeasurementApp,
  ModuleFiles,
} from "../../../interface/module_group/application/application";
import InputText from "../../Common/InputText.vue";
import LongInputText2 from "../../Common/LongInputText2.vue";
import { UploadProps } from "element-plus";
import * as appUtiles from "../../../utils/module_group/application-utils";
import FileTable from "./FileTable.vue";
import { ref, watch } from "vue";
import type { UploadFile } from "element-plus";

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList: ModuleFiles;
}>();

watch(
  () => props.application.isNf,
  (newVal) => {
    if (newVal) {
      if(!props.application.nfApp) {
        props.application.nfApp = appUtiles.initNf();
      }      
    } else{
      props.application.nfApp = null;
    }
  },
  { immediate: true }
);

// Reference 파일 선택 핸들러
const handleMatchingFileChange: UploadProps["onChange"] = (file: UploadFile, fileList: UploadFile[]) => {
  props.fileObjList.matchingFileList = [...fileList];
};

// EVB 조립 메뉴얼 파일 삭제 핸들러
const handleMatchingFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.matchingFileList = [];
};

// NF RFFE 파일 선택 핸들러
const handleNfRffeFileChange: UploadProps["onChange"] = (
  file: UploadFile,
  fileList: UploadFile[]
) => {
  props.fileObjList.nfRffeFileList = [...fileList];
};
// NF RFFE 파일 삭제 핸들러
const handleNfRffeFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.nfRffeFileList = [];
};

// CONFIG 파일 선택 핸들러
const handleNfConfigFileChange = (file: UploadFile, filesList: UploadFile[]) => {
  props.fileObjList.nfConfigFileList = [...filesList];
};
// CONFIG 파일 선택 핸들러
const handleNfConfigFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.nfConfigFileList = [];
};

// REFERENCE 파일 선택 핸들러
const handleNfReferenceFileChange = (file: UploadFile, filesList: UploadFile[]) => {
  props.fileObjList.nfReferenceFileList = [...filesList];
};
// REFERENCE 파일 선택 핸들러
const handleNfReferenceFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.nfReferenceFileList = [];
};

//특이사항 파일 선택 핸들러
const handleSpecialFileChange = (
  file: UploadFile,
  filesList: UploadFile[]
) => {
  props.fileObjList.nfSpecialFileList = [...filesList]
};

//특이사항 파일 삭제 핸들러
const handleSpecialFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.nfSpecialFileList = []
};
</script>

<script lang="ts">
export default {};
</script>

<style>
.el-upload__text {
  border: 1px dashed #409eff;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
}</style>
