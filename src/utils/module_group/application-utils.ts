import { ref, reactive } from "vue";
import {
  ModuleFiles,
  ModuleMeasurementApp,
  ApplicationFile,
  NaApplication,
  NfApplication,
} from "../../interface/module_group/application/application";
import { ElNotification } from "element-plus";
import { OptionInterface, OptionNumberInterface } from "../../interface/option";
import { getUserId, getUserName } from "../account-utils";
import { convertKeysToPEP8, convertPep8ToCamelCase2 } from "../key-converter";
import { sendGetRequest } from "../httpProtocol";
import axios from "axios";
import type { UploadFile } from "element-plus";
import { formatDateTime } from "../date-utils";

export function initApplication2() {
  const userId = getUserId();
  const userName = getUserName();

  const application = reactive<ModuleMeasurementApp>({
    id: null,
    requester: userName,
    requesterId: userId,
    designer: "",
    productName: "",
    quantity: "0",
    quantityDetail: "",
    smtHistory: null,
    mold: "",
    deliveryMethod: null,
    deliveryPerson: "Nguyen Thi Luan",
    dateOfDeliveryDate: null,
    dateOfExpectedFinished: null,
    wantedFinishedDate: null,
    tcfTemperature: null,
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
    rffeFile: [],
    applicationStatus: "created",
    user: { userName: "", id: "" },
    purpose: "",
  });

  application.user.userName = getUserName();
  application.user.id = getUserId();

  return application;
}

export type SiteType = "HQ" | "WHC";
export type ModeType = "create" | "edit";
export type NullableDate = Date | string | null;

export type VendorType = "" | "KEYSIGHT" | "ROHDE";
export type OnOffType = "" | "ALL" | "ON" | "OFF";
export type BoardType = "" | "IDEAL_BOARD" | "REAL_BOARD";
export type MoldType = "" | "ALL" | "NO_MOLD" | "MOLD";
export type JigSolderingType = "" | "JIG" | "SOLDERING";

export interface CommonMeasurementFields {
  noteSpl: string;
  noteMeasurement: string;
  fileLink: string;
  resultFileLink: string;
  measurer: string;
  requestedDueDate: NullableDate;
  expectedDoneDate: NullableDate;
  doneDate: NullableDate;
  links?: Record<string, string>;
}

export interface SetupForm extends CommonMeasurementFields {
  vendor: VendorType;
  deembedding: OnOffType;
  portExtension: OnOffType;
}

export interface NaForm extends CommonMeasurementFields {
  deembedding: OnOffType;
  portExtension: OnOffType;
  matching: OnOffType;
  mold: MoldType;
  jigSoldering: JigSolderingType;
  evbTuning: boolean;
  appendix: boolean;
}

export interface NfForm extends CommonMeasurementFields {
  boardType: BoardType;
  mold: MoldType;
  appendix: boolean;
}

export interface MwaForm extends CommonMeasurementFields {
  matching: OnOffType;
  loss: OnOffType;
}

export interface CaForm extends CommonMeasurementFields {
  trace: string;
  power: string;
  freqStart: string;
  freqStop: string;
  average: string;
  point: string;
}

export interface TcfForm extends CommonMeasurementFields {
  temperatureSequence: string;
  matching: OnOffType;
  jigSoldering: JigSolderingType;
}

export interface MeasurementForms {
  setup: SetupForm;
  na: NaForm;
  nf: NfForm;
  mwa: MwaForm;
  ca: CaForm;
  tcf: TcfForm;
}

export interface ModuleApplicationDetail {
  applicationId?: string;
  pn: string;
  requester: string;
  developer: string;
  purpose: string;
  siteType: SiteType | "";
  useSampleInfo?: boolean;
  sampleInfo?: {
    sender?: string;
    deliveredDate?: NullableDate;
    note?: string;
    sampleLink?: string;
  } | null;
  status?: string;
  creator?: string | null;
  modifier?: string | null;
  createdDate?: string | null;
  modifiedDate?: string | null;
  measurements: Array<{
    type: string;
    data?: Record<string, any>;
  }>;
}

export interface ModuleApplicationSubmitInput {
  applicationId?: string;
  pn: string;
  requester: string;
  developer: string;
  purpose: string;
  siteType: SiteType | "";
  useSampleInfo?: boolean;
  sampleInfo?: {
    sender?: string;
    deliveredDate?: NullableDate;
    note?: string;
    sampleLink?: string;
  } | null;
  creator?: string | null;
  modifier?: string | null;
  measurements: Array<{
    type: string;
    data?: Record<string, any>;
  }>;
}

