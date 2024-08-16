import axios from "axios";

// API를 호출하여 파일을 서버로 전송하는 함수
export async function uploadCer0Files(id: string, files: any[]): Promise<any> {
  const formData = new FormData();

  // 파일들을 FormData에 추가 (raw 속성 사용)
  files.forEach((file) => {
    if (file.raw) {
      formData.append("files", file.raw); // 'raw' 속성의 실제 File 객체 추가
    } else {
      formData.append("files", file); // 혹시라도 raw가 없을 경우 대비
    }
  });

  formData.append("cer0_id", id); // 'id' 필드 추가

  try {
    const response = await axios.post("/api/v1/cer0/upload_files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      throw new Error(
        `File upload failed: ${JSON.stringify(error.response?.data)}`
      );
    } else {
      console.error("General error:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}

// API를 호출하여 파일을 서버로 전송하는 함수
export async function deleteFileByFileId(id: string) {
  const url = "/api/v1/cer0/delete_file/" + id;
  try {
    const response = await axios.get(url);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("General error:", error);
    }
  }
  return false;
}
