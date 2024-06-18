<template>
  <div class="container">
    <div class="form-box">
      <el-form
        ref="formRef"
        :rules="applicationRules"
        :model="form"
        label-width="100px"
      >
        <el-form-item label="TEST 선택" prop="testType">
          <el-select v-model="form.testType" placeholder="예) Fuse Max">
            <el-option key="Max Fuse " label="Max Fuse" value="Max Fuse" />
            <el-option key="AMR" label="AMR" value="AMR" />
            <el-option key="Life" label="Life" value="Life" />
            <el-option key="Aging" label="Aging" value="Aging" />
            <el-option
              key="Self Heating"
              label="Self Heating"
              value="Self Heating"
            />
            <el-option key="Drop" label="Drop" value="Drop" />
            <el-option key="Step" label="Step" value="Step" />
          </el-select>
        </el-form-item>

        <el-form-item label="Signal">
          <el-col :span="6">
            <el-select
              v-model="form.signalType"
              placeholder="예) NR / LTE / 기타"
            >
              <el-option
                v-for="option in signalOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-col>

          <el-col class="line" :span="3" v-if="form.signalType === 'etc'"
            >/</el-col
          >
          <el-col :span="6" v-if="form.signalType === 'etc'">
            <el-input placeholder="Singal Type" v-model="etcTest"></el-input>
          </el-col>

          <el-col class="line" :span="3">/</el-col>

          <el-col :span="6">
            <el-form-item
              v-if="!['NR', 'LTE'].includes(form.signalType)"
              prop="band"
            >
              <el-input v-model="form.band" placeholder="Band"></el-input>
            </el-form-item>
            <el-form-item v-else>
              <el-select v-model="form.band" placeholder="Band">
                <el-option
                  v-for="band in bandList"
                  :key="band"
                  :label="band"
                  :value="band"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col
            v-if="['NR', 'LTE'].includes(form.signalType)"
            class="line"
            :span="3"
            >/</el-col
          >

          <el-col :span="6">
            <el-form-item>
              <el-input
                v-if="['NR', 'LTE'].includes(form.signalType)"
                placeholder="Duplex mode"
                v-model="form.duplexMode"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item v-if="form.duplexMode === 'TDD'" label="Duty">
          <el-select v-model="form.duty" placeholder="10, 40 , 50">
            <el-option
              v-for="item in dutyList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="
            !['CW', 'CW Duty 50%', 'WIFI', 'GSM', 'etc'].includes(
              form.signalType
            )
          "
          label="Bandwidth"
        >
          <el-select v-model="form.bandwidth" placeholder="Select">
            <el-option
              v-for="item in channelBandwidth"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <div v-if="form.testType !== ''">
          <el-form-item v-if="form.testType === 'Life'" label="고객사 정보">
            <el-select
              v-model="form.customerCompany"
              placeholder="예) 중화 / K1 / 기타"
              @change="handleSelectChange"
            >
              <el-option key="china" label="중화" value="china" />
              <el-option key="k1" label="K1" value="k1" />
              <el-option key="etc" label="기타" value="etc" />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="form.testType === 'Life'"
            label="제품 스팩"
            class="form-item-spacing"
          >
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

          <el-form-item label="기종 정보">
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

          <el-form-item
            label="의뢰목적"
            prop="purpose"
            class="form-item-spacing"
          >
            <el-input v-model="form.purpose"></el-input>
          </el-form-item>

          <el-form-item label="일정">
            <el-col :span="11">
              <el-form-item prop="dateOfSampleConvey">
                <el-date-picker
                  type="date"
                  placeholder="샘플 전달일"
                  v-model="form.dateOfSampleConvey"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="제품 정보">
            <el-col :span="11">
              <el-form-item prop="waferType">
                <el-select
                  v-model="form.waferType"
                  placeholder="예) HS, TS, NS"
                >
                  <el-option key="HS" label="HS" value="HS" />
                  <el-option key="TS" label="TS" value="TS" />
                  <el-option key="NS" label="NS" value="NS" />
                  <el-option key="FBAR" label="FBAR" value="FBAR" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col class="line" :span="2">/</el-col>
            <el-col :span="11">
              <el-form-item prop="packageType">
                <el-select
                  v-model="form.packageType"
                  placeholder="예) CSP , WLP"
                >
                  <el-option
                    key="CSP 및 기타"
                    label="CSP 및 기타"
                    value="CSP 및 기타"
                  />
                  <el-option
                    key="WLP-Mold"
                    label="WLP - Mold"
                    value="WLP-Mold"
                  />
                  <el-option
                    key="WLP-Bare"
                    label="WLP - Bare"
                    value="WLP-Bare"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item v-if="form.testType !== 'Life'" label="Test 온도" prop="temperature">
            <el-input
              placeholder="Temperature ℃"
              v-model="form.temperature"
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item label="Position" prop="position">
            <el-select
              v-model="form.targetPosition"
              placeholder="예) High / Middle / Low"
            >
              <el-option key="high" label="HIGH" value="high" />
              <!-- <el-option key="middle" label="MIDDLE" value="middle" /> -->
              <el-option key="low" label="LOW" value="low" />
            </el-select>
          </el-form-item>

          <el-form-item label="수량" prop="sample_quantity">
            <el-select v-model="selectedNumber" placeholder="Select a number">
              <el-option
                v-for="i in 30"
                :key="i"
                :label="i"
                :value="i"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="selectedNumber >= 1"
            label="SPL 정보"
            prop="test-position"
          >
            <el-table :data="dataList" style="width: 100%">
              <el-table-column
                label="SPL Num"
                prop="sampleNumber"
                width="150px"
              >
                <template #default="{ row }">
                  <el-input v-model="row.sampleNumber"></el-input>
                </template>
              </el-table-column>

              <!-- <el-table-column label="Default" prop="defaultFreq" width="120px">
                <template #default="{ row }">
                  <el-input
                    v-model="row.defaultFreq"
                    :disabled="true"
                  ></el-input>
                </template>
              </el-table-column> -->

              <el-table-column label="System (A)" prop="" width="120px">
                <template #default="{ row }">
                  <span>{{ row.defaultFreq }}</span>                  
                </template>
              </el-table-column>

              <el-table-column label="ΔFreq (B)" width="120px">
                <template #default="{ row }">
                  <el-input
                    v-model="row.offset"                    
                    :disabled="row.useDefaultFreq"
                  ></el-input>                  
                </template>
              </el-table-column>

              <el-table-column label="Input Freq (A + B)" prop="offset" width="150px">
                <template #default="{ row }">
                  <span> {{ Number(row.defaultFreq) + Number(row.offset)}} </span> 
                </template>
              </el-table-column>
                        

              <el-table-column label="직접입력" prop="" width="120px">
                <template #default="{ row }">
                  <el-checkbox v-model="row.useDefaultFreq"
                    >잠금해제</el-checkbox
                  >
                </template>
              </el-table-column>

              <el-table-column label="SPL SnP 파일" prop="offset" width="120px">
                <!-- 파일 선택 버튼 -->
                <template #default="{ row }">
                  <el-button
                    size="default"
                    type="primary"
                    @click="handleFileSelect(row.index)"
                    >파일 선택</el-button
                  >
                </template>
              </el-table-column>
              <!-- Additional column for displaying file name in next row -->
              <el-table-column label="SnP 파일명" prop="sParaFileName">
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="특이사항" prop="detail">
            <el-input type="textarea" rows="5" v-model="form.detail"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(formRef)"
              >의뢰서작성
            </el-button>
            <el-button @click="onReset(formRef)">초기화</el-button>
            <el-button v-if="application_uuid !== ''" @click="downloadExcel()"
              >의뢰서 다운로드</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="baseform">
