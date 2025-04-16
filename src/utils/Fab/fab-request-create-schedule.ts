import { ref } from "vue"
import { sendPostRequest } from "../httpProtocol"
import type { FabRequestCreateSchedule } from "../../interface/fab-request-create-schedule"
import { convertPep8ToCamelCase2 } from "../key-converter"
import { serverUrl } from "./fab-application-utils"
import { FabRequest } from "../../interface/fab-application-rev2"
import { getUserId } from "../account-utils"


export async function getFabRequestCreateScheduleList(){
    
    const url = serverUrl + "/fab_monitoring_rev2/get_fab_reqeust_create_schedule_list"
    const formData = new FormData()

    const data = await sendPostRequest(url , null)    
    return convertPep8ToCamelCase2(data)

}

export async function updateSchedule(fabRequest : FabRequestCreateSchedule){

    const formData = new FormData()
    const url = serverUrl + "fab_monitoring_rev2/set_fab_reqeust_create_schedule"
    formData.append("start_date" , fabRequest.startDate)
    formData.append("end_date", fabRequest.endDate)
    formData.append("users_id" , getUserId().toLocaleLowerCase())
    console.log("1")
    await sendPostRequest(url , formData)

}