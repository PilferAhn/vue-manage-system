import axios from "axios";
import { ref } from "vue";
import { convertToCamelCase } from "../Common/Application";
import { ProcessData } from "../Interface/ApplicationInterface";
import type { LotStatus } from "./../../../interface/mes-interface";
import { convertKeysToPEP8 } from "../../../utils/key-converter";
import { convertKeysToCamelCase } from "../../../utils/key-converter";
import type { FabExcel, FabLotStatusExcel } from "../../../interface/fab";
import { adjustDate } from "../../../utils/date-utils";

// Define the processData ref in case you want to use it directly
export const processData = ref<ProcessData[]>([]);

import axios from "axios";

export async function downloadFabPlanExcel(FabExcel: FabExcel[]) {
  try {
    // 배열의 각 요소를 변환하여 새 배열 생성
    const values = FabExcel.map((item) => convertKeysToPEP8(item));

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



export function syncFabFormToFabExcel(
  fabReqeustForm: ProcessData[],
  FabExcelList: FabExcel[]
) {
  fabReqeustForm.forEach((fab , index) => {

    const ex = ref<FabExcel>({});

    ex.value.weekNumber = fab.weekNumber;
    ex.value.modelName = fab.modelName
    ex.value.designer = fab.designer;
    ex.value.requester = fab.requester;
    ex.value.wantedFabStartDate = fab.wantedFabStartDate;
    ex.value.wantedFabFinishDate = fab.wantedFabFinishDate;

    ex.value.lotQuantity = fab.lotStatus.length;
    
    if (ex.value.lotQuantity >= 1) {
      ex.value.fabLotStatusExcel = []
      fab.lotStatus.forEach((lot, i) => {
        
        const lotExcel = ref<FabLotStatusExcel>({});

        lotExcel.value.lotId = lot["lot_id"];
        lotExcel.value.fabInsertDate = lot["creation_date"];
        
        lotExcel.value.currentOperationTime = lot["movein_date"];
        lotExcel.value.currentOperationName = lot.operation.name;

        let result = "";

        if (lot["operation"]["operation_id"] === "OP0E002040") {
          // 조건 1: operation_id가 'OP0E002040'인 경우
          result = adjustDate(lot["movein_date"], 3);
        } else if (
          lot["second_probe_history"] &&
          lot["second_probe_history"]["start_date"] !== null
        ) {
          // 조건 2: second_probe_history가 있고 start_date가 null이 아닌 경우
          result = adjustDate(lot["second_probe_history"]["start_date"], 3);
        } else if (
          lot["second_probe_history"] &&
          lot["second_probe_history"]["end_date"] !== null
        ) {
          // 조건 3: second_probe_history가 있고 end_date가 null이 아닌 경우
          result = adjustDate(lot["second_probe_history"]["end_date"], 3);
        } else if (
          lot["second_probe_history"] &&
          lot["second_probe_history"]["start_date"] === null
        ) {
          // 조건 4: second_probe_history가 있고 start_date가 null인 경우
          result = "SKIP";
        } else {
          // 조건 5: 위 조건에 모두 해당하지 않는 경우
          result = "--";
        }

        lotExcel.value.whcExpectedShipmentDate = result;

        if (lot["operation"]["name"] === "Transit 공정")
          lotExcel.value.whcShipmentDate = lot["movein_date"];
        else {
          lotExcel.value.whcShipmentDate = "--";
        }

        if (lot["hanoi_csp"] === null) {
          lotExcel.value.whcArrivalDate = "--";
        } else {
          lotExcel.value.whcArrivalDate = lot["hanoi_csp"]["creation_date"];
          lotExcel.value.assyIn = lot["hanoi_csp"]["movein_date"]

          traverseLotStatus(lot["hanoi_csp"]["child"], lotExcel.value, 0);
        }

        ex.value.fabLotStatusExcel.push(lotExcel.value);
      });
    }
    FabExcelList.push(ex.value)

  })
  return FabExcelList
}

function traverseLotStatus(
  lotStatus: LotStatus,
  lotExcel: FabLotStatusExcel | null,
  depth = 0
): void {
  if (lotStatus === null || depth >= 5) return;

  if (depth == 0) {
    lotExcel.filpBondingOperation = lotStatus["operation"]["name"];
    lotExcel.filpBondingTime = lotStatus["movein_date"];
  } else if (depth == 1) {
    lotExcel.packageOperation = lotStatus["operation"]["name"];
    lotExcel.packageTime = lotStatus["movein_date"];
  } else if (depth == 3) {
    lotExcel.assyOperation = lotStatus["operation"]["name"];
    lotExcel.assyTime = lotStatus["movein_date"];
  } else if (depth == 4) {
    lotExcel.finalShipmentOperation = lotStatus["operation"]["name"];
    lotExcel.finalShipmentTime = lotStatus["movein_date"];
  }

  traverseLotStatus(lotStatus["child"], lotExcel, depth + 1);
}

export const showInfo = async (processData: ProcessData[]) => {
  const idList = [];

  processData.forEach((data, index) => {
    if (idList.includes(data.modelName)) {
      console.log(data);
    }
  });
};

export const showInfoByWeek = (processData: ProcessData[]) => {
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

export const downloadExcel = async (processData: ProcessData[]) => {
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

export const fetchProcessData = async () => {
  try {
    let startTime = performance.now();
    const formData = new FormData();

    formData.append("lot_status", "true");

    formData.append("order_by", "week_number");

    formData.append("order_dir", "asc");

    formData.append("designer_confirm", "false");

    const url = "/fab_monitoring/get_fab_request_list";

    const response = await axios.post(url, formData);

    processData.value = convertToCamelCase(response.data); // Convert data to camelCase

    return processData.value;
  } catch (error) {
    console.error("Failed to fetch process data:", error);
    return [];
  }
};

export function getMaxHistorySeqAndIndexFromProcessData(
  processDataArray: ProcessData[]
): {
  maxHistorySeq: number | null;
  processDataIndex: number | null;
  lotStatusIndex: number | null;
} {
  if (!processDataArray || processDataArray.length === 0) {
    return {
      maxHistorySeq: null,
      processDataIndex: null,
      lotStatusIndex: null,
    };
  }

  let maxHistorySeq = null;
  let processDataIndex = null;
  let lotStatusIndex = null;

  processDataArray.forEach((processData, index) => {
    try {
      if (processData.lotStatus.length > 0) {
        processData.lotStatus.forEach((lotStatus, lotIndex) => {
          if (lotStatus.hanoi_csp !== null) {
            processData.hanoiIndex = index;
            processData.hanoiSiteIn = lotStatus["hanoi_csp"]["creation_date"];

            if (lotStatus["hanoi_csp"]["child"] === null) {
              processData.hanoiOperation =
                lotStatus["hanoi_csp"]["operation"]["name"];
              processData.hanoiOperationStart =
                lotStatus["hanoi_csp"]["movein_date"];
            } else {
              if (lotStatus["hanoi_csp"]["child"]["child"] === null) {
                processData.hanoiOperation =
                  lotStatus["hanoi_csp"]["child"]["operation"]["name"];
                processData.hanoiOperationStart =
                  lotStatus["hanoi_csp"]["child"]["movein_date"];
                processData.hanoiStep = "(Package)";
                // console.log(processData.modelName)
                // console.log(lotStatus["hanoi_csp"]["child"])
              } else {
                processData.hanoiStep = "(Assay)";
                processData.hanoiOperation =
                  lotStatus["hanoi_csp"]["child"]["child"]["operation"]["name"];
                processData.hanoiOperationStart =
                  lotStatus["hanoi_csp"]["child"]["child"]["movein_date"];
              }
            }
          }

          let maxsq = -999;
          let maxIndex = 0;

          if (
            lotStatus.judge_flag === "P" ||
            lotStatus.judge_flag === "H" ||
            lotStatus.judge_flag === "S"
          ) {
            if (processData.hanoiTransite === undefined) {
              if (lotStatus["operation"]["operation_id"] === "TRANSIT") {
                processData.feIndex = lotIndex;
                processData.feOperationStart = lotStatus["movein_date"];
                processData.feSiteIn = lotStatus["creation_date"];
                processData.feOperation = lotStatus["operation"]["name"];
                processData.hanoiTransite = true;
                return;
              } else if (lotStatus.history_seq > maxsq) {
                maxsq = lotStatus.history_seq;
                processData.maxHistorySeq = lotIndex;
                processData.feIndex = lotIndex;
                processData.feOperationStart = lotStatus["movein_date"];
                processData.feSiteIn = lotStatus["creation_date"];
                processData.feOperation = lotStatus["operation"]["name"];
              }
            }
          }
        });
      }
    } catch {
      console.log(processData);
    }
  });

  return { maxHistorySeq, processDataIndex, lotStatusIndex };
}
