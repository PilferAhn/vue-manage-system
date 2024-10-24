<template>
  <el-form
    :model="applicationData"
    :rules="rules"
    label-position="top"
    label-width="100px"
    ref="applicationForm"
  >
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <el-divider content-position="center">기본 정보</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <inputText
                  v-model="applicationData.modelName"
                  label="기 종 명"
                  prop="modelName"
                  placeholder="ex) XMN5CTV@1A"
                />
              </el-col>
              <el-col :span="12">
                <inputText
                  v-model="applicationData.lotId"
                  label="WHC LOT ID"
                  prop="lotId"
                  placeholder="ex) NCIFE0A30"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <inputText
                  v-model="applicationData.designer"
                  label="개 발 자"
                  prop="designer"
                  placeholder="ex) 개 발 자"
                />
              </el-col>
              <el-col :span="12">
                <inputText
                  v-model="applicationData.requester"
                  label="의 뢰 자"
                  prop="requester"
                  placeholder="ex) 의 뢰 자"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Filter Type" prop="filterType">
                  <el-select
                    v-model="applicationData.filterType"
                    placeholder="Select Filter Type"
                  >
                    <el-option label="DPX" value="DPX"></el-option>
                    <el-option label="QPX" value="QPX"></el-option>
                    <el-option label="RX" value="RX"></el-option>
                    <el-option label="TRX" value="TRX"></el-option>
                    <el-option
                      label="DUAL (2X1/1X2)"
                      value="DUAL (2X1/1X2)"
                    ></el-option>
                    <el-option
                      label="DDPX (6 Port)"
                      value="DDPX (6 Port)"
                    ></el-option>
                    <el-option
                      label="DUAL (2X2)"
                      value="DUAL (2X2)"
                    ></el-option>
                    <el-option label="기타" value="기타"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Deembed Mode" prop="deembedMode">
                  <el-select
                    v-model="applicationData.deembedMode"
                    placeholder="Select Deembed Mode"
                  >
                    <el-option
                      label="Port Extention"
                      value="Port Extention"
                    ></el-option>
                    <el-option
                      label="External Deembeding"
                      value="External Deembeding"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <inputText
                  v-model="applicationData.evbType"
                  label="EVB Type"
                  prop="evbType"
                  placeholder="ex) 1612_Rev5_W200"
                />
              </el-col>

              <el-col :span="12">
                <inputText
                  v-model="applicationData.evbInfo"
                  label="EVB name for external deembeding"
                  prop="evbInfo"
                  placeholder="ex) EVB name for external deembeding"
                  :disabled="applicationData.deembedMode === 'Port Extention'"
                />
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Band">
                  <el-select
                    v-model="applicationData.band"
                    placeholder="Band 28"
                  >
                    <el-option
                      v-for="key in keys"
                      :key="key"
                      :label="key"
                      :value="key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- Change EVB 출하정보 to use el-date-picker -->
                <el-form-item label="EVB 출하정보" prop="shipmentInfo">
                  <el-date-picker
                    v-model="applicationData.shipmentInfo"
                    type="date"
                    placeholder="Select Date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="Matching 소자 Type"
                  prop="matchingComponentType"
                >
                  <el-select
                    v-model="applicationData.matchingComponentType"
                    placeholder="Select Deembed Mode"
                  >
                    <el-option label="TN" value="TN"></el-option>
                    <el-option label="HQ" value="HQ"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="center">측정 정보</el-divider>
      <el-row>
        <el-col>
          <el-card>
            <el-table :data="sortedMeasure" style="width: 100%">
              <el-table-column prop="measurementType" label="측정 종류">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.measurementType"
                    disabled
                  ></el-input>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="isMeasured" label="측정 여부" width="120">
                <template #default="scope">
                  <el-checkbox v-model="scope.row.isMeasured"></el-checkbox>
                </template>
              </el-table-column> -->
              <el-table-column prop="quantity" label="수량" width="120">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.quantity"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="기타" label="기타" width="750">
                <template #default="scope">
                  <el-input v-model="scope.row.detail"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="UPDATE" :align="'center'" width="230">
                <template #default="scope">
                  <div style="display: flex; align-items: center; gap: 10px">
                    <el-select
                      class="m-4"
                      v-model="scope.row.status"
                      placeholder="Select"
                      size="small"
                      style="width: 130px"
                      :align="'center'"
                    >
                      <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      /> </el-select
                    ><el-button
                      type="primary"
                      size="small"
                      :align="'center'"
                      :disabled="!scope.row.isMeasured"
                      @click="handleUpdate(scope.row)"
                    >
                      Update
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="center">의뢰서</el-divider>
      <el-table :data="applicationData.files" style="width: 100%">
        <el-table-column prop="name" label="파일 이름" align="center">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ext" label="파일 형식" align="center">
          <template #default="scope">
            <span>{{ scope.row.ext }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Action" :align="'center'">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="downloadFile(scope.row.uuid, scope.row.name)"
            >
              다운로드
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="center">세그먼트 정보</el-divider>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-card>
            <!-- Dropdown for segment quantity -->
            <el-form-item label="Segment Quantity">
              <el-select
                v-model="applicationData.segmentQuantity"
                placeholder="Select quantity"
                @change="updateSegments"
              >
                <el-option
                  v-for="n in 10"
                  :key="n"
                  :label="n"
                  :value="n"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-card>
        </el-col>

        <el-col :span="15">
          <!-- Segment details table -->
          <el-table :data="sortedSegments" style="width: 100%">
            <el-table-column label="Segment 정보" header-align="center">
              <el-table-column prop="start" label="Start">
                <template #default="scope">
                  <el-input v-model="scope.row.start"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="stop" label="Stop">
                <template #default="scope">
                  <el-input v-model="scope.row.stop"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="points" label="Points">
                <template #default="scope">
                  <el-input v-model="scope.row.points"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ifbw" label="IFBW">
                <template #default="scope">
                  <el-input v-model="scope.row.ifbw"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-divider content-position="center">매칭 정보</el-divider>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-card>
            <!-- Dropdown for segment quantity -->
            <el-form-item label="Matching Quantity">
              <el-select
                v-model="applicationData.matchingQuantity"
                placeholder="Select quantity"
                @change="updateMathching"
              >
                <el-option
                  v-for="n in 10"
                  :key="n"
                  :label="n"
                  :value="n"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-card>
        </el-col>

        <el-col :span="15">
          <!-- Segment details table -->
          <el-table :data="sortedMatching" style="width: 100%">
            <el-table-column label="구분" header-align="center">
              <el-table-column label="Port" :align="'center'">
                <template #default="scope">
                  <el-input v-model="scope.row.port"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <!-- IND 정보 -->
            <el-table-column label="IND (nH)" header-align="center">
              <el-table-column
                prop="ind.series"
                label="Series"
                :align="'center'"
              >
                <template #default="scope">
                  <el-input v-model="scope.row.ind.series"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ind.shunt" label="Shunt" :align="'center'">
                <template #default="scope">
                  <el-input v-model="scope.row.ind.shunt"></el-input>
                </template>
              </el-table-column>
            </el-table-column>

            <!-- CAP 정보 -->

            <el-table-column label="CAP (pF)" header-align="center">
              <el-table-column
                prop="cap.series"
                label="Series"
                :align="'center'"
              >
                <template #default="scope">
                  <el-input v-model="scope.row.cap.series"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="cap.shunt" label="Shunt" :align="'center'">
                <template #default="scope">
                  <el-input v-model="scope.row.cap.shunt"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="24">
          <el-button type="primary" @click="onSubmit">제출</el-button>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import { sendApplicationData, updateStatusByUuid } from "./SolderApplication";
import inputText from "../../Common/InputText.vue";
import longInputText from "../../Common/LongInputText.vue";
import { statusList } from "../ApplicationList/SolderApplicationList";
import { reactive } from "vue";
import { solderApplicationRules } from "./SolderApplicationRules";
import {
  initializeApplicationData2,
  downloadFileByUrl,
} from "./LoadSolderApplication";
import {
  useApplicationData,
  fetchApplicationData,
} from "./LoadSolderApplication"; // 방금 만든 훅 불러오기
import { sortMeasurementByNumber } from "../ApplicationList/SolderApplicationList"; // 방금 만든 훅 불러오기
import type { ApplicationData } from "../../../interface/solderAppInterface";
// useRoute 훅을 사용하여 현재 라우트 객체를 가져옵니다.
const route = useRoute();

// route.params에서 uuid 값을 추출합니다.
const uuid = route.params.applicationUuid;

// Initialize application data as reactive
const initData = reactive(initializeApplicationData2());
const rules = solderApplicationRules;

// 선택한 파일들의 이름을 저장하는 변수
const selectedFileNames = ref<string[]>([]);
const selectedFiles = ref<File[]>([]); // 선택된 파일들을 저장하는 변수

const applicationForm = ref();

// useApplicationData를 호출하여 데이터를 가져옴
const { applicationData } = useApplicationData(initData, uuid);

// computed를 사용해 segment를 정렬하여 sortedSegments로 반환
const sortedSegments = computed(() => {
  return applicationData.segments.sort(
    (a, b) => Number(a.number) - Number(b.number)
  );
});

// computed를 사용해 segment를 정렬하여 sortedSegments로 반환
const sortedMatching = computed(() => {
  return applicationData.matching.sort(
    (a, b) => Number(a.number) - Number(b.number)
  );
});

// computed를 사용해 segment를 정렬하여 sortedSegments로 반환
const sortedMeasure = computed(() => {
  return applicationData.measurements.sort(
    (a, b) => Number(a.number) - Number(b.number)
  );
});

// Function to handle file selection
const handleFileChange = (file: any, fileList: File[]) => {
  selectedFiles.value = fileList; // 선택된 파일들의 배열을 저장
};

// Function to handle file upload limit exceed
const handleExceed = () => {
  console.warn("File limit exceeded");
};

const downloadFile = (uuid: string, fileName: string) => {
  downloadFileByUrl(uuid, fileName);
};

const handleUpdateStatus = (uuid: string, status: string) => {
  console.log();
};

// Submit handler with form validation
const onSubmit = () => {
  // Validate form data using the validate method of el-form component
  applicationForm.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // Call the sendApplicationData function to send the POST request
        const result = await sendApplicationData(
          applicationData,
          selectedFiles.value
        );
        // console.log("Form submitted successfully:", result);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      console.error("Validation failed");
    }
  });
};

