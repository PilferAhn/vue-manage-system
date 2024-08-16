<template>
  <el-form
    :model="applicationForm"
    :rules="applicationRules"
    ref="formRef"
    label-width="100"
  >
    <div class="container">
      <div class="inline-fields">
        <inputText
          v-model="applicationForm.requestNumber"
          label="의뢰번호"
          prop="requestNumber"
          placeholder="의뢰번호를 입력하세요."
          class="flex-item form-item"
        ></inputText>
        <el-button type="success" :disabled="applicationForm.status !== 'created'" @click="updateApplicationNumber(uuid.toString() , applicationForm.requestNumber, applicationForm)">의뢰 접수</el-button>
      </div>
      <div class="inline-fields">
        <el-form-item label="상태" class="flex-item form-item">
          <el-select v-model="applicationForm.status" placeholder="상태 선택">
            <el-option label="의뢰서 작성 완료" value="created"></el-option>
            <el-option label="측정 대기" value="reserved"></el-option>
            <el-option label="측정 완료" value="finished"></el-option>
            <el-option label="측정 진행중" value="in progress"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="success" @click="updateApplicationStatus(uuid.toString(), applicationForm.requestNumber, applicationForm.status)">업데이트</el-button>
      </div>
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
      
      <el-form-item label="작성일">
        <el-col :span="11">
          <el-form-item prop="dateOfCreate">
            <el-date-picker
              type="date"
              placeholder="샘플 전달일"
              v-model="applicationForm.dateOfCreate"
              style="width: 100%"
              disabled
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
        :options="getSampleQuantityOptionsByAdmin()"
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
              <applicationDetail v-model:samples="applicationForm.samples" />
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
        <el-button type="primary" @click="handleUpdate()"
          >의뢰서 업데이트</el-button
        >

        <el-button type="danger" @click="handleDelete()">삭제</el-button>
        <el-button type="success" @click="handleDownload">의뢰서 다운로드</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref } from "vue";
import { FormInstance } from "element-plus";
import inputText from "../Common/InputText.vue";
import inputNumber from "../Common/InputNumber.vue";
import longInputText from "../Common/LongInputText.vue";
import selectOption from "../Common/SelectOption.vue";
import selectNumberOption from "../Common/SelectNumberOption.vue";
import pdtSample from "../ProductPage/ApplicationPage/PDTSample.vue";
import pdtSampleTab from "../ProductPage/ApplicationPage/PDTSampleTab.vue";
import applicationDetail from "./ApplicationDetailSample.vue"

import {
  applicationRules,
  createApplicationRules,
} from "../ProductPage/ApplicationPage/ApplicationRules";
import axios from "axios";
import {
  usePDTRequestForm,
  usePDTRequestFormBoolean,
  testOptions,
  resetForm,
  saveForm,
  updateNote,
  loadForm,
  signalList,
  packageTypeList,
  waferTypeList,
  customerList,
  bandList,
  dutyList,
  bandwidthList,
  getSampleQuantityOptionsByAdmin,
  upAndDown,
  testPostionList,
  sampleRequestMode,
  setMode,
  updateSampleInformation,
  SampleInformation,
  getSystemFreq,
} from "../ProductPage/ApplicationPage/Application";
import { deleteApplicationByUuid, updateApplicationNumber, updateApplicationStatus } from "./ApplicationDetail";
import {downloadExcel} from "../ProductPage/ApplicationPage/Application"

import { useRoute } from "vue-router";
const { form: applicationForm } = usePDTRequestForm();
const { form: applicationFormBoolean } = usePDTRequestFormBoolean();
const requestNumber = localStorage.getItem("ms_username");

// useRoute 훅을 사용하여 현재 라우트 객체를 가져옵니다.
const route = useRoute();

// route.params에서 uuid 값을 추출합니다.
const uuid = route.params.uuid;

// Watch for changes in testType and reset the form
// watch(
//   () => applicationForm.value.testType,
//   () => {
//     resetForm(applicationForm, requestNumber);
//     applicationRules.value = createApplicationRules(
//       applicationFormBoolean.value
//     );
//     // console.log(applicationFormBoolean.value);
//   }
// );

