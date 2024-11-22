import axios from "axios";
import type { FabApplicationInterface } from "../interface/fab";
import { convertKeysToCamelCase } from "./key-converter";

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
    console.log(error)
  }
}
