import axios from "../utils/request";

interface LoginResponse {
  status: boolean;
  user_name?: string;
  ms_keys?: string;
  role? : string;
  message?: string;
}

export const userLogin = async (id: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(
      "/user/login",
      {
        "id" : id,
        "password" : password
      }
    );

    if (response.data.status) {
      return {
        user_name: response.data.user_name,
        ms_keys: response.data.ms_keys,
        status: response.data.status,
      };
    } else {
      return {
        message: response.data.message,
        status: response.data.status,
      };
    }
  } catch (error) {
    console.error("Login request failed:", error);
    throw new Error("Login request failed");
  }
};
