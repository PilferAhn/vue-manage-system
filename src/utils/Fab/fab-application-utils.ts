import type {
  FabApplicationForm,
  LotStatus,
} from "../../interface/mes-interface";
import { ref, reactive } from "vue";
import axios from "axios";
import type { FabApplicationInterface } from "../../interface/fab";
import { convertKeysToCamelCase, convertKeysToPEP8, convertPep8ToCamelCase2 } from "./../key-converter";
import {
  SawType,
  FabRequestForm,
  Layer,
  band,
} from "../../interface/fab-application-rev2";
import User from "../../views/user.vue";
import { ElMessage, ElNotification } from "element-plus";
import {
  sendGetRequest,
  sendGetRequest2,
  sendPostRequest,
} from "../httpProtocol";
import { formatDateTime } from "../date-utils";
import { OptionInterface } from "../../interface/option";
import { Option } from "element-plus/es/components/select-v2/src/select.types";
import { objectEach } from "highcharts";
import { TegApplication } from "../../interface/Teg/teg";
import type { TegApplication as TegApplicationInterface } from "../../Common/ApplicationTypes";
import type { Bom } from "../../interface/fab-application-rev2";

export function initFabApplication3(bom: Bom) {
  const fabApplication = reactive<FabRequestForm>({
    productName: "",
    requesterId: "",
    designerId: "",

    designerConfirm: false,
    weekNumber: undefined,
    isAoi: true,
    isDvr: false,
    quantity: 0,
    waferType: "",
    wantedFabStartDate: undefined,
    wantedFabFinishDate: undefined,
    hsTrimingTarget: null,
    destinationId: "",
    packageId: undefined,
    priorityId: "",
    group: "",
    purpose: "",
    isNeedSio2Seed: false,
    status: "",
    createdDate: undefined,
    isActive: true,
    note: "",
    code: "",
    waferId: undefined,
    waferAngle: undefined,
    waferThickness: undefined,
    idtMachineName: undefined,
    idtId: null,
    pstId: null,
    tcId: null,
    depositionCondi: undefined,
    requester: { userName: "" },
    designer: { userName: "" },
    idtType: undefined,
    is_idt_xoi: false,
    is_need_extra_shot: false,
    is_tone_inverted: false,
    bom: bom,
    photo: {
      photoProcesses: [
        {
          processName: "IDT",
          machineName: "",
          reticleName: "",
          isMutable: true,
        },
        {
          processName: "PAD",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "SiO",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
      ],
    },

    chip: {
      hori: 0,
      verti: 0,
    },
    shot: {
      hori: 0,
      verti: 0,
    },

    chipX: 0,
    chipY: 0,
    shotX: 0,
    shotY: 0,

    hsType: null,
    idtLayers: [],
    pstLayers: [],
    passivationLayers: [],
    seedLayers: [],
    tcLayers: [],
  });
  // Return the reactive FabRequestForm object
  return { fabApplication };
}

export function initFabApplication2() {
  const fabApplication = reactive<FabRequestForm>({
    productName: "TEST12345678",
    requesterId: "",
    designerId: "",

    designerConfirm: false,
    weekNumber: undefined,
    isAoi: true,
    isDvr: false,
    quantity: 10,
    waferType: "HS",
    band: "B1",
    filterType: "Single",
    wantedFabStartDate: undefined,
    wantedFabFinishDate: undefined,
    hsTrimingTarget: null,
    destinationId: "WHC",
    packageId: "WLP",
    priorityId: "S",
    group: "",
    purpose: "의뢰서 테스트",
    isNeedSio2Seed: false,
    status: "",
    createdDate: undefined,
    isActive: true,
    note: "",
    code: "",
    waferId: undefined,
    waferAngle: undefined,
    waferThickness: undefined,

    idtMachineName: undefined,
    idtId: null,
    pstId: null,
    tcId: null,
    depositionCondi: undefined,
    requester: { userName: "" },
    designer: { userName: "" },
    idtType: undefined,

    photo: {
      photoProcesses: [
        {
          processName: "IDT",
          machineName: "",
          reticleName: "",
          isMutable: true,
        },
        {
          processName: "PAD",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "SiO",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
      ],
    },
    bom: {
      finishedProductSize: null,
      size: undefined,
      bump: {
        size: "",
        quantity: 0,
      },
      epoxy: {
        modelName: null,
        size: undefined,
        code: undefined,
        purpose: undefined,
      },
      package: undefined,
    },
    // bom : null

    chip: {
      hori: 0,
      verti: 0,
    },
    shot: {
      hori: 0,
      verti: 0,
    },

    chipX: 1,
    chipY: 2,
    shotX: 3,
    shotY: 4,

    hsType: null,
    idtLayers: [],
    pstLayers: [],
    passivationLayers: [],
    seedLayers: [],
    tcLayers: [],
  });
  // Return the reactive FabRequestForm object
  return { fabApplication };
}

const serverUrl = "http://10.29.11.124:40000";

export async function receivefilterTypeList(): Promise<OptionInterface[]> {
  const fileterTypeList = ref<OptionInterface[]>([]);

  const data = await sendGetRequest2(
    serverUrl + "/fab_monitoring_rev2/get_fab_filter_types_list"
  );
  for (let i = 0; i < data.length; i++) {
    const temp = convertKeysToCamelCase(data[i]);
    fileterTypeList.value.push({
      key: temp.order_index,
      label: temp.filterType,
      value: temp.filterType,
    });
  }

  return fileterTypeList.value;
}

export async function receivePriorityList(): Promise<OptionInterface[]> {
  const priorityList = ref<OptionInterface[]>([]);

  try {
    const data = await sendGetRequest2(
      serverUrl + "/fab_monitoring_rev2/get_fab_priorities_list"
    );

    for (let i = 0; i < data.length; i++) {
      const temp = convertKeysToCamelCase(data[i]);
      priorityList.value.push({
        key: i,
        label: temp.priorityId,
        value: temp.priorityId,
      });
    }
  } catch (error) {
    console.error("ㄹ 목록 가져오기 실패:", error);
  }

  return priorityList.value;
}

export async function receiveDestinationList(): Promise<OptionInterface[]> {
  const destinationList = ref<OptionInterface[]>([]);
  const data = await sendGetRequest2(
    serverUrl + "/fab_monitoring_rev2/get_fab_destinations_list"
  );

  for (let i = 0; i < data.length; i++) {
    const temp = convertKeysToCamelCase(data[i]);
    destinationList.value.push({
      key: i,
      label: temp.description,
      value: temp.destinationId,
    });
  }
  return destinationList.value;
}

export async function getBandList(): Promise<band[]> {
  const bandList = ref<band[]>([]);

  const data = await sendGetRequest2(
    serverUrl + "/band/get_band_combinations_list"
  );

  for (let i = 0; i < data.length; i++) {
    bandList.value.push(convertKeysToCamelCase(data[i]) as band);
  }

  return bandList.value;
}
export function allocFabFormToTegForm(
  fabApp: FabRequestForm,
  tegApp: TegApplicationInterface
) {
  for (const key in fabApp) {
    if (
      fabApp.hasOwnProperty(key) && // fabApp에 해당 키가 존재하는지 확인
      tegApp.hasOwnProperty(key) && // tegApp에 해당 키가 존재하는지 확인
      typeof (fabApp as any)[key] === typeof (tegApp as any)[key] // 타입 비교
    ) {
      tegApp[key] = fabApp[key];
      // (tegApp as any)[key] = (fabApp as any)[key]; // 값을 복사
    }
  }

  tegApp.requesterId = fabApp.requester.id;
  tegApp.designerId = fabApp.designer.id;
  tegApp.designer = fabApp.designer.userName;
  tegApp.waferQuantity = fabApp.quantity;

  if (fabApp.isAoi) {
    tegApp.isAOI = "O";
  } else {
    tegApp.isAOI = "X";
  }

  tegApp.shotSize = fabApp.shotX + "*" + fabApp.shotY;
  tegApp.chipSize = fabApp.chipX + "*" + fabApp.chipY;
}

export async function getAppRev2ByProductName(
  productName: string
): Promise<FabRequestForm> {
  const form = new FormData();
  const url = "/fab_monitoring_rev2/get_fab_request";
  form.append("product_name", productName);

  try {
    const data = await sendPostRequest(url, form); // Promise 해제
    return convertKeysToCamelCase(data) as FabRequestForm; // 데이터 변환 후 반환
  } catch (error) {
    console.error("Error in getAppRev2ByProductName:", error);
    throw error; // 에러를 호출자에게 전달
  }
}

export async function getApplicationList(
  UserOption: boolean,
  waferOption: boolean,
  idtType: boolean,
  userId: string
): Promise<FabRequestForm[]> {
  // const applications = reactive<FabRequestForm[]>([]);
  const applications = ref<FabRequestForm[]>([]);

  const formData = new FormData();
  formData.append("users", String(UserOption));
  formData.append("wafer", String(waferOption));
  formData.append("idt_type", String(idtType));
  // formData.append("observer_id", userId);

  const data = (await sendPostRequest(
    serverUrl + "/fab_monitoring_rev2/get_fab_requests_list",
    formData
  )) as object[];

  for (let i = 0; i < data.length; i++) {
    applications.value.push(convertKeysToCamelCase(data[i]));
  }

  return applications.value;
}

export function validateIdtLayers(layers: Layer[]): boolean {
  if (layers === null) {
    return true;
  }
  if (layers.length > 0) {
    for (const layer of layers) {
      // layer.thinckness 값이 undefined, null, NaN 또는 0보다 작으면 false 반환
      const thickness = parseFloat(layer.thickness as any); // float로 변환 시도
      if (isNaN(thickness) || thickness === undefined || thickness < 0) {
        return false;
      }
    }
  }
  return true;
}

export function validatingForm(applciation: FabRequestForm) {
  if (!validateIdtLayers(applciation.idtLayers)) {
    ElMessage({
      message: "IDT 레이어의 두께 값이 유효하지 않습니다. 값을 확인해주세요.",
      type: "error",
    });
    return false;
  }

  if (!validateIdtLayers(applciation.pstLayers)) {
    ElMessage({
      message: "PST 레이어의 두께 값이 유효하지 않습니다. 값을 확인해주세요.",
      type: "error",
    });
    return false;
  }

  if (
    ["NS", "HS"].includes(applciation.waferType) &&
    !validateIdtLayers(applciation.tcLayers)
  ) {
    ElMessage({
      message: "TC 레이어의 두께 값이 유효하지 않습니다. 값을 확인해주세요.",
      type: "error",
    });
    return false;
  }

  return true;
}

/**
 * Checks if the given application is a DVR model and updates the note accordingly.
 *
 * @param application - The FabRequestForm object containing application details.
 * @param type - A string parameter (not currently used in logic but may be relevant in future updates).
 */
export async function dvrChecker(application: FabRequestForm, type: string) {
  if (application.isDvr) {
    if (application.note === "") {
      application.note = "DVR 해당 기종입니다.";
    } else {
      application.note += "\nDVR 해당 기종입니다.";
    }
  } else {
    let lines = application.note.split("\n");
    let newNote = "";
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== "DVR 해당 기종입니다.") {
        if (i + 1 == lines.length) {
          newNote += lines[i];
        } else {
          newNote += lines[i] + "\n";
        }
      }
    }
    application.note = newNote;
  }
}

