import axios from "axios";
import { ref, watch } from "vue";

import {
  ApplicationData,
  Measurement,
} from "../../../interface/solderAppInterface";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import fs from "fs/promises";
import path from "path";

export async function downloadSolderApplicationXlsx(
  applicationData: ApplicationData,
  destinationUrl: string
) {
  try {
    const requestData = convertToPep8(applicationData);

    const template_url = destinationUrl;

    const response = await axios({
      url: template_url,
      method: "POST",
      data: requestData,
      responseType: "blob", // Important for handling binary data (xlsx)
    });

    // Extract the file name from the 'Content-Disposition' header
    const disposition = response.headers["content-disposition"];
    let fileName = "solder_application.xlsx"; // Default file name

    if (disposition && disposition.includes("filename")) {
      const fileNameMatch = disposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (fileNameMatch != null && fileNameMatch[1]) {
        fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, "")); // Ensure correct decoding
      }
    }

    // Create a link element to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Use the extracted file name
    document.body.appendChild(link);
    link.click();

    // Clean up the link element after the download
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

export function getMeasurementLabel(measurementType: string): string {
  switch (measurementType) {
    case '비선형':
      return '비선형 (Non-Linearity)';
    case 'PS 신뢰성':
      return 'PS 신뢰성 (ESD)';
    case '내전력':
      return '내전력 (PDT)';
    case '특성 평가':
      return '특성 평가 (Solder Measurement)';
    default:
      return measurementType; // 기본적으로 한글만 출력
  }
}

// Convert camelCase to snake_case
function toSnakeCase(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

// Convert ApplicationData object to snake_case keys
function convertToPep8(data: ApplicationData): any {
  const convertedData: { [key: string]: any } = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // Convert each key to snake_case
      convertedData[toSnakeCase(key)] = data[key];
    }
  }

  convertedData["measurements"] = [];
  convertedData["segments"] = [];
  convertedData["matching"] = [];

  return convertedData;
}

// JSON 파일에서 데이터와 key 값을 읽는 함수
export async function loadApplicationData(isForSubmission: boolean): Promise<{
  keys: string[];
  vals: any;
}> {
  try {
    // '/segment_data.json' 은 public 폴더에 있는 파일을 참조합니다.
    const response = await fetch("/segment_data.json");
    if (!response.ok) {
      throw new Error("Failed to load JSON file");
    }
    const data = await response.json();

    if (isForSubmission) {
      const keys = Object.keys(data["k1"]);
      const vals = data["k1"];
      return { keys, vals };
    } else {
      const keys = Object.keys(data["normal"]);
      const vals = data["normal"];
      return { keys, vals };
    }
    // JSON 파일의 key 값을 배열로 추출
  } catch (error) {
    console.error("Error loading JSON:", error);
    return { keys: [], vals: null };
  }
}

// Recursive function to convert camelCase to snake_case for nested objects
function toPep8Recursive(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj; // If it's not an object, return as-is
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toPep8Recursive(item)); // Process arrays recursively
  }

  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    // Use regex to convert camelCase to snake_case
    const pep8Key = key.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
    newObj[pep8Key] = toPep8Recursive(obj[key]); // Recursively process nested objects
  });
  return newObj;
}

export async function removeApplicationByUuid(uuid: string) {
  const url = `/solder/remove/${uuid}`; // uuid를 포함한 URL 정의

  try {
    // GET 요청을 통해 서버에서 데이터를 삭제
    const response = await axios.get(url);

    if (response.status === 200) {
      // 요청이 성공한 경우, 성공 메시지 표시
      ElMessage({
        type: "success",
        message: "데이터가 성공적으로 삭제되었습니다.",
      });
    } else {
      // 요청이 성공했지만 상태 코드가 200이 아닌 경우
      ElNotification({
        title: "에러",
        message: `서버에서 예상치 못한 응답을 받았습니다: ${response.status}`,
        type: "warning",
      });
    }
  } catch (error) {
    // 요청이 실패한 경우
    console.error("Error removing data:", error);
    ElNotification({
      title: "삭제 실패",
      message: `요청 중 에러가 발생했습니다: ${error.message}`,
      type: "error",
    });
  }
}

export async function sendApplicationData(
  applicationData: ApplicationData,
  selectedFiles: File[] | null // 배열 또는 null일 수 있음
) {
  // selectedFiles가 null 또는 빈 배열일 경우를 처리
  if (!selectedFiles || selectedFiles.length === 0) {
    console.log("No files selected.");
  } else {
    console.log("Selected files:", selectedFiles);
  }

  try {
    updateMeasurementStatus(applicationData);

    const apiUrl = "/solder/submit"; // FastAPI 엔드포인트
    const pep8Data = toPep8Recursive(applicationData);

    // 데이터 전송

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pep8Data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    const uuid = result.uuid;

    // 파일이 있을 경우에만 파일 전송
    if (selectedFiles && selectedFiles.length > 0) {
      await sendFilesWithUuid(uuid, selectedFiles);
    } else {
      console.log("No files to upload.");
    }

    // 성공 시 el-message-box로 메시지 출력
    ElMessageBox.alert("의뢰서가 정상적으로 작성되었습니다.", "성공", {
      confirmButtonText: "확인",
      type: "success",
    });
  } catch (error) {
    console.error("Error sending request to server:", error);
    // 실패 시 el-notification으로 에러 메시지 출력
    ElNotification({
      title: "에러",
      message: `요청 중 에러가 발생했습니다: ${error.message}`,
      type: "error",
    });
  }
}

export async function sendFilesWithUuid(uuid: string, selectedFiles: File[]) {
  try {
    const apiUrl = "/solder/upload_solder_application_file"; // 파일 업로드를 위한 FastAPI 엔드포인트
    const formData = new FormData();
    formData.append("uuid", uuid); // UUID 추가
    // formData.append("files", selectedFiles.values); // 파일 추가
    selectedFiles.forEach((file) => formData.append("files", file.raw));
    const response = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error uploading files:", error);
  }
}

function updateMeasurementStatus(applicationData: ApplicationData) {
  if (applicationData.measurements && applicationData.measurements.length > 0) {
    applicationData.measurements.forEach((measurement) => {
      if (measurement.isMeasured) {
        measurement.status = "created";
      } else {
        measurement.status = ""; // Reset to an empty string if not measured
      }
    });
  }
}

export async function updateStatusByUuid(
  application_uuid: string,
  uuid: string,
  status: string
) {
  try {
    const url = `/solder/update_measurement_status`; // uuid를 포함한 URL을 정의

    const formData = new FormData();
    formData.append("application_uuid", application_uuid);
    formData.append("uuid", uuid); // UUID 추가
    formData.append("status", status);

    axios.post(url, formData);
  } catch (error) {
    console.error("Error update status of application:", error);
  }
}

