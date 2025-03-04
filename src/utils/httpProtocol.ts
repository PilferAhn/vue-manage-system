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

export const sendPostRequestByInterface = async (url : string, data : Record<string, any>) => {

  
  try {
    const res = await axios.post(url , data)
    data = convertPep8ToCamelCase2(res.data)
    return data
  }
  catch(error){
    if (error.response) {
      console.error("❌ Server Error:", error.response.status, error.response.data);
      return { success: false, error: error.response.data }; // 서버 응답 반환
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      return { success: false, error: "No response from server" }; // 요청 실패
    } else {
      console.error("❌ Unexpected error:", error.message);
      return { success: false, error: error.message }; // 기타 예외 처리
    }
    
  }
  
}

export const sendPostRequest = async (url: string, formData: FormData) => {
  try {
    const response = await axios.post(url, formData);
    return response.data
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};

export const sendObjPostRequest = async (url: string, objs : any[]) => {
  try {
    const response = await axios.post(url, objs);
    return response.data
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};



export const sendPostAndDownloadExcel = async (url, objs) => {
  try {
    // 백엔드로 POST 요청 (JSON 데이터 전송)
    const response = await axios.post(url, objs, {
      headers: { "Content-Type": "application/json" },
      responseType: "blob", // 파일 다운로드를 위한 설정
    });

    // 파일 다운로드 처리
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dv2_plan.xlsx"); // 다운로드될 파일명
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.error("파일 다운로드 실패: 응답 상태", response.status);
    }

    return response.data; // 파일 응답 데이터 반환 (필요시)
  } catch (error) {
    console.error("HTTP POST request failed:", error);
    throw error; // 호출자에게 에러 전달
  }
};


export const sendGetRequestWithHeader = async (url : string , headers : object) => {
  
  try {
    const response = await axios.get(url, { headers });
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};

export async function sendPostRequestWithHeader(url: string, formData: FormData){

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml",
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