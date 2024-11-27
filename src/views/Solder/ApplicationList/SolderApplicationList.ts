import axios from "axios";
import type {
  ApplicationData,
  SolderFile,
} from "../../../interface/solderAppInterface";
import { ElMessageBox, ElMessage } from "element-plus";
import { removeApplicationByUuid } from "../Application/SolderApplication";
import { getUserName } from "../../../utils/account-utils";
// import type { LotStatus, FabApplicationForm } from "../../FAB/Interface/mes-interface";
import {
  LotStatus,
  FabApplicationForm,
} from "../../../interface/mes-interface";

import { convertKeysToPEP8 } from "../../../utils/key-converter";

import { ref } from "vue";
import { FabExcel } from "../../../interface/fab";

export const statusList = [
  { key: "created", value: "created", label: "Waiting" },
  { key: "in progress", value: "in progress", label: "In Progress" },
  { key: "finished", value: "finished", label: "FINISH" },
];

function traverseLotStatus(
  app: ApplicationData,
  lotStatus: LotStatus | null,
  depth = 0
): void {
  if (lotStatus === null || depth >= 5) return; // Null 체크 및 최대 깊이 제한

  // console.log(`Depth: ${depth}, Lot ID: ${lotStatus.lotId}`);
  // console.log(`Operation Name: ${lotStatus.operation.name}`);
  // console.log(`Material ID: ${lotStatus.materialId}`);

  if (app.childDepth === undefined || app.childDepth <= depth) {
    app.childDepth = depth;
    app.childOperation = lotStatus.operation.name;

    if (depth == 0) {
      app.childStageName = "플립본딩";
    } else if (depth == 1) {
      app.childStageName = "Package";
    } else if (depth == 2) {
      app.childStageName = "Assy";
      app.childIsAssay = true;
      app.assayLotId = lotStatus.lotId;
    } else if (depth == 3) {
      app.childStageName = "STEP4";
    } else if (depth == 4) {
      app.childStageName = "출하";
      app.receivedDate = lotStatus.moveinDate;
      // console.log(lotStatus);
    }
    app.lotId = lotStatus.lotId;
  }

  // 다음 child 탐색
  traverseLotStatus(app, lotStatus.child, depth + 1);
}

export function getMyApplicationList(applicationData: ApplicationData[]) {
  if (["admin", "안지민", "엄정은", "whcRD"].includes(getUserName())) {
    return applicationData;
  }

  const myApplicationList: ApplicationData[] = applicationData.filter(
    (app, index) => {
      if (app.requester === getUserName() || app.designer === getUserName()) {
        return app;
      }
    }
  );

  return myApplicationList;
}

export function updateReelInfo(applicationData : ApplicationData[]) {
  
  applicationData.forEach((app , index) => {
    if(app.stocks.length > 0){
      
      app.stocks.forEach((stock) =>{
        if (stock.operationType === "reel"){
          app.reelId = stock.reelId
          app.reelLoc = stock.location
          
        }
        else{
          app.jigSolderId = stock.reelId
          app.jigSolderLoc = stock.location          
        }
      })
    }
  })

}

export async function findLotHistoryFromFabRequest(
  applicationData: ApplicationData[]
) {
  let tempModelNames = "";

  applicationData.forEach((app, index) => {
    if (app.modelName.split("@").length === 2) {
      tempModelNames += app.modelName + ",";
    }
  });

  // 마지막에 추가된 ',' 제거
  if (tempModelNames.endsWith(",")) {
    tempModelNames = tempModelNames.slice(0, -1);
  }

  const url = "/fab_monitoring/get_fab_request_list";
  const form = new FormData();
  form.append("model_names", tempModelNames);
  form.append("lot_status", "true");

  const response = await axios.post(url, form);

  const fabApplicationData: FabApplicationForm[] = response.data.map(
    (item: any) => convertKeysToCamelCase(item)
  ) as FabApplicationForm[];

  for (let i = 0; i < applicationData.length; i++) {
    for (let j = 0; j < fabApplicationData.length; j++) {
      if (applicationData[i].modelName === fabApplicationData[j].modelName) {
        applicationData[i].lotStatus = fabApplicationData[j].lotStatus;

        // if (applicationData[i].modelName === "XG47GHU@1A") {
        //   console.log(fabApplicationData[j]);
        // }

        fabApplicationData[j].lotStatus.forEach((lot, index) => {
          if (lot.hanoiCsp !== null) {
            traverseLotStatus(applicationData[i], lot.hanoiCsp, 0);
          }
          else{

            if(!["OPF01", "OP07001015", "OP07003015"].includes(lot.operation.operationId)){

              if(applicationData[i].modelName === "HG72EXH@M2"){
                console.log(lot)
              }
              
              if(applicationData[i].childOperation === undefined){
                applicationData[i].childOperation  = lot.operation.name + ", "
              }
              else{
                applicationData[i].childOperation = applicationData[i].childOperation + lot.operation.name + ", "
              }              
              applicationData[i].childStageName = "FAB";

            }
            
          }
        });
        // console.log(applicationData[i]);
      }
    }
  }
}

