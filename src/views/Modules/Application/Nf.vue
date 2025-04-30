<template>
  <div class="container" v-if="props.application.isNf">
    <el-divider content-position="center">측정 정보 (NF)</el-divider>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="De-embedding 방식">
          <el-select v-model="props.application.nfApp.deMethod">
            <el-option :value="'Offset Value'" label="Offset Value"></el-option>
            <el-option :value="'Offset Table'" label="Offset Table"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Capture">
          <el-select v-model="props.application.nfApp.capture">
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
      <el-col :span="12"> </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12"> </el-col>
      <el-col :span="12"> </el-col>
    </el-row>    
    <file-table :app-file="props.application.nfApp.matchingFile" file_type="matching"></file-table>
    <el-upload
      v-if="props.application.nfApp.isRealMatching"
      drag
      :auto-upload="false"
      :multiple="false"
      :on-remove="handleMatchingFileRemove"
      :on-change="handleMatchingFileChange"
      :show-file-list="true"
      :file-list="props.fileObjList.matchingFileList"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"><em>Matching 특성 파일 선택</em></div>
    </el-upload>
    <long-input-text-2
      v-model="props.application.nfApp.note"
      label="특이사항"
      prop="note"
      placeholder=""
      row-cnt="3"
    />
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

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList: ModuleFiles;
}>();

watch(
  () => props.application.isNf,
  (newVal) => {
    if (newVal) {
      if(props.application.nfApp === null){
        props.application.nfApp = appUtiles.initNf();
      }      
    } else if (newVal === null) {
      props.application.nfApp = null;
    }
  }
);

// Reference 파일 선택 핸들러
const handleMatchingFileChange: UploadProps["onChange"] = (file) => {
  props.fileObjList.matchingFileList = [file];
};

// EVB 조립 메뉴얼 파일 삭제 핸들러
const handleMatchingFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.matchingFileList = [];
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
