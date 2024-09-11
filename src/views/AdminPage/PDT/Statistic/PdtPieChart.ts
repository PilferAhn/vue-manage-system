import axios from "axios";

export async function postChartData(dateFrom: number, dateEnd: number) {
  try {
    // 날짜 값을 문자열로 변환하여 전송하거나 그대로 전송
    const response = await axios.post(
      "/pdt_application/get_finished_task_cnt",
      {
        date_from: dateFrom.toString(), // 필요한 경우 문자열로 변환
        date_end: dateEnd.toString(), // 필요한 경우 문자열로 변환
      }
    );

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    // 오류 핸들링
    console.error("Error posting chart data:", error);
    throw error;
  }
}