// export async function findLots(applicationData: ApplicationData[]) {
//   let lot_list_str = "";

//   applicationData.forEach((app) => {
//     if (
//       app.assayLotId !== null &&
//       app.assayLotId !== "-" &&
//       app.assayLotId !== ""
//     ) {
//       lot_list_str += app.assayLotId + ",";
//     }
//   });

//   // 마지막에 추가된 ',' 제거
//   if (lot_list_str.endsWith(",")) {
//     lot_list_str = lot_list_str.slice(0, -1);
//   }

//   try {
//     let url = "/reel/get_reel_id_list";
//     const reelResponse = await axios.get(url);
//     const reelIdList: [] = reelResponse.data;

//     url = "/mes/get_lots_by_id_from_whcsp";
//     const form = new FormData();
//     form.append("lots_id", lot_list_str);
//     form.append("first_history", "false");
//     form.append("prev_history", "false");

//     const response = await axios.post(url, form);

//     const lotData: FabApplicationForm[] = response.data.map((item: any) =>
//       convertKeysToCamelCase(item)
//     ) as FabApplicationForm[];

//     for (let i = 0; i < applicationData.length; i++) {
//       for (let j = 0; j < lotData.length; j++) {
//         if (applicationData[i].assayLotId === lotData[j].lotId) {
//           applicationData[i].lotData = lotData[j];
//         }
//       }
//     }

//     // lotData.forEach((lot) => {
//     //   if (lot.lotId === "CNS048IJU00000") {
//     //     console.log(lot);
//     //   }
//     // });

//     const normalizedReelIdList = reelIdList.map((id) =>
//       (id as string).toLowerCase()
//     );

//     applicationData.forEach((app) => {
//       if (
//         app.lotData !== undefined &&
//         app.lotData.child !== null &&
//         app.lotData.child.child !== null
//       ) {
//         const tempLotId = findOperationTransit(app.lotData);
//         if (typeof tempLotId === "string") {
//           // tempLotId가 문자열일 때 처리

//           if (normalizedReelIdList.includes(tempLotId.toLowerCase())) {
//             return (app.isSampleAvailable = true);
//           }
//         } else {
//           // tempLotId가 null일 때 처리
//           app.isSampleAvailable = false;
//         }
//       } else {
//         app.isSampleAvailable = false;
//       }
//     });
//   } catch (error) {}
// }

// // 재귀 탐색 함수
// function findOperationTransit(node: LotData | null): boolean {
//   if (!node) {
//     // 현재 노드가 null이면 탐색 종료
//     return;
//   }

//   if (node.operation.operationId === "OP_TRANSIT") {
//     // 조건을 만족하면 true 반환
//     // console.log(node.lotId);
//     return node.lotId;
//   }

//   // 현재 노드의 child를 재귀적으로 탐색
//   return findOperationTransit(node.child);
// }

// 서버에서 받아온 데이터를 저장할 타입 지정
export async function get_application_list(): Promise<ApplicationData[]> {
  try {
    // 서버의 API 엔드포인트 호출

    //const url = `/solder/get_solder_application_list_by_status/${status},created_date`;
    const url = `/solder/get_solder_application_list/created_date`;

    const response = await axios.get(url);
    // 응답 데이터를 CamelCase 형식으로 변환
    const convertedData = convertKeysToCamelCase(response.data);

    // measurements 배열을 숫자 순으로 정렬
    const sortedData = sortMeasurementsByNumber(convertedData);

    // 변환된 데이터를 반환
    return sortedData as ApplicationData[];
  } catch (error) {
    console.error("Error fetching application list by status:", error);
    throw error; // 에러 발생 시 상위 컴포넌트에서 처리
  }
}