// Function to update the measurements array based on the selected quantity
const updateMeasurements = () => {
  const selectedQuantity = applicationData.measurementQuantity;
  // If the new quantity is larger, add empty objects
  // measurements 배열을 선택된 수량만큼 초기화
  applicationData.measurements = Array.from(
    { length: selectedQuantity },
    () => ({
      measurementType: "", // 빈 문자열
      isMeasured: false, // 초기값 false
      quantity: 0, // 초기값 0
      detail: "string",
      status: "created",
    })
  );
};

const emit = defineEmits(["status-updated"]);
function handleUpdate(row: ApplicationData) {
  updateStatusByUuid(uuid, row.uuid, row.status);  
  // fetchApplicationData(row, uuid);

}

// Function to update the measurements array based on the selected quantity
const updateSegments = () => {
  const selectedQuantity = applicationData.segmentQuantity;
  // segments 배열을 선택된 수량만큼 초기화
  applicationData.segments = Array.from(
    { length: selectedQuantity },
    (_, index) => ({
      number: (index + 1).toString(), // number를 1부터 시작하여 증가시키기
      start: "",
      stop: "",
      points: "",
      ifbw: "20",
    })
  );
};

const updateMathching = () => {
  const selectedQuantity = applicationData.matchingQuantity;
  applicationData.matching = Array.from(
    { length: selectedQuantity },
    (_, index) => ({
      number: (index + 1).toString(),
      port: "",
      ind: { series: "", shunt: "" },
      cap: { series: "", shunt: "" },
    })
  );
};
</script>

<style scoped>
@import "../../../assets/style/solderAppStyle.css";
</style>
