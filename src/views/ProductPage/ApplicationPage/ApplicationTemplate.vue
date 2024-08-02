<template>
    <el-form
      :model="applicationForm"
      :rules="applicationRules"
      ref="formRef"
      label-width="100"
    >
      <div class="container">
        <selectOption
          v-model="applicationForm.testType"
          label="테스트 유형"
          prop="testType"
          placeholder="테스트 유형을 입력해주세요."
          :options="testOptions"
          :disable="applicationFormBoolean.testType"
          class="form-item"
        ></selectOption>
  
        <div class="inline-fields">
          <selectOption
            v-model="applicationForm.signalType"
            label="Signal"
            prop="signalType"
            placeholder="신호 유형을 입력해주세요."
            :options="signalList"
            class="flex-item form-item"
          ></selectOption>
  
          <div
            v-if="
              applicationForm.signalType === 'NR' ||
              applicationForm.signalType === 'LTE'
            "
            class="flex-item form-item"
          >
            <selectOption
              v-model="applicationForm.band"
              label=""
              prop="band"
              placeholder="신호 유형을 입력해주세요."
              class="flex-item form-item"
              :options="bandList"
              :disable="applicationFormBoolean.band"
            ></selectOption>
          </div>
  
          <div v-else class="flex-item form-item">
            <inputText
              v-model="applicationForm.band"
              label=""
              prop="band"
              placeholder="Band 정보"
              class="flex-item"
              :disable="applicationFormBoolean.band"
            ></inputText>
          </div>
  
          <inputText
            v-model="applicationForm.duplexMode"
            label=""
            prop="duplexMode"
            placeholder="Duplex Mode"
            class="flex-item"
            :disable="applicationFormBoolean.duplexMode"
          ></inputText>
        </div>
  
        <div v-if="applicationForm.duplexMode === 'TDD'">
          <selectOption
            v-model="applicationForm.duty"
            label="Duty"
            prop="duty"
            placeholder="듀티를 입력해주세요."
            :options="dutyList"
            class="form-item"
          ></selectOption>
        </div>
  
        <selectOption
          v-model="applicationForm.bandwidth"
          label="Bandwidth"
          prop="bandwidth"
          placeholder="대역폭을 입력해주세요."
          :options="bandwidthList"
          class="form-item"
        ></selectOption>
  
        <div v-if="applicationForm.testType === 'Life'">
          <selectOption
            v-model="applicationForm.customerCompany"
            label="고객사 정보"
            prop="customerCompany"
            placeholder="예) K1 , 기타 , 중화"
            :options="customerList"
            :disable="applicationFormBoolean.customerCompany"
          ></selectOption>
          <div class="inline-fields">
            <inputText
              v-model="applicationForm.specTemperature"
              label="제품스팩"
              prop="specTemperature"
              placeholder="Temperature"
              :disable="applicationFormBoolean.specTemperature"
              class="wide-select"
            ></inputText>
            <inputText
              v-model="applicationForm.specPower"
              label=""
              prop="specPower"
              placeholder="Input Power"
              :disable="applicationFormBoolean.specPower"
              class="wide-select"
            ></inputText>
          </div>
        </div>
  
        <div class="inline-fields">
          <inputText
            v-model="applicationForm.modelName"
            label="기종 정보"
            prop="modelName"
            placeholder="기종명"
            class="wide-select"
          ></inputText>
          <inputText
            v-model="applicationForm.condition"
            label=""
            prop="condition"
            placeholder="설계 차수"
            class="wide-select"
          ></inputText>
        </div>
  
        <div class="inline-fields">
          <inputText
            v-model="applicationForm.designer"
            label="작성자"
            prop="designer"
            placeholder="개발자"
            class="wide-select"
          ></inputText>
          <inputText
            v-model="requestNumber"
            label=""
            prop="requester"
            placeholder="의뢰자"
            class="wide-select"
          ></inputText>
        </div>
        <inputText
          v-model="applicationForm.purpose"
          label="의뢰목적"
          prop="purpose"
          placeholder="의뢰목적을 입력하세요"
        ></inputText>
  
        <inputText
          v-model="applicationForm.temperature"
          label="온도"
          prop="temperature"
          placeholder="온도를 입력해주세요."
          class="form-item"
          :disable="applicationFormBoolean.temperature"
        ></inputText>
  
        <el-form-item label="일정">
          <el-col :span="11">
            <el-form-item prop="dateOfCreate">
              <el-date-picker
                type="date"
                placeholder="샘플 전달일"
                v-model="applicationForm.dateOfCreate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
  
        <div class="inline-fields">
          <selectOption
            v-model="applicationForm.waferType"
            label="제품정보"
            prop="waferType"
            placeholder="HS / TS / NS"
            :options="waferTypeList"
            class="wide-select"
          ></selectOption>
          <selectOption
            v-model="applicationForm.packageType"
            label=""
            prop="packageType"
            placeholder="CSP or WLP"
            :options="packageTypeList"
            class="wide-select"
          ></selectOption>
        </div>
  
        <div class="inline-fields">
          <selectOption
            v-model="applicationForm.targetPosition"
            label="Position"
            prop="targetPosition"
            placeholder="ex ) HiGH, MIDDLE, LOW"
            class="wide-select"
            :options="testPostionList"
          ></selectOption>
          <selectOption
            v-model="applicationForm.link"
            label=""
            prop="packageType"
            placeholder="Up / Down"
            :options="upAndDown"
            class="wide-select"
          ></selectOption>
        </div>
  
        <selectNumberOption
          v-model="applicationForm.sampleQuantity"
          label="수량"
          prop="sampleQuantity"
          placeholder="1 ~ 30"
          :options="getSampleQuantityOptions()"
          class="wide-select"
        ></selectNumberOption>
  
        <div class="inline-fields">
          <el-form-item label="의뢰 종류">
            <el-button
              :type="sampleRequestMode === 'normal' ? 'primary' : 'default'"
              @click="setMode('normal')"
            >
              일반
            </el-button>
            <el-button
              :type="sampleRequestMode === 'advanced' ? 'primary' : 'default'"
              @click="setMode('advanced')"
            >
              고급
            </el-button>
          </el-form-item>
        </div>
  
        <div v-if="applicationForm.sampleQuantity >= 1">
          <el-form-item label="SPL 정보">
            <div v-if="sampleRequestMode === 'normal'">
              <div v-if="applicationForm.sampleQuantity >= 1">
                <pdt-sample v-model:samples="applicationForm.samples" />
              </div>
            </div>
            <div v-else>
              <pdtSampleTab
                :samples="applicationForm.samples"
                label=""
                :position="applicationForm.targetPosition"
                :link="applicationForm.link"
              />
            </div>
          </el-form-item>
        </div>
  
        <longInputText
          v-model="applicationForm.detail"
          label="세부사항"
          prop="detail"
          placeholder="세부사항을 입력해주세요."
        ></longInputText>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">의뢰서 작성</el-button>
          <el-button type="warning" @click="handleReset">초기화</el-button>
          <el-button type="success" @click="handleDownload"
            >의뢰서 다운로드</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </template>

