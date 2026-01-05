export function getCurrentWeekNumber(targetDate?: Date): number {
  const date = targetDate ? new Date(targetDate) : new Date();
  // 시간 날리고 날짜만 보정
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // ISO: 월요일=1, ..., 일요일=7
  const day = d.getUTCDay() || 7;
  // 그 주의 "목요일"로 이동 (ISO 규칙: 목요일이 속한 해가 그 주의 해)
  d.setUTCDate(d.getUTCDate() + 4 - day);
  // 그 해 1월 1일(해당 ISO week-year의 시작점)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const diffDays = Math.floor((d.getTime() - yearStart.getTime()) / 86400000);
  const weekNo = Math.floor((diffDays + 1) / 7) + 1;
  return weekNo;
  // const now = new Date();
  // const startOfYear = new Date(now.getFullYear(), 0, 1);
  // const pastDaysOfYear =
  //   (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000);

  // // startOfYear.getDay()가 1(월요일)이 되도록 조정
  // const dayOfWeekAdjustment = (startOfYear.getDay() + 6) % 7;

  // return Math.ceil((pastDaysOfYear + dayOfWeekAdjustment) / 7);
}

export function getWeekYearFromWantedFabStart(dateInput: Date | string): number {
  const d = dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput);

  // NaN 방지
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date in getWeekYearFromWantedFabStart");
  }

  const year = d.getFullYear();

  // JS: getDay() 0=일, 1=월 ... 6=토
  const day = d.getDay();
  const monday = new Date(d);
  const diffToMonday = (day + 6) % 7; // 월(1) → 0, 화(2) → 1, ... 일(0) → 6
  monday.setDate(d.getDate() - diffToMonday);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const nextJan1 = new Date(year + 1, 0, 1); // (year+1)-01-01

  if (nextJan1 >= monday && nextJan1 <= friday) {
    return year + 1;
  }
  return year;
}

// export function getIsoWeekYear(date: Date): number {
//   // ISO 8601 week-year 계산
//   const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//   const dayNum = d.getUTCDay() || 7; // 일요일=7
//   d.setUTCDate(d.getUTCDate() + 4 - dayNum); // 그 주의 목요일로 이동
//   return d.getUTCFullYear();
// }

/**
 * 문자열에서 첫 번째 연도(4자리 숫자)를 추출하는 함수
 * @param dateTimeString 연도가 포함된 날짜 및 시간 문자열 (예: "2024-12-16T14:48:09")
 * @returns 연도(4자리 숫자)를 문자열로 반환, 연도가 없으면 null 반환
 */
