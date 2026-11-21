import { ref, watch, type Ref } from "vue";

/**
 * 브라우저 탭 단위 저장소(sessionStorage) 도우미.
 * F5(새로고침)에는 유지되고, 브라우저 탭을 닫으면 사라진다.
 * 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 조용히 기본값으로 동작한다.
 */
const PREFIX = "ms_ui:";

export function loadSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function hasSession(key: string): boolean {
  try {
    return sessionStorage.getItem(PREFIX + key) !== null;
  } catch {
    return false;
  }
}

export function saveSession(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* 저장 실패는 무시 (화면 동작에는 영향 없음) */
  }
}

/** 값이 바뀔 때마다 sessionStorage 에 저장되는 ref (F5 후에도 같은 값으로 시작) */
export function useSessionRef<T>(key: string, fallback: T): Ref<T> {
  const r = ref(loadSession(key, fallback)) as Ref<T>;
  watch(r, (v) => saveSession(key, v));
  return r;
}
