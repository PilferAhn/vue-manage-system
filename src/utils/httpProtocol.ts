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

export const sendPostRequest = async (url: string, formData: FormData) => {
  try {
    const response = await axios.post(url, formData);
    return response.data
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error; // 에러를 다시 throw하여 호출자에게 에러를 알림
  }
};