import { reactive, ref, watch, watchEffect, onMounted, computed } from "vue";
import { ElMessageBox, ElMessage, genFileId } from "element-plus";
import type {
  FormInstance,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { BandData, bandInformationDict } from "../../utils/types";
import { applicationRules } from "../../utils/FromRule";
import {
  computeSignalOptions,
  computeChannelBandwidth,
  dutyList,
  validateSampleData,
} from "../../utils/applicationUtility";
import { checkFileExtension, readFileContent } from "../../utils/utility";
import axios from "axios";

const upload = ref<UploadInstance>();

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  console.log(files);
  return file;
};

const handleFileSelect = (index) => {
  // File selection logic
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  // fileInput.accept = '.txt'; // Example: Allow only .txt extension
  fileInput.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files[0];

    if(!checkFileExtension(selectedFile.name)){
      ElMessage.error("S parameter 파일만 선택할 수 있습니다.")
      return 
    }

    if (selectedFile) {
      // Use FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result as string; // 결과를 문자열로 캐스팅

        dataList.value[index].sParaFileName = selectedFile.name;
        dataList.value[index].fileContent = fileContent

        // const lines = fileContent.split('\n'); // 파일 내용을 줄바꿈으로 분할
        // lines.forEach((line, index) => {
        //   console.log(`Line ${index + 1}: ${line}`); // 각 줄을 콘솔에 출력
        //   // 여기서 각 줄을 처리하는 추가 로직을 구현할 수 있습니다.
        // });
      };
      reader.readAsText(selectedFile);
    }
  });
  fileInput.click();
};


