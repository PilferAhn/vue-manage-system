import axios from "axios";
import { convertPep8ToCamelCase2 } from "./key-converter";

export const sendGetRequest = async (baseUrl: string, uuid: string) => {
  const url = `${baseUrl}/${uuid}`;

  try {
    const response = await axios.get(url);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};

export const sendGetRequest2 = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};

export const sendPostRequest = async (url: string, formData: FormData) => {
  try {
    const response = await axios.post(url, formData);
    return response.data;
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};

export const sendGetRequestWithHeader = async (
  url: string,
  headers: object
) => {
  try {
    const response = await axios.get(url, { headers });
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};

export async function sendPostRequestWithBody(url: string, payload: object) {
  try {
    const response = await axios.post(url, payload);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios 에러:", error.response?.data || error.message);
    } else {
      console.error("알 수 없는 에러:", error);
    }
    return null;
  }
}

export async function sendingPostRequestByOptions(
  url: string,
  formData: FormData,
  options?: {
    contentType?: string | null;
    accept?: string | null;
  }
) {
  try {
    const headers: Record<string, string> = {};

    if (options?.contentType) {
      headers["Content-Type"] = options.contentType;
    }

    if (options?.accept) {
      headers["Accept"] = options.accept;
    }

    const response = await axios.post(url, formData, { headers });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios 에러:", error.response?.data || error.message);
    } else {
      console.error("알 수 없는 에러:", error);
    }
    return null;
  }
}

export async function sendPostRequestWithHeader(
  url: string,
  formData: FormData
) {
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
        Accept:
          "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios 에러:", error.response?.data || error.message);
    } else {
      console.error("알 수 없는 에러:", error);
    }
    return null;
  }
}

export async function downloadFileFromServerByObject(
  url: string,
  formData: FormData
): Promise<void> {
  try {
    const response = await axios.post(url, formData, {
      responseType: "blob",
    });

    // 파일 이름 파싱
    const disposition = response.headers["content-disposition"];
    const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/);
    const fileName = fileNameMatch?.[1] || "downloaded-file";

    // 파일 다운로드 처리
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = decodeURIComponent(fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
  }
}

export const sendPostAndDownloadExcel = async (url: string, objs: any) => {
  try {
    // 백엔드로 POST 요청 (JSON 데이터 전송)
    const response = await axios.post(url, objs, {
      headers: { "Content-Type": "application/json" },
      responseType: "blob", // 파일 다운로드를 위한 설정
    });

    // 파일 다운로드 처리
    if (response.status === 200) {
      // 🔹 Content-Disposition 헤더에서 파일명 추출
      const disposition = response.headers["content-disposition"];
      let filename = "download.xlsx"; // 기본 파일명

      if (disposition) {
        const match = disposition.match(/filename="(.+?)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      // Blob을 URL로 변환하여 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // 동적으로 설정된 파일명 사용
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.error("파일 다운로드 실패: 응답 상태", response.status);
    }

    return response.data; // 필요 시 응답 데이터 반환
  } catch (error) {
    console.error("HTTP POST request failed:", error);
    throw error; // 호출자에게 에러 전달
  }
};

export const sendPostRequestByInterface = async (
  url: string,
  data: Record<string, any>
) => {
  try {
    const res = await axios.post(url, data);

    data = convertPep8ToCamelCase2(res.data);
    return data;
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ Server Error:",
        error.response.status,
        error.response.data
      );
      return { success: false, error: error.response.data }; // 서버 응답 반환
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      return { success: false, error: "No response from server" }; // 요청 실패
    } else {
      console.error("❌ Unexpected error:", error.message);
      return { success: false, error: error.message }; // 기타 예외 처리
    }
  }
};
