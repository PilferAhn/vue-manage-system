import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

// getStatusText 함수 정의 및 내보내기
export function getStatusText(status: string): string {
  
  switch (status) {
    case "waiting":
      return "측정 대기";
    case "start":
      return "측정 진행중";
    case "finished":
      return "측정 종료";
    case "cancel":
      return "취소";
    default:
      return "알 수 없음";
  }
}

export async function updateWaferStatus(
  uuid: string,
  status: string
): Promise<string> {
  try {
    const response = await axios.get(
      `/teg_application/update_wafer_status/${uuid}/${status}`
    );

    return "success"
    
  } catch (error) {
    console.error("wafer 상태 변경 실패:", error);
    return "fail";
  }
}

// 버튼 클릭으로 Wafer 상태 업데이트 함수
export async function updateStatus(wafer, status) {

  const response = await updateWaferStatus(wafer.uuid , status)
  if (response === "success"){    
    wafer.waferStatus = status;
  }
  else{
    ElMessage.error("상태 변경에 실해하였습니다. 잠시후 다시 클릭해 주세요")
  }
  
}
