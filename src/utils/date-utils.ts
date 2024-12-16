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

export function convertDateTimeToDateTimeString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
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

export function getThisMonday(): string {
  const today = new Date(); // 오늘 날짜 가져오기
  const dayOfWeek = today.getDay(); // 오늘이 주의 몇 번째 날인지 (0: 일요일 ~ 6: 토요일)

  // 현재 주 월요일까지의 남은 일수 계산
  const daysSinceMonday = dayOfWeek - 1; // 1은 월요일 (0: 일요일 기준)

  // 이번 주 월요일 날짜 계산
  const thisMonday = new Date(today);
  thisMonday.setDate(
    today.getDate() -
      (daysSinceMonday >= 0 ? daysSinceMonday : 7 + daysSinceMonday)
  );

  // 문자열로 반환 (YYYY-MM-DD HH:mm:ss 형식)
  const year = thisMonday.getFullYear();
  const month = String(thisMonday.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const date = String(thisMonday.getDate()).padStart(2, "0");
  const hours = String(thisMonday.getHours()).padStart(2, "0");
  const minutes = String(thisMonday.getMinutes()).padStart(2, "0");
  const seconds = String(thisMonday.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

export function getThisSunday(): string {
  const today = new Date(); // 오늘 날짜 가져오기
  const dayOfWeek = today.getDay(); // 오늘이 주의 몇 번째 날인지 (0: 일요일 ~ 6: 토요일)

  // 이번 주 일요일까지의 남은 일수 계산
  const daysUntilSunday = 7 - dayOfWeek; // 7은 다음 주 일요일 기준, 0이면 오늘이 일요일

  // 이번 주 일요일 날짜 계산
  const thisSunday = new Date(today);
  thisSunday.setDate(
    today.getDate() + (daysUntilSunday >= 7 ? 0 : daysUntilSunday)
  );

  // 문자열로 반환 (YYYY-MM-DD HH:mm:ss 형식)
  const year = thisSunday.getFullYear();
  const month = String(thisSunday.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const date = String(thisSunday.getDate()).padStart(2, "0");
  const hours = String(thisSunday.getHours()).padStart(2, "0");
  const minutes = String(thisSunday.getMinutes()).padStart(2, "0");
  const seconds = String(thisSunday.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

export function getMondayFromInsertedDate(dateStr: string): string {
  // 입력받은 문자열을 Date 객체로 변환
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Use 'YYYY-MM-DD HH:mm:ss'");
  }

  // 현재 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const day = date.getDay();

  // 월요일을 기준으로 날짜 보정
  const diff = day === 0 ? -6 : 1 - day;

  // 보정된 날짜 (월요일) 계산
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);

  // YYYY-MM-DD 형식으로 반환
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(monday.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}

/**
 * 입력된 날짜(YYYY-MM-DD) 기준으로 주 번호를 계산하여 반환
 * @param dateStr 날짜 문자열 (예: "2024-11-15")
 * @returns 주 번호 (ISO-8601 기준)
 */
export function getWeekNumberByDate(dateStr: string): number {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Please use 'YYYY-MM-DD'");
  }

  // ISO-8601 주 계산: 월요일 시작, 첫 주는 1월 4일을 포함해야 함
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // ISO 주 계산용 시작 요일 설정 (0: 일요일, 1: 월요일 ...)
  const dayOfWeek = tempDate.getUTCDay() === 0 ? 7 : tempDate.getUTCDay(); // 0일 경우 7(일요일을 월요일 이후로 계산)
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayOfWeek); // 해당 주의 목요일로 이동 (ISO 주 기준)

  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1)); // 해당 연도의 첫 번째 날
  const weekNumber = Math.ceil(
    ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return weekNumber;
}
