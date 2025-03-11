import axios from "axios";

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
