
import type { Dv2 } from "../../interface/Dv2/dv2-list-interface";
import type { FabApplicationForm } from "../../interface/mes-interface";
import { formatDate, formatDateTime } from "../date-utils";


/**
 * dv2TableData 업데이트 함수
 * @param dv2TableData - 테이블에서 사용되는 dv2 데이터 배열
 * @param fabApp - FabApplicationForm 배열
 */
export function updateDv2TableData(dv2TableData: Dv2[], fabApp: FabApplicationForm[]): void {
  let isFound = false;

  for (let i = 0; i < dv2TableData.length; i++) {
    if (isFound) {
      isFound = false;
      continue;
    }
    for (let j = 0; j < fabApp.length; j++) {
      if (dv2TableData[i].partName === fabApp[j].modelName) {
        if (fabApp[j].lotStatus.length >= 1) {
          dv2TableData[i + 1].dateOfFabIn = formatDate(
            fabApp[j].lotStatus[0].creationDate
          );
          dv2TableData[i].userOfSupporter = fabApp[j].requester;
          dv2TableData[i + 1].userOfSupporter = fabApp[j].designer;
          dv2TableData[i].userOfSupporterID = fabApp[j].requesterId;
          dv2TableData[i].userOfDesignerID = fabApp[j].designerId;
          
          if (fabApp[j].lotStatus[0]["operation"]["name"] === "Transit 공정") {
            dv2TableData[i + 1].dateOfHqOut = formatDate(
              fabApp[j].lotStatus[0].moveinDate
            );
          }
          dv2TableData[i].currentStage =
            fabApp[j].lotStatus[0].operation.name +
            formatDateTime(fabApp[j].lotStatus[0].moveinDate);

          if (fabApp[j].lotStatus[0].hanoiCsp !== null) {
            dv2TableData[i + 1].dateOfWhcIn = formatDate(
              fabApp[j].lotStatus[0].hanoiCsp.creationDate
            );
            dv2TableData[i + 1].dateOfAssyIn = formatDate(
              fabApp[j].lotStatus[0].hanoiCsp.moveinDate
            );
          }

          isFound = true;
        }
      }
    }
  }
}
