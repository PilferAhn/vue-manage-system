import axios from "axios";
import type { FabData } from "./SampleStatusInterface";
import type { ProcessData } from "../Interface/ApplicationInterface";
// 오늘 날짜로부터 특정 일수를 뺀 날짜를 반환하는 함수
export function getPastDateString(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days); // 주어진 일수만큼 날짜를 뺌
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월을 두 자리로
  const day = date.getDate().toString().padStart(2, "0"); // 일을 두 자리로
  return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 반환
}

// 오늘 날짜를 문자열로 변환하는 함수
export const getTodayAsString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 입력받은 날짜로부터 30일 이전의 날짜를 계산하는 함수
export const getPrevious30DaysAsString = (dateString: string): string => {
  const date = new Date(dateString); // 문자열을 Date 객체로 변환
  date.setDate(date.getDate() - 30); // 현재 날짜에서 30일을 뺌

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 날짜를 특정 형식(YYYY-MM-DD HH:mm:ss)으로 변환하는 함수
function formatDateToTimestampString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 오늘과 30일 전 날짜를 문자열로 반환하는 함수
export function getTodayAnd30DaysAgoDates(): {
  startDate: string;
  lastDate: string;
} {
  const today = new Date();
  const formattedToday = formatDateToTimestampString(today);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const formattedThirtyDaysAgo = formatDateToTimestampString(thirtyDaysAgo);

  return {
    startDate: formattedThirtyDaysAgo,
    lastDate: formattedToday,
  };
}

export const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: FabData;
  rowIndex: number;
}) => {
  if (row.waitTime >= 10) {
    return "success-row";
  }

  if (row.importance === "★") {
    return "success-row";
  } else if (row.importance === "C" || row.importance === "H") {
    return "success-row";
  }
  return "";
};

// MES 데이터를 가져오는 함수
export async function fetchMesDataForDateRange(
  applications : ProcessData[],
  startDate : string , lastDate : string) {

  let matId = ""
  applications.forEach((application , index) => {
    matId += application.modelName + ","
  })
  
  const formData = new FormData();
  formData.append("materials_id", matId)
  // formData.append("min_original_date", startDate)
  // formData.append("max_original_date", lastDate)

  try {
    const response = await axios.post("/mes/get_materials_by_id", formData);

    if (response.status === 200) {
      // console.log("MES Data:", response.data);
      return response.data;
    } else {
      console.error("Failed to fetch MES data:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching MES data:", error);
    return null;
  }
}