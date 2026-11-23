// 한국 공휴일 + 회사 휴일 (2026-11-22) — 휴일은 이 파일 한 곳에서만 관리
// - 메인 화면 달력 표시 (일본(WJC) 사용자는 일본어 이름 + "韓国の祝日" 안내)
// - 근무일 계산(Fab Card 전달일, 리드타임): date-utils.ts 의 holidaysList 가 이 목록에서 만들어짐
// - 매년 말에 다음 해 날짜를 추가할 것 (음력 명절/대체공휴일/임시공휴일은 해마다 다름)
// - 회사 휴일: 매년 9월 1일 창립기념일

export type KoreanHoliday = {
  ko: string;
  ja: string;
  /** true: 공휴일이지만 회사는 근무 (달력에는 표시, 근무일 계산에서는 근무일로 봄) */
  companyWorkday?: boolean;
};

const N = {
  newYear: { ko: "신정", ja: "元日" },
  seollal: { ko: "설날", ja: "旧正月(ソルラル)" },
  samil: { ko: "삼일절", ja: "三・一節" },
  labor: { ko: "근로자의 날", ja: "勤労者の日" },
  children: { ko: "어린이날", ja: "こどもの日" },
  buddha: { ko: "부처님오신날", ja: "釈迦誕生日" },
  memorial: { ko: "현충일", ja: "顕忠日" },
  constitution: { ko: "제헌절", ja: "制憲節" },
  liberation: { ko: "광복절", ja: "光復節" },
  chuseok: { ko: "추석", ja: "秋夕(チュソク)" },
  foundation: { ko: "개천절", ja: "開天節" },
  hangul: { ko: "한글날", ja: "ハングルの日" },
  christmas: { ko: "성탄절", ja: "クリスマス" },
  substitute: { ko: "대체공휴일", ja: "振替休日" },
  temporary: { ko: "임시공휴일", ja: "臨時休日" },
  presidential: { ko: "대통령 선거일", ja: "大統領選挙日" },
  local: { ko: "지방선거일", ja: "地方選挙日" },
  founding: { ko: "창립기념일", ja: "創立記念日" }, // 회사 휴일 (매년 9월 1일)
};

export const KOREAN_HOLIDAYS: Record<string, KoreanHoliday> = {
  // 2025
  "2025-01-01": N.newYear,
  "2025-01-27": { ...N.temporary, companyWorkday: true }, // 기존 회사 휴일 목록에 없던 날 (근무일 계산 결과 유지)
  "2025-01-28": N.seollal,
  "2025-01-29": N.seollal,
  "2025-01-30": N.seollal,
  "2025-03-01": N.samil,
  "2025-03-03": N.substitute,
  "2025-05-01": N.labor,
  "2025-05-05": N.children, // 부처님오신날과 겹침
  "2025-05-06": N.substitute,
  "2025-06-03": N.presidential,
  "2025-06-06": N.memorial,
  "2025-08-15": N.liberation,
  "2025-09-01": N.founding,
  "2025-10-03": N.foundation,
  "2025-10-05": N.chuseok,
  "2025-10-06": N.chuseok,
  "2025-10-07": N.chuseok,
  "2025-10-08": N.substitute,
  "2025-10-09": N.hangul,
  "2025-12-25": N.christmas,

  // 2026
  "2026-01-01": N.newYear,
  "2026-02-16": N.seollal,
  "2026-02-17": N.seollal,
  "2026-02-18": N.seollal,
  "2026-03-01": N.samil,
  "2026-03-02": N.substitute,
  "2026-05-01": N.labor,
  "2026-05-05": N.children,
  "2026-05-24": N.buddha,
  "2026-05-25": N.substitute,
  "2026-06-03": N.local,
  "2026-06-06": N.memorial,
  "2026-07-17": N.constitution,
  "2026-08-15": N.liberation,
  "2026-08-17": N.substitute,
  "2026-09-01": N.founding,
  "2026-09-24": N.chuseok,
  "2026-09-25": N.chuseok,
  "2026-09-26": N.chuseok,
  "2026-10-03": N.foundation,
  "2026-10-05": N.substitute,
  "2026-10-09": N.hangul,
  "2026-12-25": N.christmas,

  // 2027 (임시공휴일은 발표되면 추가)
  "2027-01-01": N.newYear,
  "2027-02-06": N.seollal,
  "2027-02-07": N.seollal,
  "2027-02-08": N.seollal,
  "2027-02-09": N.substitute,
  "2027-03-01": N.samil,
  "2027-05-01": N.labor,
  "2027-05-05": N.children,
  "2027-05-13": N.buddha,
  "2027-06-06": N.memorial,
  "2027-07-17": N.constitution,
  "2027-08-15": N.liberation,
  "2027-08-16": N.substitute,
  "2027-09-01": N.founding,
  "2027-09-14": N.chuseok,
  "2027-09-15": N.chuseok,
  "2027-09-16": N.chuseok,
  "2027-10-03": N.foundation,
  "2027-10-04": N.substitute,
  "2027-10-09": N.hangul,
  "2027-10-11": N.substitute,
  "2027-12-25": N.christmas,
  "2027-12-27": N.substitute,
};

/**
 * 근무일 계산용 휴일 목록 ("YYYY. M. D." 형식 = toLocaleDateString("ko-KR") 과 같은 형식)
 * 회사 근무일(companyWorkday)은 제외. 주말에 걸친 공휴일도 들어가지만 근무일 계산은 주말을 이미 건너뛰므로 영향 없음
 */
export function buildWorkdayHolidayList(): string[] {
  return Object.entries(KOREAN_HOLIDAYS)
    .filter(([, h]) => !h.companyWorkday)
    .map(([ymd]) => {
      const [y, m, d] = ymd.split("-").map(Number);
      return `${y}. ${m}. ${d}.`;
    });
}
