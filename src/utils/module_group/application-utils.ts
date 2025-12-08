import { ref, reactive } from "vue";
import {
  ModuleFiles,
  ModuleMeasurementApp,
  ApplicationFile,
  NaApplication,
  NfApplication,
} from "../../interface/module_group/application/application";
import { ElNotification } from 'element-plus'
import { OptionInterface, OptionNumberInterface } from "../../interface/option";
import { Option } from "element-plus/es/components/select-v2/src/select.types";
import { getUserId, getUserName } from "../account-utils";
import ApplicationStatus from "../../views/ProductPage/ApplicationPage/ApplicationStatus.vue";
import { convertKeysToPEP8, convertPep8ToCamelCase2 } from "../key-converter";
import { sendGetRequest, sendPostRequest } from "../httpProtocol";
import axios from "axios";
import type { UploadFile } from "element-plus";
import { formatDateTime } from "../date-utils";

// export function initApplication() {
//   const application = reactive<ModuleMeasurementApp>({
//     productName: "",
//     quantity: 0,
//     requester: "",
//     requesterId: "",
//     smtHistory: "",
//     mold: "",
//     deliveryMethod: null,
//     dateOfDeliveryDate: null,
//     tcfTemperature: null,
//     naApp: null,
//     nfApp: null,
//     measurer: "",
//     estFinishedDate: "",
//     isNa: false,
//     isNf: false,
//     referenceFile: null,
//     evbAssembleManual: null,

//     user: { userName: "", id: "" },
//   });

//   application.user.userName = getUserName();
//   application.user.id = getUserId();

//   return {
//     application,
//   };
// }

export function initApplication2() {

  const userId = getUserId()
  const userName = getUserName()

  const application = reactive<ModuleMeasurementApp>({
    id: null,
    requester: userName,
    requesterId: userId,
    designer: "",
    productName: "",
    quantity: 0,
    quantityDetail: "",
    smtHistory: null,
    mold: "",
    deliveryMethod: null,
    deliveryPerson: "Nguyen Thi Luan",
    dateOfDeliveryDate: null,
    dateOfExpectedFinished: null,
    wantedFinishedDate: null,
    tcfTemperature: null,
    measurementManager: "",
    completionDueDate: null,
    naApp: null,
    nfApp: null,
    measurer: "",
    estFinishedDate: null,
    dateOfCreated: null,
    isNa: false,
    isNf: false,
    referenceFile: [],
    evbAssembleManual: [],
    xmlFile: [],
    configFile: [],
    rffeFile : [],
    applicationStatus: "created",
    user: { userName: "", id: "" },
    purpose: "",
  });

  application.user.userName = getUserName();
  application.user.id = getUserId();

  return application;
}

export function initNa() {
  const na = ref<NaApplication>({
    na: "",
    deMethod: "",
    portExtensionLoss: false,
    measMethod: "",
    sParaType: "",
    note: "",
  });
  return na.value;
}

export function initNf() {
  const nf = ref<NfApplication>({
    capture: null,
    nfParameterMdf:null,
    isRealMatching: true,
    matchingFile: null,
    note: "",
  });
  return nf.value;
}

export function createQuantityOptions(num: number) {
  const options = ref<OptionNumberInterface[]>([]);
  for (let i = 1; i < num + 1; i++) {
    const temp: OptionNumberInterface = {
      key: i,
      label: i.toString(),
      value: i,
    };
    options.value.push(temp);
  }

  return options.value;
}

export function createMoldOptions() {
  const moldOptions = ref<OptionInterface[]>([
    { key: 0, label: "Mold", value: "Mold" },
    { key: 1, label: "No-mold", value: "No-mold" },
    { key: 2, label: "EMI", value: "EMI" },
  ]);

  return moldOptions.value;
}

export function createPurposeOptions() {
  const purposeOptions = ref<OptionInterface[]>([
    { key:0, label: "특성 평가", value: "forEvaluation" },
    { key:1, label: "고객사 제출용", value: "forCustomer" },
    { key:2, label: "특성 평가 (Tunning)", value: "forTunning" },
    { key:3, label: "기타 목적", value: "others" },
  ]);
  
  return purposeOptions.value;
}

