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
