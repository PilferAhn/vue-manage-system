export const checkFileExtension = (fileName) => {
  // 파일 확장자 가져오기
  const extension = fileName.split(".").pop().toLowerCase();
  // 확장자가 's'로 시작하고 'p'로 끝나는지 확인
  return extension.startsWith("s") && extension.endsWith("p");
};

export const colorList = [
  "rgba(255, 99, 132, 1)", // 빨간색
  "rgba(54, 162, 235, 1)", // 파란색
  "rgba(255, 206, 86, 1)", // 노란색
  "rgba(75, 192, 192, 1)", // 청록색
  "rgba(153, 102, 255, 1)", // 보라색
  "rgba(255, 159, 64, 1)", // 주황색
  "rgba(255, 99, 132, 0.6)", // 연한 빨간색
  "rgba(255, 159, 64, 0.6)", // 연한 주황색
  "rgba(153, 102, 255, 0.6)", // 연한 보라색
  "rgba(54, 162, 235, 0.6)", // 연한 파란색
  "rgba(75, 192, 192, 0.6)", // 연한 청록색
  "rgba(255, 206, 86, 0.6)", // 연한 노란색
  "rgba(116, 185, 255, 1)", // 하늘색
  "rgba(162, 155, 254, 1)", // 연보라색
  "rgba(0, 184, 148, 1)", // 에메랄드색
  "rgba(253, 121, 168, 1)", // 분홍색
];

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formatted = date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // 문자열 분리 및 재조립
  const parts = formatted.match(/(\d+). (\d+). (\d+). (\d+):(\d+)/);
  if (parts) {
    //return `${parts[1]}년 ${parts[2]}월 ${parts[3]}일 - ${parts[4]}시 ${parts[5]}분`;
    return `${parts[1]}-${parts[2]}-${parts[3]}`;
  } else {
    return dateStr; // 매칭 실패 시 원본 문자열 반환
  }
};

export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function getLastThursday(): String {
  const today = new Date();
  const dayOfWeek = today.getDay();
  let daysToLastThursday: number;

  if (dayOfWeek >= 4) {
    // 오늘 요일이 목요일 이상일 경우
    daysToLastThursday = dayOfWeek - 4 + 7;
  } else {
    // 오늘 요일이 목요일 이전일 경우
    daysToLastThursday = dayOfWeek + 4;
  }

  const lastThursday = new Date(
    today.setDate(today.getDate() - daysToLastThursday)
  );
  lastThursday.setHours(0, 0, 0, 0);

  // 날짜를 'YYYY-MM-DD 00:00:00' 형식의 문자열로 변환
  const year = lastThursday.getFullYear();
  const month = lastThursday.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
  const day = lastThursday.getDate();

  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} 00:00:00`;
  return formattedDate;
}

export const readFileContent = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const dataStr = event.target.result;
    console.log("파일 내용:", dataStr);
    // dataStr을 다른 곳에 저장하거나 처리하는 로직 추가
  };
  reader.readAsText(file);
  return false;
};
