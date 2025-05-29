<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card>
        <NaNfToogle :application="props.application" />
        <el-divider content-position="center">기본 정보</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <inputText
              v-model="props.application.productName"
              label="Model Name"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
            />
          </el-col>
          <el-col :span="12">
            <OptionNumber
              v-model="props.application.quantity"


              label="Quantity"
              prop="quantity"
              :disable="false"
              :placeholder="''"
              :options="quantityList"              
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <!-- <el-form-item label="Requester" prop="requester">
              <el-input v-model="props.application.user.userName"></el-input>
            </el-form-item> -->
            <!-- <inputText
              v-model="props.application.user.userName"
              label="Requester Name"
              prop="requester"
              placeholder="ex) XMN5CTV@1A"
            /> -->
          </el-col>
          <el-col :span="6">
            <!-- <inputText
              v-model="props.application.user.id"
              label="Requester ID"
              prop="requesterId"
              placeholder="ex) XMN5CTV@1A"
            /> -->
          </el-col>
          <el-col :span="12">
            <el-form-item label="측정 SPL">
              <el-input placeholder="협의필요" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <inputText
              v-model="props.application.smtHistory"
              label="조립차수"
              prop="smtHistory"
              placeholder=""
            />
          </el-col>
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="의뢰목적"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">            
            <el-form-item prop="dateOfDeliveryDate" label="자재 전달 일자">              
              <el-date-picker
                v-model="props.application.dateOfDeliveryDate"
                placeholder="Pick one or more dates"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">            
            <el-form-item prop="dateOfExpectedFinished" label="완료 요청 일자">
              <el-date-picker
                v-model="props.application.dateOfExpectedFinished"                
                placeholder="Pick one or more dates"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <SelectOptionsNew2
              v-model="props.application.mold"
              label="MOLD"
              :prop="'mold'"
              :rules="[{required: true,}]"
              :need-bold="false"
              :disable="false"
              :placeholder="''"
              :options="appUtiles.createMoldOptions()"
            ></SelectOptionsNew2>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <input-text
              v-model="props.application.lotId"
              label="LOT ID"
              prop="lotId"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
          <el-col :span="12">
            <input-text
              v-model="props.application.deliveryMethod"
              label="샘플 전달방법"
              prop="deliveryMethod"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>


        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="TCF 측정 유무">
              <el-select v-model="props.application.needTcf">
                <el-option
                  v-for="option in TrueAndFalseOptions"
                  :key="option.key"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <input-text
              v-model="props.application.tcfTemperature"
              label="TCF 측정 온도"
              prop="tcfTemperature"
              :disable="!props.application.needTcf"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>
        
        <CommonFiles
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
        ></CommonFiles>

        <NaSection          
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
           @updatePortextensionLoss="props.application.naApp.portExtensionLoss = $event"
        ></NaSection>

        <NfSection          
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
        ></NfSection>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  components: { FileTable },};
</script>
<script setup lang="ts">
import { FormRules, UploadProps } from "element-plus";
import type { ModuleMeasurementApp, ModuleFiles } from "../../../interface/module_group/application/application";
import * as appUtiles from "../../../utils/module_group/application-utils";
import InputText from "../../Common/InputText.vue";
import LongInputText2 from "../../Common/LongInputText2.vue";
import SelectNumberOption from "../../Common/SelectNumberOption.vue";
import OptionNumber from "../../Common/OptionNumber.vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import type { OptionInterface, OptionNumberInterface } from "../../../interface/option";
import { onMounted, ref, watch } from "vue";
import NaNfToogle from "./NaNfToogle.vue";
import NaSection from "./Na.vue";
import NfSection from "./Nf.vue";
import CommonFiles from "./CommonFiles.vue";
import { TrueAndFalseOptions } from "../../../utils/dropdown-options";
import FileTable from './FileTable.vue';

const quantityList = ref<OptionNumberInterface[]>([]);

onMounted(() => {
  quantityList.value = appUtiles.createQuantityOptions(20);
});

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList : ModuleFiles;
}>();

watch(
  () => props.application.needTcf,
  (newVal) => {
    if (!newVal) {
      props.application.tcfTemperature = null;
    }
  }
);

</script>

<style></style>