export function extractYearFromDateTime(dateTimeString: string): string | null {
  // 정규 표현식: 문자열의 시작(^)에서 4자리 숫자 (\d{4})를 찾음
  const yearMatch = dateTimeString.match(/^\d{4}/);

  // 매칭된 결과가 있으면 첫 번째 결과(yearMatch[0]) 반환, 없으면 null 반환
  return yearMatch ? yearMatch[0] : null;
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

export function getTodayDate() {
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return currentDate;
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

export function getEarliestTimeOfCurrentMonth(): Date {
  const today = new Date(); // 오늘 날짜
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
    0,
    0,
    0,
    0
  ); // 이번 달의 첫 번째 날 00:00:00

  return firstDayOfMonth;
}

/**
 * 요일을 입력하면 이번 주에 해당하는 날짜를 반환하는 함수
 * @param dayOfWeek "월" | "화" | "수" | "목" | "금" | "토" | "일"
 * @returns 이번 주 해당 요일의 날짜 (시간: 00:00:00)
 */
export function getDateOfThisWeek(dayOfWeek: string): Date {
  const daysMap: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  // 입력된 요일이 올바른지 확인
  if (!(dayOfWeek in daysMap)) {
    throw new Error(
      `잘못된 요일 입력: ${dayOfWeek}. "월", "화", ..., "일" 중 하나를 입력하세요.`
    );
  }

  // 현재 날짜 및 현재 주의 시작(일요일) 계산
  const now = new Date();
  const currentDay = now.getDay(); // 현재 요일 (0: 일요일 ~ 6: 토요일)
  const diff = daysMap[dayOfWeek] - currentDay; // 입력 요일과 현재 요일 차이

  // 이번 주 해당 요일의 날짜 계산
  const targetDate = new Date();
  targetDate.setDate(now.getDate() + diff); // 날짜 이동
  targetDate.setHours(0, 0, 0, 0); // 시간: 00:00:00 설정

  return targetDate;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();  
  return day == 0 || day == 6;
}

export function isHoliday(date: Date, holidays: Set<string>): boolean {
  
  return holidays.has(date.toLocaleDateString("ko-KR").split("T")[0]); // YYYY-MM-DD 형식으로 변환하여 체크
}

function getPreviousWorkday(startDate: Date, holidays: Set<string>): Date {
  let currentDate = new Date(startDate);

  while (isWeekend(currentDate) || isHoliday(currentDate, holidays)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return currentDate;
}

// 📌 테스트 실행
// export const holidaysList = [
//   "2023-03-01",
//   "2023-05-05",
//   "2023-05-27",
//   "2023-05-29",
//   "2023-06-06",
//   "2023-08-15",
//   "2023-09-01",
//   "2023-09-28",
//   "2023-09-29",
//   "2023-10-02",
//   "2023-10-03",
//   "2023-10-09",
//   "2023-12-25",
//   "2024-01-01",
//   "2024-02-09",
//   "2024-02-12",
//   "2024-03-01",
//   "2024-04-10",
//   "2024-05-01",
//   "2024-05-02",
//   "2024-05-05",
//   "2024-05-06",
//   "2024-05-15",
//   "2024-06-06",
//   "2024-08-15",
//   "2024-09-02",
//   "2024-09-16",
//   "2024-09-17",
//   "2024-09-18",
//   "2024-10-01",
//   "2024-10-03",
//   "2024-10-09",
//   "2024-12-25",
//   "2025-01-01",
//   "2025-01-28",
//   "2025-01-29",
//   "2025-01-30",
//   "2025-03-03",
//   "2025-05-01",
//   "2025-05-05",
//   "2025-05-06",
//   "2025-06-06",
//   "2025-08-15",
//   "2025-09-01",
//   "2025-10-03",
//   "2025-10-06",
//   "2025-10-07",
//   "2025-10-08",
//   "2025-10-09",
//   "2025-12-25",
// ];

export const holidaysList = [
    "2025. 1. 1.",
    "2025. 1. 28.",
    "2025. 1. 29.",
    "2025. 1. 30.",
    "2025. 3. 3.",
    "2025. 5. 1.",
    "2025. 5. 5.",
    "2025. 5. 6.",
    "2025. 6. 3.",
    "2025. 6. 6.",
    "2025. 8. 15.",
    "2025. 9. 1.",
    "2025. 10. 3.",
    "2025. 10. 6.",
    "2025. 10. 7.",
    "2025. 10. 8.",
    "2025. 10. 9.",
    "2025. 12. 25.",
    "2026. 1. 1.",
    "2026. 2. 16.",
    "2026. 2. 17.",
    "2026. 2. 18.",
    "2026. 3. 2.",
    "2026. 5. 1.",
    "2026. 5. 5.",
    "2026. 5. 25.",
    "2026. 6. 3.",
    "2026. 6. 6.",
    "2026. 8. 17.",
    "2026. 9. 1.",
    "2026. 9. 24.",
    "2026. 9. 25.",
    "2026. 10. 5.",
    "2026. 10. 9.",
    "2026. 12. 25.",
  ];

function workday(startDate: string, holidaysList: string[]): string {
  const holidays = new Set(holidaysList); // 공휴일을 Set으로 변환하여 빠른 검색 가능
  let date = new Date(startDate);

  // console.log("startDate: "+date.toISOString())
  let tempStr = "";

  do {
    tempStr += "test\t";

    date.setDate(date.getDate() - 1); // 하루 전으로 이동
  } while (isWeekend(date));

  return date.toLocaleDateString("ko-KR").split("T")[0]; // YYYY-MM-DD 형식 반환
}

export function calculateWorkday(L9: string, holidaysList: string[]): string {
  const holidays = new Set(holidaysList); // 공휴일을 Set으로 변환하여 빠른 검색 가능
  let date = new Date(L9);    
  date.setDate(date.getDate() - 1);  
  while (isWeekend(date) || isHoliday(date , holidays)) {    
    date.setDate(date.getDate() - 1);
  }
  
  return date.toLocaleDateString().split("T")[0]; // YYYY-MM-DD 형식 반환
}
