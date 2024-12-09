import type {
  FabApplicationForm,
  LotStatus,
} from "../../interface/mes-interface";
import { ref, reactive } from "vue";
import axios from "axios";
import type { FabApplicationInterface } from "../../interface/fab";
import { convertKeysToCamelCase } from "./../key-converter";
import { SawType } from "../../interface/fab-application-rev2";


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

export function getAngleAndThick(waferInfo : string , sawType : SawType){

  

}

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
    }
    else{
      filteredApp.value.push(applicationList[i]);
    }
  }
  console.log(filteredApp.value.length)
  return filteredApp.value;
}

