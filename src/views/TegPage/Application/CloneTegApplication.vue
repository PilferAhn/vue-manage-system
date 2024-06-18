<template>
  <el-form
    :model="tegApplicationForm"
    :rules="tegApplicationRules"
    ref="applicationForm"
    label-position="top"
    label-width="100px"
  >
    <div class="container">
      <div class="split-layout">
        <div class="form-box">
          <div class="meas-types-container">
            <el-form-item label="작성자">
              <el-col :span="11">
                <InputText
                  v-model="tegApplicationForm.designer"
                  label=""
                  prop="designer"
                  :rules="rules.designer"
                  placeholder="개발자"
                />
              </el-col>
              <el-col class="line" :span="2">/</el-col>
              <el-col :span="11">
                <InputText
                  v-model="tegApplicationForm.requester"
                  label=""
                  prop="requester"
                  :rules="rules.requester"
                  placeholder="의뢰자"
                />
              </el-col>
            </el-form-item>
            <select-option
              v-model="tegApplicationForm.applicationType"
              label="의뢰 구분"
              prop="applicationType"
              :rules="rules.applicationType"
              placeholder="의뢰 구분"
              :options="applicationPriority"
            ></select-option>

            <InputText
              v-model="tegApplicationForm.modelName"
              label="모델명"
              prop="modelName"
              :rules="rules.modelName"
              placeholder="ex) WGS24"
            />

            <InputText
              v-model="tegApplicationForm.lotID"
              label="LOT ID"
              prop="lotID"
              :rules="rules.lotID"
              placeholder="ex) ex) NCHDE04703"
            />

            <InputText
              v-model="tegApplicationForm.purpose"
              label="의뢰 목적"
              prop="purpose"
              :rules="rules.purpose"
              placeholder="ex) 신뢰성 테스트"
            />

            <LongInputText
              v-model="tegApplicationForm.note"
              label="특이 사항"
              prop="note"
              :rules="rules.note"
              placeholder="ex) 특 이 사 항"
            />
          </div>
        </div>
        <div class="form-box">
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.shotSize"
                label="SHOT SIZE (Flat zone 하단)"
                prop="shotSize"
                :rules="rules.shotSize"
                placeholder="ex) 10.23*10.17"
              />
            </el-col>
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.chipSize"
                label="CHIP SIZE (Flat zone 하단)"
                prop="chipSize"
                :rules="rules.chipSize"
                placeholder="ex) 0.93*1.13"
              />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.chipQuantity"
                label="Wafer 1매당 CHIP 수"
                prop="chipQuantity"
                :rules="rules.chipQuantity"
                placeholder="ex) 200"
              />
            </el-col>
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.maskName"
                label="1차 Mask 명"
                prop="maskName"
                :rules="rules.maskName"
                placeholder="ex) KF128-210616-TEST"
              />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <select-option
                v-model="tegApplicationForm.isMaskChange"
                label="Mask 변경 여부"
                prop="isMaskChange"
                :rules="rules.isMaskChange"
                placeholder="의뢰 구분"
                :options="maskChanges"
              ></select-option>
            </el-col>
            <el-col :span="12">
              <select-option
                v-model="tegApplicationForm.port"
                label="PORT"
                prop="port"
                :rules="rules.port"
                placeholder="PORT 종류"
                :options="portOptions"
              ></select-option>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <select-option
                v-model="tegApplicationForm.isAOI"
                label="AOI 여부"
                prop="isAOI"
                :rules="rules.isAOI"
                placeholder="AOI 여부"
                :options="maskChanges"
              ></select-option>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.shortPatternNo"
                label="SHORT Pattern No."
                prop="shortPatternNo"
                :rules="rules.shortPatternNo"
                placeholder="1"
              />
            </el-col>
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.thruPatternNo"
                label="THRU Pattern No."
                prop="thruPatternNo"
                :rules="rules.thruPatternNo"
                placeholder="2"
              />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.openPatternNo"
                label="OPEN Pattern No."
                prop="openPatternNo"
                :rules="rules.openPatternNo"
                placeholder="3"
              />
            </el-col>
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.rawPatternNo"
                label="RAW Pattern No."
                prop="rawPatternNo"
                :rules="rules.rawPatternNo"
                placeholder="4"
              />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.preTegPatternMeasShot"
                label="Pre-Teg Pattern Meas Shot"
                prop="preTegPatternMeasShot"
                :rules="rules.preTegPatternMeasShot"
                placeholder="Pre TEG 측정 샷 EX) 3_4, 4_3"
              />
            </el-col>
          </el-row>
          <SelectImage @update-file="handleFileUpdate"></SelectImage>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="split-layout">
        <div class="form-box">
          <div class="meas-types-container">
            <WaferInformationUpdate
              label="Wafer 매수"
              prop="waferQuantity"
              :rules="rules.waferQuantity"
              :wafer-quantity="tegApplicationForm.waferQuantity"
              :wafer-information="tegApplicationForm.waferInformation"
              @update-wafer="handleWaferUpdate"
            />

            <SelectOption
              v-model="tegApplicationForm.waferSize"
              label="Wafer Size"
              prop="waferSize"
              :rules="rules.waferSize"
              :options="waferSizeList"
              placeholder=""
            ></SelectOption>
            <Wafer
              :waferInfo="tegApplicationForm.shotInformation"
              @updateActiveShots="handleActiveShots"
            />
          </div>
        </div>
        <div class="form-box">
          <div class="meas-types-container">
            <MeasType @updateMeasInfo="updateMeasInfo" />

            <MeasTemperature
              :measInfo="tegApplicationForm.measInfo"
              @updateTemperature="handleTemperatures"
            ></MeasTemperature>

            <Segmentation
              :measInfo="tegApplicationForm.measInfo"
              @forwardUpdate="handleFinalUpdate"
            />
          </div>

          <span
            ><el-button type="primary" @click="handleFormSubmission"
              >의뢰서 작성</el-button
            ></span
          >
          /
          <span>
            <el-button
              type="primary"
              @click="handleDownload"
              :disabled="!activateDownload"
              >의뢰서 다운로드</el-button
            >
          </span>
        </div>
      </div>
    </div>

    
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { FormInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";
// type 정의
import { getWaferInfoBySize } from "./../../../utils/waferApplicationHelper";
import {
  defaultTegApplicationForm,
  applicationPriority,
  maskChanges,
  portOptions,
  waferSizeList,
} from "./../../../utils/tegTypes";
import { tegApplicationRules } from "./../../../utils/tegApplicationRules";
import { submitForm, download } from "./../../../utils/tegUtility";
import {
  cloneApplicationDetail
} from "./LoadTegApplication";

// 하위 component 정의
import InputText from "./InputText.vue"; // assuming generic text input component
import LongInputText from "./LongInputText.vue"; // assuming generic text input component
import MeasType from "./MeasType.vue";
import SelectImage from "./SelectImage.vue";
import SelectOption from "./SelectOption.vue"; // assuming generic text input component
import Segmentation from "./Segmentation.vue";
import MeasTemperature from "./MeasTemperature.vue";
import Wafer from "../Wafer.vue";
import WaferInformationUpdate from "./WaferInfomation.vue";

const route = useRoute();
const activateDownload = ref(false);
const applicationUuid = ref('');
const applicationForm = ref<FormInstance>();
const selectedFile = ref<File | null>(null);


const tegApplicationForm = defaultTegApplicationForm();
// const tegApplicationForm = tegApplicationForm;
const requesterName = localStorage.getItem("ms_username");
tegApplicationForm.requester = requesterName

const rules = tegApplicationRules;

// UUID 변경 감지
watch(
  () => route.params.uuid,
  (newUuid) => {
    if (newUuid) {
      // getApplicationDetail(newUuid, tegApplicationForm);
      cloneApplicationDetail(newUuid, tegApplicationForm)
    }
  },
  { immediate: true }
); // immediate: true 옵션으로 컴포넌트 마운트 시 즉시 실행

function handleFormSubmission() {
  if (applicationForm.value) {
    activateDownload.value = false;
    submitForm(
      applicationForm.value,
      tegApplicationForm,
      selectedFile.value,
      activateDownload,
      applicationUuid
    );
  } else {
    console.error("Form is not yet initialized.");
  }
}

function handleWaferUpdate(quantity, information) {
  tegApplicationForm.waferQuantity = quantity;  
  tegApplicationForm.waferInformation = information;
}

let activeShots = [];

// Watch for changes in wafer size and call the getWaferInfoBySize function
watch(
  () => tegApplicationForm.waferSize,
  (newSize, oldSize) => {
    if (newSize) {
      Object.assign(
        tegApplicationForm.shotInformation,
        getWaferInfoBySize(newSize)
      );
      // console.log(tegApplicationForm.shotInformation); // Logs updated wafer info for debugging
    }
  }
);

const handleActiveShots = (shots) => {
  activeShots = shots;
  tegApplicationForm.activeShots = activeShots;
};

const handleDownload = async () => {
  const temp = applicationUuid.value
  
  await download(temp);
}

// 자식 컴포넌트에서 보낸 measInfo 데이터로 form.measInfo 업데이트
const updateMeasInfo = (newMeasInfo) => {
  tegApplicationForm.measInfo = newMeasInfo;
};

function handleTemperatures(values) {
  tegApplicationForm.temperatures = values;
}

// measInfo 업데이트 핸들러
const handleFinalUpdate = (updatedMeasInfo, index) => {
  tegApplicationForm.measInfo[index] = updatedMeasInfo;
  tegApplicationForm.measInfo = [...tegApplicationForm.measInfo]; // 반응성 유지
};

const handleFileUpdate = (file: File | null) => {
  selectedFile.value = file;
};
</script>

<style>
.container {
  width: 90%;
  max-width: 90%;
}

.split-layout {
  display: flex;
  flex-wrap: nowrap;
}

.form-box {
  flex: 1;
  margin-right: 20px; /* 폼 박스 간의 간격 조정 */
}

.form-box:last-child {
  margin-right: 0;
}

.el-form-item {
  margin-bottom: 20px;
}

.meas-types-container {
  max-width: 100%;
  margin: 10px 0;
  background-color: #fff; /* Light background for better visibility */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}
</style>
