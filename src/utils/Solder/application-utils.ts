import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import axios from "axios";
import { ApplicationData as solderApplication } from "../../interface/solderAppInterface";

import { ElMessageBox, ElMessage } from "element-plus";

export async function removeApplicationHandler(
  solderApplication: solderApplication
): Promise<boolean> {
  try {
    // 사용자 확인 대기
    console.log(solderApplication)
    await ElMessageBox.confirm(
      "정말로 삭제하시겠습니까?<br>한번 삭제된 의뢰서는 복구할 수 없습니다.",
      "삭제 확인",
      {
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        type: "warning",
        dangerouslyUseHTMLString: true,
      }
    );

    // 삭제 수행
    const result = await performDelete(solderApplication);

    // 삭제 성공 여부 반환
    return result;
  } catch (error) {
    // 사용자가 취소한 경우
    ElMessage.info("삭제가 취소되었습니다.");
    return false;
  }
}

async function performDelete(solderApplication: solderApplication): Promise<boolean> {
  try {
    // 삭제 작업 수행 로직
    console.log("Deleting:", solderApplication);

    // 예: API 요청
    // await axios.delete(`/api/solder/${solderApplication.id}`);

    ElMessage({
      message: "의뢰서가 성공적으로 삭제되었습니다.",
      type: "success",
    });

    return true;
  } catch (error) {
    console.error("삭제 중 오류 발생:", error);
    ElMessage.error("삭제 중 오류가 발생했습니다.");
    return false;
  }
}


export async function removeApplicationByUuid(uuid: string) {
  const url = `/solder/remove/${uuid}`; // uuid를 포함한 URL 정의

  try {
    // GET 요청을 통해 서버에서 데이터를 삭제
    const response = await axios.get(url);

    if (response.status === 200) {
      // 요청이 성공한 경우, 성공 메시지 표시
      ElMessage({
        type: "success",
        message: "데이터가 성공적으로 삭제되었습니다.",
      });
      return true;
    } else {
      // 요청이 성공했지만 상태 코드가 200이 아닌 경우
      ElNotification({
        title: "에러",
        message: `서버에서 예상치 못한 응답을 받았습니다: ${response.status}`,
        type: "warning",
      });
      return false;
    }
  } catch (error) {
    // 요청이 실패한 경우
    console.error("Error removing data:", error);
    ElNotification({
      title: "삭제 실패",
      message: `요청 중 에러가 발생했습니다: ${error.message}`,
      type: "error",
    });
    return false;
  }
}
