import axios from "axios";

export const sendGetRequest = async (baseUrl: string, uuid: string) => {
    const url = `${baseUrl}/${uuid}`;
    
    try {
      const response = await axios.get(url);
      console.log(response.data);
      return response.data;  // 응답 데이터를 반환
    } catch (error) {
      console.error('HTTP GET request failed:', error);
      throw error;  // 에러를 다시 throw하여 호출자에게 에러를 알림
    }
  };