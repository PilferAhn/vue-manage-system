<script lang="ts">
export default {};
</script>
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
            <el-form-item label="작성자 / 의뢰자" :rules="rules.designer">
              <el-col :span="11">
                <!-- <InputText
                  v-model="tegApplicationForm.designer"
                  label=""
                  prop="designer"
                  :rules="rules.designer"
                  placeholder="개발자"
                /> -->
                <el-form-item>
                  <el-autocomplete
                    v-model="tegApplicationForm.designer"
                    placeholder="개발자를 입력하세요"
                    :fetch-suggestions="
                      (queryString, cb) =>
                        querySearch(queryString, cb, 'designer')
                    "
                    @select="(item) => handleSelect(item, 'designer')"
                    value-key="label"
                    :style="{ width: '100%' }"
                  ></el-autocomplete>
                </el-form-item>
                <!-- 의뢰자 입력 -->
              </el-col>
              <el-col class="line" :span="2">/</el-col>
              <el-col :span="11">
                <el-form-item>
                  <el-autocomplete
                    v-model="tegApplicationForm.requester"
                    placeholder="의뢰자를 입력하세요"
                    :fetch-suggestions="
                      (queryString, cb) =>
                        querySearch(queryString, cb, 'requester')
                    "
                    @select="(item) => handleSelect(item, 'requester')"
                    value-key="label"
                    class="wide-select"
                    :style="{ width: '100%' }"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-form-item>

            <SelectOptionsNew2
              v-model="tegApplicationForm.waferType"
              label="Wafer Type"
              placeholder="HS / NS / TC"
              :rules="rules.waferType"
              :options="waferTypeList"
              :prop="'waferType'"
              :disable="false"
              :need-bold="false"
            ></SelectOptionsNew2>

            <SelectOptionsNew2
              v-model:="tegApplicationForm.packageType"
              label="Package Type"
              placeholder="CSP / WLP / BDMP"
              :rules="rules.packageType"
              :options="packageList"
              :prop="'packageType'"
              :disable="false"
              :need-bold="false"
            ></SelectOptionsNew2>

            <SelectOptionsNew2
              v-model="tegApplicationForm.applicationType"
              label="의뢰 구분"
              :rules="rules.applicationType"
              placeholder="의뢰 구분"
              :options="applicationGroupOptions"
              :prop="'applicationType'"
              :disable="false"
              :need-bold="false"
            ></SelectOptionsNew2>

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
              :rules="null"
              placeholder="ex) 신뢰성 테스트"
            />

            <LongInputText
              v-model="tegApplicationForm.note"
              label="특이 사항"
              prop="note"
              :rules="null"
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
                label="Wafer 1매당 측정 CHIP 수"
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
                label="AOI 유무"
                prop="isAOI"
                :rules="null"
                placeholder="AOI 유무"
                :options="maskChanges"
              ></select-option>
            </el-col>
            <el-col :span="12">
              <el-form-item label="DVR 유무"
                ><el-switch v-model="tegApplicationForm.isDvr"></el-switch
              ></el-form-item>
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
          <!-- <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.openPatternNo"
                label="OPEN Pattern No."
                prop=""
                :rules="rules.openPatternNo"
                placeholder="3"
              />
            </el-col>
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.rawPatternNo"
                label="RAW Pattern No."
                prop=""
                :rules="[]"
                placeholder="4"
              />
            </el-col>
          </el-row> -->
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="tegApplicationForm.preTegPatternMeasShot"
                label="Pre-Teg Pattern Meas Shot"
                prop="preTegPatternMeasShot"
                :rules="null"
                placeholder="Pre TEG 측정 샷 EX) 3_4, 4_3"
              />
            </el-col>
          </el-row>
          <ApplicationFiles
            :application-data="props.applicationData"
            :application-type="props.applicationType"
            v-model:files="selectFiles"
          ></ApplicationFiles>
          <SelectImage @update-file="handleFileUpdate"></SelectImage>
          <LoadImage
            v-if="!['create', 'clone'].includes(props.applicationType)"
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
              v-if="getUserId() === 'admin' && props.applicationType === 'load'"
              label="Wafer 매수"
              prop="waferQuantity"
              :rules="rules.waferQuantity"
              :wafer-quantity="tegApplicationForm.waferQuantity"
              :wafer-information="tegApplicationForm.waferInformation"
              @update-wafer="handleWaferUpdate"
            />

            <WaferInformation
              label="Wafer 매수"
              prop="waferQuantity"
              :rules="rules.waferQuantity"
              :wafer-quantity="tegApplicationForm.waferQuantity"
              :wafer-information="tegApplicationForm.waferInformation"
              @update-wafer="handleWaferUpdate"
            ></WaferInformation>

            <SelectOption
              v-model="tegApplicationForm.waferSize"
              label="Wafer Size"
              prop="waferSize"
              :rules="rules.waferSize || []"
              :options="waferSizeList"
              placeholder=""
            ></SelectOption>
            <Wafer
              :waferInfo="tegApplicationForm.shotInformation"
              @updateActiveShots="handleActiveShots"
              :application-type="props.applicationType"
            />
          </div>
        </div>
        <div class="form-box">
          <div class="meas-types-container">
            <MeasType
              :application-data="props.applicationData"
              :application-type="props.applicationType"
              @updateMeasInfo="updateMeasInfo"
            />

            <MeasTemperature
              :measInfo="tegApplicationForm.measInfo"
              :tegTypes="tegTypes"
              :teg-application="props.applicationData"
              :application-type="props.applicationType"
              @updateTemperature="handleTemperatures"
            ></MeasTemperature>

            <Segmentation
              :measInfo="tegApplicationForm.measInfo"
              @forwardUpdate="handleFinalUpdate"
            />
          </div>

          <span v-if="['create', 'clone'].includes(props.applicationType)"
            ><el-button type="primary" @click="handleFormSubmission"
              >의뢰서 작성</el-button
            >
            <span> / </span>
          </span>
          <!-- <span v-else-if="props.applicationType === 'load'"
            ><el-button type="primary" @click="handleFormSubmission" disabled
              >업데이트</el-button
            ></span
          > -->

          <span v-if="['load', 'create'].includes(props.applicationType)">
            <el-button type="primary" @click="handleDownload"
              >의뢰서 다운로드</el-button
            >
          </span>

          <span v-if="['load', 'clone'].includes(props.applicationType)">
            <span v-if="['load'].includes(props.applicationType)">
              <span> / </span>
              <el-button type="success" @click="changeRouter"
                >비슷한 의뢰서 만들기</el-button
              >
            </span>
            <span> / </span>
            <el-button type="danger" @click="handleAppRemove">삭제</el-button>
          </span>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { FormInstance } from "element-plus";

