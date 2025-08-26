import axios from "axios";
import type { FabRequest } from "../../interface/fab-application-rev2";
import { convertKeysToPEP8 } from "../key-converter";
import { ref } from "vue";
import { ElMessage, ElNotification } from "element-plus";

export async function downloadExcelWithCountdown(
  processData: FabRequest[],
  onCountdownUpdate: (remainingTime: number) => void,
  onDownloadComplete: () => void
) {
  try {
    let countdown = 20; // ✅ 카운트다운 초기값 (20초)
    onCountdownUpdate(countdown); // 초기 카운트다운 설정

    const newData = ref<object[]>([]);

    for (let i = 0; i < processData.length; i++) {
      newData.value.push(convertKeysToPEP8(processData[i]));
      newData.value[i]["wafer_info"] = processData[i].createWaferInfo();
      newData.value[i]["trmming_info"] = processData[i].createTrimmingInfo();
      newData.value[i]["hs_wafer_condi"] =
        processData[i].createHsWaferCondition();
      newData.value[i]["fab_card_convey_date"] =
        processData[i].calFabCardConveyDate();
    }

    // ✅ 1️⃣ 다운로드 시작 알림
    ElMessage({
      message: "파일이 다운로드 중입니다. 잠시만 기다려주세요...",
      type: "info",
      duration: 20000, // 20초 동안 유지
      showClose: true,
    });

    // ✅ 2️⃣ FastAPI로 데이터 전송 & 다운로드 시작
    const response = await axios.post(
      "/test/create_fab_request_review_excel",
      newData.value,
      { responseType: "blob", timeout: 0 } // ✅ 긴 요청 허용
    );

    // ✅ 3️⃣ 다운로드 진행 상태 표시
    const countdownInterval = setInterval(() => {
      countdown--;
      onCountdownUpdate(countdown);

      if (countdown <= 0) {
        clearInterval(countdownInterval); // ✅ 카운트다운 종료
      }
    }, 1000); // 1초마다 카운트다운 감소

    // ✅ 4️⃣ 서버에서 파일명 추출 (헤더 확인)
    const contentDisposition = response.headers["content-disposition"];
    console.log("Content-Disposition:", contentDisposition); // 🔹 확인용 로그

    let fileName = "process_data.xlsm"; // 기본 파일명

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
      if (fileNameMatch && fileNameMatch.length > 1) {
        fileName = decodeURIComponent(fileNameMatch[1]); // ✅ UTF-8 디코딩
      }
    }

    // ✅ 5️⃣ 파일 다운로드 실행
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // ✅ 서버에서 받은 파일명 적용
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url); // 리소스 해제

    // ✅ 6️⃣ 다운로드 완료 후 UI 업데이트
    onDownloadComplete();

    // ✅ 7️⃣ 다운로드 완료 메시지 출력
    ElNotification({
      title: "다운로드 완료",
      message: `파일 "${fileName}"이(가) 성공적으로 다운로드되었습니다!`,
      type: "success",
      duration: 5000, // 5초 동안 유지
    });

    // ✅ 8️⃣ 카운트다운 종료
    clearInterval(countdownInterval);
  } catch (error) {
    console.error("Excel 다운로드 실패:", error);

    // ❌ 다운로드 실패 메시지 출력
    ElMessage({
      message: "파일 다운로드에 실패하였습니다!",
      type: "error",
      duration: 5000, // 5초 동안 유지
    });

    onDownloadComplete(); // 에러 발생 시 UI 초기화
  }
}
