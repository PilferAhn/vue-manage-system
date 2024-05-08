<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="100px">
      <div class="split-layout">
        <!-- 첫 번째 컬럼의 내용 -->
        <div class="form-box">
          <el-form-item label="고객사 정보">
            <el-input v-model="form.customerCompany"></el-input>
          </el-form-item>

          <el-form-item label="제품 스팩" class="form-item-spacing">
            <el-col :span="6">
              <el-form-item>
                <el-input
                  v-model="form.specTemperature"
                  placeholder="Temperature"
                  :disabled="!form.isSpecEdit"
                />
                <!-- <el-button v-if="isEditable" @click="enableEditing"
                >직접 입력</el-button
              > -->
              </el-form-item>
            </el-col>
            <el-col class="line" :span="3">/</el-col>
            <el-col :span="6">
              <el-input
                v-model="form.specPower"
                placeholder="Input Power"
                :disabled="!form.isSpecEdit"
              />
            </el-col>

            <el-col class="line" :span="3">/</el-col>
            <el-col :span="6">
              <el-checkbox v-model="form.isSpecEdit">직접 입력</el-checkbox>
            </el-col>
          </el-form-item>

          <el-form-item label="설계정보" prop="band">
            <el-col :span="6">
              <el-form-item prop="modelName">
                <el-input
                  placeholder="기종명"
                  v-model="form.modelName"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="3">/</el-col>
            <el-col :span="6">
              <el-form-item prop="ps">
                <el-input
                  placeholder="설계 차수"
                  v-model="form.condition"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

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

          <el-form-item label="의뢰목적" prop="purpose">
            <el-input v-model="form.purpose"></el-input>
          </el-form-item>

          <el-form-item label="작성일">
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker
                  type="date"
                  placeholder="샘플 전달일"
                  v-model="form.dateOfCreated"
                  style="width: 100%"
                  disabled
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="제품 정보">
            <el-col :span="11">
              <el-form-item prop="waferType">
                <el-input
                  placeholder="ex) HS, NS, TC"
                  v-model="form.waferType"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">/</el-col>
            <el-col :span="11">
              <el-form-item prop="productType">
                <el-input
                  placeholder="ex) CSP / WLP"
                  v-model="form.packageType"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="Test 종류">
            <el-form-item>
              <el-input
                placeholder="Type"
                v-model="form.testType"
                style="width: 100%"
              >
              </el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item label="Signal">
            <el-col :span="6">
              <el-form-item>
                <el-input
                  placeholder="Type"
                  v-model="form.signalType"
                  style="width: 100%"
                >
                </el-input>
              </el-form-item>
            </el-col>

            <el-col class="line" :span="3">/</el-col>

            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.duplexMode"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="3">/</el-col>

            <el-col :span="5">
              <el-form-item>
                <el-input
                  placeholder="Type"
                  v-model="form.band"
                  style="width: 100%"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="Position" prop="position">
            <el-input
              placeholder="Type"
              v-model="form.targetPosition"
              style="width: 100%"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="실험 온도">
            <el-input
              placeholder="Temperature"
              v-model="form.temperature"
              style="width: 100%"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="수량" prop="sample_quantity">
            <el-select
              v-model="form.sampleQuantity"
              placeholder="Select a number"
            >
              <el-option
                v-for="i in 30"
                :key="i"
                :label="i"
                :value="i"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="form.sampleQuantity >= 1"
            label="SPL 정보"
            prop="test-position"
          >
            <el-table :data="form.samples" style="width: 100%">
              <el-table-column label="Sample Number" prop="sampleNumber">
                <template #default="{ row }">
                  <el-input v-model="row.sample_number"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="Target" prop="targetFreq">
                <template #default="{ row }">
                  <el-input v-model="row.target_freq"></el-input>
                </template>
              </el-table-column>

              <el-table-column label="상태" prop="selfHeating">
                <template #default="{ row }">
                  <el-select v-model="row.status">
                    <el-option key="cancel" label="취소" value="cancel" />
                    <el-option
                      key="waiting"
                      label="측정 대기"
                      value="waiting"
                    />
                    <el-option key="finished" label="완료" value="finished" />
                    <el-option
                      key="in progress"
                      label="측정중"
                      value="in progress"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="특이사항" prop="detail">
            <el-input
              type="textarea"
              rows="10"
              v-model="form.detail"
            ></el-input>
          </el-form-item>
        </div>

        <!-- 두 번째 컬럼의 내용 -->
        <div class="form-box">
          <el-form-item label="의뢰번호" prop="requestNumber">
            <el-col :span="11">
              <el-input
                placeholder="ex) 24-123"
                v-model="form.requestNumber"
                style="width: 100%"
              ></el-input>
            </el-col>
            <el-col class="line" :span="2">/</el-col>
            <el-col :span="11">
              <el-button type="info" @click="generateRequstNumber(form)" round
                >의뢰번호 생성</el-button
              >
            </el-col>
          </el-form-item>

          <el-form-item label="진행상황" prop="status">
            <el-col :span="11">
              <el-select
                v-model="form.status"
                placeholder="상태 선택"
                style="width: 100%"
              >
                <el-option label="의뢰서 작성 완료" value="created"></el-option>
                <el-option label="투입 대기" value="reserved"></el-option>
                <el-option label="측정 완료" value="finished"></el-option>
                <el-option label="측정 진행중" value="in progress"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <!-- <el-form-item label="소요시간">
            <el-col :span="11">
              <el-form-item prop="requestToCompletionDuration">
                <el-input
                  placeholder="소요시간 의뢰일-완료일 [day]"
                  v-model="form.expectedCompletionDate"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col class="line" :span="2">/</el-col>

            <el-col :span="11">
              <el-form-item prop="startToCompletionDuration">
                <el-input
                  placeholder="소요시간 투입일-완료일 [day]"
                  v-model="form.startToCompletionDuration"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item> -->

          <el-form-item label="의뢰일">
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker
                  type="date"
                  placeholder="의뢰일"
                  v-model="form.dateOfSampleConvey"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">/</el-col>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker
                  type="date"
                  placeholder="투입일"
                  v-model="form.expectedMeasurementDate"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="완료일">
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="form.expectedCompletionDate"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <div v-if="form.testType !== 'Life'">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <el-form-item>
            <div class="mb-4">
              <el-button type="primary" @click="onSubmit()" round>
                업데이트
              </el-button>
              <el-button type="info" @click="downloadExcel(uuid)" round>
                의뢰서 다운로드
              </el-button>
              <el-button type="danger" disabled round> 삭제 </el-button>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="baseform">
