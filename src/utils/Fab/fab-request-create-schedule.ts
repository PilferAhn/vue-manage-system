import { ref } from "vue"
import { sendPostRequest } from "../httpProtocol"
import type { FabRequestCreateSchedule } from "../../interface/fab-request-create-schedule"
import { convertPep8ToCamelCase2 } from "../key-converter"
const serverUrl = "http://10.29.11.124:40000"

export async function getFabRequestCreateScheduleList(){
    
    const url = serverUrl + "/fab_monitoring_rev2/get_fab_reqeust_create_schedule_list"
    const formData = new FormData()

    const data = await sendPostRequest(url , null)    
    return convertPep8ToCamelCase2(data)

}