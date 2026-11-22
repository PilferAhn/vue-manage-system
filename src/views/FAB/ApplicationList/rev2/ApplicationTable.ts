import {
  FabRequest,
  FabRequestForm,
} from "../../../../interface/fab-application-rev2";
import { usePermissStore } from "../../../../store/permiss";
import { getApplicationListByDict } from "../../../../utils/Fab/fab-application-utils";
import { formatDate } from "../../../../utils/date-utils";
import { sendingPostRequestByOptions } from "../../../../utils/httpProtocol";

export async function getMesFabFormInfo(apps: FabRequest[]) {
  // 문자열 → 숫자(타임스탬프) 변환 후 필터링
  const timestamps = apps
    .map((app) => new Date(app.wantedFabStartDate).getTime())
    .filter((time) => !isNaN(time));

  if (timestamps.length === 0) {
    return {
      minDate: null,
      maxDate: null,
    };
  }

  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));

  const form = new FormData();
  form.append("date_of_start", formatDate(minDate.toString()));
  form.append("date_of_end", formatDate(maxDate.toString()));
  
  const fabMesDataList: any[] = await sendingPostRequestByOptions(
    "/api/fabplans",
    form,
    {
      contentType: "application/json",
    }
  );


  for (let i = 0; i < apps.length; i++) {
    // if(apps[i].isFabCardCreated) continue
    apps[i].isFabCardCreated = false
        
    let isFound = false
    for (let j = 0; j < fabMesDataList.length; j++) {
      
      if(apps[i].productName === fabMesDataList[j].pmname && apps[i].quantity.toString() === fabMesDataList[j].pcnt && formatDate(apps[i].wantedFabStartDate) === fabMesDataList[j].psdt){                      
      // if(apps[i].productName === fabMesDataList[j].pmname){
      // if(apps[i].productName === fabMesDataList[j].pmname && apps[i].quantity.toString() === fabMesDataList[j].pcnt){

          if([0,1].includes(fabMesDataList[j].flev)){
            apps[i].isFabCardCreated = false            
          }
          else{
            apps[i].isFabCardCreated = true
          }        
          isFound = true
      }      
    }

    if(!isFound){
      apps[i].isFabCardCreated = null
    }

    // Not Found 인데 같은 기종의 다른 변형(마지막 글자만 다른 P/N, 예: B 대신 A)만 MES 에 있으면
    // 이 변형은 투입 취소된 것으로 보고 화면에 "투입취소 확인 요망" 표시 (2026-11-22)
    (apps[i] as any).mesSiblingName = null;
    if (!isFound && apps[i].productName) {
      const pn = apps[i].productName;
      const base = pn.slice(0, -1);
      const sibling = fabMesDataList.find(
        (m) => m.pmname && m.pmname !== pn && m.pmname.length === pn.length && m.pmname.startsWith(base)
      );
      if (sibling) (apps[i] as any).mesSiblingName = sibling.pmname;
    }

  }

  return {
    minDate,
    maxDate,
  };
}

export async function getFabAppForReview(
  apps: FabRequest[],
  weekNumber: number,
  weekYear: number,
  userId: string
) {
  apps.length = 0;

  try {
    // getApplicationList를 호출하고 결과를 기다림
    const year = new Date().getFullYear();
    const wanted_fab_start_date_start = `${weekYear}-01-01T00:00:00`;
    const wanted_fab_start_date_end   = `${weekYear + 1}-01-01T00:00:00`;
    let para = {
      users: true,
      wafer: true,
      idt_type: true,
      hs_type: true,
      idt_layers: true,
      week_numbers: weekNumber,
      week_year: weekYear,
      wanted_fab_start_date_start,
      wanted_fab_start_date_end,
      order_by: "created_date",
    };
    // 전체 조회 권한: 권한관리 > fab.review.manage
    if (!usePermissStore().hasPerm("fab.review.manage")) {
      para["observer_id"] = userId;
    }

    const data: FabRequestForm[] = await getApplicationListByDict(para);

    // const transformedData = data.map((item: any) => new FabApplication(item));
    apps.push(...data.map((item: FabRequestForm) => new FabRequest(item)));
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
}
