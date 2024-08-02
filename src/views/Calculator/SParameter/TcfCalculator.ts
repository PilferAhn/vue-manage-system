import axios from "axios";
import { CalculatedTCFValue, Graphs } from "./sparameter";
import { ElMessageBox, ElMessage } from "element-plus";

export async function createReport(
  files: File[],
  roundingPoing: string,
  userName : string,
  options: Array<{
    name: string;
    output: number;
    input: number;
    ilLevel: number;
  }>
) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("rounding_point", roundingPoing);
  formData.append("values", JSON.stringify(options));
  formData.append("user_name", userName)

  try {
    const response = await axios.post("tcf/create_excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });
    // Blob 데이터로부터 다운로드 URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Content-Disposition 헤더에서 파일 이름 추출
    let filename = "default-filename.xlsx"; // 기본 파일 이름 설정
    const contentDisposition = response.headers["content-disposition"];
    console.log(contentDisposition);
    if (contentDisposition) {
      const filenameRegex = /filename\*?=['"]?([^;\r\n"]*)['"]?/i;
      // const filenameRegex = /filename\*?=['"]?UTF-8''([^;'\"]*)['"]?;?/i;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches && matches[1]) {
        // UTF-8 인코딩 해제 및 디코딩
        filename = decodeURIComponent(matches[1]);
      }
    }

    link.setAttribute("download", filename); // 다운로드할 파일 이름 설정
    document.body.appendChild(link);
    link.click(); // 프로그래매틱하게 링크 클릭 이벤트 발생

    // 정리 작업
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    ElMessage.error("서버에 요청된 작업양이 많습니다. 1 ~ 2초 후에 다시 클릭해주세요")
    console.error("Error sending data to server:", error);
    throw error;
  }
}