/**
 * Check if the give application package model is a CSP and remove bom information if package model == CSP
 *
 * @param application - The FabRequestForm object containing application details.
 * @param type - A string parameter (not currently used in logic but may be relevant in future updates).
 */
export async function packageChecker(
  application: FabRequestForm,
  type: string
) {
  if (application.packageId !== "CSP") {
    application.bom = null;
  }
}

export async function sendingForm(application: FabRequestForm, type: string) {
  if (validatingForm(application)) {
    let url = ""; // 조건문 외부에서 선언
    if (type === "submit") {
      url = serverUrl + "/fab_monitoring_rev2/create_fab_request";
    } else {
      url = serverUrl + "/fab_monitoring_rev2/update_fab_request";
    }

    dvrChecker(application, type);
    packageChecker(application, type);
    try {
      if (application.wantedFabFinishDate !== undefined) {
        application.wantedFabFinishDate = formatDateTime(
          application.wantedFabFinishDate
        );
      }
      if (application.wantedFabStartDate !== undefined) {
        application.wantedFabStartDate = formatDateTime(
          application.wantedFabStartDate
        );
      }
      const app = convertKeysToPEP8(application);
      const response = await axios.post(url, app);
      console.log(response.data);
      console.log(convertPep8ToCamelCase2(response.data));
      Object.assign(application, convertPep8ToCamelCase2(response.data));

      // 성공 알림
      ElNotification({
        title: "성공",
        message:
          type === "submit"
            ? "의뢰서가 성공적으로 제출되었습니다."
            : "의뢰서가 성공적으로 업데이트되었습니다.",
        type: "success",
      });
    } catch (error) {
      if (error.response) {
        console.log(error);
        const status = error.response.status;
        const errorMessage =
          error.response.data?.detail || "알 수 없는 서버 에러가 발생했습니다.";

        // 사용자에게 알림
        ElNotification({
          title: `에러 (HTTP ${status})`,
          message: errorMessage,
          type: "error",
        });

        console.error("상세 에러 데이터:", error.response.data);
      } else if (error.request) {
        // 서버에 요청이 도달하지 않음
        ElNotification({
          title: "네트워크 오류",
          message:
            "서버로부터 응답을 받을 수 없습니다. 네트워크 상태를 확인하세요.",
          type: "error",
        });

        console.error("요청 객체:", error.request);
      } else {
        // 설정 중 에러
        ElNotification({
          title: "요청 설정 에러",
          message: `요청 처리 중 문제가 발생했습니다: ${error.message}`,
          type: "error",
        });

        console.error("에러 메시지:", error.message);
      }
    }
  }
}

