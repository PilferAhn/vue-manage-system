<template>
  <el-form
    :model="form"
    :rules="TegApplicationRules"
    ref="ruleFormRef"
    label-width="100px"
  >
    <div class="container">
      <div class="split-layout">
        <div class="form-box">
          <div class="meas-types-container">
            <el-form-item label="작성자">
              <el-col :span="11">
                <el-form-item prop="designer">
                  <el-input
                    placeholder="개발자"
                    v-model="form.designer"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">/</el-col>
              <el-col :span="11">
                <el-form-item prop="requester">
                  <el-input
                    placeholder="의뢰자"
                    v-model="form.requester"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>

            <application-priority
              :priority="form.priority"
              :applicationType="form.applicationType"
              @update="handlePriorityUpdate"
            ></application-priority>

            <el-form-item label="의뢰목적" prop="purpose">
              <el-input
                v-model="form.purpose"
                placeholder="ex) 신뢰성 테스트"
              ></el-input>
            </el-form-item>

            <ModelName
              :modelName="form.modelName"
              @updateModelName="handleModelName"
            />

            <el-form-item label="Lot ID" prop="LotID">
              <el-input
                v-model="form.lotID"
                placeholder="ex) NCHDE04703"
              ></el-input>
            </el-form-item>

            <el-form-item label="특이사항">
              <el-input
                type="textarea"
                rows="15"
                v-model="form.note"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-box">
          <tegSize
            :shotSize="form.shotSize"
            :chipSize="form.chipSize"
            :chipQuantity="form.chipQuantity"
            :maskName="form.maskName"
            :isMaskChange="form.isMaskChange"
            :port="form.port"
            @updateSizes="handleSizeUpdate"
          />
          <pre-teg @updatePattern="handlePartternUpdates"></pre-teg>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="split-layout">
        <div class="form-box">
          <div class="meas-types-container">
            <WaferInfomation 
              :waferQuantity="form.waferQuantity" 
              />

            <el-form-item label="Wafer Size">
              <el-select
                v-model="form.waferSize"
                placeholder="Select Wafer Size"
              >
                <el-option
                  v-for="size in waferSizeList"
                  :key="size"
                  :label="size.trim()"
                  :value="size.trim()"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <Wafer
            :waferInfo="waferInfoLoc"
            @updateActiveShots="handleActiveShots"
          />
        </div>

        <div class="form-box">
          <div class="meas-types-container">
            <MeasType @updateMeasInfo="updateMeasInfo" />
            <MeasTemperature
              :measInfo="form.measInfo"
              @updateTemperature="handleTemperatures"
            ></MeasTemperature>
            <Segmentation
              :measInfo="form.measInfo"
              @forwardUpdate="handleFinalUpdate"
            />
          </div>
          <el-button @click="submitForm">의뢰서 작성</el-button>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
// Vue 관련 기본 Imports
import { reactive, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

// Type Definitions
import type { FormInstance, FormRules } from "element-plus";


// Utilities and Helpers
import { TegApplicationRules } from "../../../utils/FromRule";
import {
  waferSizeList,
  getWaferInfoBySize,
  TegApplicationForm,
  TegFormRuleInterface
} from "../../../utils/waferApplicationHelper";

import {
  getTegApplicationDetail,
  TegApplication,
  waferInfo,
  loadApplicationDetails,
} from "../../../utils/waferMeasurementHelper";

// Component Imports
import ApplicationPriority from "./../Application/ApplicationPriority.vue";
import FrequacySection from "./../Application/FrequancySection.vue";
import MeasType from "./../Application/MeasType.vue";
import MeasTemperature from "./../Application/MeasTemperature.vue";
import ModelName from "./../Application/ModelName.vue";
import TegSize from "./../Application/TegSize.vue";
import PreTeg from "./../Application/PreTeg.vue";
import Segmentation from "./../Application/Segmentation.vue";
import Wafer from "./../Wafer.vue";
import WaferInfomation from "../Application/WaferInfomation.vue";


const application = ref<TegApplication>();
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const waferQuantity = ref(0);
const waferNames = ref([]);
const form = TegApplicationForm;

// useRoute 훅을 사용하여 현재 라우트 객체를 가져옵니다.
const route = useRoute();
// route.params에서 uuid 값을 추출합니다.
const uuid = route.params.uuid;
const waferInformation = ref<waferInfo[]>();

onMounted(() => {
  if (uuid) {
  
    loadApplicationDetails(uuid, form, waferInformation);

  
  }
});


const submitForm = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      console.log("Form is valid!");
      console.log(form)
      // 폼 제출 로직
    } else {
      console.log("Form validation failed!");
      return false;
    }
  });
};

const handlePriorityUpdate = ({ key, priority }) => {
  form.priority = priority;
  form.applicationType = key;
};

function handleModelName(modelName) {
  form.modelName = modelName;
}

function handleSelectedMeasTypes(selectedTypes) {
  form.measInfo = selectedTypes;
}

const handleFinalUpdate = (updatedInfo) => {
  // 이곳에서 measInfo를 업데이트합니다.
  form.measInfo = form.measInfo.map((info) =>
    info.id === updatedInfo.id ? updatedInfo : info
  );
};

// 자식 컴포넌트에서 보낸 measInfo 데이터로 form.measInfo 업데이트
const updateMeasInfo = (newMeasInfo) => {
  form.measInfo = newMeasInfo;
};

function handleTemperatures(values) {
  form.temperatures = values;
}

function handleSizeUpdate({
  shotSize,
  maskName,
  isMaskChange,
  chipSize,
  chipQuantity,
  port,
}) {
  form.shotSize = shotSize;
  form.chipSize = chipSize;
  form.maskName = maskName;
  form.isMaskChange = isMaskChange;
  form.chipQuantity = chipQuantity;
  form.port = port;
}

// 단일 이벤트 핸들러 함수를 정의합니다.
const handlePartternUpdates = (sizes) => {
  form.shotPatternNo = sizes.shotPatternNo;
  form.thruPatternNo = sizes.thruPatternNo;
  form.openPatternNo = sizes.openPatternNo;
  form.rawPatternNo = sizes.rawPatternNo;
};

function handleWaferInformationUpdate(data){
  form.waferQuantity = data.quantity;
  waferInformation.value = data.waferInfo
}

function handleWaferDataUpdate(data) {
  form.waferIDList = data.ids;
  form.waferQuantity = data.quantity;
}

const waferInfoLoc = reactive({
  shots: [],
  disableShots: [],
  size: 0,
  status: [],
});

let activeShots = [];

// Watch for changes in wafer size and call the getWaferInfoBySize function
watch(
  () => form.waferSize,
  (newSize, oldSize) => {
    if (newSize) {
      Object.assign(waferInfoLoc, getWaferInfoBySize(newSize));
      console.log(waferInfoLoc); // Logs updated wafer info for debugging
    }
  }
);

const handleActiveShots = (shots) => {
  activeShots = shots;
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
