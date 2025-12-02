<template>
  <!-- {{ props.applicationData }} -->
  <el-form
    :model="props.application"
    label-position="top"
    label-width="100px"
    ref="formRef"
    :rules="moduleAppRules"
  >
    <div class="container">
      <common-content
        :application="props.application"
        :application-type="props.applicationType"
        :file-obj-list="fileObjList"
      ></common-content>
    </div>
    <div class="container">
      <app-buttons
        :application="props.application"
        :application-type="props.applicationType"
        :file-obj-list="fileObjList"
        :form-ref="formRef"
      />
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ModuleMeasurementApp, ModuleFiles } from "../../../interface/module_group/application/application";
import CommonContent from "./CommonContent.vue";
import { moduleAppRules } from "../../../utils/rules/module-application";
import { FormInstance } from "element-plus";
import AppButtons from "./AppButtons.vue";

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
}>();

const fileObjList = ref<ModuleFiles>({
  //NA
  stateFileList : [],
  naRffeFileList: [],
  naConfigFileList: [],
  
  xmlFileList : [],
  naReferenceFileList : [],
  naSpecialFileList: [],
  //NF
  nfRffeFileList: [],
  nfReferenceFileList : [],
  nfConfigFileList: [],
  nfSpecialFileList: [],

  evbAssembleFileList : [],
  matchingFileList : [],
  s2pFileList: [],
})

const formRef = ref<FormInstance>();
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
@import "../../../assets/style/solderAppStyle.css";
</style>