export function initFabApplication() {
  // reactive로 초기화
  const fabApplication = reactive<FabApplicationInterface>({
    uuid: "",
    id: "",
    group: "",
    process: "",
    priority: "",
    packageType: "",
    modelName: "",
    purpose: "",
    isAoi: false,
    destination: "",
    quantity: 0,
    code: "",
    fabInsertDate: "",
    fabFinishDate: "",
    waferCompany: "",
    waferAngle: "",
    waferThickness: "",
    waferType: "",
    machineName: "",
    condition: "",
    idtThickness: "",
    packageName: "",
    moldingName: "",
    moldingCode: "",
    designerConfirm: "",
    weekNumber: 0,
    createdData: "",
    expectStartDate: "",
    expectFinishDate: "",
    hsWaferInfo: "",
    wantedFabStartDate: "",
    wantedFabFinishDate: "",
    realStartDate: "",
    realFinishDate: "",
    designer: "",
    designerId: "",
    requester: "",
    requesterId: "",
    lotStatus: [],
    maxHistorySeq: 0,
    hanoiIndex: 0,
    hanoiOperation: "",
    hanoiOperationStart: "",
    hanoiSiteIn: "",
    hanoiStep: "",
    hanoiTransite: false,
    feIndex: 0,
    feOperation: "",
    feOperationStart: "",
    feSiteIn: "",
    estToHanoi: "",
    status: "",
    note: "",
    result: "",
    step1Operation: "",
    step1OperationStart: "",
    step1SiteIn: "",
    step1LotId: "",
    step2Operation: "",
    step2OperationStart: "",
    step2SiteIn: "",
    step2LotId: "",
    step3Operation: "",
    step3OperationStart: "",
    step3SiteIn: "",
    step3LotId: "",
    step4Operation: "",
    step4OperationStart: "",
    step4SiteIn: "",
    step4LotId: "",
    step5Operation: "",
    step5OperationStart: "",
    step5SiteIn: "",
    step5LotId: "",
  });

  return { fabApplication };
}