// type 정의
import {
  applicationPriority,
  maskChanges,
  portOptions,
  waferSizeList,
  waferTypeList,
  packageList,
} from "./../../../utils/tegTypes";

import { getWaferInfoBySize } from "./../../../utils/waferApplicationHelper";
import type {
  TegApplication as TegApplicationInterface,
  TestTypeOptions as TestTypeOptionsInterface,
} from "../Common/ApplicationTypes";
import { tegApplicationRules } from "./../../../utils/tegApplicationRules";
import { submitForm2, download } from "./../../../utils/tegUtility";

import { applicationGroupOptions } from "../../../utils/dropdown-options";
// 기능

import { tegTypes } from "../Common/utility";
import { useUserOptions } from "../../Common/utility";
import { useRouter } from "vue-router";
// 하위 component 정의
import InputText from "./InputText.vue"; // assuming generic text input component
import LongInputText from "./LongInputText.vue"; // assuming generic text input component
import MeasType from "./MeasType.vue";
import SelectImage from "./SelectImage.vue";
import SelectOption from "./SelectOption.vue"; // assuming generic text input component
import Segmentation from "./Segmentation.vue";
import MeasTemperature from "./MeasTemperature.vue";
import Wafer from "../Wafer.vue";
import WaferInformationUpdate from "./WaferInfomationload.vue";
import WaferInformation from "./WaferInfomation.vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import ApplicationFiles from "./TegApplicationFiles.vue";
import { sendRemoveRequest } from "./LoadTegApplication";
import { getUserId } from "../../../utils/account-utils";
import LoadImage from "./LoadImage.vue";

