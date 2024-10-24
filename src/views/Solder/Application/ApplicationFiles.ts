import axios from "axios";

// API를 호출하여 파일을 다운로드하는 함수
export async function downloadFileByFileId(id: string) {
  const url = `/api/v1/cer0/download_file_by_id/${id}`;
  
  try {
    const response = await axios.get(url, {
      responseType: 'blob'  // Blob 형태로 데이터를 받음
    });

    // 파일 확장자를 얻기 위한 content-disposition 헤더에서 파일 이름 추출
    const contentDisposition = response.headers['content-disposition'];
    let fileName = "downloaded_file";

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length > 1) {
        fileName = fileNameMatch[1];
      }
    }

    // Blob 데이터를 처리하고 파일 다운로드를 실행
    const blob = new Blob([response.data], { type: response.data.type });
    const blobUrl = window.URL.createObjectURL(blob);  // Blob URL 생성
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;  // 추출한 파일 이름을 다운로드 이름으로 사용
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // URL 객체 해제
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
}

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