export function createEmptyMeasurementForms(): MeasurementForms {
  return {
    setup: {
      vendor: "",
      deembedding: "",
      portExtension: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    },
    na: {
      deembedding: "",
      portExtension: "",
      matching: "",
      mold: "",
      jigSoldering: "",
      evbTuning: false,
      appendix: false,
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    },
    nf: {
      boardType: "",
      mold: "",
      appendix: false,
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    },
    mwa: {
      matching: "",
      loss: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    },
    ca: {
      trace: "",
      power: "",
      freqStart: "",
      freqStop: "",
      average: "",
      point: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    },
    tcf: {
      temperatureSequence: "",
      matching: "",
      jigSoldering: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    },
  };
}

export function mapApiDetailToUi(detail: any): ModuleApplicationDetail {
  return {
    applicationId: detail.applicationId ?? "",
    pn: detail.pn ?? "",
    requester: detail.requester ?? "",
    developer: detail.developer ?? "",
    purpose: detail.purpose ?? "",
    siteType: detail.siteType ?? "",
    useSampleInfo: !!detail.useSampleInfo,
    sampleInfo: detail.sampleInfo
      ? {
          sender: detail.sampleInfo.sender ?? "",
          deliveredDate: detail.sampleInfo.deliveredDate ?? null,
          note: detail.sampleInfo.note ?? "",
          sampleLink: detail.sampleInfo.sampleLink ?? "",
        }
      : {
          sender: "",
          deliveredDate: null,
          note: "",
          sampleLink: "",
        },
    status: detail.status ?? "",
    creator: detail.creator ?? null,
    modifier: detail.modifier ?? null,
    createdDate: detail.createdDate ?? null,
    modifiedDate: detail.modifiedDate ?? null,
    measurements: (detail.measurements || []).map((item: any) => {
      const data = item.data || {};

      return {
        type: item.type,
        data: {
          ...data,
          links: data.links ?? {},
        },
      };
    }),
  };
}

function buildCommonMeasurementData(data: Record<string, any>) {
  const links =
    data.links && typeof data.links === "object"
      ? data.links
      : {};

  return {
    note_spl: data.noteSpl ?? "",
    note_measurement: data.noteMeasurement ?? "",
    file_link:
      data.fileLink ||
      Object.values(links).find((value) => String(value ?? "").trim() !== "") ||
      "",
    links,
    result_file_link: data.resultFileLink ?? "",
    measurer: data.measurer ?? "",
    requested_due_date: data.requestedDueDate ?? null,
    expected_done_date: data.expectedDoneDate ?? null,
    done_date: data.doneDate ?? null,
  };
}
export function buildModuleNewPayload(app: ModuleApplicationSubmitInput) {
  const measurements = (app.measurements || [])
    .map((item) => {
      const data = item.data || {};

      if (item.type === "setup") {
        return {
          type: "setup",
          data: {
            vendor: data.vendor ?? "",
            deembedding: data.deembedding ?? "",
            port_extension: data.portExtension ?? "",
            ...buildCommonMeasurementData(data),
          }
        };
      }

      if (item.type === "na") {
        return {
          type: "na",
          data: {
            deembedding: data.deembedding ?? "",
            port_extension: data.portExtension ?? "",
            matching: data.matching ?? "",
            mold: data.mold ?? "",
            jig_soldering: data.jigSoldering ?? "",
            evb_tuning: !!data.evbTuning,
            appendix: !!data.appendix,
            ...buildCommonMeasurementData(data),
          }
        };
      }

      if (item.type === "nf") {
        return {
          type: "nf",
          data: {
            board_type: data.boardType ?? "",
            mold: data.mold ?? "",
            appendix: !!data.appendix,
            ...buildCommonMeasurementData(data),
          },
        };
      }

      if (item.type === "mwa") {
        return {
          type: "mwa",
          data: {
            matching: data.matching ?? "",
            loss: data.loss ?? "",
            ...buildCommonMeasurementData(data),
          },
        };
      }

      if (item.type === "ca") {
        return {
          type: "ca",
          data: {
            trace: data.trace ?? "",
            power: data.power ?? "",
            freq_start: data.freqStart ?? "",
            freq_stop: data.freqStop ?? "",
            average: data.average ?? "",
            point: data.point ?? "",
            ...buildCommonMeasurementData(data),
          },
        };
      }

      if (item.type === "tcf") {
        return {
          type: "tcf",
          data: {
            temperature_sequence: data.temperatureSequence ?? "",
            matching: data.matching ?? "",
            jig_soldering: data.jigSoldering ?? "",
            ...buildCommonMeasurementData(data),
          },
        };
      }
      if (item.type === "nonlinear") {
        return {
          type: "nonlinear",
          data: {
            selected_type: data.selectedType ?? "",
            selected_types: Array.isArray(data.selectedTypes) ? data.selectedTypes : [],
          
            imd_band: data.imdBand ?? "",
            imd_input_power: data.imdInputPower ?? "",
            imd_fjam_power: data.imdFjamPower ?? "",
          
            p1db_band: data.p1dbBand ?? "",
            p1db_gain_bias_address: data.p1dbGainBiasAddress ?? "",
          
            iip3_band: data.iip3Band ?? "",
            iip3_gain_bias_address: data.iip3GainBiasAddress ?? "",
            iip3_fjam_power: data.iip3FjamPower ?? "",
          
            rse_frequency: data.rseFrequency ?? "",
          
            harmonic_band: data.harmonicBand ?? "",
            harmonic_input_power: data.harmonicInputPower ?? "",
            harmonic_order: data.harmonicOrder ?? "",
            harmonic_unit: data.harmonicUnit ?? "",
          
            ...buildCommonMeasurementData(data),
          },
        };
      }

      if (item.type === "probeSpl") {
        return {
          type: "probeSpl",
          data: {
            sample_type: data.sampleType ?? "",
            freq_start: data.freqStart ?? "",
            freq_stop: data.freqStop ?? "",
            step_point: data.stepPoint ?? "",
            power_ifbw: data.powerIfbw ?? "",
            pitch: data.pitch ?? "",
            gs_type: data.gsType ?? "",
            ...buildCommonMeasurementData(data),
          },
        };
      }

      if (item.type === "probeDeembedding") {
        return {
          type: "probeDeembedding",
          data: {
            evb_info: data.evbInfo ?? "",
            freq_start: data.freqStart ?? "",
            freq_stop: data.freqStop ?? "",
            step_point: data.stepPoint ?? "",
            power_ifbw: data.powerIfbw ?? "",
            pitch: data.pitch ?? "",
            gs_type: data.gsType ?? "",
            ...buildCommonMeasurementData(data),
          },
        };
      }

      if (item.type === "evbAssembly") {
        return {
          type: "evbAssembly",
          data: {
            request_link: data.requestLink ?? "",
            ...buildCommonMeasurementData(data),
          },
        };
      }
      return null;
    })
    .filter(Boolean);

  return {
    pn: app.pn,
    requester: app.requester,
    developer: app.developer,
    purpose: app.purpose,
    site_type: app.siteType,
    use_sample_info: !!app.useSampleInfo,
    sample_info: app.useSampleInfo
    ? {
        sender: app.sampleInfo?.sender ?? "",
        delivered_date: app.sampleInfo?.deliveredDate ?? null,
        note: app.sampleInfo?.note ?? "",
        sample_link: app.sampleInfo?.sampleLink ?? "",
      }
    : null,
    measurements,
    creator: app.creator ?? null,
    modifier: app.modifier ?? null,
  };
}