<script lang="ts" setup>
import { watch, onMounted, ref } from "vue";
import { FormInstance } from "element-plus";
import inputText from "../../Common/InputText.vue";
import inputNumber from "../../Common/InputNumber.vue";
import longInputText from "../../Common/LongInputText.vue";
import selectOption from "../../Common/SelectOption.vue";
import selectNumberOption from "../../Common/SelectNumberOption.vue";
import pdtSample from "./PDTSample.vue";
import pdtSampleTab from "./PDTSampleTab.vue";
import { applicationRules, createApplicationRules } from "./ApplicationRules";

import {
  usePDTRequestForm,
  usePDTRequestFormBoolean,
  submitForm,
  testOptions,
  resetForm,
  saveForm,
  loadForm,
  signalList,
  watchSignalType,
  watchTestType, // Ensure to import the function
  watchCustomerCompany,
  packageTypeList,
  waferTypeList,
  customerList,
  bandList,
  dutyList,
  bandwidthList,
  watchBand,
  setBandwidthOptions,
  watchDuplexMode,
  getSampleQuantityOptions,
  watchSampleQuantity,
  upAndDown,
  testPostionList,
  watchLink,
  watchPosition,
  sampleRequestMode,
  setMode,
  submitPdtApplicationForm,
  PDTRequestFormType
} from "./Application";

const props = defineProps<{
    applicationForm : PDTRequestFormType
}>();

const { form: applicationForm } = usePDTRequestForm();
const { form: applicationFormBoolean } = usePDTRequestFormBoolean();
const requestNumber = localStorage.getItem("ms_username");

// Watch for changes in testType and reset the form
watch(
  () => applicationForm.value.testType,
  () => {
    resetForm(applicationForm, requestNumber);
    applicationRules.value = createApplicationRules(
      applicationFormBoolean.value
    );
    // console.log(applicationFormBoolean.value);
  }
);

const formRef = ref(null);

// Load form values from localStorage when the component is mounted
onMounted(() => {
  loadForm(applicationForm);
  watchSignalType(
    applicationForm,
    applicationFormBoolean,
    bandList,
    bandwidthList
  );
  watchTestType(applicationForm, applicationFormBoolean); // Call watchTestType here
  watchCustomerCompany(applicationForm, applicationFormBoolean);
  setBandwidthOptions(applicationForm, applicationFormBoolean, bandwidthList);
  watchBand(applicationForm, applicationFormBoolean);
  watchDuplexMode(applicationForm, applicationFormBoolean);
  watchSampleQuantity(applicationForm, applicationFormBoolean);
  watchLink(applicationForm);
  watchPosition(applicationForm);
});

// Watch for changes in the form and save to localStorage
watch(
  applicationForm,
  () => {
    saveForm(applicationForm);
  },
  { deep: true }
);

function handleSubmitDetail() {}

function handleSubmit() {
  // console.log(applicationForm.value.samples);

  formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log("Form is valid and ready for submission!");
      submitPdtApplicationForm(applicationForm.value);
    } else {
      console.log("Form validation failed");
    }
  });
}

function handleReset() {
  resetForm(applicationForm, requesterName);
}

function handleDownload(){

}

</script>

<style>
@import "../../../assets/css/PDTRequestForm.css";

.inline-fields {
  display: flex;
  gap: 10px; /* Adjust the gap as needed */
}

.flex-item {
  flex: 1;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px; /* 버튼 사이의 간격 설정 */
  margin-bottom: 20px; /* 아래쪽 여백 설정 */
}
</style>
./Application1
  