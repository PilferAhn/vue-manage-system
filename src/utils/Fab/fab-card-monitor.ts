// Fab Card 작성 현황: 조회 / 투입취소 확인 대상 판정 (2026-11-22)
// - FabCardMoniter.vue 화면과 로그인 팝업(home.vue)이 같은 기준을 쓰도록 공용으로 분리
import { ElMessageBox } from "element-plus";
import { FabRequest } from "../../interface/fab-application-rev2";
import type { FabRequestForm } from "../../interface/fab-application-rev2";
import { getApplicationListByDict } from "./fab-application-utils";
import { getMesFabFormInfo } from "../../views/FAB/ApplicationList/rev2/ApplicationTable";
import { getCurrentWeekNumber } from "../date-utils";
import { isJapaneseUser } from "../i18n";

function ymdOffset(base: Date, offset: number): string {
  const dt = new Date(base);
  dt.setDate(dt.getDate() + offset);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

/**
 * 이번 주 + 지난 2주 의뢰서 조회
 * - 오늘/7일 전/14일 전의 ISO 주차로 한 번에 조회, 연도 대신 투입예정일 범위(오늘 ±60일)로 거름 → 연초에도 빠짐 없음
 * - observerId 를 주면 그 사람 관련 건만
 */
export async function fetchFabCardRecentWeeks(observerId?: string | null): Promise<FabRequest[]> {
  const today = new Date();
  const weeks = [0, 7, 14].map((d) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - d);
    return getCurrentWeekNumber(dt);
  });
  const para: Record<string, any> = {
    users: true,
    wafer: true,
    idt_type: true,
    hs_type: true,
    idt_layers: true,
    week_numbers: weeks.join(","),
    wanted_fab_start_date_start: `${ymdOffset(today, -60)}T00:00:00`,
    wanted_fab_start_date_end: `${ymdOffset(today, 60)}T23:59:59`,
    order_by: "created_date",
  };
  if (observerId) para["observer_id"] = observerId;
  const data: FabRequestForm[] = await getApplicationListByDict(para);
  return data.map((item: FabRequestForm) => new FabRequest(item));
}

/**
 * 투입취소 판단 기준: 투입예정일까지 남은 일수 (2026-11-22)
 * - MES 투입계획은 대략 투입 1주일 전쯤 등록됨 (측정: 투입 3~7일 전 건 100% 등록, 8일 이상 남은 건 0%)
 * - 그래서 투입예정일까지 3일 이내인데도 MES 에 없을 때만 "투입취소 확인 요망" + 팝업
 * - 그보다 이르면 "MES 등록 대기" (아직 등록 시점이 안 된 것으로 봄)
 */
export const CANCEL_CHECK_DAYS = 3;

/** 오늘(달력 날짜) 기준 투입예정일까지 남은 일수. 날짜가 없으면 null */
export function daysUntilFabStart(app: FabRequest, now: number | Date = Date.now()): number | null {
  if (!app.wantedFabStartDate) return null;
  const start = new Date(app.wantedFabStartDate);
  if (isNaN(start.getTime())) return null;
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const n = new Date(now);
  const t = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
  return Math.round((s - t) / 86400000);
}

/** MES 투입계획과 맞는 건이 없음 (Not Found) */
export function isMesNotFound(app: FabRequest): boolean {
  return !app.isPending && app.isFabCardCreated === null;
}

/** Fab Card 화면에서 "Not Found / 투입취소 확인 요망" 으로 보이는 건인지 (투입예정일 3일 이내) */
export function isCancelCheckTarget(app: FabRequest, now: number | Date = Date.now()): boolean {
  if (!isMesNotFound(app)) return false;
  const d = daysUntilFabStart(app, now);
  return d === null || d <= CANCEL_CHECK_DAYS;
}

/** 아직 MES 등록 시점 전이라 "MES 등록 대기" 로 보이는 건인지 (투입예정일 3일 초과) */
export function isMesRegistrationPending(app: FabRequest, now: number | Date = Date.now()): boolean {
  return isMesNotFound(app) && !isCancelCheckTarget(app, now);
}

