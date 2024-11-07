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
                  label="Model Name"
                  prop="modelName"
                  placeholder="ex) XMN5CTV@1A"
                />
              </el-col>
              <el-col :span="12">
                <inputText
                  v-model="applicationData.lotId"
                  label="FAB LOT ID"
                  prop="lotId"
                  placeholder="ex) NCIFE0A30"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <inputText
                  v-model="applicationData.designer"
                  label="Designer"
                  prop="designer"
                  placeholder="ex) Designer"
                />
              </el-col>
              <el-col :span="12">
                <inputText
                  v-model="applicationData.requester"
                  label="Requester"
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
                <el-form-item
                  label="WHC EVB Material List"
                  prop="matchingComponentType"
                >
                  <el-button type="primary" @click="getEvbListExcel">
                    WHC EVB LIST EXCEL
                  </el-button>
                  <el-button type="primary" @click="getEvbListExcel" disabled>
                    WHC IND LIST EXCEL
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- Same column for checkbox and the evbType select/input -->
              <el-col :span="8">
                <div style="display: flex; align-items: center">
                  <!-- Form item that displays either inputText or el-select depending on isManualInput -->
                  <el-form-item label="EVB Type" style="flex-grow: 1">
                    <!-- Show inputText if manual input is enabled -->
                    <template v-if="isManualInput">
                      <inputText
                        v-model="applicationData.evbType"
                        label=""
                        prop="evbType"
                        placeholder="Enter custom EVB Type"
                        style="width: 100%"
                      />
                    </template>

                    <!-- Otherwise show the el-select dropdown -->
                    <template v-else>
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
                    </template>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="4">
                <!-- Checkbox to toggle between manual input or dropdown -->
                <el-form-item label="Action">
                  <el-button
                    @click="toggleManualInput"
                    type="primary"
                    :plain="!isManualInput"
                    style="margin-right: 10px"
                  >
                    {{ isManualInput ? "EVB Type 선택" : "수동 입력 전환" }}
                  </el-button>
                </el-form-item>
              </el-col>

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

            <!-- <el-row :gutter="20">
              
              <el-col :span="8">
                <div style="display: flex; align-items: center">
                  
                  <el-form-item label="Inductor Type" style="flex-grow: 1">
                    
                    <template v-if="isManualInput">
                      <inputText
                        v-model="applicationData.evbType"
                        label=""
                        prop="evbType"
                        placeholder="Enter custom EVB Type"
                        style="width: 100%"
                      />
                    </template>

                    
                    <template v-else>
                      <el-select
                        v-model="applicationData.evbType"
                        placeholder="EVB Type 선택"
                      >
                        <el-option
                          v-for="item in evbTypeList"
                          :key="item.key"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="4">
                
                <el-form-item label="Action">
                  <el-button
                    @click="toggleManualInput"
                    type="primary"
                    :plain="!isManualInput"
                    style="margin-right: 10px"
                  >
                    {{ isManualInput ? "EVB Type 선택" : "수동 입력 전환" }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row> -->

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="WHC 개발팀 Sample 보유 여부"
                  prop="isSampleAvailable"
                >
                  <el-switch
                    v-model="applicationData.isSampleAvailable"
                    active-text="Yes"
                    inactive-text="No"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="6"> </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="center">Measurement Infomation</el-divider>
      <el-row>
        <el-col>
          <el-card>
            <el-table :data="applicationData.measurements" style="width: 100%">
              <el-table-column
                prop="measurementType"
                label="측정 종류"
                width="250"
              >
                <template #default="scope">
                  {{ getMeasurementLabel(scope.row.measurementType) }}
                  <!-- <el-input
                      :model-value="
                        getMeasurementLabel(scope.row.measurementType)
                      "
                      disabled
                    ></el-input> -->
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
                label="수량"
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
              <el-table-column prop="기타" label="기타" width="500">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.detail"
                    :disabled="!scope.row.isMeasured"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="기타" label="유의사항" width="450">
                <template #default="scope">
                  <el-input v-model="scope.row.placeHolder" disabled></el-input>
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

      <el-row
        v-if="props.applicationType === 'create'"
        :gutter="20"
        style="margin-top: 20px"
      >
        <el-col :span="24">
          <el-card>
            <el-divider content-position="center">File Upload</el-divider>
            <el-upload
              :limit="5"
              :multiple="true"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              :auto-upload="false"
              drag
              ref="uploadRef"
              class="upload-box"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                파일을 이곳에 드래그하거나 클릭하여 업로드하세요
              </div>
              <div class="el-upload__tip">
                파일 최대 5개까지 업로드할 수 있습니다.
              </div>
            </el-upload>
            <el-button
              type="primary"
              @click="downloadFile"
              style="margin-top: 20px"
            >
              Download Application Template
            </el-button>
          </el-card>
        </el-col>
      </el-row>

      <el-divider
        v-if="props.applicationType === 'load'"
        content-position="center"
        >의뢰서</el-divider
      >
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
              @click="downloadCreatedFile(scope.row.uuid, scope.row.name)"
            >
              다운로드
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
          <el-table :data="applicationData.segments" style="width: 100%">
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
          <!-- Segment details table -->
          <el-table :data="applicationData.matching" style="width: 100%">
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
          <el-button type="primary" @click="onSubmit(props.applicationType)"
            >Update Application</el-button
          >
          <!-- <el-button type="danger" @click="onSubmit"
            >Delete Application</el-button
          > -->
        </el-col>
      </el-row>
      <el-row v-else :gutter="20" style="margin-top: 20px"
        ><el-col :span="24">
          <el-button type="primary" @click="onSubmit(props.applicationType)"
            >Create Application</el-button
          >
        </el-col></el-row
      >
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
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
} from "./SolderApplication";
import { statusList } from "../ApplicationList/SolderApplicationList";
import { chipInductorList } from "../../../utils/ChipInductorList";
import inputText from "../../Common/InputText.vue";
import longInputText from "../../Common/LongInputText.vue";
import { reactive } from "vue";
import { solderApplicationRules } from "./SolderApplicationRules";
import { bandInformationDict } from "../../../utils/frequancyInfo";
import type { ApplicationData } from "../../../interface/solderAppInterface";
import { downloadFileByUrl } from "./LoadSolderApplication";

