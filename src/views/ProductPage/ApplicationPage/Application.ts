import { ref, watch } from "vue";
import axios from "axios";

import { ElMessage, FormInstance } from "element-plus";
import { bandInformationDict } from "../../../utils/frequancyInfo";
import { containSPL } from "./ApplicationValidation";
import PDTRequestForm from "./PDTRequestForm.vue";

export const signalTypeOptions = [];

export const packageTypeList = ["CSP 및 기타", "WLP-Mold", "WLP-Bare"];

export const waferTypeList = ["NS", "TS", "HS", "Fbar"];

export const dutyList = ref(["40", "50", "60"]);

export const testPostionList = ["High", "Low", "ETC"];

export const upAndDown = ["Up Link", "Down Link", "ETC"];

export const testOptions = [
  "Max Fuse",
  "AMR",
  "Life",
  "Aging",
  "Self Heating",
  "Drop",
  "Step",
];

export const signalList = [
  "CW",
  "CW Duty 50%",
  "WIFI",
  "GSM",
  "NR",
  "LTE",
  "기타",
];

export const customerList = ["K1", "중화", "기타"];

export const bandwidthList = ref([]);

export const bandList = ref([]); // Define the bandList as a reactive variable

export function getSampleQuantityOptions() {
  const quantityOptions = [];

  for (let i = 0; i <= 10; i++) {
    quantityOptions.push(i);
  }

  return quantityOptions;
}

export function getSampleQuantityOptionsByAdmin() {
  const quantityOptions = [];

  for (let i = 0; i <= 30; i++) {
    quantityOptions.push(i);
  }

  return quantityOptions;
}

export function computeChannelBandwidth(testType: string, duplexMode: string) {
  if (testType === "Aging") {
    if (duplexMode === "TDD") return ["5Mhz"];
    else {
      // FDD 일 경우
      return ["1.4Mhz"];
    }
  } else if (testType === "AMR") {
    return ["5Mhz"];
  } else if (["Life", "Max Fuse", "Step Stress"].includes(testType)) {
    return ["1.4Mhz", "5Mhz", "10Mhz"];
  } else {
    return [];
  }
}

function convertInterfaceToDict(application: PDTRequestFormType) {
  const dataDict = {
    uuid: application.applicationUuid,
    customer_company: application.customerCompany,
    spec_temperature: application.specTemperature,
    spec_power: application.specPower,
    is_spec_edit: application.isSpecEdit,
    model_name: application.modelName,
    condition: application.condition,
    signal_type: application.signalType,
    band: application.band,
    duplex_mode: application.duplexMode,
    bandwidth: application.bandwidth,
    designer: application.designer,
    requester: application.requester,
    purpose: application.purpose,
    temperature: application.temperature,
    date_of_sample_convey: application.dateOfSampleConvey,
    wafer_type: application.waferType,
    package_type: application.packageType,
    test_type: application.testType,
    target_position: application.targetPosition,
    detail: application.detail,
    data: application.samples,
    force: true,
    sample_quantity: application.sampleQuantity,
    request_number: application.requestNumber,
    link: application.link,
  };

  return dataDict;
}