/** 로그인한 사용자가 개발자/의뢰자인 "투입취소 확인 요망" 건 */
export async function getMyCancelCheckItems(userId: string): Promise<FabRequest[]> {
  const apps = await fetchFabCardRecentWeeks(userId);
  if (!apps.length) return [];
  await getMesFabFormInfo(apps);
  return apps.filter(
    (a: any) => isCancelCheckTarget(a) && (a.designer?.id === userId || a.requester?.id === userId)
  );
}

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

/**
 * 로그인 팝업: 내 "투입취소 확인 요망" 건이 있으면 알림
 * Fab Card 작성 현황에서 사라질 때까지(보류 처리 또는 MES 등록으로 맞춰질 때까지) 로그인할 때마다 표시
 */
// 같은 로그인(페이지를 새로 열기 전까지) 동안 한 번만 표시.
// App.vue 가 화면 이동마다 레이아웃을 다시 그리므로(key = fullPath) 이 값으로 중복 표시를 막음
let popupShownFor: string | null = null;

/** 로그아웃 시 호출: 다음 로그인 때 다시 확인하도록 */
export function resetCancelCheckPopup(): void {
  popupShownFor = null;
}

export async function showMyCancelCheckPopup(userId: string | null): Promise<void> {
  if (!userId || userId === "admin" || userId === "MES") return;
  if (popupShownFor === userId) return;
  popupShownFor = userId; // 조회 중 화면 이동으로 다시 호출되어도 중복 실행 안 함
  let items: FabRequest[] = [];
  try {
    items = await getMyCancelCheckItems(userId);
  } catch (e) {
    console.error("투입취소 확인 대상 조회 실패:", e);
    popupShownFor = null; // 실패하면 다음 화면 이동 때 다시 시도
    return;
  }
  if (!items.length) return;

  const ja = isJapaneseUser();
  const rows = items
    .map(
      (a: any) =>
        `<tr><td>${esc(a.productName)}</td><td>${esc(a.quantity)}</td><td>${esc((a.wantedFabStartDate ?? "").slice(0, 10))}</td></tr>`
    )
    .join("");
  const head = ja ? "<th>P/N</th><th>枚数</th><th>投入予定日</th>" : "<th>P/N</th><th>매수</th><th>투입예정일</th>";
  const intro = ja
    ? "以下の依頼書は MES の投入計画にありません(Not Found)。<br/><b>投入キャンセルかどうか確認してください。</b>"
    : "아래 의뢰서는 MES 투입계획에 없습니다 (Not Found).<br/><b>투입취소 여부를 확인해 주세요.</b>";
  const guide = ja
    ? "・投入しない場合: <b>マイ依頼書一覧(My Form List)で該当の依頼書を Delete してください。</b><br/>・投入する場合: MES に投入計画を登録してください<br/><span style='color:#909399'>対応が終わるまで、ログインのたびに表示されます。</span>"
    : "· 투입하지 않음: <b>My Form List 에서 해당 의뢰서를 Delete 해주세요.</b><br/>· 투입함: MES에 투입계획을 등록해 주세요<br/><span style='color:#909399'>처리될 때까지 로그인할 때마다 표시됩니다.</span>";

  const html = `
    <div style="line-height:1.7">
      <p>${intro}</p>
      <table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:13px">
        <thead style="background:#fef0f0;color:#c00000">${head.replace(/<th>/g, "<th style='padding:4px 8px;border:1px solid #fbc4c4'>")}</thead>
        <tbody>${rows.replace(/<td>/g, "<td style='padding:4px 8px;border:1px solid #ebeef5;text-align:center'>")}</tbody>
      </table>
      <p style="font-size:13px">${guide}</p>
    </div>`;

  try {
    await ElMessageBox.alert(html, ja ? "投入キャンセル確認のお願い" : "투입취소 확인 요망", {
      dangerouslyUseHTMLString: true,
      type: "warning",
      confirmButtonText: ja ? "確認" : "확인",
    });
  } catch {
    /* 닫기(X) 무시 */
  }
}
