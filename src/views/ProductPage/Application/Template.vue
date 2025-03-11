<template>
    <el-form
      :model="props.app"
      :rules="applicationRules"
      ref="formRef"
      label-width="100"
    >
      <div class="container">
        <selectOption
          v-model="props.app.testType"
          label="테스트 유형"
          prop="testType"
          placeholder="테스트 유형을 입력해주세요."
          :options="testOptions"
          :disable="applicationFormBoolean.testType"
          class="form-item"
        ></selectOption>
  
        <div class="inline-fields">
          <selectOption
            v-model="props.app.signalType"
            label="Signal"
            prop="signalType"
            placeholder="신호 유형을 입력해주세요."
            :options="signalList"
            class="flex-item form-item"
          ></selectOption>
  
          <div
            v-if="props.app.signalType === 'NR' || props.app.signalType === 'LTE'"
            class="flex-item form-item"
          >
            <selectOption
              v-model="props.app.band"
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
              v-model="props.app.band"
              label=""
              prop="band"
              placeholder="Band 정보"
              class="flex-item"
              :disable="applicationFormBoolean.band"
            ></inputText>
          </div>
  
          <inputText
            v-model="props.app.duplexMode"
            label=""
            prop="duplexMode"
            placeholder="Duplex Mode"
            class="flex-item"
            :disable="applicationFormBoolean.duplexMode"
          ></inputText>
        </div>
  
        <div v-if="props.app.duplexMode === 'TDD'">
          <selectOption
            v-model="props.app.duty"
            label="Duty"
            prop="duty"
            placeholder="듀티를 입력해주세요."
            :options="dutyList"
            class="form-item"
          ></selectOption>
        </div>
  
        <selectOption
          v-model="props.app.bandwidth"
          label="Bandwidth"
          prop="bandwidth"
          placeholder="대역폭을 입력해주세요."
          :options="bandwidthList"
          class="form-item"
        ></selectOption>
  
        <div v-if="props.app.testType === 'Life'">
          <selectOption
            v-model="props.app.customerCompany"
            label="고객사 정보"
            prop="customerCompany"
            placeholder="예) K1 , 기타 , 중화"
            :options="customerList"
            :disable="applicationFormBoolean.customerCompany"
          ></selectOption>
          <div class="inline-fields">
            <inputText
              v-model="props.app.specTemperature"
              label="제품스팩"
              prop="specTemperature"
              placeholder="Temperature"
              :disable="applicationFormBoolean.specTemperature"
              class="wide-select"
            ></inputText>
            <inputText
              v-model="props.app.specPower"
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
            v-model="props.app.modelName"
            label="기종 정보"
            prop="modelName"
            placeholder="기종명"
            class="wide-select"
          ></inputText>
          <inputText
            v-model="props.app.condition"
            label=""
            prop="condition"
            placeholder="설계 차수"
            class="wide-select"
          ></inputText>
        </div>
  
        <div class="inline-fields">
          <inputText
            v-model="props.app.designer"
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
          v-model="props.app.purpose"
          label="의뢰목적"
          prop="purpose"
          placeholder="의뢰목적을 입력하세요"
        ></inputText>
  
        <inputText
          v-model="props.app.temperature"
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
                v-model="props.app.dateOfCreate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
  
        <div class="inline-fields">
          <selectOption
            v-model="props.app.waferType"
            label="제품정보"
            prop="waferType"
            placeholder="HS / TS / NS"
            :options="waferTypeList"
            class="wide-select"
          ></selectOption>
          <selectOption
            v-model="props.app.packageType"
            label=""
            prop="packageType"
            placeholder="CSP or WLP"
            :options="packageTypeList"
            class="wide-select"
          ></selectOption>
        </div>
  
        <div class="inline-fields">
          <selectOption
            v-model="props.app.targetPosition"
            label="Position"
            prop="targetPosition"
            placeholder="ex ) HiGH, MIDDLE, LOW"
            class="wide-select"
            :options="testPostionList"
          ></selectOption>
  
          <SelectOptionsNew2
            v-model="props.app.link"
            label=""
            prop="link"
            placeholder="TX / RX"
            :options="transcevierModeOptions"
            class="wide-select"
          >
          </SelectOptionsNew2>
  
          <!-- <selectOption
            v-model="props.app.link"
            label=""
            prop="link"
            placeholder="TX / RX"
            :options="upAndDown"
            class="wide-select"
          ></selectOption> -->
        </div>
  
        <selectNumberOption
          v-model="props.app.sampleQuantity"
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
  
        <div v-if="props.app.sampleQuantity >= 1">
          <el-form-item label="SPL 정보">
            <div v-if="sampleRequestMode === 'normal'">
              <div v-if="props.app.sampleQuantity >= 1">
                <pdt-sample v-model:samples="props.app.samples" />
              </div>
            </div>
            <div v-else>
              <pdtSampleTab
                :samples="props.app.samples"
                label=""
                :position="props.app.targetPosition"
                :link="props.app.link"
              />
            </div>
          </el-form-item>
        </div>
  
        <longInputText
          v-model="props.app.detail"
          label="세부사항"
          prop="detail"
          placeholder="세부사항을 입력해주세요."
        ></longInputText>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">의뢰서 작성</el-button>
          <el-button type="warning" @click="handleReset">초기화</el-button>
  
          <el-button
            type="success"
            @click="handleDownload"
            :disabled="!isDownload"
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
  import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
  import selectNumberOption from "../../Common/SelectNumberOption.vue";
  import pdtSample from "../ApplicationPage/PDTSample.vue";
  import pdtSampleTab from "../ApplicationPage/PDTSampleTab.vue";
  import {
    applicationRules,
    createApplicationRules,
  } from "../ApplicationPage/ApplicationRules";
  
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
    downloadExcel,
    PDTRequestFormType,
    transcevierModeOptions,
  } from "../ApplicationPage/Application";
  
  const props = defineProps<{
    app: PDTRequestFormType;
    appType: String;
  }>();
  
  // const { form: props.app } = usePDTRequestForm();
  const { form: applicationFormBoolean } = usePDTRequestFormBoolean();
  const requestNumber = localStorage.getItem("ms_username");
  
  // Watch for changes in testType and reset the form
  watch(
    () => props.app.testType,
    () => {
      resetForm(props.app, requestNumber);
      applicationRules.value = createApplicationRules(
        applicationFormBoolean.value
      );
      // console.log(applicationFormBoolean.value);
    }
  );
  
  const formRef = ref(null);
  const isDownload = ref<Boolean>(false);
  
  // Load form values from localStorage when the component is mounted
  onMounted(() => {
    loadForm(props.app);
    watchSignalType(props.app, applicationFormBoolean, bandList, bandwidthList);
    watchTestType(props.app, applicationFormBoolean); // Call watchTestType here
    watchCustomerCompany(props.app, applicationFormBoolean);
    setBandwidthOptions(props.app, applicationFormBoolean, bandwidthList);
    watchBand(props.app, applicationFormBoolean);
    watchDuplexMode(props.app, applicationFormBoolean);
    watchSampleQuantity(props.app, applicationFormBoolean);
    watchLink(props.app);
    watchPosition(props.app);
  });
  
  // Watch for changes in the form and save to localStorage
  watch(
    props.app,
    () => {
      saveForm(props.app);
    },
    { deep: true }
  );
  
  function handleSubmitDetail() {}
  
  function handleSubmit() {
    // console.log(props.app.value.samples);
  
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        console.log("Form is valid and ready for submission!");
        submitPdtApplicationForm(props.app, isDownload);
      } else {
        console.log("Form validation failed");
      }
    });
  }
  
  function handleReset() {
    resetForm(props.app, requestNumber);
  }
  
  function handleDownload() {
    downloadExcel(props.app);
  }
  </script>
  
  <style>
  @import "../../../assets/css/PDTRequestForm.css";
  </style>