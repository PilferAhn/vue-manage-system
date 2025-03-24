import { FabRequest, FabRequestForm } from "../../../../interface/fab-application-rev2";
import { getApplicationListByDict } from "../../../../utils/Fab/fab-application-utils";

export async function getFabAppForReview(apps : FabRequest[],  weekNumber : number, userId : string, ){

    apps.length = 0

    try {
        // getApplicationList를 호출하고 결과를 기다림
        let para = {
          users: true,
          wafer: true,
          idt_type: true,
          hs_type: true,
          idt_layers: true,      
          is_pending: false, // Row filter
          week_numbers: weekNumber,
          order_by: "wanted_fab_start_date",
        };
    
        if (!["w2150108", "admin"].includes(userId)) {
          para["observer_id"] = userId;
        }
    
        const data: FabRequestForm[] = await getApplicationListByDict(para);
    
        // const transformedData = data.map((item: any) => new FabApplication(item));
        apps.push(
          ...data.map((item: FabRequestForm) => new FabRequest(item))
        );


      } catch (error) {
        console.error("Error fetching application list:", error);
      }

}