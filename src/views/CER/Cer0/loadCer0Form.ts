import axios from "axios";
import type { CER0Form } from "./cer0-types";
import { convertToJavaScriptStyle } from "../cer-utility";

// API를 호출하여 파일을 서버로 전송하는 함수
export async function assignTask(id: string, handlerId : string, handlerName : string) {
  const formData = new FormData();

  formData.append("id", id);
  formData.append("handler_id", handlerId);  
  formData.append("handler_name", handlerName);  

  if (id === undefined) {
    return null;
  }

  const url = "/api/v1/cer0/assign_task";
  try {
    const response = await axios.post(url, formData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("General error:", error);
    }
  }
  return null; // 오류 시 null 반환
}

// API를 호출하여 파일을 서버로 전송하는 함수
export async function getApplicationById(id: string): Promise<CER0Form | null> {
  if (id === undefined) {
    return null;
  }

  const url = "/api/v1/cer0/get_application_by_id/" + id;
  try {
    const response = await axios.get(url);
    const applicationData = convertToJavaScriptStyle(response.data);

    return applicationData; // CER0Form 반환
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("General error:", error);
    }
  }
  return null; // 오류 시 null 반환
}

// API를 호출하여 파일을 서버로 전송하는 함수
export async function updateStatus(id: string, status: string) {
  const formData = new FormData();

  formData.append("id", id);
  formData.append("status", status);

  if (id === undefined) {
    return null;
  }

  const url = "/api/v1/cer0/update_status";
  try {
    const response = await axios.post(url, formData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("General error:", error);
    }
  }
  return null; // 오류 시 null 반환
}
