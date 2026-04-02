<template>
  <el-form
    :model="applicationForm"
    :rules="rulesForCreate"
    ref="formRef"
    label-width="100"
  >
    <div class="container">
      <div class="inline-fields">
      <selectOption
        v-model="applicationForm.testType"
        label="테스트 유형"
        prop="testType"
        placeholder="테스트 유형을 입력해주세요."
        :options="testOptions"
        :disable="applicationFormBoolean.testType"
        class="flex-item form-item"
      ></selectOption>

      <selectOption
        v-model="applicationForm.vswr"
        label="vswr"
        prop="vswr"
        placeholder="vswr을 입력하세요."
        :options="vswrOptions"
        class="flex-item"
      ></selectOption>
      
      <inputText
        v-model="applicationForm.phase"
        label="Phase조건"
        prop="purpose"
        placeholder="Phase step을 입력해주세요"
        class="flex-item"
      ></inputText>
      </div>
      
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
            applicationForm.signalType === 'NR(DFT-s-OFDM)' ||
            applicationForm.signalType === 'NR(CP-OFDM)' ||
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
            class="wide-select"
          ></inputText>
          <inputText
            v-model="applicationForm.specPower"
            label=""
            prop="specPower"
            placeholder="Input Power"
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
          v-model="applicationForm.requester"
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
          prop="link"
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

        <PdtModuleAttachFiles
          v-if="applicationForm.packageType === 'Module'"
          :form="applicationForm"
          :files="pdtModuleFiles"
        />


      <longInputText
        v-model="applicationForm.detail"
        label="세부사항"
        prop="detail"
        placeholder="세부사항을 입력해주세요."
      ></longInputText>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">의뢰서 작성</el-button>
        <el-button type="warning" @click="handleReset">초기화</el-button>
        
          <el-button type="success" @click="handleDownload" :disabled="!isDownload"
            >의뢰서 다운로드</el-button
          >
        
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref, computed } from "vue";
import { UploadFile  } from "element-plus";
import inputText from "../../Common/InputText.vue";
import inputNumber from "../../Common/InputNumber.vue";
import longInputText from "../../Common/LongInputText.vue";
import selectOption from "../../Common/SelectOption.vue";
import selectNumberOption from "../../Common/SelectNumberOption.vue";
import pdtSample from "./PDTSample.vue";
import pdtSampleTab from "./PDTSampleTab.vue";
import { applicationRules, createApplicationRules } from "./ApplicationRules";
import PdtModuleAttachFiles from "./PdtModuleAttachFiles.vue";
import {ElMessage} from "element-plus";
import {
  usePDTRequestForm,
  usePDTRequestFormBoolean,
  submitForm,
  testOptions,
  vswrOptions,
  resetForm,
  saveForm,
  loadForm,
  signalList,
  watchSignalType,
  watchTestType, // Ensure to import the function
  watchVswr,
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
  downloadExcel
} from "./Application";

const { form: applicationForm } = usePDTRequestForm();
const { form: applicationFormBoolean } = usePDTRequestFormBoolean();
const requestNumber = localStorage.getItem("ms_username") ?? "";
const NO_BW = new Set(["CW", "CW Duty 50%", "WIFI", "GSM"]);
const isApplyingReuseData = ref(false);
const rulesForCreate = computed(() => ({
  ...applicationRules,
  bandwidth: [
    {
      trigger: ["blur", "change"],
      validator: (_rule, value, callback) => {
        const sig = applicationForm.value.signalType;

        // ✅ CW/CW Duty/WIFI/GSM 은 bandwidth 없어도 통과
        if (sig && NO_BW.has(sig)) return callback();

        // ✅ 그 외엔 필수 유지
        if (value === "" || value == null) {
          return callback(new Error("대역폭을 입력해주세요."));
        }
        return callback();
      },
    },
  ],
}));

watch(
  () => applicationForm.value.signalType,
  (sig) => {
    if (sig && NO_BW.has(sig)) {
      applicationForm.value.bandwidth = "";
      formRef.value?.clearValidate(["bandwidth"]);
    } else {
      formRef.value?.validateField("bandwidth");
    }
  }
);

// Watch for changes in testType and reset the form
watch(
  () => applicationForm.value.testType,
  () => {
    if (isApplyingReuseData.value) return;
    resetForm(applicationForm, requestNumber);
    // applicationRules.value = createApplicationRules(
    //   applicationFormBoolean.value
    // );
  }
);

const formRef = ref(null);
const isDownload = ref<Boolean>(false)

