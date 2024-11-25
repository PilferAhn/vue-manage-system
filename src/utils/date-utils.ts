export function getCurrentWeekNumber(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000);

  // startOfYear.getDay()가 1(월요일)이 되도록 조정
  const dayOfWeekAdjustment = (startOfYear.getDay() + 6) % 7;

  return Math.ceil((pastDaysOfYear + dayOfWeekAdjustment) / 7);
}

export function getTodayDatetime() {
  const now = new Date();
  const cururentTime =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")} ` +
    `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  return cururentTime;
}

export function adjustDate(dateString, daysOffset) {
  // 문자열을 Date 객체로 변환
  const date = new Date(dateString);

  // 날짜를 조정
  date.setDate(date.getDate() + daysOffset);

  // 결과를 "YYYY-MM-DD HH:MM:SS" 형식으로 반환
  const adjustedDateTime =
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ` +
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  return adjustedDateTime;
}

// Utility function to format date to YYYY-MM-DD
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Utility function to format date to "YYYY-MM-DD HH:MM"
export function formatDateTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function getThisFriday(): string {
  const today = new Date(); // 오늘 날짜 가져오기
  const dayOfWeek = today.getDay(); // 오늘이 주의 몇 번째 날인지 (0: 일요일 ~ 6: 토요일)

  // 현재 주 금요일까지의 남은 일수 계산
  const daysUntilFriday = 5 - dayOfWeek; // 5는 금요일 (0: 일요일 기준)

  // 이번 주 금요일 날짜 계산
  const thisFriday = new Date(today);
  thisFriday.setDate(
    today.getDate() +
      (daysUntilFriday >= 0 ? daysUntilFriday : 7 + daysUntilFriday)
  );

  // 문자열로 반환 (YYYY-MM-DD HH:mm:ss 형식)
  const year = thisFriday.getFullYear();
  const month = String(thisFriday.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const date = String(thisFriday.getDate()).padStart(2, "0");
  const hours = String(thisFriday.getHours()).padStart(2, "0");
  const minutes = String(thisFriday.getMinutes()).padStart(2, "0");
  const seconds = String(thisFriday.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

// 테스트 실행
console.log("이번 주 금요일:", getThisFriday());