export async function createModuleApplicationNew(app: ModuleApplicationSubmitInput) {
  const payload = buildModuleNewPayload(app);
  const response = await axios.post("/module_new/create_app", payload);
  return response.data;
}

export async function updateModuleApplicationNew(app: ModuleApplicationSubmitInput) {
  if (!app.applicationId) {
    throw new Error("applicationId가 없습니다.");
  }

  const payload = buildModuleNewPayload(app);
  const response = await axios.post(
    `/module_new/update_app/${app.applicationId}`,
    payload
  );
  return response.data;
}

export async function deleteModuleApplicationNew(applicationId: string) {
  const formData = new FormData();
  formData.append("application_id", applicationId);

  const response = await axios.post("/module_new/delete_app", formData);
  return response.data;
}

export async function getModuleApplicationNewById(applicationId: string) {
  const response = await axios.get(`/module_new/get_app_by_id/${applicationId}`);
  return mapApiDetailToUi(response.data);
}


export type ModuleApplicationStatus = "waiting" | "in_progress" | "done";
export type ModuleMeasurementStatus = "none" | "waiting" | "in_progress" | "done";

export interface ModuleMeasurementCell {
  type: string | null;
  status: ModuleMeasurementStatus;
  displayValue: string | null;
  displayColor: "gray" | "orange" | "green" | "blue";
  expectedDoneDate: string | null;
  doneDate: string | null;
}

export interface ModuleApplicationListRow {
  applicationId: string;
  pn: string;
  requester: string;
  developer?: string | null;
  purpose?: string | null;
  siteType: SiteType;
  useSampleInfo: boolean;
  status: ModuleApplicationStatus;
  creator?: string | null;
  modifier?: string | null;
  createdDate?: string | null;
  modifiedDate?: string | null;

