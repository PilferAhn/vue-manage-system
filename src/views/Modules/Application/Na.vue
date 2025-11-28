<script lang="ts">
export default {};
</script>
<template>
  <div class="container" v-if="props.application.isNa && props.application.naApp">
    <el-divider content-position="center">측정 정보 (NA)</el-divider>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="NA 선택">
          <el-select v-model="props.application.naApp.na">
            <el-option :value="'keysight'" label="Keysight"></el-option>
            <el-option :value="'rohde'" label="Rohde"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="De-embedding 방식">
          <el-select v-model="props.application.naApp.deMethod">
            <el-option
              :value="'Port Extension'"
              label="Port Extension"
            ></el-option>
            <el-option :value="'De-Embedding'" label="De-Embedding"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Port Extension Loss">
          <el-select
            v-model="props.application.naApp.portExtensionLoss"
            :disabled="props.application.naApp.deMethod === 'De-Embedding'"
          >
            <el-option :value="true" label="ON"></el-option>
            <el-option :value="false" label="OFF"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="측정 방식">
          <el-select v-model="props.application.naApp.measMethod">
            <el-option :value="'jig'" label="JIG"></el-option>
            <el-option :value="'solder'" label="SOLDER"></el-option>
            <el-option :value="'solderWithTuning'" label="SOLDER + Tunning"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="SPARA 형식">
          <el-select v-model="props.application.naApp.sParaType">
            <el-option
              :value="'false'"
              label="Ideal Matching 미포함"
            ></el-option>
            <el-option :value="'true'" label="Ideal Matching 포함"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
       <long-input-text-2
        v-model="props.application.naApp.note"
        label="NA 특이사항"
        prop="note"
        placeholder=""
        row-cnt="3"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="props.application.naApp?.deMethod === 'De-Embedding'">
      <el-col :span="24">
        <file-table
          :app-file="props.application.naApp.s2pFile"
          file_type="s2p"
        ></file-table>

        <el-upload
          drag
          :auto-upload="false"
          :multiple="false"
          :on-remove="handleS2pFileRemove"
          :on-change="handleS2pFileChange"
          :show-file-list="true"
          :file-list="props.fileObjList.s2pFileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            <em>De-embedding 파일 선택</em>
          </div>
        </el-upload>
      </el-col>
    </el-row>
    <file-table :app-file="props.application.naApp?.stateFile" file_type="state"></file-table>
    <el-upload
      drag
      :auto-upload="false"
      :multiple="true"
      :on-remove="handleStateFileRemove"
      :on-change= "(file, fileList) => handleStateFileChange(file, fileList)"
      :show-file-list="true"
      :file-list="props.fileObjList.stateFileList"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"><em>State File 선택</em></div>
    </el-upload>
  
    <el-row :gutter="20" style="margin-top: 16px">
      <el-col :span="24">
        <file-table
          :app-file="props.application.naApp?.naRffeFile"
          file_type="na_rffe"
        ></file-table>
      
        <el-upload
          drag
          :auto-upload="false"
          :multiple="true"
          :on-remove="handleNaRffeFileRemove"
          :on-change="(file, fileList) => handleNaRffeFileChange(file ,fileList)"
          :show-file-list="true"
          :file-list="props.fileObjList.naRffeFileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text"><em>RFFE 파일 선택 (NA)</em></div>
        </el-upload>
      </el-col>
    </el-row>

    <el-col :span="24">
      <file-table
        :app-file="props.application.naApp.naConfigFile"
        file_type="na_config"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="true"
        :on-remove="handleConfigFileRemove"
        :on-change="
          (file, fileList) => handleConfigFileChange(file, fileList)
        "
        :show-file-list="true"
        :file-list="props.fileObjList.naConfigFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          <em>Config 파일 선택</em>
        </div>
      </el-upload>
    </el-col>
    <el-col :span="24" v-if="props.application.naApp.na === 'rohde'">
      <file-table
        :app-file="props.application.xmlFile"
        file_type="xml"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="handleXmlFileRemove"
        :on-change="(file, fileList) => handleXmlFileChange(file, fileList)"
        :show-file-list="true"
        :file-list="props.fileObjList.xmlFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">XML File 파일 선택</div>
      </el-upload>
    </el-col>
     <el-col :span="24">
      <file-table
        :app-file="props.application.naApp?.naReferenceFile"
        file_type="na_reference"
      ></file-table>
      <el-upload
        drag
        :auto-upload="false"
        :multiple="false"
        :on-remove="handleReferenceFileRemove"
        :on-change="
          (file, fileList) => handleReferenceFileChange(file, fileList)
        "
        :show-file-list="true"
        :file-list="props.fileObjList.naReferenceFileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Reference 특성 파일 선택</div>
      </el-upload>
    </el-col>
    <file-table :app-file="props.application.naApp?.naSpecialFile" file_type="na_special"></file-table>
    <el-upload
      drag
      :auto-upload="false"
      :multiple="true"
      :on-remove="handleSpecialFileRemove"
      :on-change= "(file, fileList) => handleSpecialFileChange(file ,fileList)"
      :show-file-list="true"
      :file-list="props.fileObjList.naSpecialFileList"
    >
  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"><em>NA 이미지 파일 선택</em></div></el-upload>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import type { ModuleMeasurementApp, ModuleFiles } from "../../../interface/module_group/application/application";
