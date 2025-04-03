import {
  FabRequest,
  FabRequestForm,
} from "../../../../interface/fab-application-rev2";
import { getRole } from "../../../../utils/account-utils";
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
    
    if(apps[i].productName === "DDM02AA4002A"){
      console.log(apps[i])
    }
    
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

  }

  return {
    minDate,
    maxDate,
  };
}

export async function getFabAppForReview(
  apps: FabRequest[],
  weekNumber: number,
  userId: string
) {
  apps.length = 0;

  try {
    // getApplicationList를 호출하고 결과를 기다림
    let para = {
      users: true,
      wafer: true,
      idt_type: true,
      hs_type: true,
      idt_layers: true,
      week_numbers: weekNumber,
      order_by: "created_date",
    };

    if (
      !["w2150108", "admin"].includes(userId) &&
      getRole() !== "group leader"
    ) {
      para["observer_id"] = userId;
    }

    const data: FabRequestForm[] = await getApplicationListByDict(para);

    // const transformedData = data.map((item: any) => new FabApplication(item));
    apps.push(...data.map((item: FabRequestForm) => new FabRequest(item)));
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
}