const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "요소기술그룹" : "요소기술그룹";

const data = bandInformationDict;
const bandList = ref([]);
const application_uuid = ref("");

const formRef = ref<FormInstance>();
const selectedNumber = ref(0);
const dataList = ref([]);

const etcTest = ref("");
let signalType = "";

const form = reactive({
  // customerCompany: "",
  // specTemperature: "",
  // specPower: "",
  // isSpecEdit: false,

  // modelName: "TESTING",
  // condition: "TESTING",

  // signalType: "LTE",
  // band: "1",
  // duplexMode: "FDD",
  // bandwidth: "1.4Mhz",

  // designer: "테스트 의뢰서 작성(무시)",
  // requester: name,
  // purpose: "테스트 의뢰서 작성(무시)",

  // temperature: "85",
  // duty: "",
  // dateOfSampleConvey: "",

  // waferType: "HS",
  // packageType: "WLP - Mold",

  // testType: "Max Fuse",
  // targetPosition: "High",

  // sampleQuantity: dataList.value.length,
  // detail: "",

  customerCompany: "",
  specTemperature: "",
  specPower: "",
  isSpecEdit: false,

  modelName: "",
  condition: "",

  signalType: "",
  band: "",
  duplexMode: "",
  bandwidth: "",

  designer: "",
  requester: name,
  purpose: "",

  temperature: "",
  duty: "",
  dateOfSampleConvey: "",

  waferType: "",
  packageType: "",

  testType: "",
  targetPosition: "",

  sampleQuantity: dataList.value.length,
  detail: "",
});

const handleSelectChange = (value: string) => {
  switch (value) {
    case "china":
      if (form.signalType === "NR") {
        form.specPower = "29.5dBm";
      } else {
        form.specPower = "31dBm";
      }

      form.specTemperature = "50℃";
      form.isSpecEdit = false;

      break;
    case "k1":
      if (form.signalType === "NR") {
        form.specPower = "27.5dBm";
      } else {
        form.specPower = "29dBm";
      }
      form.specTemperature = "85℃";
      form.isSpecEdit = false;
      break;
    case "etc":
      form.specTemperature = "";
      form.specPower = "";
      form.isSpecEdit = true;
      break;
  }
};

