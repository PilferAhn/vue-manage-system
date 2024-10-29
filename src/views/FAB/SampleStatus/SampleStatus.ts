import type { FabData } from "../SampleStatusInterface";
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

export const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: FabData;
  rowIndex: number;
}) => {

  if (row.waitTime >= 10){
    return "success-row";
  }

  if (row.importance === "★") {
    
    return "success-row";
  } else if (row.importance === "C" || row.importance === "H") {
    return "success-row";
  }
  return "";
};