// 외부 라이브러리
import { reactive, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Chart } from "chart.js";
import { ElMessageBox, ElMessage } from "element-plus";

// 타입 정의
import type { FormInstance, FormRules } from "element-plus";

// 로컬 유틸리티 함수 및 설정
import { getCurrentDate } from "../../utils/utility";
import { createApplicationForm } from "../../utils/form";
import {
  createRequestNumber,
  downloadExcel,
} from "../../utils/applicationUtility";
import {
  getRequestNumber,
  getCurrentYearLastTwoDigits,
} from "../../utils/adminUtility";
import { drawChart } from "../../utils/chartHelper";

const rules: FormRules = {
  requestNumber: [
    { required: true, message: "의뢰번호를 입력해주세요.", trigger: "blur" },
  ],
  status: [
    { required: true, message: "진행상황을 입력해주세요.", trigger: "blur" },
  ],
};

// useRoute 훅을 사용하여 현재 라우트 객체를 가져옵니다.
const route = useRoute();

// route.params에서 uuid 값을 추출합니다.
const uuid = route.params.uuid;

// uuid 값을 사용하여 필요한 데이터를 가져오는 로직을 여기에 추가하세요.
// 예를 들어, API 호출을 통해 uuid에 해당하는 상세 정보를 불러올 수 있습니다.

const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "요소기술그룹" : "요소기술그룹";

// reactive 객체를 사용하여 form 상태를 정의합니다.
const formRef = ref<FormInstance>();

const form = createApplicationForm();