// Toggle function for switching between manual input and select dropdown

// Define props to receive processData
const props = defineProps<{
  applicationData: ApplicationData;
  applicationType: string;
}>();

const toggleManualInput = () => {
  isManualInput.value = !isManualInput.value;
};

// Determine if manual input should be used
const isManualInput = ref(false);
const isForSubmission = ref(true);

// Initialize application data as reactive

const applicationData = props.applicationData;
const rules = solderApplicationRules;

// 선택한 파일들의 이름을 저장하는 변수
const selectedFileNames = ref<string[]>([]);
const selectedFiles = ref<File[]>([]); // 선택된 파일들을 저장하는 변수

const applicationForm = ref();
// const bandList = Object.keys(bandInformationDict.LTE);

// Function to handle file selection
const handleFileChange = (file: any, fileList: File[]) => {
  selectedFiles.value = fileList; // 선택된 파일들의 배열을 저장
};

// Handle selection change
const handleEvbTypeChange = (value: string) => {
  if (value === "수동 입력") {
    isManualInput.value = true;
  }
};

const segmentData = ref<any>(null);
const keys = ref<string[]>([]); // keys를 빈 배열로 초기화
const selectedKey = ref<string | null>(null);

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

// Function to handle file upload limit exceed
const handleExceed = () => {
  console.warn("File limit exceeded");
};

function getEvbListExcel() {
  downloadSolderApplicationXlsx(applicationData, `/solder/send_evb`); // Pass the ApplicationData object
}

function downloadFile() {
  downloadSolderApplicationXlsx(applicationData, `/solder/send_template`); // Pass the ApplicationData object
}

const downloadCreatedFile = (uuid: string, fileName: string) => {
  downloadFileByUrl(uuid, fileName);
};

// Submit handler with form validation
const onSubmit = (buttonType: string) => {
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
          selectedFiles.value,
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

function handleUpdate(row: ApplicationData) {
  updateStatusByUuid(props.applicationData.uuid, row.uuid, row.status);
  // fetchApplicationData(row, uuid);
}

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
      port: "Port " + (index + 1).toString(),
      ind: { series: "0", shunt: "0" },
      cap: { series: "0", shunt: "0" },
    })
  );
};
</script>

<style scoped>
@import "../../../assets/style/solderAppStyle.css";
</style>
