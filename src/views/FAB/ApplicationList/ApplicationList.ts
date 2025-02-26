import axios from "axios";
import { ref } from "vue";
import { convertToCamelCase } from "../Common/Application";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";
import type {
  LotStatus,
  FabApplicationForm,
} from "./../../../interface/mes-interface";
import { convertKeysToPEP8 } from "../../../utils/key-converter";
import { convertKeysToCamelCase } from "../../../utils/key-converter";
import type {
  ModifiedFabDataInterface,
  ModifiedFabLotDataInterface,
} from "../../../interface/fab";
import { adjustDate } from "../../../utils/date-utils";

// Define the processData ref in case you want to use it directly
export const processData = ref<FabApplicationForm[]>([]);

export async function downloadFabPlanExcel(
  FabExcel: ModifiedFabDataInterface[]
) {
  try {
    // 배열의 각 요소를 변환하여 새 배열 생성
    const values = FabExcel.map((item) => convertKeysToPEP8(item));
    console.log(values);
    const url = "/test/download_fab_plan_excel";

    // 파일 다운로드 요청
    const response = await axios.post(url, values, {
      responseType: "blob", // 바이너리 데이터 처리
    });

    // 파일 다운로드 처리
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "투입계획서.xlsx"; // 다운로드될 파일 이름
    document.body.appendChild(link);
    link.click();
    link.remove();

    console.log("다운로드 성공");
  } catch (error) {
    console.error("다운로드 실패:", error);
  }
}

const operatioMaxTaime: Record<string, number> = {
  TRANSIT: -1,
  //OP07003030 : -1, // 샘플 1차 프로브
  //OP0E002020 : -1, // 개발 프로브 1차
  // OP0E002040 : 24 // 개발 프로브 2차
  OP07001015: -1, // 샘플 F/O 보관
  OP09003030: -1, // 출하
  OP08003030: 48, // 전수검사
  OP08003020: 48, // AOI
  OPF01: -1, // 불량창고
};

export function testFabOutAlarm(operationId: string, moveinDate: string) {
  let max_time = 24;

  if (Object.prototype.hasOwnProperty.call(operatioMaxTaime, operationId)) {
    max_time = operatioMaxTaime[operationId];
  }

  if (max_time < 0) {
    return false;
  }

  // 현재 시간을 Date 객체로 가져오기
  const now = new Date();

  // moveinDate를 Date 객체로 변환
  const movein = new Date(moveinDate);

  // 시간 차이를 밀리초 단위로 계산
  const timeDifference = now.getTime() - movein.getTime();

  // max_time을 밀리초로 변환 (시간 -> ms)
  const maxTimeInMs = max_time * 60 * 60 * 1000;

  return timeDifference > maxTimeInMs;
}