  measurement1: ModuleMeasurementCell;
  measurement2: ModuleMeasurementCell;
  measurement3: ModuleMeasurementCell;
  measurement4: ModuleMeasurementCell;
  measurement5: ModuleMeasurementCell;
  measurement6: ModuleMeasurementCell;
  measurement7: ModuleMeasurementCell;
  measurement8: ModuleMeasurementCell;
  measurement9: ModuleMeasurementCell;
  measurement10: ModuleMeasurementCell;
}


export async function getModuleApplicationNewList(params?: {
  pn?: string;
  requester?: string;
  siteType?: SiteType | "";
  orderBy?: string;
  orderDir?: "asc" | "desc";
}) {
  const formData = new FormData();

  if (params?.pn) formData.append("pn", params.pn);
  if (params?.requester) formData.append("requester", params.requester);
  if (params?.siteType) formData.append("site_type", params.siteType);
  formData.append("order_by", params?.orderBy ?? "created_date");
  formData.append("order_dir", params?.orderDir ?? "desc");

  const response = await axios.post("/module_new/get_app_list", formData);
  return response.data as ModuleApplicationListRow[];
}


export async function downloadModuleApplicationNewExcel(applicationId: string) {
  const response = await axios.get(
    `/module_new/download_excel/${applicationId}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: response.headers["content-type"] || "application/octet-stream",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const disposition = response.headers["content-disposition"];
  let fileName = `module_application_${applicationId}.xlsx`;

  if (disposition) {
    const match = disposition.match(/filename\*=UTF-8''(.+)|filename="?([^"]+)"?/);
    const extracted = match?.[1] || match?.[2];
    if (extracted) {
      fileName = decodeURIComponent(extracted);
    }
  }

  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function initNa() {
  const na = ref<NaApplication>({
    na: "",
    deMethod: "",
    portExtensionLoss: false,
    measMethod: "",
    sParaType: "",
    note: "",
    measurementManager: "",
    completionDueDate: null,
    finishedDate: null,
  });
  return na.value;
}

export function initNf() {
  const nf = ref<NfApplication>({
    capture: null,
    nfParameterMdf: null,
    isRealMatching: true,
    matchingFile: null,
    note: "",
    measurementManager: "",
    completionDueDate: null,
    finishedDate: null,
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
    { key: 0, label: "특성 평가", value: "forEvaluation" },
    { key: 1, label: "고객사 제출용", value: "forCustomer" },
    { key: 2, label: "특성 평가 (Tunning)", value: "forTunning" },
    { key: 3, label: "기타 목적", value: "others" },
  ]);

  return purposeOptions.value;
}

const appendFileGroup = async (
  files: ApplicationFile[],
  fileList: UploadFile[],
  file_type: string,
  app_id: number | string
) => {
  console.log("Appending files:", fileList, "of type:", file_type, "to app ID:", app_id);
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

    const uploaded = convertPep8ToCamelCase2(response.data);
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
  const url = "/module/update_app";
  try {
    const response = await axios.post(url, convertedData);

    if (response.status === 200) {
      Object.assign(app, convertPep8ToCamelCase2(response.data));
      sendingFiles(app, file_objs);
    }

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios 요청 실패:", error.response?.status, error.message);
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
  console.log("Converted Data:", convertedData);
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
    if (submitType === "update") {
      sendingFiles(app, file_objs);
    }

    const response = await axios.post(url, convertedData);

    if (response.status === 200) {
      if (submitType === "update") {
        const temp = await sendGetRequest("/module/get_app_by_id", app.id.toString());
        Object.assign(app, convertPep8ToCamelCase2(temp));
      } else {
        Object.assign(app, convertPep8ToCamelCase2(response.data));
      }

      if (submitType === "create") {
        sendingFiles(app, file_objs);
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios 요청 실패:", error.response?.status, error.message);
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

  if (application.isNa && application.naApp) {
    if (fileObjs.stateFileList.length === 0) missingFile = "State File";
    else if (fileObjs.naRffeFileList.length === 0) missingFile = "NA RFFE File";
    else if (fileObjs.naConfigFileList.length === 0) missingFile = "NA Config File";
    else if (application.naApp.na === "rohde" && fileObjs.xmlFileList.length === 0) {
      missingFile = "XML File (Rohde 사용 시 필수)";
    }
  }

  if (application.isNf && application.nfApp && !missingFile) {
    if (fileObjs.nfRffeFileList.length === 0) missingFile = "NF RFFE File";
    else if (fileObjs.nfConfigFileList.length === 0) missingFile = "NF Config File";
  }

  if (missingFile) {
    ElNotification({
      title: "필수 파일 누락",
      message: `${missingFile} 은(는) 필수입니다.`,
      type: "error",
      duration: 3000,
      position: "top-right",
    });
    return false;
  }

  return true;
};