const pdtModuleFiles = ref<{
  pdtModuleRffeFileList: UploadFile[];
  pdtModuleConfigFileList: UploadFile[];
}>({
  pdtModuleRffeFileList: [],
  pdtModuleConfigFileList: [],
});

// Load form values from localStorage when the component is mounted
onMounted(() => {
  const reuseRaw = sessionStorage.getItem("pdt_reuse_form");
  
  if (reuseRaw) {
     isApplyingReuseData.value = true;
    const reuseData = JSON.parse(reuseRaw);
    
    applicationForm.value.customerCompany = reuseData.customerCompany ?? "";
    applicationForm.value.specTemperature = reuseData.specTemperature ?? "";
    applicationForm.value.specPower = reuseData.specPower ?? "";
    applicationForm.value.isSpecEdit = reuseData.isSpecEdit ?? false;

    applicationForm.value.modelName = reuseData.modelName ?? "";
    applicationForm.value.condition = reuseData.condition ?? "";

    applicationForm.value.signalType = reuseData.signalType ?? "";
    applicationForm.value.band = reuseData.band ?? "";
    applicationForm.value.duplexMode = reuseData.duplexMode ?? "";
    applicationForm.value.bandwidth = reuseData.bandwidth ?? "";

    applicationForm.value.designer = reuseData.designer ?? "";
    applicationForm.value.requester = reuseData.requester ?? "";
    applicationForm.value.purpose = reuseData.purpose ?? "";

    applicationForm.value.waferType = reuseData.waferType ?? "";
    applicationForm.value.packageType = reuseData.packageType ?? "";
    applicationForm.value.detail = reuseData.detail ?? "";

    applicationForm.value.testType = reuseData.testType ?? "";
    applicationForm.value.targetPosition = reuseData.targetPosition ?? "";
    applicationForm.value.temperature = reuseData.temperature ?? "";

    applicationForm.value.sampleQuantity = 0;
    applicationForm.value.samples = Array.isArray(reuseData.samples) ? reuseData.samples : [];

    // 새 의뢰서이므로 초기화
    applicationForm.value.requestNumber = "";
    applicationForm.value.status = "created";
    sessionStorage.removeItem("pdt_reuse_form");
  }else{
    loadForm(applicationForm);
  }

  watchSignalType(
    applicationForm,
    applicationFormBoolean,
    bandList,
    bandwidthList
  );
  watchTestType(applicationForm, applicationFormBoolean); // Call watchTestType here
  watchVswr(applicationForm);
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


watch(
  () => applicationForm.value.packageType,
  (v) => {
    if (v === "Module") {
      applicationForm.value.pdtModule ??= { rffeFileList: [], configFileList: [] };
      return;
    }

    // ✅ Module 해제 시 데이터/파일리스트 정리
    applicationForm.value.pdtModule = null;
    pdtModuleFiles.value.pdtModuleRffeFileList = [];
    pdtModuleFiles.value.pdtModuleConfigFileList = [];
  },
  { immediate: true }
);


function handleSubmitDetail() {}

function isValidSnpFile(fileName?: string | null): boolean {
  if (!fileName) return false;

  const base = fileName.split(/[\\/]/).pop() || "";
  // 확장자: .s1p, .s2p, .s3p ... (대소문자 무시)
  return /\.s\d+p$/i.test(base.trim());
}

function validateSparaFiles(): { ok: true } | { ok: false; message: string } {
  const samples = applicationForm.value?.samples ?? [];
  for (const s of samples) {
    const sampleNumber = s?.sampleNumber ?? "";         // 표기용
    const fileName = s?.sParaFileName ?? null;          // 검사 대상
    if (!isValidSnpFile(fileName)) {
      return { ok: false, message: `${sampleNumber || "해당 샘플"} 의 SnP 파일을 선택해주세요` };
    }
  }
  return { ok: true };
}

  watch(
  pdtModuleFiles,
  (v) => {
    console.log("pdtModuleFiles changed", v);
  },
  { deep: true }
  );
  
function handleSubmit() {
  const snpCheck = validateSparaFiles();
  if (!snpCheck.ok) {
    ElMessage.warning(snpCheck.message);
    return;
  }

  formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log("Form is valid and ready for submission!");
      console.log('pdtModuleFiles.value', pdtModuleFiles.value);
      submitPdtApplicationForm(applicationForm.value, pdtModuleFiles.value, isDownload);
    } else {
      console.log("Form validation failed");
    }
  });
}

function handleReset() {
  resetForm(applicationForm, requestNumber);
}

function handleDownload() {
  downloadExcel(applicationForm)
}

</script>

<style>
 

@import "../../../assets/css/PDTRequestForm.css";


</style>
./Application1