const appendFileGroup = async (
  files: ApplicationFile[],
  fileList: UploadFile[],
  file_type: string,
  app_id: number | string
) => {
  //ORIGINAL 배포시 수정
  // const url = "http://10.29.11.59:8002/module/upload_files";
  console.log('Appending files:', fileList, 'of type:', file_type, 'to app ID:', app_id);
  //TEST용
  const url = "/module/upload_files";

  const formData = new FormData();
  if (fileList.length === 0) return;

  fileList.forEach((file) => {
    if (file.raw) {
      formData.append("files", file.raw);
    }
  });

  formData.append("file_type", file_type);
  formData.append("id", String(app_id));

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    const uploaded  = convertPep8ToCamelCase2(response.data);
     if (files) {
      files.splice(0, files.length, ...uploaded);
    }
    if (files) return uploaded;
  } catch (error) {
    console.error("❌ 업로드 실패", error);
    throw error;
  }
};

export const sendingFiles = async (
  app: ModuleMeasurementApp,
  file_objs: ModuleFiles
) => {
  
  //NA
  if (app.naApp?.id && file_objs.stateFileList?.length > 0) {
    await appendFileGroup(
      app.naApp.stateFile,
      file_objs.stateFileList,
      "state",
      app.naApp.id
    );
  }
  if (app.naApp?.id && file_objs.naRffeFileList?.length > 0) {
    await appendFileGroup(
      app.naApp.naRffeFile,
      file_objs.naRffeFileList,
      "na_rffe",
      app.naApp.id
    );
  }
  if (app.naApp?.id && file_objs.naConfigFileList?.length > 0) {
    await appendFileGroup(
      app.naApp.naConfigFile,
      file_objs.naConfigFileList,
      "na_config",
      app.naApp.id
    );
  }
  if (app.naApp?.id && file_objs.s2pFileList?.length > 0) {
    await appendFileGroup(
      app.naApp.s2pFile,
      file_objs.s2pFileList,
      "s2p",
      app.naApp.id
    );
  }
  if (app.id && file_objs.xmlFileList?.length > 0) {
    await appendFileGroup(app.xmlFile, file_objs.xmlFileList, "xml", app.id);
  }
  if (app.naApp?.id && file_objs.naReferenceFileList?.length > 0) {
    
    await appendFileGroup(
      app.naApp.naReferenceFile,
      file_objs.naReferenceFileList,
      "na_reference",
      app.naApp.id
    );
  }
  if (app.naApp?.id && file_objs.naSpecialFileList?.length > 0) {
    await appendFileGroup(
      app.naApp.naSpecialFile,
      file_objs.naSpecialFileList,
      "na_special",
      app.naApp.id
    );
  } 
  
  //NF
  if (app.nfApp?.id && file_objs.nfRffeFileList?.length > 0) {
    await appendFileGroup(
      app.nfApp.nfRffeFile,
      file_objs.nfRffeFileList,
      "nf_rffe",
      app.nfApp.id
    );
  }
  if (app.nfApp?.id && file_objs.nfConfigFileList?.length > 0) {
    await appendFileGroup(
      app.nfApp.nfConfigFile,
      file_objs.nfConfigFileList,
      "nf_config",
      app.nfApp.id
    );
  }
  if (app.nfApp?.id && file_objs.nfReferenceFileList?.length > 0) {
    
    await appendFileGroup(
      app.nfApp.nfReferenceFile,
      file_objs.nfReferenceFileList,
      "nf_reference",
      app.nfApp.id
    );
  }
  if (app.nfApp?.id && file_objs.nfSpecialFileList?.length > 0) {
    await appendFileGroup(
      app.nfApp.nfSpecialFile,
      file_objs.nfSpecialFileList,
      "nf_special",
      app.nfApp.id
    );
  }
  if (app.nfApp?.id && file_objs.matchingFileList?.length > 0) {
    await appendFileGroup(
      app.nfApp.matchingFile,
      file_objs.matchingFileList,
      "matching",
      app.nfApp.id
    );
  }

  if (app.id && file_objs.evbAssembleFileList?.length > 0) {
    
    await appendFileGroup(
      app.evbAssembleManual,
      file_objs.evbAssembleFileList,
      "evb_assemble",
      app.id
    );
  }
};