export async function getApplicationByModelName(
  application: FabApplicationInterface,
  modelName: string
) {
  try {
    const form = new FormData();
    form.append("model_name", modelName);
    const url = "fab_monitoring/get_fab_request_by_model_name";
    const response = await axios.post(url, form);
    Object.assign(application, convertKeysToCamelCase(response.data));
  } catch (error) {
    console.log(error);
  }
}

function findFinalLotStats(lot: LotStatus, depth: number) {
  if (lot.child !== null) {
    return findFinalLotStats(lot.child, depth + 1);
  } else {
    if (depth >= 5) {
      // console.log(`${depth}  ${lot.operation.name} -- ${lot.operation.operationId} -- ${lot.operation.siteId}`)
      if (
        ["OP_TRANSIT", "OR002", "OC460"].includes(lot.operation.operationId)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

export function getAngleAndThick(waferInfo: string, sawType: SawType) {}

export function getRunningFabReqeust(applicationList: FabApplicationForm[]) {
  const filteredApp = ref<FabApplicationForm[]>([]);
  // 모든 lot 이 끝까지 가고,
  // depth 가 5에서 완료된 공정일 경우만 true

  // 모든 Fab Application 을 읽고
  for (let i = 0; i < applicationList.length; i++) {
    // console.log(`Application Number ${i}`)
    // 그중에 Lot Status 가 1개 이상이고.
    if (applicationList[i].lotStatus.length > 0) {
      // lot status 에서 데이터를 찾아오는데 !
      // hanoi csp 에서 공정이 모두 끝까지 갔다 안갔나를 확인할때 사용하는 함수
      let isFinish = true;
      for (let j = 0; j < applicationList[i].lotStatus.length; j++) {
        if (applicationList[i].lotStatus[j].hanoiCsp === null) {
          isFinish = false;
          break;
        } else {
          const result = findFinalLotStats(
            applicationList[i].lotStatus[j].hanoiCsp,
            1
          );
          if (!result) {
            isFinish = false;
            break;
          }
        }
      }
      if (!isFinish) {
        filteredApp.value.push(applicationList[i]);
      }
    } else {
      filteredApp.value.push(applicationList[i]);
    }
  }

  return filteredApp.value;
}