export async function downloadExcel(application: any) {
  console.log(application.value);
  try {
    const response = await axios.get(
      `/pdt_application/download_application_excel/${application.value.applicationUuid}`,
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

    // application.value.applicationUuid = "";
  } catch (error) {
    console.error("Error:", error);
    console.error("Error downloading the report:", error);
    alert("다운로드 중 문제가 발생했습니다.");
  }
}
// const validateTemperature = (rule: any, value: any, callback: any) => {
//   if (value === "" || value === null || value === undefined) {
//     callback(new Error("온도를 입력해주세요."));
//   } else if (isNaN(value)) {
//     callback(new Error("숫자만 입력해주세요."));
//   } else if (value > 200) {
//     callback(new Error("온도는 200 이하이어야 합니다."));
//   } else {
//     callback();
//   }
// };

function extractPortNumber(fileName: string): string | null {
  const regex = /\.s(\d+)p$/i;
  const match = fileName.match(regex);
  return match ? match[1] : null;
}

export interface point {
  x: number;
  y: number;
}

export interface SampleInformation {
  sampleUuid?: string;
  sampleNumber: string;
  defaultFreq: number;
  dB3Freq: string;
  targetFreq: number;
  useDefaultFreq: boolean;
  isManualInput: boolean;
  offset: number;
  sParaFileName: string;
  index: number;
  fileContent: string;
  sInput: string;
  sOutput: string;
  ilLevel: string;
  fc: string;
  points?: point[];
  status: string;
}

export interface PDTRequestFormBooleanType {
  customerCompany: boolean;
  specTemperature: boolean;
  specPower: boolean;
  isSpecEdit: boolean;

  modelName: boolean;
  condition: boolean;

  signalType: boolean;
  band: boolean;
  duplexMode: boolean;
  bandwidth: boolean;

  designer: boolean;
  requester: boolean;
  purpose: boolean;

  temperature: boolean;
  duty: boolean;
  dateOfSampleConvey: boolean;

  waferType: boolean;
  packageType: boolean;

  testType: boolean;
  targetPosition: boolean;
  link: boolean;
  sampleQuantity: boolean;
  samples: boolean;
  detail: boolean;
}

export function usePDTRequestFormBoolean() {
  const form = ref<PDTRequestFormBooleanType>({
    customerCompany: true,
    specTemperature: true,
    specPower: true,
    isSpecEdit: true,

    modelName: true,
    condition: true,

    signalType: true,
    band: true,
    duplexMode: true,
    bandwidth: true,

    designer: true,
    requester: true,
    purpose: true,

    temperature: false,
    duty: true,
    dateOfSampleConvey: true,

    waferType: true,
    packageType: true,

    testType: false,
    targetPosition: true,
    link: true,
    sampleQuantity: true,
    samples: true,
    detail: true,
  });

  return {
    form,
  };
}

export interface PDTRequestFormType {
  applicationUuid: string;

  customerCompany: string;
  specTemperature: string;
  specPower: string;
  isSpecEdit: boolean;

  modelName: string;
  condition: string;

  signalType: string;
  band: string;
  duplexMode: string;
  bandwidth: string;

  designer: string;
  requester: string;
  purpose: string;

  temperature: string;
  duty: string;
  dateOfSampleConvey: string;
  dateOfCreate: string;

  waferType: string;
  packageType: string;

  testType: string;
  targetPosition: string;

  link: string;

  sampleQuantity: number;
  samples: SampleInformation[];
  detail: string;

  requestNumber: string;
  status: string;
}

export function usePDTRequestForm() {
  const form = ref<PDTRequestFormType>({
    applicationUuid: "",
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
    requester: "",
    purpose: "",

    temperature: "0",
    duty: "",
    dateOfSampleConvey: "",
    dateOfCreate: "",

    waferType: "",
    packageType: "",

    testType: "",
    targetPosition: "",

    link: "",

    sampleQuantity: 0,
    samples: [],
    detail: "",

    requestNumber: "",
    status: "",
  });

  return {
    form,
  };
}

export function hasDuplicates(array: any[]): boolean {
  return new Set(array).size !== array.length;
}

export function resetForm(applicationForm: any, requesterName: string) {
  applicationForm.value = {
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
    requester: requesterName,
    purpose: "",

    temperature: "",
    duty: "",
    dateOfSampleConvey: "",
    dateOfCreate: getTodayDate(),

    waferType: "",
    packageType: "",

    testType: applicationForm.value.testType,
    targetPosition: "",

    link: "",

    sampleQuantity: 0,
    samples: [],
    detail: "",
  };
  saveForm(applicationForm); // Save the reset form to localStorage
}

export function submitForm(application: PDTRequestFormType) {
  console.log(application);
}

export function saveForm(applicationForm: any) {
  localStorage.setItem("pdtRequestForm", JSON.stringify(applicationForm.value));
}

export function loadForm(applicationForm: any) {
  const savedForm = localStorage.getItem("pdtRequestForm");
  if (savedForm) {
    applicationForm.value = JSON.parse(savedForm);
  }
}

export function watchSignalType(
  applicationForm: any,
  applicationFormBoolean: any,
  bandList: any,
  bandwidthList: any
) {
  watch(
    () => applicationForm.value.signalType,
    (newVal: string, oldVal: string) => {
      applicationForm.value.band = "";
      applicationForm.value.duplexMode = "";
      applicationForm.value.bandwidth = "";
      applicationForm.value.duty = "";
      applicationForm.value.link = "";
      applicationForm.value.targetPosition = "";
      applicationForm.value.sampleQuantity = 0;
      bandList.value = [];
      bandwidthList.value = [];

      if (["NR", "LTE"].includes(newVal)) {
        applicationFormBoolean.value.duplexMode = false;

        if (newVal === "NR") {
          bandList.value = Object.keys(bandInformationDict.NR);
        } else {
          bandList.value = Object.keys(bandInformationDict.LTE);
        }

        applicationFormBoolean.value.duplexMode = true;
        applicationFormBoolean.value.band = false;
      } else if (newVal === "기타") {
        applicationFormBoolean.value.band = false;
        applicationFormBoolean.value.duplexMode = false;
      } else if (!["NR", "LTE"].includes(newVal)) {
        applicationFormBoolean.value.band = false;
        applicationFormBoolean.value.duplexMode = true;
      } else {
        applicationFormBoolean.value.duplexMode = true;
      }
    }
  );
}

export function watchBand(applicationForm: any, applicationFormBoolean: any) {
  watch(
    () => applicationForm.value.band,
    (newVal: string, oldVal: string) => {
      applicationForm.value.targetFreq = "";
      applicationForm.value.link = "";

      if (newVal !== "") {
        if (["NR", "LTE"].includes(applicationForm.value.signalType)) {
          if (applicationForm.value.signalType === "NR") {
            // bandList.value = Object.keys(bandInformationDict.NR);
            applicationForm.value.duplexMode =
              bandInformationDict.NR[applicationForm.value.band]["duplexMode"];
          } else {
            applicationForm.value.duplexMode =
              bandInformationDict.LTE[applicationForm.value.band]["duplexMode"];
          }
        }
      }
    }
  );
}

export function watchTestType(
  applicationForm: any,
  applicationFormBoolean: any
) {
  watch(
    () => applicationForm.value.testType,
    (newVal: string, oldVal: string) => {
      if (newVal === "Life") {
        applicationFormBoolean.value.customerCompany = false;
        applicationFormBoolean.value.temperature = true;
      } else {
        applicationFormBoolean.value.customerCompany = true;
        applicationFormBoolean.value.temperature = false;
      }
    }
  );
}

export function watchCustomerCompany(
  applicationForm: any,
  applicationFormBoolean: any
) {
  watch(
    () => applicationForm.value.customerCompany,
    (newVal: string, oldVal: string) => {
      if (newVal === "기타") {
        applicationFormBoolean.value.specTemperature = false;
        applicationFormBoolean.value.specPower = false;
        applicationForm.value.specTemperature = "";
        applicationForm.value.specPower = "";
      } else if (newVal === "중화") {
        applicationForm.value.specTemperature = "50";
        applicationForm.value.specPower = "31dBm";
        applicationFormBoolean.value.specTemperature = true;
        applicationFormBoolean.value.specPower = true;
      } else if (newVal === "K1") {
        applicationForm.value.specTemperature = "85";
        applicationForm.value.specPower = "29dBm";
        applicationFormBoolean.value.specTemperature = true;
        applicationFormBoolean.value.specPower = true;
      } else {
        applicationFormBoolean.value.customerCompany = true;
      }
    }
  );
}

export function setBandwidthOptions(
  applicationForm: any,
  applicationFormBoolean: any,
  bandwidthList: any
) {
  watch(
    () => applicationForm.value.band,
    (newVal: string, oldVal: string) => {
      applicationForm.value.bandwidth = "";
      applicationForm.value.duty = "";

      if (applicationForm.value.testType === "Aging") {
        if (applicationForm.duplexMode === "TDD") {
          bandwidthList.value = ["5Mhz"];
        } else {
          bandwidthList.value = ["1.4Mhz"];
        }
      } else if (applicationForm.value.testType === "AMR") {
        bandwidthList.value = ["5Mhz"];
      } else if (
        ["Life", "Max Fuse", "Step Stress"].includes(
          applicationForm.value.testType
        )
      ) {
        bandwidthList.value = ["1.4Mhz", "5Mhz", "10Mhz"];
      } else {
        applicationForm.value.bandwidth = "None";
        bandwidthList.value = ["None"];
      }
    }
  );
}

export function watchDuplexMode(
  applicationForm: any,
  applicationFormBoolean: any
) {
  watch(
    () => applicationForm.value.duplexMode,
    (newVal: string, oldVal: string) => {
      if (newVal === "TDD") {
        applicationFormBoolean.duty = false;
      } else {
        applicationFormBoolean.duty = true;
        applicationForm.duty = "";
      }
    }
  );
}

export function watchTemperature(
  applicationForm: any,
  applicationFormBoolean: any
) {
  watch(
    () => applicationForm.value.watchTemperature,
    (newVal: string, oldVal: string) => {
      if (newVal === "TDD") {
        applicationFormBoolean.duty = false;
      } else {
        applicationFormBoolean.duty = true;
        applicationForm.duty = "";
      }
    }
  );
}

export function watchLink(applicationForm: any) {
  watch(
    () => applicationForm.value.link,
    (newVal: string, oldVal: string) => {
      if (applicationForm.value.sampleQuantity !== 0) {
        let defaultFreq = findFrequacy(applicationForm);
        applicationForm.value.samples = applicationForm.value.samples.map(
          (sample: any) => ({
            ...sample,
            defaultFreq: defaultFreq,
          })
        );
      }
    }
  );
}

export function getSystemFreq(applicationForm: any) {
  const systemFreq = findFrequacy(applicationForm);

  return systemFreq;
}

export type SampleRequestMode = "normal" | "advanced";

export const sampleRequestMode = ref<SampleRequestMode>("normal");

export function setMode(mode: SampleRequestMode) {
  sampleRequestMode.value = mode;
}

export function watchSampleRequestType(type: string) {
  watch(
    () => type,
    (newVal: string) => {}
  );
}

export function watchPosition(applicationForm: any) {
  watch(
    () => applicationForm.value.targetPosition,
    (newVal: string, oldVal: string) => {
      if (
        applicationForm.value.sampleQuantity !== 0 &&
        applicationForm.value.link !== ""
      ) {
        let defaultFreq = findFrequacy(applicationForm);
        applicationForm.value.samples = applicationForm.value.samples.map(
          (sample: any) => ({
            ...sample,
            defaultFreq: defaultFreq,
          })
        );
      }
    }
  );
}

function initializeSampleData(
  count: number,
  systemFreq: number,
  signalType: string
): SampleInformation[] {
  let useDefaultFreq = false;
  let isManualInput = true;
  if (["LTE", "NR"].includes(signalType)) {
    useDefaultFreq = true;
    isManualInput = false;
  } else {
  }

  return Array.from({ length: count }, (_, i) => ({
    sampleNumber: "SPL",
    sampleUuid: "",
    status: "",
    defaultFreq: systemFreq,
    dB3Freq: "",
    targetFreq: 0,
    useDefaultFreq: useDefaultFreq,
    offset: 0,
    sParaFileName: "",
    index: i + 1,
    fileContent: "",
    sInput: "",
    sOutput: "",
    ilLevel: "",
    isManualInput: isManualInput,
    fc: "0",
    points: [],
  }));
}

function findFrequacy(applicationForm: any) {
  let systemFreq = 0;

  if (
    applicationForm.value.signalType !== "" &&
    applicationForm.value.band !== "" &&
    applicationForm.value.targetPosition !== "" &&
    applicationForm.value.link !== ""
  ) {
    if (["LTE", "NR"].includes(applicationForm.value.signalType)) {
      let bandInfo = {};

      if (applicationForm.value.signalType === "LTE") {
        bandInfo = bandInformationDict.LTE[applicationForm.value.band];
      } else {
        bandInfo = bandInformationDict.NR[applicationForm.value.band];
      }

      let linkList = [];
      if (applicationForm.value.link === "Up Link") {
        linkList = bandInfo["uplinkMhz"];
      } else if (applicationForm.value.link === "Down Link") {
        linkList = bandInfo["downlinkMhz"];
      } else {
        return 0;
      }

      console.log(applicationForm.value.targetPosition);
      if (linkList.length !== 2) {
        systemFreq = linkList[0];
      } else {
        if (applicationForm.value.targetPosition.toUpperCase() === "HIGH") {
          systemFreq = linkList[1];
        } else if (
          applicationForm.value.targetPosition.toUpperCase() === "LOW"
        ) {
          systemFreq = linkList[0];
        } else {
          return 0;
        }
      }
    } else {
    }
  }

  return systemFreq;
}

export function watchSampleQuantity(
  applicationForm: any,
  applicationFormBoolean: any
) {
  watch(
    () => applicationForm.value.sampleQuantity,
    (newVal: string, oldVal: string) => {
      let systemFreq = findFrequacy(applicationForm);

      const cnt = parseInt(applicationForm.value.sampleQuantity);
      applicationForm.value.samples = initializeSampleData(
        cnt,
        systemFreq,
        applicationForm.value.signalType
      );
    }
  );
}

export function appendSamples(applicationForm: any) {
  watch(
    () => applicationForm.value.sampleQuantity,
    (newVal: string, oldVal: string) => {
      if (Number(newVal) > Number(oldVal)) {
        for (let i = Number(oldVal); i < Number(newVal); i++) {
          applicationForm.value.samples.push({
            ...applicationForm.value.samples,
          });
        }
      } else if (Number(newVal) < Number(oldVal)) {
        applicationForm.value.samples.splice(Number(newVal));
      }
    }
  );
}

export function getTodayDate() {
  // 오늘 날짜를 return 하는 함수
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function updateNote(application: PDTRequestFormType) {
  try {
    // python 과 데이터를 쉽게 주고 받기 쉽게 하려고
    // dictionary 로 치환.
    // const applicationDictData = convertInterfaceToDict(application);

    const formData = new FormData();
    formData.append("detail", application.detail)
    formData.append("pdt_application_uuid", application.applicationUuid)
    

    const response = await axios.post(
      "/pdt_application/update_detail_by_uuid",
      formData
    );

    if (response.status === 200) {
      if (response.data.status) {
        ElMessage.success("의뢰서가 성공적으로 작성되었습니다.");        
      } else {
        ElMessage.error("의뢰서 작성에 실패했습니다. 잠시 후에 시도하세요");
      }
    }
  } catch (error) {
    ElMessage.error("알수없는 오류가 발생했습니다. 잠시 후에 시도하세요");
    console.error("Error:", error);
  }

  console.log(application);
}

export async function submitPdtApplicationForm(
  application: PDTRequestFormType,
  isDownload: any
) {
  try {
    const isValidForm = validateValues(application);
    isDownload.value = false;
    if (isValidForm) {
      // python 과 데이터를 쉽게 주고 받기 쉽게 하려고
      // dictionary 로 치환.
      const applicationDictData = convertInterfaceToDict(application);
      const response = await axios.post(
        "/pdt_application/submit_pdt_application",
        applicationDictData
      );

      if (response.status === 200) {
        if (response.data.status) {
          ElMessage.success("의뢰서가 성공적으로 작성되었습니다.");
          isDownload.value = true;
          application.applicationUuid = response.data.applicationUuid;
        } else {
          ElMessage.error("의뢰서 작성에 실패했습니다. 잠시 후에 시도하세요");
        }
      }
    }
  } catch (error) {
    ElMessage.error("알수없는 오류가 발생했습니다. 잠시 후에 시도하세요");
    console.error("Error:", error);
  }

  console.log(application);
}

export async function updateApplication(application: PDTRequestFormType) {
  const applicationDictData = convertInterfaceToDict(application);
  try {
    const isValidForm = validateValues(application);
    if (isValidForm) {
      // python 과 데이터를 쉽게 주고 받기 쉽게 하려고
      // dictionary 로 치환.

      const response = await axios.post(
        "/pdt_application/update_pdt_appliction",
        applicationDictData
      );

      if (response.status === 200) {
        if (response.data.status) {
          ElMessage.success("의뢰서가 성공적으로 업데이트 되었습니다.");
        } else {
          ElMessage.error("의뢰서 작성에 실패했습니다. 잠시 후에 시도하세요");
        }
      }
    }
  } catch (error) {
    ElMessage.error("알수없는 오류가 발생했습니다. 잠시 후에 시도하세요");
    console.error("Error:", error);
    console.log(applicationDictData);
  }
}

export async function updateSampleInformation(application: PDTRequestFormType) {
  const applicationDictData = convertInterfaceToDict(application);
  try {
    const isValidForm = validateValues(application);

    if (isValidForm) {
      // python 과 데이터를 쉽게 주고 받기 쉽게 하려고
      // dictionary 로 치환.

      const response = await axios.post(
        "/pdt_application/update_application_sample",
        applicationDictData
      );

      if (response.status === 200) {
        if (response.data.status) {
          ElMessage.success("의뢰서가 성공적으로 업데이트 되었습니다.");
        } else {
          ElMessage.error("의뢰서 작성에 실패했습니다. 잠시 후에 시도하세요");
        }
      }
    }
  } catch (error) {
    ElMessage.error("알수없는 오류가 발생했습니다. 잠시 후에 시도하세요");
    console.error("Error:", error);
    console.log(applicationDictData);
  }
}

function validateValues(application: PDTRequestFormType) {
  let isValid = true;

  // 입력된 SAMPLE Number 값을 validating 한다.
  const sampleStatus = validateSampleNumber(
    application.sampleQuantity,
    application.samples
  );
  if (!sampleStatus.status) {
    ElMessage.error(sampleStatus.message);
    isValid = false;
  }

  // duplex mode에서 duty값이 누락되어있는지 확인
  const dutyStatus = validateDuty(application.duplexMode, application.duty);
  if (!dutyStatus.status) {
    ElMessage.error(dutyStatus.message);
    isValid = false;
  }

  // if duplex mode is TDD
  // add duty information to duplex column
  if (application.duplexMode === "TDD") {
    application.duplexMode += " (Duty " + application.duty + "%)";
  }

  // Port 정보 확인
  const portStatus = validatePort(application.samples);
  if (!portStatus.status) {
    ElMessage.error(portStatus.message);
    isValid = false;
  }

  return isValid;
}

function validateDuty(duplexMode: string, duty: string) {
  if (duplexMode === "TDD") {
    if (duty === "") {
      return {
        status: false,
        message: "Duty값을 입력하세요",
      };
    } else {
      return {
        status: true,
        message: "Duty값을 입력하세요",
      };
    }
  }

  return {
    status: true,
    message: "Duty값을 입력하세요",
  };
}

function validateSampleNumber(
  sampleQuantity: number,
  samples: SampleInformation[]
) {
  let sampleNumberList = [];

  if (samples.length === 0 || sampleQuantity === 0) {
    return {
      status: false,
      message: "Sample 정보가 입력되지 않았습니다.",
    };
  }

  for (let i = 0; i < samples.length; i++) {
    if (samples[i]["sampleNumber"] === "SPL") {
      return {
        status: false,
        message: "Sample Number를 입력하세요.",
      };
    } else {
      sampleNumberList.push(samples[i]["sampleNumber"]);
    }
  }

  // 만약 sample 번호에 spl이 안들어가 있으면 ㅈ매ㅑ더쇄먇ㄱ저
  // for (let i = 0; i < samples.length; i++) {
  //   if (containSPL(samples[i]["sampleNumber"])) {

  //   }
  //   else{
  //     return {
  //       status: false,
  //       message: "Sample 번호에는 SPL이 꼭 들어가야합니다",
  //     };
  //   }
  // }

  if (hasDuplicates(sampleNumberList)) {
    return {
      status: false,
      message: "중복된 Sample Number가 존재합니다.",
    };
  }

  for (let i = 0; i < samples.length; i++) {
    samples[i].targetFreq =
      Number(samples[i].defaultFreq) + Number(samples[i].offset);
  }

  return {
    status: true,
    message: "Sample Number에 이상 없음. ",
  };
}

function validatePort(samples: SampleInformation[]) {
  for (let i = 0; i < samples.length; i++) {
    if (samples[i].sParaFileName !== "") {
      if (samples[i].sInput === "" || samples[i].sOutput === "") {
        return { status: false, message: "Port 정보를 확인하세요" };
      }
    }

    if (samples[i].sInput === "0" || samples[i].sOutput === "0") {
      return {
        status: false,
        message: `Sample ${i + 1}의 Port 값은 0이 될 수 없습니다.`,
      };
    }

    // 이 부분은 파일이 선택되어있다는 가정하에 진행.
    if (samples[i].sParaFileName !== "") {
      let portNumber = Number(extractPortNumber(samples[i].sParaFileName));

      let sInput = Number(samples[i].sInput);
      let sOutput = Number(samples[i].sOutput);

      if (sInput > portNumber || sOutput > portNumber) {
        return {
          status: false,
          message: `Sample ${
            i + 1
          }번줄의 Port 값은 ${portNumber}보다 클 수 없습니다.`,
        };
      }
    }
  }

  return {
    status: true,
    message: "Port 입력 확인 완료",
  };
}