export function createTableData(
  fabReqeustForm: FabApplicationForm[],
  FabExcelList: ModifiedFabDataInterface[]
) {
  fabReqeustForm.forEach((fab, index) => {
    const ex = ref<ModifiedFabDataInterface>({});

    ex.value.weekNumber = fab.weekNumber;
    ex.value.modelName = fab.modelName;
    ex.value.designer = fab.designer;
    ex.value.requester = fab.requester;
    ex.value.wantedFabStartDate = fab.wantedFabStartDate;
    ex.value.wantedFabFinishDate = fab.wantedFabFinishDate;

    ex.value.lotQuantity = fab.lotStatus.length;

    if (ex.value.lotQuantity >= 1) {
      ex.value.fabLotStatusExcel = [];
      fab.lotStatus.forEach((lot, i) => {
        const lotExcel = ref<ModifiedFabLotDataInterface>({});

        lotExcel.value.lotId = lot.lotId;
        lotExcel.value.fabInsertDate = lot.creationDate;

        lotExcel.value.currentOperationTime = lot.moveinDate;
        lotExcel.value.currentOperationName = lot.operation.name;
        ex.value.isAlarm = testFabOutAlarm(
          lot.operation.operationId,
          lot.moveinDate
        );
        // console.log(lot.operation.operationId)
        // console.log(lot.operation.siteId)
        // console.log(lot.moveinDate)
        // console.log(lot.operation.name)

        for (const key in lot) {
        }

        let result = "";

        if (lot.operation.operationId === "OP0E002040") {
          // 조건 1: operationId가 'OP0E002040'인 경우
          result = adjustDate(lot.moveinDate, 3);
        } else if (
          lot.secondProbeHistory &&
          lot.secondProbeHistory.startDate !== null
        ) {
          // 조건 2: secondProbeHistory가 있고 startDate가 null이 아닌 경우
          result = adjustDate(lot.secondProbeHistory.startDate, 3);
        } else if (
          lot.secondProbeHistory &&
          lot.secondProbeHistory.endDate !== null
        ) {
          // 조건 3: secondProbeHistory가 있고 endDate가 null이 아닌 경우
          result = adjustDate(lot.secondProbeHistory.endDate, 3);
        } else if (
          lot.secondProbeHistory &&
          lot.secondProbeHistory.startDate === null
        ) {
          // 조건 4: secondProbeHistory가 있고 startDate가 null인 경우
          result = "SKIP";
        } else {
          // 조건 5: 위 조건에 모두 해당하지 않는 경우
          result = "--";
        }

        lotExcel.value.whcExpectedShipmentDate = result;

        if (lot.operation.name === "Transit 공정")
          lotExcel.value.whcShipmentDate = lot.moveinDate;
        else {
          lotExcel.value.whcShipmentDate = "--";
        }

        if (lot.hanoiCsp === null) {
          lotExcel.value.whcArrivalDate = "--";
        } else {
          lotExcel.value.whcArrivalDate = lot.hanoiCsp.creationDate;
          lotExcel.value.assyIn = lot.hanoiCsp.moveinDate;

          traverseLotStatus(lot.hanoiCsp, lotExcel.value, 0);
        }

        ex.value.fabLotStatusExcel.push(lotExcel.value);
      });
    }
    FabExcelList.push(ex.value);
  });
  return FabExcelList;
}

function traverseLotStatus(
  lotStatus: LotStatus,
  lotExcel: ModifiedFabLotDataInterface | null,
  depth = 0
): void {
  if (lotStatus === null || depth >= 5) return;

  if (depth == 0) {
    lotExcel.flipBondingOperation = lotStatus.operation.name;
    lotExcel.flipBondingTime = lotStatus.moveinDate;
  } else if (depth == 1) {
    lotExcel.packageOperation = lotStatus.operation.name;
    lotExcel.packageTime = lotStatus.moveinDate;
  } else if (depth == 2) {
    lotExcel.assyOperation = lotStatus.operation.name;
    lotExcel.assyTime = lotStatus.moveinDate;
  } else if (depth == 4) {
    lotExcel.finalShipmentOperation = lotStatus.operation.name;
    lotExcel.finalShipmentTime = lotStatus.moveinDate;
  }

  traverseLotStatus(lotStatus.child, lotExcel, depth + 1);
}

export const showInfo = async (processData: FabApplicationForm[]) => {
  const idList = [];

  processData.forEach((data, index) => {
    if (idList.includes(data.modelName)) {
      console.log(data);
    }
  });
};

export const showInfoByWeek = (processData: FabApplicationForm[]) => {
  const weekList = [35, 36, 37];
  let tempStr = "";

  processData.forEach((app, index) => {
    if (weekList.includes(app.weekNumber)) {
      const tempModelName = app.modelName.split("@")[0];
      tempStr += tempModelName + "-M,";
    }
  });

  console.log(tempStr);
};

export const downloadExcel = async (processData: FabApplicationForm[]) => {
  try {
    // processData 배열에서 id 값만 추출하여 idList에 저장
    const idList = processData.map((data) => data.id);
    const form = new FormData();

    // 각 id를 FormData에 추가
    idList.forEach((id) => {
      form.append("id_list", id.toString());
    });

    const template_url = "/fab_monitoring/download_fab_inset_list";

    const response = await axios({
      url: template_url,
      method: "POST",
      data: form,
      responseType: "blob", // Important for handling binary data (xlsx)
    });

    // Extract the file name from the 'Content-Disposition' header
    const disposition = response.headers["content-disposition"];
    let fileName = "FAB 투입 리스트.xlsx"; // Default file name

    if (disposition) {
      const fileNameUTF8Match = disposition.match(
        /filename\*=UTF-8''([^;\n]*)/
      );
      if (fileNameUTF8Match && fileNameUTF8Match[1]) {
        fileName = decodeURIComponent(fileNameUTF8Match[1]);
      } else {
        const fileNameMatch = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ""));
        }
      }
    }

    // Create a link element to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Use the extracted file name
    document.body.appendChild(link);
    link.click();

    // Clean up the link element after the download
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error:", error);
  }
};

