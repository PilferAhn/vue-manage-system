// 브라우저를 닫으면 로그아웃 (2026-11-22)
// - 로그인 정보는 localStorage(영구)에 있어 브라우저를 껐다 켜도 남아, 이전 화면이 로그인된 채 열렸음
// - 로그인할 때 "세션 쿠키"(만료일 없음 → 브라우저를 닫으면 삭제, 같은 브라우저의 탭끼리는 공유)를 남기고,
//   화면을 열 때 이 쿠키가 없으면 브라우저를 새로 켠 것으로 보고 로그아웃
// - 주의: 브라우저 설정의 "이전 세션 이어서 열기(시작 시 계속)" 를 켜 두면 브라우저가 세션 쿠키까지 복원하므로 로그인 상태가 유지될 수 있음

const SESSION_COOKIE = "rf_login_session";

// 로그아웃 때 지우는 로그인 정보 (login.vue 가 저장하는 항목)
const LOGIN_KEYS = ["ms_username", "id", "email", "role", "department", "ms_keys"];

export function markLoginSession(): void {
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax`;
}

export function hasLoginSession(): boolean {
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${SESSION_COOKIE}=`));
}

export function clearLoginSession(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/** 로그인 정보와 열려 있던 화면 탭 목록 삭제 */
export function clearLoginData(): void {
  LOGIN_KEYS.forEach((k) => localStorage.removeItem(k));
  clearLoginSession();
}
