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
  creator?: string | null;
  modifier?: string | null;
  measurements: Array<{
    type: string;
    data?: Record<string, any>;
  }>;
}

export interface ModuleMeasurementCell {
  type: string | null;
  status: "none" | "waiting" | "in_progress" | "done";
  display_value: string | null;
  display_color: "gray" | "orange" | "green" | "blue";
  expected_done_date: string | null;
  done_date: string | null;
}

export interface ModuleApplicationListRow {
  application_id: string;
  pn: string;
  requester: string;
  site_type: SiteType;
  status: string;
  creator?: string | null;
  modifier?: string | null;
  created_date?: string | null;
  modified_date?: string | null;
  measurement_1: ModuleMeasurementCell;
  measurement_2: ModuleMeasurementCell;
  measurement_3: ModuleMeasurementCell;
  measurement_4: ModuleMeasurementCell;
  measurement_5: ModuleMeasurementCell;
  measurement_6: ModuleMeasurementCell;
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
    applicationId: detail.application_id,
    pn: detail.pn ?? "",
    requester: detail.requester ?? "",
    developer: detail.developer ?? "",
    purpose: detail.purpose ?? "",
    siteType: detail.site_type ?? "",
    status: detail.status ?? "",
    creator: detail.creator ?? null,
    modifier: detail.modifier ?? null,
    createdDate: detail.created_date ?? null,
    modifiedDate: detail.modified_date ?? null,
    measurements: (detail.measurements || []).map((item: any) => {
      const data = item.data || {};

      if (item.type === "setup") {
        return {
          type: item.type,
          data: {
            vendor: data.vendor ?? "",
            deembedding: data.deembedding ?? "",
            portExtension: data.port_extension ?? "",
            noteSpl: data.note_spl ?? "",
            noteMeasurement: data.note_measurement ?? "",
            fileLink: data.file_link ?? "",
            resultFileLink: data.result_file_link ?? "",
            measurer: data.measurer ?? "",
            requestedDueDate: data.requested_due_date ?? null,
            expectedDoneDate: data.expected_done_date ?? null,
            doneDate: data.done_date ?? null,
          },
        };
      }

      if (item.type === "na") {
        return {
          type: item.type,
          data: {
            deembedding: data.deembedding ?? "",
            portExtension: data.port_extension ?? "",
            matching: data.matching ?? "",
            mold: data.mold ?? "",
            jigSoldering: data.jig_soldering ?? "",
            evbTuning: !!data.evb_tuning,
            appendix: !!data.appendix,
            noteSpl: data.note_spl ?? "",
            noteMeasurement: data.note_measurement ?? "",
            fileLink: data.file_link ?? "",
            resultFileLink: data.result_file_link ?? "",
            measurer: data.measurer ?? "",
            requestedDueDate: data.requested_due_date ?? null,
            expectedDoneDate: data.expected_done_date ?? null,
            doneDate: data.done_date ?? null,
          },
        };
      }

      if (item.type === "nf") {
        return {
          type: item.type,
          data: {
            boardType: data.board_type ?? "",
            mold: data.mold ?? "",
            appendix: !!data.appendix,
            noteSpl: data.note_spl ?? "",
            noteMeasurement: data.note_measurement ?? "",
            fileLink: data.file_link ?? "",
            resultFileLink: data.result_file_link ?? "",
            measurer: data.measurer ?? "",
            requestedDueDate: data.requested_due_date ?? null,
            expectedDoneDate: data.expected_done_date ?? null,
            doneDate: data.done_date ?? null,
          },
        };
      }

      if (item.type === "mwa") {
        return {
          type: item.type,
          data: {
            matching: data.matching ?? "",
            loss: data.loss ?? "",
            noteSpl: data.note_spl ?? "",
            noteMeasurement: data.note_measurement ?? "",
            fileLink: data.file_link ?? "",
            resultFileLink: data.result_file_link ?? "",
            measurer: data.measurer ?? "",
            requestedDueDate: data.requested_due_date ?? null,
            expectedDoneDate: data.expected_done_date ?? null,
            doneDate: data.done_date ?? null,
          },
        };
      }

      if (item.type === "ca") {
        return {
          type: item.type,
          data: {
            trace: data.trace ?? "",
            power: data.power ?? "",
            freqStart: data.freq_start ?? "",
            freqStop: data.freq_stop ?? "",
            average: data.average ?? "",
            point: data.point ?? "",
            noteSpl: data.note_spl ?? "",
            noteMeasurement: data.note_measurement ?? "",
            fileLink: data.file_link ?? "",
            resultFileLink: data.result_file_link ?? "",
            measurer: data.measurer ?? "",
            requestedDueDate: data.requested_due_date ?? null,
            expectedDoneDate: data.expected_done_date ?? null,
            doneDate: data.done_date ?? null,
          },
        };
      }

      if (item.type === "tcf") {
        return {
          type: item.type,
          data: {
            temperatureSequence: data.temperature_sequence ?? "",
            matching: data.matching ?? "",
            jigSoldering: data.jig_soldering ?? "",
            noteSpl: data.note_spl ?? "",
            noteMeasurement: data.note_measurement ?? "",
            fileLink: data.file_link ?? "",
            resultFileLink: data.result_file_link ?? "",
            measurer: data.measurer ?? "",
            requestedDueDate: data.requested_due_date ?? null,
            expectedDoneDate: data.expected_done_date ?? null,
            doneDate: data.done_date ?? null,
          },
        };
      }

      return {
        type: item.type,
        data: {},
      };
    }),
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
            note_spl: data.noteSpl ?? "",
            note_measurement: data.noteMeasurement ?? "",
            file_link: data.fileLink ?? "",
            result_file_link: data.resultFileLink ?? "",
            measurer: data.measurer ?? "",
            requested_due_date: data.requestedDueDate ?? null,
            expected_done_date: data.expectedDoneDate ?? null,
            done_date: data.doneDate ?? null,
          },
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
            note_spl: data.noteSpl ?? "",
            note_measurement: data.noteMeasurement ?? "",
            file_link: data.fileLink ?? "",
            result_file_link: data.resultFileLink ?? "",
            measurer: data.measurer ?? "",
            requested_due_date: data.requestedDueDate ?? null,
            expected_done_date: data.expectedDoneDate ?? null,
            done_date: data.doneDate ?? null,
          },
        };
      }

      if (item.type === "nf") {
        return {
          type: "nf",
          data: {
            board_type: data.boardType ?? "",
            mold: data.mold ?? "",
            appendix: !!data.appendix,
            note_spl: data.noteSpl ?? "",
            note_measurement: data.noteMeasurement ?? "",
            file_link: data.fileLink ?? "",
            result_file_link: data.resultFileLink ?? "",
            measurer: data.measurer ?? "",
            requested_due_date: data.requestedDueDate ?? null,
            expected_done_date: data.expectedDoneDate ?? null,
            done_date: data.doneDate ?? null,
          },
        };
      }

      if (item.type === "mwa") {
        return {
          type: "mwa",
          data: {
            matching: data.matching ?? "",
            loss: data.loss ?? "",
            note_spl: data.noteSpl ?? "",
            note_measurement: data.noteMeasurement ?? "",
            file_link: data.fileLink ?? "",
            result_file_link: data.resultFileLink ?? "",
            measurer: data.measurer ?? "",
            requested_due_date: data.requestedDueDate ?? null,
            expected_done_date: data.expectedDoneDate ?? null,
            done_date: data.doneDate ?? null,
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
            note_spl: data.noteSpl ?? "",
            note_measurement: data.noteMeasurement ?? "",
            file_link: data.fileLink ?? "",
            result_file_link: data.resultFileLink ?? "",
            measurer: data.measurer ?? "",
            requested_due_date: data.requestedDueDate ?? null,
            expected_done_date: data.expectedDoneDate ?? null,
            done_date: data.doneDate ?? null,
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
            note_spl: data.noteSpl ?? "",
            note_measurement: data.noteMeasurement ?? "",
            file_link: data.fileLink ?? "",
            result_file_link: data.resultFileLink ?? "",
            measurer: data.measurer ?? "",
            requested_due_date: data.requestedDueDate ?? null,
            expected_done_date: data.expectedDoneDate ?? null,
            done_date: data.doneDate ?? null,
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