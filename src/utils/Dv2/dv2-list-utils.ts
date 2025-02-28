import type { Dv2 } from "../../interface/Dv2/dv2-list-interface";
import type { FabApplicationForm } from "../../interface/mes-interface";
import { formatDate, formatDateTime } from "../date-utils";
import { ref } from "vue";
import axios from "axios";
import { convertKeysToPEP8 } from "../key-converter";
import { sendGetRequest, sendPostRequest } from "../httpProtocol";

/**
 * dv2TableData 업데이트 함수
 * @param dv2TableData - 테이블에서 사용되는 dv2 데이터 배열
 * @param fabApp - FabApplicationForm 배열
 */
export function updateDv2TableData(
  dv2TableData: Dv2[],
  fabApp: FabApplicationForm[]
): void {
  let isFound = false;

  for (let i = 0; i < dv2TableData.length; i++) {
    if (isFound) {
      isFound = false;
      continue;
    }
    for (let j = 0; j < fabApp.length; j++) {
      if (dv2TableData[i].productName === fabApp[j].modelName) {
        let maxIndex = -1;
        let maxSequance = -1;

        for (let k = 0; k < fabApp[j].lotStatus.length; k++) {
          if (fabApp[j].lotStatus[k].historySeq >= maxSequance) {
            maxSequance = fabApp[j].lotStatus[k].historySeq;
            maxIndex = k;
          }
        }

        if (fabApp[j].lotStatus.length >= 1 && maxIndex != -1) {
          dv2TableData[i + 1].dateOfFabIn = formatDate(
            fabApp[j].lotStatus[maxIndex].creationDate
          );

          // dv2TableData[i].supporter = fabApp[j].requester;
          // dv2TableData[i].supporterId = fabApp[j].requesterId;
          // dv2TableData[i + 1].supporter = fabApp[j].designer;
          // dv2TableData[i + 1].supporterId = fabApp[j].designerId;

          if (
            fabApp[j].lotStatus[maxIndex]["operation"]["name"] ===
            "Transit 공정"
          ) {
            dv2TableData[i + 1].dateOfHqOut = formatDate(
              fabApp[j].lotStatus[maxIndex].moveinDate
            );
          }
          
          if(dv2TableData[i].currentStage === null){
            dv2TableData[i].currentStage = fabApp[j].lotStatus[maxIndex].operation.name;
          }

          if (fabApp[j].lotStatus[maxIndex].hanoiCsp !== null) {
            dv2TableData[i + 1].dateOfWhcIn = formatDate(
              fabApp[j].lotStatus[maxIndex].hanoiCsp.creationDate
            );
            dv2TableData[i + 1].dateOfAssyIn = formatDate(
              fabApp[j].lotStatus[maxIndex].hanoiCsp.moveinDate
            );
          }

          isFound = true;
        }
      }
    }
  }
}

export async function checkDv2ListToCreate(oldList: Dv2[], newList: Dv2[]) {
  for (let i = 0; i < newList.length; i++) {
    let isFound = false;
    for (let j = 0; j < oldList.length; j++) {
      if (newList[i].productName === oldList[j].productName) {
        isFound = true;
        break;
      }
    }

    if (!isFound) {
      // 추가적으로 Dv2 Data를 생성하는 Logic 구현
      createDv2(newList[i]);
    }
  }
}

export async function createDv2(dv2: Dv2) {
  console.log(dv2);
}

export function initDv2() {
  const dv2 = ref<Dv2>({
    salesTerritory: null,
    main: null,
    sub: null,
    client: null,
    category: null,
    band: null,
    productName: null,
    chip: null,
    package: null,
    group: null,
    status: null,
    turn: null,
    dateOfMdr: null,
    dateOfEstimatedMdr: null,
    dateOfEstimatedFabIn: null,
    dateOfEstimatedFabOut: null,
    dateOfEstimatedHqOut: null,
    dateOfEstimatedWhcIn: null,
    dateOfEstimatedAssyIn: null,
    dateOfEstimatedDCOut: null,
    dateOfEstimatedMeasIn: null,
    dateOfEstimatedCer: null,
    priority: null,
    designer: null,
    designerId: null,
    supporter: null,
    supporterId: null,
  });

  return dv2.value;
}

import { ElMessageBox, ElMessage } from "element-plus";

export async function removeDv2(dv2: Dv2) {
  try {
    // 삭제 확인 다이얼로그
    await ElMessageBox.confirm(
      `정말로 "${dv2.productName}" 데이터를 삭제하시겠습니까?\n\n삭제 후에는 되돌릴 수 없습니다.`,
      "경고",
      {
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        type: "warning",
      }
    );

    // ✅ 사용자가 "삭제"를 누른 경우 실행됨
    const productName = dv2.productName;
    const formData = new FormData();
    formData.append("product_name", productName);

    const res = await sendPostRequest(
      "/dv2/delete_dv2_by_product_name",
      formData
    );

    if (res.status) {
      ElMessage({
        type: "success",
        message: `"${productName}" 데이터가 삭제되었습니다.`,
      });
      return true;
    } else {
      ElMessage({
        type: "error",
        message: `"${productName}" 삭제에 실패했습니다.`,
      });
      return false;
    }
  } catch (error) {
    // 🚫 사용자가 "취소"를 누른 경우 실행됨
    ElMessage({
      type: "info",
      message: "삭제가 취소되었습니다.",
    });
    return false; // ❌ 취소 시 false 반환
  }
}

export function getModelNameList(dv2List: Dv2[]) {
  let tempStr = "";
  for (let i = 0; i < dv2List.length; i++) {
    tempStr += dv2List[i].productName + ",";
  }

  return tempStr;
}

export async function sendDv2(dv2: Dv2, sendingType: string) {
  let url = "";
  if (sendingType === "update") {
    url = "/dv2/update";
  } else {
    url = "dv2/create";
  }

  try {
    const response = await axios.post(url, convertKeysToPEP8(dv2));
    console.log(response.status);

    if (response.status == 200) {
      return true;
    }

    return false; // schema 반환
  } catch (error) {
    console.error("Error sending DV2 data:", error);
    throw error; // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
  }
}