const formRef = ref(null);

// Load form values from localStorage when the component is mounted
// onMounted(() => {
//   loadForm(applicationForm);
// });

function handleDownload() {
  downloadExcel(applicationForm)
}

watch(
  () => uuid,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      fetchApplicationDetail();
    }
  }
);

// Watch for changes in the form and save to localStorage
watch(
  applicationForm,
  () => {
    saveForm(applicationForm);
  },
  { deep: true }
);

function handleDelete() {
  deleteApplicationByUuid(uuid.toString());
}

function handleUpdate() {

  formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log("Form is valid and ready for submission!");
      updateNote(applicationForm.value);
    } else {
      console.log("Form validation failed");
    }
  });
  
}

const fetchApplicationDetail = async () => {
  try {
    const response = await axios.post(
      "pdt_application/get_application_detail2",
      { uuid: uuid }
    );

    applicationForm.value.applicationUuid = uuid.toString();
    // 받아온 데이터를 reactive form 객체에 할당합니다.

    applicationForm.value.requestNumber = response.data.request_number;
    applicationForm.value.status = response.data.status;

    applicationForm.value.customerCompany = response.data.customer_company;
    applicationForm.value.specTemperature = response.data.spec_temperature;
    applicationForm.value.specPower = response.data.spec_power;
    applicationForm.value.isSpecEdit = response.data.is_spec_edit;

    applicationForm.value.modelName = response.data.model_name;
    applicationForm.value.condition = response.data.condition;

    applicationForm.value.signalType = response.data.signal_type;
    applicationForm.value.band = response.data.band;
    applicationForm.value.duplexMode = response.data.duplex_mode;
    applicationForm.value.bandwidth = response.data.bandwidth;

    applicationForm.value.designer = response.data.designer;
    applicationForm.value.requester = response.data.requester;

    applicationForm.value.purpose = response.data.purpose;

    applicationForm.value.waferType = response.data.wafer_type;

    applicationForm.value.packageType = response.data.package_type;
    applicationForm.value.temperature = response.data.temperature;
    applicationForm.value.detail = response.data.detail;

    applicationForm.value.testType = response.data.test_type;
    applicationForm.value.targetPosition =
      response.data.target_position.toUpperCase();

    applicationForm.value.dateOfCreate = response.data.date_of_created

    applicationForm.value.samples = response.data.samples;
    applicationForm.value.sampleQuantity = response.data.sample_quantity;

    if (response.data.link === undefined) {
      applicationForm.value.link = "Up Link";
    } else {
      applicationForm.value.link = response.data.link;
    }

    const systemFreq = getSystemFreq(applicationForm);

    for (let i = 0; i < applicationForm.value.samples.length; i++) {
      applicationForm.value.samples[i].defaultFreq = systemFreq;
      applicationForm.value.samples[i].offset = parseFloat(
        (
          Number(applicationForm.value.samples[i].targetFreq) -
          Number(systemFreq)
        ).toFixed(3)
      );
    }

    // Watch for changes in applicationForm.sampleQuantity after initial load
    watch(
      () => applicationForm.value.sampleQuantity,
      (newQuantity, oldQuantity) => {
        if (Number(newQuantity) > Number(oldQuantity)) {
          for (let i = Number(oldQuantity); i < Number(newQuantity); i++) {
            const newSample: SampleInformation = {
              sampleNumber: "SPL",
              defaultFreq: systemFreq,
              dB3Freq: "",
              targetFreq: 0,
              useDefaultFreq: true,
              isManualInput: false,
              offset: 0,
              sParaFileName: "",
              index: 0,
              fileContent: "",
              sInput: "",
              sOutput: "",
              ilLevel: "",
              fc: "",
              points: [],
            };
            applicationForm.value!.samples.push(newSample);
          }
        }
      }
    );
    // applicationForm.value.dateOfCreated = response.data.date_of_created;
  } catch (error) {
    console.error(error);
  }
};

// 컴포넌트가 마운트될 때 HTTP 요청을 보냄
onMounted(fetchApplicationDetail);
</script>

<style>
@import "../../assets/css/PDTRequestForm.css";

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