const onSubmit = (formEl: FormInstance | undefined) => {
  // 수량 검증
  if (selectedNumber.value < 1) {
    ElMessage.error("수량은 1개 이상이어야 합니다");
    return;
  }

  // 폼 검증
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(form);
      //ElMessage.success("정상적으로 작성되었습니다");
      submitData();
    } else {
      return false;
    }
  });
};

const downloadExcel = async () => {
  try {
    const response = await axios.get(
      `/pdt_application/download_application_excel/${application_uuid.value}`,
      { responseType: "blob" } // 서버로부터 blob 형태로 데이터를 받기 위해 설정
    );

    // Blob 데이터로부터 다운로드 URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Content-Disposition 헤더에서 파일 이름 추출
    let filename = "default-filename.xlsx"; // 기본 파일 이름 설정
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameRegex = /filename\*?=['"]?UTF-8''([^;'\"]*)['"]?;?/i;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches && matches[1]) {
        // UTF-8 인코딩 해제 및 디코딩
        filename = decodeURIComponent(matches[1]);
      }
    }

    link.setAttribute("download", filename); // 다운로드할 파일 이름 설정
    document.body.appendChild(link);
    link.click(); // 프로그래매틱하게 링크 클릭 이벤트 발생

    // 정리 작업
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    application_uuid.value = "";
  } catch (error) {
    console.error("Error:", error);
    console.error("Error downloading the report:", error);
    alert("다운로드 중 문제가 발생했습니다.");
  }
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

watch(
  () => form.targetPosition,
  (oldValue, newValue) => {
    if (oldValue === "") {
      selectedNumber.value = 0;
    } else if (oldValue !== newValue) {
      generateRows();
    }
  }
);

// Signal 을 관찰하고 Signal 값이 변하면 필요한 값등을 초기화 시킴.
watch(
  () => form.signalType,
  (oldValue, newValue) => {
    form.customerCompany = "";
    form.specPower = "";
    form.specTemperature = "";
    form.band = "";
  }
);

// Duplex Mode 를 관찰하고 debuging하는 영역

// Watcher to generate rows when selectedNumber changes
watch(selectedNumber, () => {
  generateRows();
});

// selectedNumber의 변화를 감시하고 폼의 검증 상태를 업데이트하는 로직
watch(selectedNumber, (newValue) => {
  if (formRef.value) {
    // form 객체에 가상의 'sample_quantity' 필드를 추가하고, selectedNumber 값을 할당합니다.
    // 이는 실제 폼 데이터 모델에는 영향을 주지 않으며, 단지 검증을 위한 용도로만 사용됩니다.
    formRef.value.validateField("sample_quantity", () => {
      // 'sample_quantity' 필드에 대한 커스텀 검증 로직
      if (newValue < 1) {
        ElMessage.error("수량은 1개 이상이어야 합니다");
      }
    });
  }
});

// Signal 이 선택되었을때 Band List 를 구해온다.
watch(
  () => form.signalType,
  (newValue, oldValue) => {
    if (oldValue !== newValue) {
      form.band = "";
      form.duplexMode = "";
      form.bandwidth = "";
      if (["NR", "LTE"].includes(form.signalType)) {
        bandList.value = Object.keys(data[form.signalType]);
      } else if (form.signalType === "WIFI") {
        bandList.value = ["WIFI"];
      } else {
        bandList.value = [];
      }
    }
  }
);

const generateRows = () => {
  dataList.value = Array.from({ length: selectedNumber.value }, (_, index) => ({
    sampleNumber: "SPL",
    defaultFreq: getTargetFreq(index),
    dB3Freq: "",
    targetFreq: 0, // Function to get unique targetFreq for each row
    useDefaultFreq: true,
    offset: 0,
    sParaFileName: "",
    index: index,
    fileContent: "",
  }));
};

