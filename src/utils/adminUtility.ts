import axios from "axios";
import { ElMessage } from "element-plus";

export function getCurrentYearLastTwoDigits() {
  const currentYear = new Date().getFullYear(); // 현재 연도를 가져옵니다.
  return (currentYear % 100).toString().padStart(2, "0"); // 마지막 두 자리를 문자열로 변환
}

export async function getRequestNumber(requestType) {
  try {
    const response = await axios.get(
      `pdt_application/get-request-number/${requestType}`
    );

    if (response.data.status === 200) {
      return response.data.requestNumber; // 성공적으로 requestNumber를 받은 경우 반환
    } else {
      handleErrors(response.data.status); // 오류 처리를 별도의 함수로 분리
      return { status: response.data.status, requestNumber: 0 };
    }
  } catch (error) {
    console.error("Error during fetch: ", error);
    handleCatchError(error);
    return { status: error.response?.status || 500, requestNumber: 0 };
  }
}

function handleErrors(status) {
  if (status === 404) {
    ElMessage.error("확인된 URL이 아닙니다");
  } else {
    ElMessage.error(
      "의뢰 번호를 생성하는데 실패했습니다. 관리자에게 문의하세요"
    );
  }
}

function handleCatchError(error) {
  if (error.response?.status === 422) {
    console.error("Parameter 값이 잘못되었습니다: ", error);
  } else {
    console.error("Bad Request, 아마 URL이 잘못되었을 것입니다: ", error);
  }
}