// Define props to receive processData
const props = defineProps<{
  applicationData: TegApplicationInterface;
  applicationType: string;
}>();

const { userOptions } = useUserOptions();
// 사용자의 입력을 기준으로 필터링된 결과를 반환하는 공통 함수
const querySearch = (
  queryString: string,
  cb: (suggestions: { value: string; label: string; key: string }[]) => void,
  fieldType: string // 'designer' 또는 'requester'로 구분
) => {
  const results = userOptions.value.filter((user) =>
    user.label.toLowerCase().includes(queryString.toLowerCase())
  );
  cb(results);
};

// 개발자와 의뢰자 선택 시 처리하는 공통 함수
const handleSelect = (
  item: { value: string; label: string },
  fieldType: string
) => {
  const selectedUser = userOptions.value.find(
    (user) => user.label === item.label
  );
  if (selectedUser) {
    if (fieldType === "designer") {
      props.applicationData.designerId = selectedUser.value; // 개발자 ID 할당
    } else if (fieldType === "requester") {
      props.applicationData.requesterId = selectedUser.value; // 의뢰자 ID 할당
    }
  }
};

const activateDownload = ref(false);
const applicationUuid = ref("");
const applicationForm = ref<FormInstance>();
const selectedFile = ref<File | null>(null);
const selectFiles = ref<File[]>([]);

const tegApplicationForm = props.applicationData;
// const tegApplicationForm = tegApplicationForm;
const requesterName = localStorage.getItem("ms_username");
tegApplicationForm.requester = requesterName;

const rules = tegApplicationRules;

function handleFormSubmission() {
  if (applicationForm.value) {
    activateDownload.value = false;

    submitForm2(
      applicationForm.value,
      tegApplicationForm,
      selectedFile.value,
      selectFiles.value,
      activateDownload,
      applicationUuid,
      tegTypes
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
      if (["create", "clone"].includes(props.applicationType)) {
        Object.assign(
          tegApplicationForm.shotInformation,
          getWaferInfoBySize(newSize)
        );

        if (tegApplicationForm.shotInformation.shots.length == 169) {
          tegApplicationForm.shotInformation.status[48] = "activate";
          tegApplicationForm.shotInformation.status[72] = "activate";
          tegApplicationForm.shotInformation.status[96] = "activate";
          tegApplicationForm.shotInformation.status[120] = "activate";
        }
      }
    }
  }
);

watch(
  () => tegApplicationForm.applicationType,
  (newVal) => {
    if (
      ["차세대공법그룹", "차세대SAW그룹 - TEG", "상품화개발 - TEG"].includes(
        newVal
      )
    ) {
      tegApplicationForm.isAOI = "X";
    } else {
      tegApplicationForm.isAOI = "O";
    }
  }
);

const handleActiveShots = (shots) => {
  activeShots = shots;
  tegApplicationForm.activeShots = activeShots;
};

const handleDownload = async () => {
  const temp = props.applicationData.uuid;
  await download(temp);
};

// 자식 컴포넌트에서 보낸 measInfo 데이터로 form.measInfo 업데이트
const updateMeasInfo = (newMeasInfo) => {
  tegApplicationForm.measInfo = newMeasInfo;
};

function handleTemperatures(values) {
  tegApplicationForm.temperatures = values;
}

function handleAppRemove() {
  sendRemoveRequest(tegApplicationForm.uuid, router);
}

// measInfo 업데이트 핸들러
const handleFinalUpdate = (updatedMeasInfo, index) => {
  tegApplicationForm.measInfo[index] = updatedMeasInfo;
  tegApplicationForm.measInfo = [...tegApplicationForm.measInfo]; // 반응성 유지
};

const handleFileUpdate = (file: File | null) => {
  selectedFile.value = file;
};

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

async function changeRouter() {
  try {
    await router.push({
      name: "CloneTegApplication",
      params: { uuid: tegApplicationForm.uuid },
    });
  } catch (error) {
    console.error("Routing error:", error);
  }
  // moveToAnotherRoute("CloneTegApplication", tegApplicationForm.uuid, router);
}
</script>

<style>
@import "../../../assets/css/TegApplication.css";
</style>
