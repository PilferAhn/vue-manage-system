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
