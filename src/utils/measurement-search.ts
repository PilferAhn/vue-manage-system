import { reactive } from "vue";

/**
 * 측정 목록(측정 완료 / 측정 진행·대기) 검색어 기억.
 * - 탭(상태+측정 종류)별로 따로 기억한다. key = "measurement_list:{status}:{testType}"
 * - 의뢰서 화면(MeasurementInfo)에서 돌아올 때만 유지하고, 메뉴 등 다른 곳에서 들어오면 비운다.
 * - 메모리에만 두므로 F5 / 브라우저를 다시 열면 비어 있다.
 */
export const savedSearch = reactive<Record<string, string>>({});

/** 직전 화면의 라우트 이름 (router.afterEach 에서 기록) */
let lastFromRouteName: string | null = null;
export function setLastFromRoute(name: unknown) {
  lastFromRouteName = typeof name === "string" ? name : null;
}

/** 목록 페이지에 들어올 때 호출: 의뢰서 화면에서 돌아온 게 아니면 그 목록의 검색어를 모두 비움 */
export function resetSearchUnlessReturning(status: string) {
  if (lastFromRouteName === "MeasurementInfo") return;
  const prefix = `measurement_list:${status}:`;
  Object.keys(savedSearch).forEach((k) => {
    if (k.startsWith(prefix)) savedSearch[k] = "";
  });
}