export const updateApplication = async (
  app: ModuleMeasurementApp,
  file_objs: ModuleFiles
) => {
  const convertedData = convertKeysToPEP8(app);
  //ORIGINAL 배포시 수정
  //const url = "http://10.29.11.59:8002/module/update_app";
  //TEST용
  const url = "/module/update_app";
  try {
    const response = await axios.post(url, convertedData);

    if (response.status === 200) {
      Object.assign(app, convertPep8ToCamelCase2(response.data));
      sendingFiles(app, file_objs);
    }

    return true;
  } catch (error) {
    // 에러가 AxiosError 타입일 경우
    if (axios.isAxiosError(error)) {
      console.error(
        "❌ Axios 요청 실패:",
        error.response?.status,
        error.message
      );
    } else {
      console.error("❌ 알 수 없는 오류:", error);
    }
    return null;
  }
};

export const submitApplication = async (
  app: ModuleMeasurementApp,
  file_objs: ModuleFiles,
  submitType: string
) => {
  app.dateOfDeliveryDate = formatDateTime(app.dateOfDeliveryDate);
  app.dateOfExpectedFinished = formatDateTime(app.dateOfExpectedFinished);

  const convertedData = convertKeysToPEP8(app);
  let url = "";
  if (submitType === "create") {
    url = "/module/create_app";
  } else if (submitType === "update") {
    url = "/module/update_app";
  } else if (submitType === "delete") {
    url = "/module/delete_app";
  } else {
    return false;
  }
  try {

    if(submitType === "update"){
      sendingFiles(app, file_objs);
      // 1초 후 페이지 이동 (예: 리스트 페이지로)      
    }

    const response = await axios.post(url, convertedData);

    if (response.status === 200) {      

      if(submitType === "update"){
        const url = "/module/get_app_by_id";
        
        const temp = await sendGetRequest(url, app.id.toString());
        Object.assign(app, convertPep8ToCamelCase2(temp));
        
      }
      else{
        Object.assign(app, convertPep8ToCamelCase2(response.data));
      }      
      // Sending is only allowed submitType ["update", "create"]
      if (submitType === "create") {
        sendingFiles(app, file_objs);
      }
    }

    return true;
  } catch (error) {
    // 에러가 AxiosError 타입일 경우
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.error(
        "❌ Axios 요청 실패:",
        error.response?.status,
        error.message
      );
    } else {
      console.error("❌ 알 수 없는 오류:", error);
    }
    return null;
  }
};

export const checkFiles = (
  application: ModuleMeasurementApp,
  fileObjs: ModuleFiles
) => {
  let missingFile = "";

  // ========== NA (필수) ==========
  if (application.isNa && application.naApp) {
    if (fileObjs.stateFileList.length === 0) missingFile = "State File";
    else if (fileObjs.naRffeFileList.length === 0) missingFile = "NA RFFE File";
    else if (fileObjs.naConfigFileList.length === 0) missingFile = "NA Config File";
    else if (application.naApp.na === "rohde" && fileObjs.xmlFileList.length === 0)
      missingFile = "XML File (Rohde 사용 시 필수)";
  }

  // ========== NF (필수) ==========
  if (application.isNf && application.nfApp && !missingFile) {
    if (fileObjs.nfRffeFileList.length === 0) missingFile = "NF RFFE File";
    else if (fileObjs.nfConfigFileList.length === 0) missingFile = "NF Config File";
  }
  

  if (missingFile) {
    ElNotification({
      title: "필수 파일 누락",
      message: `${missingFile} 은(는) 필수입니다.`,
      type: "error",
      duration: 3000, // 3초 후 자동 닫힘
      position: "top-right",
    });
    return false;
  }

  return true;
};
