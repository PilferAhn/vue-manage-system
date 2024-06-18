<template>
  <el-form
    :model="tegApplicationForm"
    :rules="tegApplicationRules"
    ref="applicationForm"
    label-position="top"
    label-width="100px"
  >
    <div v-if="role === 'admin'" class="container">
      <QR :application-uuid="route.params.uuid"></QR>
    </div>


    <div class="container">
      <div class="split-layout">
        <div class="form-box">
          <div class="meas-types-container">
            <div v-if="role === 'admin'">
            <el-form-item label="고유 식별 번호">
              <el-col :span="11">
                <InputText
                  v-model="route.params.uuid"
                  label=""
                  prop="amin"                  
                  placeholder="운영자"
                />
              </el-col>
            </el-form-item>
          </div>
            <el-form-item label="상태">
              <el-col :span="11">
                <ApplicationStatus
                  v-model="tegApplicationForm.status"
                  label=""
                  prop="designer"
                  :rules="rules.designer"
                  placeholder="상태"
                  :wafer-information="tegApplicationForm.waferInformation"
                />
              </el-col>
              <!-- <el-col class="line" :span="2">/</el-col> -->
              <el-col :span="11">
                <!-- <InputText
                  v-model="tegApplicationForm.requester"
                  label=""
                  prop="requester"
                  :rules="rules.requester"
                  placeholder="의뢰자"
                /> -->
              </el-col>
            </el-form-item>
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
            <el-col :span="12">
              <select-option
                v-model="tegApplicationForm.priority"
                label="측정 등급"
                prop="priority"
                :rules="rules.priority"
                placeholder="측정 등급"
                :options="priorityList"
              ></select-option>
            </el-col>
          </el-row>
          <LoadImage
            :application-uuid="tegApplicationForm.uuid"
            :image-type="'layout'"
          ></LoadImage>
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
              :temperature="tegApplicationForm.temperatures"
            ></MeasTemperature>

            <Segmentation
              :measInfo="tegApplicationForm.measInfo"
              @forwardUpdate="handleFinalUpdate"
            />
          </div>
          <!-- {{ tegApplicationForm.status }} -->
          <span v-if="tegApplicationForm.status === 'created'">
            <el-button
              type="primary"
              @click="handleFormSubmission"
              :disabled="role !== 'admin'"
              >업데이트</el-button
            >
            <span> / </span>
          </span>
          <el-button type="success" @click="changeRouter"
            >비슷한 의뢰서 만들기</el-button
          >
          <span> / </span>
          <el-button type="primary" @click="handleDownload"
            >의뢰서 다운로드</el-button
          >
          <span> / </span>
          <el-button type="danger" @click="handleAppRemove">삭제</el-button>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { FormInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";

// type 정의

import {
  defaultTegApplicationForm,
  applicationPriority,
  maskChanges,
  portOptions,
  waferSizeList,
} from "./../../../utils/tegTypes";
import { tegApplicationRules } from "./../../../utils/tegApplicationRules";
import {
  getApplicationDetail,
  priorityList,
  sendRemoveRequest,
  moveToAnotherRoute,
} from "./LoadTegApplication";
import { download } from "./../../../utils/tegUtility";

// 하위 component 정의
import ApplicationStatus from "./ApplicationStatus.vue";
import InputText from "./InputText.vue"; // assuming generic text input component
import LongInputText from "./LongInputText.vue"; // assuming generic text input component
import MeasType from "./MeasType.vue";
import LoadImage from "./LoadImage.vue";
import SelectOption from "./SelectOption.vue"; // assuming generic text input component
import Segmentation from "./Segmentation.vue";
import MeasTemperature from "./LoadMeasTemperature.vue";
import Wafer from "../Wafer.vue";
import WaferInformationUpdate from "./WaferInfomationLoad.vue";
import QR from "./QR.vue";

const route = useRoute();
const router = useRouter();
// const { tegApplication } = useApplicationUUID(
//   route.params.uuid
// );

const applicationForm = ref<FormInstance>();
const selectedFile = ref<File | null>(null);
const tegApplicationForm = defaultTegApplicationForm();
const rules = tegApplicationRules;
const role = localStorage.getItem("ms_username");

// UUID 변경 감지
watch(
  () => route.params.uuid,
  (newUuid) => {
    if (newUuid) {
      getApplicationDetail(newUuid, tegApplicationForm);
    }
  },
  { immediate: true }
); // immediate: true 옵션으로 컴포넌트 마운트 시 즉시 실행

function handleFormSubmission() {
  if (applicationForm.value) {
    console.log(tegApplicationForm);
    // submitForm(applicationForm.value, tegApplicationForm, selectedFile.value);
  } else {
    console.error("Form is not yet initialized.");
  }
}

function handleAppRemove() {
  sendRemoveRequest(tegApplicationForm.uuid, router);
}

function handleWaferUpdate(quantity, information) {
  tegApplicationForm.waferQuantity = quantity;
  tegApplicationForm.waferInformation = information;
}

let activeShots = [];

const handleActiveShots = (shots) => {
  activeShots = shots;
  tegApplicationForm.activeShots = activeShots;
};

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

function changeRouter() {
  const someData = {
    uuid: tegApplicationForm.uuid,
  };

  moveToAnotherRoute("CloneTegApplication", tegApplicationForm.uuid, router);
}

const handleDownload = async () => {
  const temp = tegApplicationForm.uuid;
  await download(temp);
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