export function getLateFab(fabList: FabApplicationForm[]) {
  const LateFabList = ref<FabApplicationForm[]>([]);

  fabList.forEach((fab) => {
    const tempLots = ref<LotStatus[]>([]);
    let isLate = false;
    for (let i = 0; i < fab.lotStatus.length; i++) {
      if (
        testFabOutAlarm(
          fab.lotStatus[i].operation.operationId,
          fab.lotStatus[i].moveinDate
        )
      ) {

        isLate = true;
        tempLots.value.push(fab.lotStatus[i])
      }
    }

    if (isLate) {
      fab.lotStatus = tempLots.value
      LateFabList.value.push(fab);
    }
  });

  return LateFabList.value;
}

export const getApplicationByUserName = async (
  userName: string,
  fabList: FabApplicationForm[]
) => {
  try {
    let startTime = performance.now();
    const formData = new FormData();

    formData.append("lot_status", "true");
    formData.append("order_by", "week_number");
    formData.append("order_dir", "asc");
    formData.append("designer_confirm", "false");
    formData.append("name", userName);
    const url = "/fab_monitoring/get_fab_request_list_person";

    // 시작 시간 기록
    const startFilterTime = performance.now();
    const response = await axios.post(url, formData);

    // 필터링 소요 시간 계산

    fabList = response.data.map((fab) => convertPep8ToCamelCase2(fab));

    const endFilterTime = performance.now();
    const filterTime = ((endFilterTime - startFilterTime) / 1000).toFixed(3);

    return fabList;
  } catch (error) {
    console.error("Failed to fetch process data:", error);
    return [];
  }
};

export const getFabRequestFormByModelNames = async (modelNames : string,   fabList: FabApplicationForm[]) => {

  try {
    let startTime = performance.now();
    const formData = new FormData();

    formData.append("lot_status", "true");
    formData.append("order_by", "week_number");
    formData.append("order_dir", "asc");
    formData.append("designer_confirm", "false");
    formData.append("name", modelNames);
    const url = "/fab_monitoring/get_fab_request_list_by_model_name_list";

    // 시작 시간 기록
    const startFilterTime = performance.now();
    const response = await axios.post(url, formData);

    // 필터링 소요 시간 계산

    fabList = response.data.map((fab) => convertPep8ToCamelCase2(fab));

    const endFilterTime = performance.now();
    const filterTime = ((endFilterTime - startFilterTime) / 1000).toFixed(3);

    return fabList;
  } catch (error) {
    console.error("Failed to fetch process data:", error);
    return [];
  }
}

export const fetchProcessData = async (fabList: FabApplicationForm[]) => {
  try {
    let startTime = performance.now();
    const formData = new FormData();

    formData.append("lot_status", "true");

    formData.append("order_by", "wanted_fab_start_date");

    formData.append("order_dir", "asc");

    formData.append("designer_confirm", "false");

    const url = "/fab_monitoring/get_fab_request_list";

    // 시작 시간 기록
    const startFilterTime = performance.now();
    const response = await axios.post(url, formData);

    // 필터링 소요 시간 계산

    fabList = response.data.map((fab) => convertPep8ToCamelCase2(fab));

    const endFilterTime = performance.now();
    const filterTime = ((endFilterTime - startFilterTime) / 1000).toFixed(3);
    // console.log(`Filtering and processing took ${filterTime} seconds.`);
    // console.log(fabList);
    return fabList;

    // processData.value = convertKeysToCamelCase2(response.data); // Convert data to camelCase

    return processData.value;
  } catch (error) {
    console.error("Failed to fetch process data:", error);
    return [];
  }
};