// 서버에서 받아온 데이터를 저장할 타입 지정
export async function get_application_list_by_status(
  status: string
): Promise<ApplicationData[]> {
  try {
    // 서버의 API 엔드포인트 호출

    //const url = `/solder/get_solder_application_list_by_status/${status},created_date`;
    const url = `/solder/get_solder_application_list_by_status/${status},created_date`;

    const response = await axios.get(url);
    // 응답 데이터를 CamelCase 형식으로 변환
    const convertedData = convertKeysToCamelCase(response.data);

    // measurements 배열을 숫자 순으로 정렬
    const sortedData = sortMeasurementsByNumber(convertedData);

    // 변환된 데이터를 반환
    return sortedData as ApplicationData[];
  } catch (error) {
    console.error("Error fetching application list by status:", error);
    throw error; // 에러 발생 시 상위 컴포넌트에서 처리
  }
}

export function sortMeasurementByNumber(
  application: ApplicationData
): ApplicationData {
  if (application.measurements) {
    // measurements 배열을 number 필드를 기준으로 정렬
    application.measurements = application.measurements.sort((a, b) => {
      const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
      const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
      return numA - numB; // 오름차순 정렬
    });
  }

  if (application.segments) {
    // segments 배열을 number 필드를 기준으로 정렬
    application.segments = application.segments.sort((a, b) => {
      const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
      const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
      return numA - numB; // 오름차순 정렬
    });
  }

  if (application.matching) {
    // matching 배열을 number 필드를 기준으로 정렬
    application.matching = application.matching.sort((a, b) => {
      const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
      const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
      return numA - numB; // 오름차순 정렬
    });
  }

  return application;
}

export function sortMeasurementsByNumber(
  applicationData: ApplicationData[]
): ApplicationData[] {
  return applicationData.map((application) => {
    if (application.measurements) {
      // measurements 배열을 number 필드를 기준으로 정렬
      application.measurements = application.measurements.sort((a, b) => {
        const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
        const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
        return numA - numB; // 오름차순 정렬
      });
    }

    if (application.segments) {
      // measurements 배열을 number 필드를 기준으로 정렬
      application.segments = application.segments.sort((a, b) => {
        const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
        const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
        return numA - numB; // 오름차순 정렬
      });
    }

    if (application.matching) {
      // measurements 배열을 number 필드를 기준으로 정렬
      application.matching = application.matching.sort((a, b) => {
        const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
        const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
        return numA - numB; // 오름차순 정렬
      });
    }

    return application;
  });
}

// snake_case를 camelCase로 변환하는 함수
function toCamelCase(snakeStr: string): string {
  return snakeStr.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// 재귀적으로 객체의 모든 키를 CamelCase로 변환하는 함수
export function convertKeysToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    // 배열일 경우 배열 내의 각 요소에 대해 재귀적으로 변환
    return data.map((item) => convertKeysToCamelCase(item));
  } else if (typeof data === "object" && data !== null) {
    // 객체일 경우 모든 키를 변환
    return Object.keys(data).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key);
      acc[camelCaseKey] = convertKeysToCamelCase(data[key]);
      return acc;
    }, {} as any);
  }
  return data; // 기본값(primitive)은 그대로 반환
}

// 삭제 확인 메시지 출력 함수
export function confirmDelete(
  row: ApplicationData,
  deleteCallback: (uuid: string) => void
) {
  ElMessageBox.confirm("정말로 삭제하시겠습니까?", "삭제 확인", {
    confirmButtonText: "예",
    cancelButtonText: "아니오",
    type: "warning",
  })
    .then(() => {
      // 삭제 확인 후 콜백을 통해 삭제 처리
      removeApplicationByUuid(row.uuid);
      deleteCallback(row.uuid);
      ElMessage({
        type: "success",
        message: "삭제되었습니다.",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "삭제가 취소되었습니다.",
      });
    });
}