import InputText from "../../Common/InputText.vue";
import LongInputText2 from "../../Common/LongInputText2.vue";
import { UploadProps } from "element-plus";
import * as appUtiles from "../../../utils/module_group/application-utils";
import FileTable from "./FileTable.vue";
import type { UploadFile } from "element-plus";

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList : ModuleFiles;
}>();

watch(
  () => props.application.isNa,
  (newVal) => {
    if (newVal) {
      if (!props.application.naApp) {
        props.application.naApp = appUtiles.initNa();
      }
    } else {
      props.application.naApp = null;
    }
  },
  { immediate: true }
);

const emit = defineEmits(['updatePortextensionLoss']);

watch(
  () => props.application.naApp?.deMethod,
  (newVal) => {
    if(newVal){
      props.application.naApp.portExtensionLoss = (newVal !== 'De-Embedding')
    }
  }
);

// S2P 파일 선택 핸들러
const handleS2pFileChange: UploadProps["onChange"] = (file) => {
  props.fileObjList.s2pFileList = [file];
};

// S2P 파일 파일 삭제 핸들러
const handleS2pFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.s2pFileList = [];
};

// State 파일 선택 핸들러
const handleStateFileChange = (
  file: UploadFile,
  filesList: UploadFile[]
) => {
  props.fileObjList.stateFileList = [...filesList]
};
// State 파일 삭제 핸들러
const handleStateFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.stateFileList = []
};

// NA RFFE 파일 선택 핸들러
const handleNaRffeFileChange: UploadProps["onChange"] = (file: UploadFile,
  filesList: UploadFile[]) => {
  props.fileObjList.naRffeFileList = [...filesList];
};
// NA RFFE 파일 삭제 핸들러
const handleNaRffeFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.naRffeFileList = [];
};

//Config 파일 선택 핸들러 
const handleConfigFileChange = (
  file: UploadFile,
  filesList: UploadFile[]
) => {
  props.fileObjList.naConfigFileList = [...filesList];
};
//Config 파일 삭제 핸들러
const handleConfigFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.naConfigFileList = []
};

// //XML 파일 선택 핸들러 
// const handleXmlFileChange = (
//   file: UploadFile,
//   filesList: UploadFile[]
// ) => {
//   props.fileObjList.xmlFileList = [...filesList];
// };
// //XML 파일 삭제 핸들러
// const handleXmlFileRemove: UploadProps["onRemove"] = () => {
//   props.fileObjList.xmlFileList = []
// };

//Reference 파일 선택 핸들러 
const handleReferenceFileChange = (
  file: UploadFile,
  filesList: UploadFile[]
) => {
  props.fileObjList.naReferenceFileList = [...filesList];
};
//Reference 파일 삭제 핸들러
const handleReferenceFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.naReferenceFileList = []
};

//특이사항 파일 선택 핸들러 
const handleSpecialFileChange = (
  file: UploadFile,
  filesList: UploadFile[]
) => {
  console.log("NA Special File Change:", filesList);
  props.fileObjList.naSpecialFileList = [...filesList];
};
//특이사항 파일 삭제 핸들러
const handleSpecialFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.naSpecialFileList = []
};
</script>


<style>
.el-upload__text {
  border: 1px dashed #409eff;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
}</style>
