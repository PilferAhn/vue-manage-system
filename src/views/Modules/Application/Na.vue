<script lang="ts">
export default {};
</script>
<template>
  <div class="container" v-if="props.application.isNa">
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
        <el-form-item label="측정 방식">
          <el-select v-model="props.application.naApp.measMethod">
            <el-option :value="'JIG'" label="JIG"></el-option>
            <el-option :value="'SOLDER'" label="SOLDER"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
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
    </el-row>
    <file-table :app-file="props.application.naApp.stateFile" file_type="state"></file-table>
    <el-upload
      drag
      :auto-upload="false"
      :multiple="false"
      :on-remove="handleStateFileRemove"
      :on-change="handleStateFileChange"
      :show-file-list="true"
      :file-list="props.fileObjList.stateFileList"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"><em>State File 선택</em></div>
    </el-upload>
    <long-input-text-2
      v-model="props.application.naApp.note"
      label="특이사항"
      prop="note"
      placeholder=""
      row-cnt="3"
    />
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

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList : ModuleFiles;
}>();

watch(
  () => props.application.isNa,
  (newVal) => {
    if (newVal) {
      if (props.application.naApp === null) {
        props.application.naApp = appUtiles.initNa();
      }
    } else if (newVal === false) {
      props.application.naApp = null;
    }
  }
);

// Reference 파일 선택 핸들러
const handleStateFileChange: UploadProps["onChange"] = (file) => {
  props.fileObjList.stateFileList = [file]
};

// EVB 조립 메뉴얼 파일 삭제 핸들러
const handleStateFileRemove: UploadProps["onRemove"] = () => {
  props.fileObjList.stateFileList = []
};
</script>

<style>
.el-upload__text {
  border: 1px dashed #409eff;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
}</style>
