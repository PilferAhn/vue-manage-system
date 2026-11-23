// Form Review "엑셀 다운로드": 의뢰서 목록을 엑셀 서버(/test → 10.29.11.59:8002)로 보내
// 투입계획서 양식(.xlsm)을 받아 저장 (2026-11-23 정리)
// - 서버에서 만드는 데 약 30초 걸림 → 끝날 때까지 안내 메시지 유지, 끝나면 닫음
import axios from "axios";
import type { FabRequest } from "../../interface/fab-application-rev2";
import { convertKeysToPEP8 } from "../key-converter";
import { ElMessage, ElNotification } from "element-plus";

const EXCEL_URL = "/test/create_fab_request_review_excel";
const DEFAULT_FILE_NAME = "process_data.xlsm";

/** 서버로 보낼 행: 의뢰서 값(snake_case) + 화면에서 계산하는 항목 */
function toExcelRow(app: FabRequest): Record<string, unknown> {
  const row = convertKeysToPEP8(app) as Record<string, unknown>;
  row["wafer_info"] = app.createWaferInfo();
  row["trmming_info"] = app.createTrimmingInfo(); // 서버가 받는 키 이름 그대로 (오타 아님)
  row["hs_wafer_condi"] = app.createHsWaferCondition();
  row["fab_card_convey_date"] = app.calFabCardConveyDate();
  return row;
}

/** 응답 헤더의 파일명 (filename*=UTF-8''...) */
function fileNameFrom(contentDisposition?: string): string {
  const m = contentDisposition?.match(/filename\*=UTF-8''(.+)/);
  return m ? decodeURIComponent(m[1]) : DEFAULT_FILE_NAME;
}

function saveBlob(data: BlobPart, fileName: string) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // 다운로드가 시작된 뒤 해제
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

/** 엑셀 만들기 + 저장. 성공 여부 반환 */
export async function downloadReviewExcel(processData: FabRequest[]): Promise<boolean> {
  const notice = ElMessage({
    message: "엑셀 파일을 만드는 중입니다. 약 30초 걸립니다…",
    type: "info",
    duration: 0, // 끝날 때까지 유지
    showClose: true,
  });
  try {
    const response = await axios.post(EXCEL_URL, processData.map(toExcelRow), {
      responseType: "blob",
      timeout: 0, // 서버에서 오래 걸림
    });
    const fileName = fileNameFrom(response.headers["content-disposition"]);
    saveBlob(response.data, fileName);
    ElNotification({
      title: "다운로드 완료",
      message: `파일 "${fileName}" 을(를) 저장했습니다.`,
      type: "success",
      duration: 5000,
    });
    return true;
  } catch (error) {
    console.error("Excel 다운로드 실패:", error);
    ElMessage({ message: "엑셀 파일을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.", type: "error", duration: 5000 });
    return false;
  } finally {
    notice.close();
  }
}
