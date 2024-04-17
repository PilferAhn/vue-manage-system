<template>
  <div class="container">
    <el-form ref="formRef" :model="form" label-width="100px">
      <div class="split-layout">
        <!-- 첫 번째 컬럼의 내용 -->
        <div class="form-box">
          <div v-if="form.testType === 'Life'">
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
          </div>
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

          <!-- <el-form-item label="소요시간">
            <el-col :span="11">
              <el-form-item prop="requestToCompletionDuration">
                <el-input
                  placeholder="소요시간 의뢰일-완료일 [day]"
                  v-model="form.requestToCompletionDuration"
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
import { useRoute } from "vue-router";
import { utils } from "xlsx";

import {
  Chart,
  ScatterDataPoint,
  ChartConfiguration,
  registerables,
  ChartType,
} from "chart.js";

// onMounted(() => {
//   // 페이지를 새로고침하는 로직을 추가합니다.
//   // 처음 페이지 로드 시에만 새로고침이 발생하도록 localStorage를 활용합니다.
//   if (!localStorage.getItem("isReloaded")) {
//     localStorage.setItem("isReloaded", "true");
//     window.location.reload();
//   } else {
//     // 페이지가 새로고침된 후에는 'isReloaded' 키를 삭제하여 무한 루프를 방지합니다.
//     localStorage.removeItem("isReloaded");
//   }
// });

// Props 정의 및 타입 설정
const props = defineProps({
  uuid: String,
});



Chart.register(...registerables);
let myChart = null; // 그래프 인스턴스를 저장할 변수 선언
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
    form.band = response.data.band.toUpperCase();
    form.duplexMode = response.data.duplex_mode;
    form.bandwidth = response.data.bandwidth;

    form.designer = response.data.designer;
    form.requester = response.data.requester;

    form.dateOfCreated = response.data.date_of_created;

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

    drawChart();
  } catch (error) {
    console.error(error);
  }
};

// UUID 변경 감시 설정
watch(() => props.uuid, (newUuid, oldUuid) => {
  fetchApplicationDetail(newUuid);
}, { immediate: true });

const drawChart = () => {
  if (chartCanvas.value && form.samples) {

    if (myChart) {
      myChart.destroy();
    }

    const colors = [
      "rgba(255, 99, 132, 1)", // 빨간색
      "rgba(54, 162, 235, 1)", // 파란색
      "rgba(255, 206, 86, 1)", // 노란색
      "rgba(75, 192, 192, 1)", // 청록색
      "rgba(153, 102, 255, 1)", // 보라색
      "rgba(255, 159, 64, 1)", // 주황색
      "rgba(255, 99, 132, 0.6)", // 연한 빨간색
      "rgba(255, 159, 64, 0.6)", // 연한 주황색
      "rgba(153, 102, 255, 0.6)", // 연한 보라색
      "rgba(54, 162, 235, 0.6)", // 연한 파란색
      "rgba(75, 192, 192, 0.6)", // 연한 청록색
      "rgba(255, 206, 86, 0.6)", // 연한 노란색
      "rgba(116, 185, 255, 1)", // 하늘색
      "rgba(162, 155, 254, 1)", // 연보라색
      "rgba(0, 184, 148, 1)", // 에메랄드색
      "rgba(253, 121, 168, 1)", // 분홍색
    ];

    // sample.p_in이 비어있지 않은 샘플들만 처리
    const datasets = form.samples
      .filter((sample) => sample.p_in !== "")
      .map((sample, index) => {
        const xValues = sample.p_in.split("\t").map(Number);
        const yValues = sample.p_out.split("\t").map(Number);

        return {
          label: sample.sample_number,
          data: xValues.map((x, i) => ({ x, y: yValues[i] })),
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          fill: false, // 영역 채우기 없음
          showLine: true, // 선 표시
        };
      });

    // X축의 최소 및 최대 값을 계산하여 범위를 조정
    const allXValues = datasets.flatMap((dataset) =>
      dataset.data.map((d) => d.x)
    );
    const minX = Math.min(...allXValues);
    const maxX = Math.max(...allXValues);
    const xRange = maxX - minX;
    const xPadding = xRange * 0.1;

    const chartConfig = {
      type: "scatter",
      data: {
        datasets,
      },
      options: {
        scales: {
          x: {
            type: "linear",
            min: minX - xPadding,
            max: maxX + xPadding,
            title: {
              display: true,
              text: "P In (dBm)",
            },
          },
          y: {
            title: {
              display: true,
              text: "P Out (dBm)",
            },
          },
        },
      },
    };

    myChart = new Chart(chartCanvas.value, chartConfig);
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
</style>