function getTargetFreq(index) {
  // Define logic to return a unique targetFreq based on the index or other criteria

  const targetFreq = ref("");

  if (form.signalType !== "" && form.band !== "") {
    if (form.targetPosition === "high") {
      if (
        ["CW", "WIFI", "GSN", "CW Duty 50%", "etc"].includes(form.signalType)
      ) {
        targetFreq.value = "";
      } else {
        targetFreq.value = data[form.signalType][form.band]["uplinkMhz"][1];
      }
    } else if (form.targetPosition === "low") {
      if (
        ["CW", "WIFI", "GSN", "CW Duty 50%", "etc"].includes(form.signalType)
      ) {
        targetFreq.value = "";
      } else {
        targetFreq.value = data[form.signalType][form.band]["uplinkMhz"][0];
      }
    } else {
      targetFreq.value = data[form.signalType][form.band]["uplinkMhz"][1];
    }
  }

  return targetFreq;
}

const forceSubmitData = async () => {
  try {
    if (form.signalType === "etc") {
      signalType = etcTest.value;
    } else {
      signalType = form.signalType;
    }

    if (form.duplexMode === "TDD") {
      if (form.duty === "") {
        ElMessageBox.alert("Duty를 선택해주세요..", "Duty value missing", {
          confirmButtonText: "확인",
        });
        return; // 함수 실행 중단
      }

      form.duplexMode += " (Duty " + form.duty + "%)";
    }

    const dataDict = {
      customer_company: form.customerCompany,
      spec_temperature: form.specTemperature,
      spec_power: form.specPower,
      is_spec_edit: form.isSpecEdit,
      model_name: form.modelName,
      condition: form.condition,
      signal_type: signalType,
      band: form.band,
      duplex_mode: form.duplexMode,
      bandwidth: form.bandwidth,
      designer: form.designer,
      requester: form.requester,
      purpose: form.purpose,
      temperature: form.temperature,
      date_of_sample_convey: form.dateOfSampleConvey,
      wafer_type: form.waferType,
      package_type: form.packageType,
      test_type: form.testType,
      target_position: form.targetPosition,

      detail: form.detail,
      data: dataList.value,
      force: true,
    };

    const response = await axios.post(
      "/pdt_application/create_pdt_application",
      dataDict
    );

    let message = response.data.message;
    application_uuid.value = response.data.application_uuid;
    ElMessage({
      type: "success",
      message: message,
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};

const validateSampleNumber = (value) => {
  // S, P, L, 0-10 만 허용하는 정규 표현식을 이용한 검증
  return /^SPL[0-9]+$/.test(value);
};

const submitData = async () => {
  if (form.signalType === "etc") {
    signalType = etcTest.value;
  } else {
    signalType = form.signalType;
  }

  let isDuplicate = false;
  let isInvalid = false;
  const sampleNumberSet = new Set();

  dataList.value.forEach((item) => {
    if (sampleNumberSet.has(item.sampleNumber)) {
      isDuplicate = true;
    } else if (!validateSampleNumber(item.sampleNumber)) {
      isInvalid = true;
    } else {
      sampleNumberSet.add(item.sampleNumber);
    }
  });

  // 검사 후 결과 처리
  if (isDuplicate) {
    ElMessageBox.alert(
      "Sample Number가 중복되었습니다.",
      "Sample Number Error",
      {
        confirmButtonText: "확인",
      }
    );
    return; // 작업 취소
  } else if (isInvalid) {
    ElMessageBox.alert(
      "유효하지 않은 Sample Number가 포함되어 있습니다. 'SPL' 뒤에는 최소 한 자리 숫자가 있거나 그 외에 문자열은 사용하실 수 없습니다.",
      "Validation Error",
      {
        confirmButtonText: "확인",
      }
    );
    return; // 작업 취소
  }

  if (form.duplexMode === "TDD") {
    if (form.duty === "") {
      ElMessageBox.alert("Duty를 선택해주세요..", "Duty value missing", {
        confirmButtonText: "확인",
      });
      return; // 함수 실행 중단
    }

    form.duplexMode += " (Duty " + form.duty + "%)";
  }

  if (!validateSampleData(dataList)) {
    return;
  }

  
  const const_data_dict = {
    customer_company: form.customerCompany,
    spec_temperature: form.specTemperature,
    spec_power: form.specPower,
    is_spec_edit: form.isSpecEdit,

    model_name: form.modelName,
    condition: form.condition,

    signal_type: signalType,
    band: form.band,
    duplex_mode: form.duplexMode,
    bandwidth: form.bandwidth,

    designer: form.designer,
    requester: form.requester,

    purpose: form.purpose,
    date_of_sample_convey: form.dateOfSampleConvey,

    temperature: form.temperature,

    wafer_type: form.waferType,
    package_type: form.packageType,
    test_type: form.testType,
    target_position: form.targetPosition,

    detail: form.detail,
    data: dataList.value,
    force: false,
  };
  console.log(const_data_dict);
  try {
    const response = await axios.post(
      "/pdt_application/create_pdt_application",
      const_data_dict
    );

    if (response.data.status == false) {
      if (response.data.error_type === "duplicated application") {
        ElMessageBox.confirm(
          "이미 동일한 의뢰가 존재합니다.\n기존의 의뢰서를 삭제하고 새로운 의뢰서를 생성하시겠습니까?",
          "중복된 의뢰",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: "warning",
          }
        )
          .then(() => {
            forceSubmitData();

            // 여기에 'Yes'를 선택했을 때 수행할 작업을 추가합니다.
          })
          .catch(() => {
            // 'No'를 선택했거나 팝업을 닫았을 때 수행할 작업을 여기에 추가합니다.
            ElMessage({
              type: "info",
              message: "작업이 취소되었습니다.",
            });
          });
      } else {
        ElMessage.error(response.data.message);
      }
    } else {
      application_uuid.value = response.data.application_uuid;
      ElMessage.success("의뢰서가 정삭적으로 작성되었습니다");
    }
    // Handle the response as needed
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};

watch(
  [() => form.band, () => form.signalType],
  ([newBand, newSignalType], [oldBand, oldSignalType]) => {
    // 두 필드가 유효한 값일 때만 동작
    if (
      newBand &&
      newSignalType &&
      data[newSignalType] &&
      data[newSignalType][newBand]
    ) {
      form.duplexMode = data[newSignalType][newBand].duplexMode;
    }
  }
);

watch(
  () => form.band,
  (oldValue, newValue) => {
    if (oldValue !== "" && oldValue !== newValue) {
      generateRows();
      setChannalBandWidth();
      channelBandwidth.value = computeChannelBandwidth(form.testType, form.duplexMode);
      form.bandwidth = "";
    }
  }
);

watch(
  () => form.signalType,
  (oldValue, newValue) => {
    if (oldValue !== "" && oldValue !== newValue) {
      generateRows();
      //computeChannelBandwidth()
      setChannalBandWidth;
      form.bandwidth = "";
    }
  }
);

// const channelBandwidth = ref([]);
const signalOptions = computed(() => computeSignalOptions(form.testType));
let channelBandwidth = ref([]);

function setChannalBandWidth() {
  if (form.signalType !== "" && form.band !== "") {
    console.log(1);
    if (["NR", "LTE"].includes(form.signalType)) {
      console.log(2);
      channelBandwidth.value = computeChannelBandwidth(form.testType, form.duplexMode);
      data[form.signalType][form.band].channelBandwidthsMhz;
    }
  } else {
    channelBandwidth.value = [];
  }
}
</script>

<style scoped>
.container {
  width: 85%; /* 기존의 너비 설정을 70%로 변경 */
}

.form-box {
  width: 85%; /* 기존의 너비 설정을 70%로 변경 */
}

.form-item-spacing {
  margin-bottom: 35px; /* 하단 마진으로 공간 추가 */
}
</style>