// 오류를 막기 위해서
// 몇몇 값의 날짜를 오늘로 기본 셋팅하고 데이터에 접근한다.
form.desiredCompletionDate = getCurrentDate();
form.expectedCompletionDate = getCurrentDate();
form.expectedMeasurementDate = getCurrentDate();

const fetchApplicationDetail = async () => {
  try {
    const response = await axios.post(
      "pdt_application/get_application_detail",
      { uuid: uuid }
    );
    // 받아온 데이터를 reactive form 객체에 할당합니다.

    form.requestNumber = response.data.request_number;

    form.status = response.data.status;

    form.customerCompany = response.data.customer_company;
    form.specTemperature = response.data.spec_temperature;
    form.specPower = response.data.spec_power;
    form.isSpecEdit = response.data.is_spec_edit;

    form.modelName = response.data.model_name;
    form.condition = response.data.condition;

    form.signalType = response.data.signal_type;
    form.band = response.data.band;
    form.duplexMode = response.data.duplex_mode;
    form.bandwidth = response.data.bandwidth;

    form.designer = response.data.designer;
    form.requester = response.data.requester;

    form.dateOfSampleConvey = getCurrentDate();
    form.purpose = response.data.purpose;

    form.waferType = response.data.wafer_type;

    form.packageType = response.data.package_type;
    form.temperature = response.data.temperature;
    form.detail = response.data.detail;

    form.testType = response.data.test_type;
    form.targetPosition = response.data.target_position.toUpperCase();

    form.samples = response.data.samples;
    form.sampleQuantity = response.data.samples.length;

    form.dateOfCreated = response.data.date_of_created;
  } catch (error) {
    console.error(error);
  }
};

// 컴포넌트가 마운트될 때 HTTP 요청을 보냄

onMounted(fetchApplicationDetail);

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitData();
      // 폼 제출 로직
    } else {
      ElMessage.error("Form is invalid");
    }
  });
};

const generateRequstNumber = async(form) => {
  // form.requestNumber =  createRequestNumber();
  
  const year = getCurrentYearLastTwoDigits()
  const response = await getRequestNumber("pdt")
  
  form.requestNumber = year.toString() + "-" + response.toString()
  
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const submitData = async () => {
  try {
    form.expectedMeasurementDate = formatDate(form.expectedMeasurementDate);
    form.expectedCompletionDate = formatDate(form.expectedCompletionDate);
    form.desiredCompletionDate = formatDate(form.desiredCompletionDate);

    const const_data_dict = {
      request_number: form.requestNumber,
      status: form.status,
      uuid: uuid,

      expected_measurement_date: form.expectedMeasurementDate,
      expected_completion_date: form.expectedCompletionDate,
      desired_completion_date: form.desiredCompletionDate,

      customer_company: form.customerCompany,
      spec_temperature: form.specTemperature,
      spec_power: form.specPower,
      is_spec_edit: form.isSpecEdit,

      model_name: form.modelName,
      condition: form.condition,

      signal_type: form.signalType,
      band: form.band,
      duplex_mode: form.duplexMode,
      bandwidth: form.bandwidth,

      designer: form.designer,
      requester: form.requester,

      purpose: form.purpose,
      date_of_sample_convey: form.dateOfSampleConvey,

      wafer_type: form.waferType,

      package_type: form.packageType,

      detail: form.detail,

      test_type: form.testType,
      target_position: form.targetPosition,
      samples: form.samples,

      temperature: form.temperature,
    };

    const response = await axios.post(
      "/pdt_application/update_appliction",
      const_data_dict
    );

    if (response.data.status == false) {
      ElMessage.error(response.data.message);
    } else {
      ElMessage.success("의뢰서가 성공적으로 업데이트 되었습니다.");
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let myChart: Chart | null = null;

onMounted(() => {
  // 샘플 데이터를 가져와서 차트를 그리는 로직
  myChart = drawChart(chartCanvas.value!, form.samples, myChart);
});

watch(
  () => form.samples,
  (newSamples) => {
    myChart = drawChart(chartCanvas.value!, newSamples, myChart);
  },
  { immediate: true }
);
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
</style>
