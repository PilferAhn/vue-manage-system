<template>
  <el-form
    :model="applicationData"
    :rules="rules"
    label-position="top"
    label-width="100px"
    ref="applicationForm"
  >
    <div class="container" v-if="!loading">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <SelectOptions
              v-model="applicationData.client"
              :label="'Customer'"
              :prop="'client'"
              :disable="applicationType === 'load'"
              :placeholder="'고객사를 선택하세요'"
              :options="clientOptions"
              :need-bold="true"
            ></SelectOptions>

            <el-divider content-position="center">기본 정보</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <inputText
                  v-model="applicationData.modelName"
                  label="Model Name"
                  prop="modelName"
                  placeholder="ex) XMN5CTV@1A"
                />
              </el-col>
              <el-col :span="12">
                <el-form-item label="Packge Type" prop="pkgType">
                  <el-select v-model="applicationData.pkgType">
                    <el-option
                      v-for="packge in packgeList"
                      :key="packge.value"
                      :value="packge.value"
                      :label="packge.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <inputText
                  v-model="applicationData.designer"
                  label="개발자"
                  prop="designer"
                  placeholder="ex) Designer"
                />
              </el-col>
              <el-col :span="12">
                <inputText
                  v-model="applicationData.requester"
                  label="의뢰자"
                  prop="requester"
                  placeholder="ex) Requester"
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
                      label="DDPX (6 Port)"
                      value="DDPX (6 Port)"
                    ></el-option>
                    <el-option
                      label="DUAL (2X1/1X2)"
                      value="DUAL (2X1/1X2)"
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
                <el-form-item label="Band" prop="band">
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
              <el-col :span="6">
                <!-- Change EVB 출하정보 to use el-date-picker -->
                <el-form-item label="EVB Shipment Date" prop="shipmentInfo">
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
                  label="Matching Component Type"
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
              <el-col :span="12">
                <el-form-item label="WHC Material List">
                  <el-button type="primary" @click="getEvbListExcel">
                    WHC EVB LIST EXCEL
                  </el-button>
                  <!-- <el-button type="primary" @click="getEvbListExcel" disabled>
                    WHC IND LIST EXCEL
                  </el-button> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- Same column for checkbox and the evbType select/input -->
              <el-col :span="8">
                <div style="display: flex; align-items: center">
                  <!-- Form item that displays either inputText or el-select depending on isManualInput -->
                  <el-form-item
                    v-if="applicationData.evbType !== '직접 입력'"
                    label="EVB Type"
                    prop="evbType"
                    style="flex-grow: 1"
                  >
                    <el-select
                      v-model="applicationData.evbType"
                      placeholder="Select EVB Type"
                    >
                      <el-option
                        v-for="item in evbTypeList"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="applicationData.evbType === '직접 입력'"
                    label="EVB Type"
                    prop="evbType"
                    style="flex-grow: 1"
                  >
                    <inputText
                      v-model="applicationData.customEvbType"
                      label=""
                      placeholder="Enter custom EVB Type"
                      style="width: 100%"
                    />
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="4"> </el-col>

              <!-- EVB info input text field -->
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
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="center">Measurement Infomation</el-divider>

      <el-row>
        <el-col>
          <el-card>
            <el-table :data="sortedMeasurements" style="width: 100%">
              <el-table-column
                prop="measurementType"
                label="측정 항목"
                width="150"
                :align="'center'"
              >
                <template #default="scope">
                  <div :key="scope.row.number">
                    {{ scope.row.measurementType }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="isMeasured"
                label="측정 여부"
                width="90"
                :align="'center'"
              >
                <template #default="scope">
                  <el-checkbox v-model="scope.row.isMeasured"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="Quantity"
                width="100"
                :align="'center'"
              >
                <template #default="scope">
                  <el-input
                    v-model="scope.row.quantity"
                    type="number"
                    :disabled="!scope.row.isMeasured"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="기타"
                label="측정 상세 요청 사항"
                width="800"
              >
                <template #default="scope">
                  <el-input
                    v-model="scope.row.detail"
                    :disabled="!scope.row.isMeasured"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column
                v-if="props.applicationType === 'load'"
                label="종료일"
                width="100"
                :align="'center'"
              >
                <template #default="scope">
                  {{ formatDate(scope.row.finishedDate) }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="유의사항" width="500">
                <template #default="scope">
                  <el-input v-model="scope.row.placeHolder" disabled></el-input>
                </template>
              </el-table-column> -->
              <el-table-column label="완료 희망" :align="'center'" width="250">
                <template #default="scope">
                  <!-- {{ scope.row.desiredCompletionDate }} -->
                  <el-date-picker
                    v-model="scope.row.desiredCompletionDate"
                    type="date"
                    placeholder="Pick a day"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    :size="'deault'"
                  />
                </template>
              </el-table-column>
              <el-table-column
                v-if="props.applicationType === 'load'"
                label="UPDATE"
                fixed="right"
                :align="'center'"
                width="230"
              >
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
                      @click="updateMeasurement(scope.row)"
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
      <el-row
        v-if="props.applicationType === 'create'"
        :gutter="20"
        style="margin-top: 20px"
      >
        <!-- EVB 사진 업로드 -->
        <el-col :span="24">
          <el-card>
            <el-divider content-position="center"
              >EVB Picture Upload</el-divider
            >
            <el-upload
              ref="evbUpload"
              class="upload-demo"
              :limit="1"
              :on-exceed="handleEvbExceed"
              :on-change="handleEvbFileChange"
              :auto-upload="false"
              drag
              :file-list="selectedFiles"
              accept="image/*"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                <em>EVB 사진을 이곳에 드래그하거나 클릭하여 업로드하세요</em>
              </div>
              <div class="el-upload__tip">
                EVB 사진은 1개만 업로드할 수 있습니다 (그림 형식만 가능합니다).
              </div>
            </el-upload>
          </el-card>
        </el-col>

        <!-- MAP 사진 업로드 -->
        <el-col :span="24" style="margin-top: 20px">
          <el-card>
            <el-divider content-position="center"
              >MAP Picture Upload</el-divider
            >
            <el-upload
              ref="mapUpload"
              class="upload-demo"
              :limit="1"
              :on-exceed="handleMapExceed"
              :on-change="handleMapFileChange"
              :auto-upload="false"
              drag
              accept="image/*"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                <em>MAP 사진을 이곳에 드래그하거나 클릭하여 업로드하세요</em>
              </div>
              <div class="el-upload__tip">
                MAP 사진은 1개만 업로드할 수 있습니다 (그림 형식만 가능합니다).
              </div>
            </el-upload>
          </el-card>
        </el-col>
      </el-row>

      <!-- <el-row v-if="props.applicationType==='create'" :gutter="20" style="margin-top: 20px">
        <el-col :span="24">
          <el-card>
            <el-divider content-position="center">Picture Upload</el-divider>
            <el-upload
              ref="upload"
              class="upload-demo"
              :limit="2"
              :on-exceed="handleExceed"
              :on-change="handleFileChange"
              :auto-upload="false"
              drag
              multiple
              accept="image/*"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                <em>파일을 이곳에 드래그하거나 클릭하여 업로드하세요</em>
              </div>
              <div class="el-upload__tip">
                파일 최대 2개까지 업로드할 수 있습니다 (그림 형식만 가능합니다).
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  EVB , Wafer MAP 사진을 선택해주세요
                </div>
              </template>
            </el-upload>
          </el-card>
        </el-col>
      </el-row> -->

      <el-divider content-position="center">Segment Information</el-divider>
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
          <el-table :data="sortedSegment" style="width: 100%">
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
      <el-divider content-position="center">Matching Information</el-divider>
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
          <!-- Matching details table -->
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
              <el-table-column prop="ind.series" label="Series">
                <template #default="scope">
                  <el-input v-model="scope.row.ind.series"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ind.shunt" label="Shunt">
                <template #default="scope">
                  <el-input v-model="scope.row.ind.shunt"></el-input>
                </template>
              </el-table-column>
            </el-table-column>

            <!-- CAP 정보 -->

            <el-table-column label="CAP (pF)" header-align="center">
              <el-table-column prop="cap.series" label="Series">
                <template #default="scope">
                  <el-input v-model="scope.row.cap.series"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="cap.shunt" label="Shunt">
                <template #default="scope">
                  <el-input v-model="scope.row.cap.shunt"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row
        v-if="props.applicationType === 'load'"
        :gutter="20"
        style="margin-top: 20px"
      >
        <el-col :span="24">
          <el-button
            type="primary"
            @click="onSubmit(props.applicationData, props.applicationType)"
            >Update Application</el-button
          >
          <el-button
            type="primary"
            @click="donwloadExcel(applicationData.uuid)"
          >
            Excel Download
          </el-button>
          <!-- <el-button type="danger" @click="onSubmit"
            >Delete Application</el-button
          > -->
          <el-button
            type="primary"
            @click="
              moveRounterbyApplicationUuid(
                'CloneSolderApplication',
                applicationData.uuid
              )
            "
          >
            비슷한 의뢰 만들기
          </el-button>
          <!-- <el-button
            type="danger"
            @click="
              removeApplication(applicationData)
            "
          >
            의뢰서 삭제
          </el-button> -->
        </el-col>
      </el-row>
      <el-row v-else :gutter="20" style="margin-top: 20px"
        ><el-col :span="24">
          <el-button
            type="primary"
            @click="onSubmit(props.applicationData, props.applicationType)"
            >Create Application</el-button
          >
        </el-col></el-row
      >
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import {
  initializeApplicationData,
  // updateMeasurements,
  // updateSegments,
} from "../../../utils/solderApplicationUtil";
import { evbTypeList, getSuggestions } from "./Application";
import {
  sendApplicationData2,
  downloadSolderApplicationXlsx,
  loadApplicationData,
  getMeasurementLabel,
  updateStatusByUuid,
  updateMeasurement,
} from "./SolderApplication";
import SelectOptions from "../../Common/SelectOptionsNew2.vue";
import { clientOptions } from "../../../utils/Solder/option-values";
import { useRouter } from "vue-router";
import { packgeList } from "../../../utils/package-types";
import { statusList } from "../ApplicationList/SolderApplicationList";
import { chipInductorList } from "../../../utils/ChipInductorList";
import inputText from "../../Common/InputText.vue";
import longInputText from "../../Common/LongInputText.vue";
import { reactive } from "vue";
import { solderApplicationRules } from "./SolderApplicationRules";
import { bandInformationDict } from "../../../utils/frequancyInfo";
import type {
  ApplicationData,
  SolderFile,
} from "../../../interface/solderAppInterface";
import { downloadFileByUrl } from "./LoadSolderApplication";
import { updateMeasurementDataByClient } from "../../../utils/Solder/application-utils";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { genFileId, ElMessage } from "element-plus";
import { formatDate } from "../../FAB/Common/Application";
import { removeApplicationHandler } from "../../../utils/Solder/application-utils";
import { optionList } from "../../Calculator/SParameter/sparameter";
const router = useRouter();

// Define props to receive processData
const props = defineProps<{
  applicationData: ApplicationData;
  applicationType: string;
}>();

const sortedMeasurements = computed(() =>
  [...applicationData.measurements].sort((a, b) => {
    const numA = parseInt(a.number ?? "0", 10); // 문자열을 숫자로 변환
    const numB = parseInt(b.number ?? "0", 10);
    return numA - numB;
  })
);

const sortedSegment = computed(() =>
  [...applicationData.segments].sort((a, b) => {
    const numA = parseInt(a.number ?? "0", 10); // 문자열을 숫자로 변환
    const numB = parseInt(b.number ?? "0", 10);
    return numA - numB;
  })
);

const sortedMatching = computed(() =>
  [...applicationData.matching].sort((a, b) => {
    const numA = parseInt(a.number ?? "0", 10); // 문자열을 숫자로 변환
    const numB = parseInt(b.number ?? "0", 10);
    return numA - numB;
  })
);

const loading = ref(true);

const application = ref<ApplicationData>({});

// EVB와 MAP 사진 리스트 관리
const evbPic = ref<File[]>([]); // EVB 사진 리스트
const mapPic = ref<File[]>([]); // EVB 사진 리스트

// EVB 초과 처리
const handleEvbExceed = (files) => {
  const newFile = files[0]; // 초과된 첫 번째 파일
  newFile.uid = genFileId(); // 고유 ID 설정
  evbPic.value = [newFile]; // EVB 사진 리스트 갱신
};

// EVB 파일 변경 처리
const handleEvbFileChange = (file: any, fileList: File[]) => {
  evbPic.value = fileList; // 선택된 파일들의 배열을 저장
};

// MAP 초과 처리
const handleMapExceed = (files) => {
  const newFile = files[0]; // 초과된 첫 번째 파일
  newFile.uid = genFileId(); // 고유 ID 설정
  mapPic.value = [newFile]; // MAP 사진 리스트 갱신
};

// MAP 파일 변경 처리
const handleMapFileChange = (file: any, fileList: File[]) => {
  mapPic.value = fileList; // 선택된 파일들의 배열을 저장
};

// Determine if manual input should be used
const isForSubmission = ref(true);

// Initialize application data as reactive

const applicationData = props.applicationData;
const rules = solderApplicationRules;

// 선택한 파일들의 이름을 저장하는 변수
const selectedFileNames = ref<string[]>([]);
const selectedFiles = ref<File[]>([]); // 선택된 파일들을 저장하는 변수
const upload = ref<UploadInstance>();
const applicationForm = ref();
// const bandList = Object.keys(bandInformationDict.LTE);

const segmentData = ref<any>(null);
const keys = ref<string[]>([]); // keys를 빈 배열로 초기화

onMounted(() => {
  application.value = props.applicationData;
  sortApplicationDataByNumber(application.value);
  console.log(application.value.measurements);
  loading.value = false;
});

onMounted(async () => {
  try {
    const { keys: loadedKeys, vals } = await loadApplicationData(
      isForSubmission.value
    );

    keys.value = loadedKeys; // 데이터 로드 후 keys에 값 할당
    segmentData.value = vals;
  } catch (error) {
    console.error("Failed to load application data:", error);
  }
});

// 데이터를 number로 정렬하는 함수
function sortApplicationDataByNumber(data: ApplicationData) {
  if (data.measurements) {
    applicationData.measurements = [
      ...applicationData.measurements.sort(
        (a, b) => Number(a.number) - Number(b.number)
      ),
    ];
  }
  if (data.segments) {
    data.segments.sort((a, b) => Number(a.number) - Number(b.number));
  }
  if (data.matching) {
    data.matching.sort((a, b) => Number(a.number) - Number(b.number));
  }
}

function getEvbListExcel() {
  downloadSolderApplicationXlsx(applicationData, `/solder/send_evb`); // Pass the ApplicationData object
}

function downloadFile() {
  downloadSolderApplicationXlsx(applicationData, `/solder/send_template`); // Pass the ApplicationData object
}

const donwloadExcel = (uuid: string) => {
  downloadSolderApplicationXlsx(
    applicationData,
    `/solder/download_solder_application_file3`
  );
};

function removeApplication(solderApplication: ApplicationData) {
  if (removeApplicationHandler(solderApplication)) {
    moveRounter("SolderApplicationList");
  }
}

// Submit handler with form validation
const onSubmit = (applicationData: ApplicationData, buttonType: string) => {
  // Validate form data using the validate method of el-form component

  const url = ref("");
  if (buttonType === "load") {
    url.value = "/solder/update";
  } else {
    url.value = "/solder/submit";
  }

  applicationForm.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // Call the sendApplicationData function to send the POST request
        const result = await sendApplicationData2(
          applicationData,
          evbPic.value,
          mapPic.value,
          url.value,
          buttonType
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

watch(
  () => applicationData.client,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if (props.applicationType !== "load") {
        updateMeasurementDataByClient(applicationData, applicationData.client);
      }
    }
  },
  { deep: true }
);

watch(
  () => applicationData.band,
  (newBand, oldBand) => {
    let tempType = "normal";
    if (isForSubmission) {
      tempType = "k1";
    }

    // segmentData.value[newBand]가 존재하는지 확인
    if (segmentData.value && segmentData.value[newBand]) {
      applicationData.segmentQuantity = segmentData.value[newBand].length;
      const selectedQuantity = applicationData.segmentQuantity;

      applicationData.segments = Array.from(
        { length: selectedQuantity },
        (_, index) => ({
          number: (index + 1).toString(),
          start: segmentData.value[newBand][index]["start"],
          stop: segmentData.value[newBand][index]["stop"],
          points: segmentData.value[newBand][index]["points"],
          ifbw: segmentData.value[newBand][index]["ifbw"],
        })
      );
    } else {
      //   console.warn(`No segment data available for band: ${newBand}`);
      applicationData.segmentQuantity = 0;
      applicationData.segments = []; // 초기화
    }
  }
);

// Filter Type 값 변경 감지
watch(
  () => applicationData.filterType,
  (newBand, oldBand) => {
    if (newBand === "DPX") {
      applicationData.matchingQuantity = 3;
    } else if (newBand === "RX") {
      applicationData.matchingQuantity = 2;
    } else if (newBand === "TRX") {
      applicationData.matchingQuantity = 2;
    } else if (newBand === "QPX") {
      applicationData.matchingQuantity = 5;
    } else if (newBand === "DUAL (2X1/1X2)") {
      applicationData.matchingQuantity = 3;
    } else if (newBand === "DUAL (2X2)") {
      applicationData.matchingQuantity = 4;
    } else {
      applicationData.matchingQuantity = 0;
    }

    const selectedQuantity = applicationData.matchingQuantity;
    // segments 배열을 선택된 수량만큼 초기화
    applicationData.matching = Array.from(
      { length: selectedQuantity },
      (_, index) => ({
        number: (index + 1).toString(),
        port: "Port " + (index + 1).toString(),
        ind: { series: "0", shunt: "0" },
        cap: { series: "0", shunt: "0" },
      })
    );
  }
);

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
      ifbw: "10kHz",
    })
  );
};

const updateMathching = () => {
  const selectedQuantity = applicationData.matchingQuantity;
  applicationData.matching = Array.from(
    { length: selectedQuantity },
    (_, index) => ({
      number: (index + 1).toString(),
      port: "Port " + (index + 1).toString(),
      ind: { series: "0", shunt: "0" },
      cap: { series: "0", shunt: "0" },
    })
  );
};

function moveRounter(vueRouterName: string) {
  router.push({
    name: vueRouterName,
  });
}

function moveRounterbyApplicationUuid(vueRouterName: string, uuid: string) {
  router.push({
    name: vueRouterName,
    params: { applicationUuid: uuid },
  });
}
</script>

<style scoped>
@import "../../../assets/style/solderAppStyle.css";
</style>
