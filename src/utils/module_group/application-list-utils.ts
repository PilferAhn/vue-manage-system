import { ref, reactive } from "vue";
import { sendPostRequest } from "../httpProtocol"
import { convertKeysToPEP8, convertPep8ToCamelCase2 } from "../key-converter";
import { ModuleMeasurementApp } from "../../interface/module_group/application/application";
import { application_status } from "../../views/ProductPage/MeasurementPage/MeasurementSummary";

export  const getApplicationList = async (params : object) => {

    const form = new FormData()
    const url = "/module/get_app_list"
    Object.entries(params).forEach(([key, value]) => {
        form.append(key, value);
      });

    // const appList = reactive<ModuleMeasurementApp[]> 

    const temp_app_list = await sendPostRequest(url , form)     
    const appList = reactive<ModuleMeasurementApp[]>(convertPep8ToCamelCase2(temp_app_list))
    
    return appList
}