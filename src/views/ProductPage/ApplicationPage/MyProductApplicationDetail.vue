<template>
  <div class="container">
    <el-form ref="formRef" :model="form" label-width="100px">
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

            <!-- <el-col class="line" :span="3">/</el-col>
              <el-col :span="6">
                <el-checkbox v-model="form.isSpecEdit">직접 입력</el-checkbox>
              </el-col> -->
          </el-form-item>

          <el-form-item label="설계정보" prop="band">
            <el-col :span="6">
              <el-form-item>
                <el-input
                  placeholder="Band"
                  v-model="form.band"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="3">/</el-col>
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

          <el-form-item label="측정 구분">
            <el-input
              placeholder="Type"
              v-model="form.testType"
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item label="측정 온도">
            <el-input
              placeholder="Type"
              v-model="form.temperature"
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item label="Position" prop="position">
            <el-input
              placeholder="Type"
              v-model="form.targetPosition"
              style="width: 100%"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="수량" prop="sample_quantity">
            <el-select
              v-model="form.sampleQuantity"
              placeholder="Select a number"
              disabled
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
              <!-- <el-table-column label="f -3dB @85" prop="freq3dB">
                  <template #default="{ row }">
                    <el-input v-model="row.db_3_freq"></el-input>
                  </template>
                </el-table-column> -->
              <el-table-column label="Target" prop="targetFreq">
                <template #default="{ row }">
                  <el-input v-model="row.target_freq"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="상태" prop="selfHeating">
                <template #default="{ row }">
                  <div
                    v-if="row.status === 'finished'"
                    :style="{ color: 'blue' }"
                  >
                    측정 완료
                  </div>
                  <div
                    v-else-if="row.status === 'in progress'"
                    :style="{ color: 'green' }"
                  >
                    측정 진행
                  </div>
                  <div
                    v-else-if="row.status === 'cancel'"
                    :style="{ color: 'red' }"
                  >
                    측정 취소됨
                  </div>
                  <div v-else :style="{ color: 'orange' }">측정 대기</div>
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
          <el-form-item label="의뢰번호" prop="request_number">
            <el-col :span="11">
              <el-input
                placeholder="ex) 24-123"
                v-model="form.requestNumber"
                style="width: 100%"
              ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="진행상황" prop="status">
            <el-col :span="11">
              <el-select
                v-model="form.status"
                placeholder="상태 선택"
                style="width: 100%"
                disabled
              >
                <el-option label="의뢰서 작성 완료" value="created"></el-option>
                <el-option label="투입 대기" value="reserved"></el-option>
                <el-option label="측정 완료" value="finished"></el-option>
                <el-option label="측정 진행 중" value="in progress"></el-option>
              </el-select>
            </el-col>
          </el-form-item>


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
                  disabled
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
                  disabled
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <div class="button-group">
              <!-- <el-button
                type="success"
                disabled
                @click="updateApplication()"
                
                >의뢰서 업데이트</el-button
              > -->
              <el-button type="info" @click="downloadExcel(route.params.uuid)"
                :disabled="excelUuid === ''"
                >의뢰서 다운로드</el-button
              >
            </div>
          </el-form-item>
          <div v-if="form.testType !== 'Life'">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="baseform">
import { reactive, ref, watch, onMounted, defineProps } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import axios from "axios";
import { getCurrentDate } from "../../../utils/utility";
import { createApplicationForm } from "../../../utils/form";
import { checkApplication, downloadExcel } from "../../../utils/applicationUtility"
import { useRoute } from "vue-router";
import { utils } from "xlsx";

import {
  Chart,
  ScatterDataPoint,
  ChartConfiguration,
  registerables,
  ChartType,
} from "chart.js";

// useRoute 훅을 사용하여 현재 라우트 객체를 가져옵니다.
const route = useRoute();

// route.params에서 uuid 값을 추출합니다.
const uuid = route.params.uuid;
const excelUuid = ref('')
Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);

const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "요소기술그룹" : "요소기술그룹";

// reactive 객체를 사용하여 form 상태를 정의합니다.
const formRef = ref<FormInstance>();
const form = createApplicationForm();

const fetchApplicationDetail = async (uuid) => {
  try {
    const response = await axios.post(
      "pdt_application/get_application_detail",
      { uuid: uuid }
    );
    // 받아온 데이터를 reactive form 객체에 할당합니다.

    form.requestNumber = response.data.request_number;

    form.status = response.data.status;

    form.customerCompany = response.data.customer_company.toUpperCase();
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

    form.detail = response.data.detail;

    form.testType = response.data.test_type;
    form.targetPosition = response.data.target_position.toUpperCase();
    form.temperature = response.data.temperature + "℃";
    form.samples = response.data.samples;

    form.sampleQuantity = response.data.samples.length;

    form.dateOfCreated = response.data.date_of_created;

    excelUuid.value = await checkApplication(uuid);
    console.log(excelUuid.value)

  } catch (error) {
    console.error(error);
  }
};

// 컴포넌트가 마운트될 때 데이터를 불러옵니다.
onMounted(() => {
  fetchApplicationDetail(uuid);
  
});

const updateApplication = async () => {
  try {

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
    };

    
    const response = await axios.post(
      "/pdt_application/update_appliction_by_user",
      const_data_dict
    );

    if(response.data.status == false){
      ElMessage.error(response.data.message);
    }
    else{
      ElMessage.success("의뢰서가 성공적으로 업데이트 되었습니다.");
    }    

  } catch (error) {
    
    console.error("Error:", error);
    // Handle the error as needed
  }
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

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px; /* 버튼 위의 여백 */
}

/* Element Plus에서 제공하는 'type' 속성에 의해 기본 스타일이 적용됩니다.
'el-button'에 대한 추가적인 스타일 커스터마이징이 필요하다면 아래와 같이 추가합니다. */
.el-button--success {
  background-color: #67c23a; /* 의뢰서 업데이트 버튼 색상 */
}

.el-button--info {
  background-color: #409eff; /* 의뢰서 다운로드 버튼 색상 */
}
</style>
