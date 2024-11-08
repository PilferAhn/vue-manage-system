import axios, { Axios } from "axios";
import type { MaterialInfo } from "./fe-meas-interface";
export async function getMaterialInfo(materialId: string) {
  const form = new FormData();
  form.append("materials_id", materialId);

  const tempUrl = "mes/get_materials_by_id";

  try {
    const response = await axios.post(tempUrl, form);

    // 요청 완료 시간
    const endTime = performance.now();

    const mes : MaterialInfo[] = response.data

    return mes

  } catch (error) {
    console.error("Error fetching material info:", error);
  }
}
