// Create Request Form: 이전 차수 공정 조건 자동 입력 / 변경 경고
//
// P/N 규칙: 12자리. 앞 10자리 = 기종, 11번째 = 차수(0-9 다음 A-Z), 12번째 = 변형(A, B, ...)
//   예) TSG00ARX002A → 기종 TSG00ARX00, 2차, A 변형
// 새 차수 의뢰서 작성 시, 현재보다 "낮은 차수"의 의뢰서 중 하나를 골라
// Freq Range / Wafer / HS Wafer Structure / IDT / Piston / Passivation / SiO2 / Photo 조건을 불러온다.
// 제출 시 불러온 값에서 바뀐 항목이 있으면 경고한다.

import axios from "axios";
import { reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { convertPep8ToCamelCase2 } from "../key-converter";
import { serverUrl } from "./fab-application-utils";
import type {
  FabRequestForm,
  SawType,
  Layer,
  IdtType,
  TcType,
  PstType,
  passivationType,
  seedType,
} from "../../interface/fab-application-rev2";

// ---------------------------------------------------------------- P/N 차수

const REVISION_ORDER = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface RevisionInfo {
  base: string; // 앞 10자리 (기종)
  order: number; // 차수 순서값 (0~35)
  variant: number; // 변형 순서값
}

export function parseRevision(productName?: string | null): RevisionInfo | null {
  const s = (productName ?? "").trim().toUpperCase();
  if (s.length !== 12) return null;
  const order = REVISION_ORDER.indexOf(s[10]);
  const variant = REVISION_ORDER.indexOf(s[11]);
  if (order < 0 || variant < 0) return null;
  return { base: s.slice(0, 10), order, variant };
}

export interface PreviousRevision {
  productName: string;
  createdDate?: string;
  wantedFabStartDate?: string;
  designerName?: string;
}

/** 같은 기종 중 현재보다 낮은 차수의 의뢰서 (차수, 변형 오름차순). 마지막 요소가 기본 선택 대상. */
export async function fetchPreviousRevisionCandidates(
  productName: string
): Promise<PreviousRevision[]> {
  const current = parseRevision(productName);
  if (!current) return [];

  const form = new FormData();
  form.append("product_name", productName.trim());
  const res = await axios.post(
    serverUrl + "/fab_monitoring_rev2/get_previous_revisions",
    form
  );
  const rows = convertPep8ToCamelCase2(res.data ?? []) as PreviousRevision[];

  return rows
    .map((r) => ({ row: r, rev: parseRevision(r.productName) }))
    .filter(
      (x) => x.rev && x.rev.base === current.base && x.rev.order < current.order
    )
    .sort((a, b) => a.rev!.order - b.rev!.order || a.rev!.variant - b.rev!.variant)
    .map((x) => x.row);
}

export async function fetchFabRequest(productName: string): Promise<FabRequestForm> {
  const form = new FormData();
  form.append("product_name", productName);
  const res = await axios.post(serverUrl + "/fab_monitoring_rev2/get_fab_request", form);
  return convertPep8ToCamelCase2(res.data) as FabRequestForm;
}

// ---------------------------------------------------------------- 레이어 보정

/** 저장된 레이어 수가 SawType 정의와 다르면 정의된 레이어로 교체 (LoadApplication2 와 동일 규칙) */
export function fixLayersBySawType(app: FabRequestForm, sawType: SawType) {
  const fix = (
    targetId: any,
    targetLayers: Layer[] | undefined,
    types: any[] | undefined,
    match: (type: any, id: any) => boolean
  ) => {
    if (targetId == null || !targetLayers) return;
    const layers: Layer[] = (types ?? []).find((t) => match(t, targetId))?.layers ?? [];
    if (layers.length !== targetLayers.length) {
      targetLayers.splice(0, targetLayers.length, ...layers);
    }
  };
  fix(app.idtId, app.idtLayers, sawType.idtTypes, (t: IdtType, id) => t.idtId === id);
  fix(app.idt2Id, app.idt2Layers, sawType.idtTypes, (t: IdtType, id) => t.idtId === id);
  fix(app.tcId, app.tcLayers, sawType.tcTypes, (t: TcType, id) => t.tcId === id);
  fix(app.pstId, app.pstLayers, sawType.pstTypes, (t: PstType, id) => t.pstId === id);
  fix(app.seedId, app.seedLayers, sawType.seedTypes, (t: seedType, id) => t.seedId === id);
  fix(
    app.passivationId,
    app.passivationLayers,
    sawType.passivationTypes,
    (t: passivationType, id) => t.passivationId === id
  );
}

// ---------------------------------------------------------------- 대상 항목

interface ProcessField {
  key: string;
  section: string;
  label: string;
  isLayers?: boolean;
}

export const PROCESS_FIELDS: ProcessField[] = [
  { key: "bandGroupId", section: "기본 정보", label: "Freq Range" },

  { key: "waferType", section: "Wafer", label: "웨이퍼 종류" },
  { key: "waferId", section: "Wafer", label: "Wafer" },
  { key: "waferAngle", section: "Wafer", label: "각도" },
  { key: "waferThickness", section: "Wafer", label: "두께" },
  { key: "isMixedWafer", section: "Wafer", label: "혼입" },
  { key: "waferAngle2", section: "Wafer", label: "혼입 각도" },
  { key: "waferThickness2", section: "Wafer", label: "혼입 두께" },
  { key: "isNeededLtEtching", section: "Wafer", label: "LTE 진행" },

  { key: "hsId", section: "HS Wafer Structure", label: "구조" },
  { key: "hsTrimingTarget", section: "HS Wafer Structure", label: "Trimming Target" },

  { key: "idtProcessId", section: "IDT", label: "공정" },
  { key: "idtId", section: "IDT", label: "IDT 종류" },
  { key: "idtLayers", section: "IDT", label: "두께", isLayers: true },
  { key: "idtMachineName", section: "IDT", label: "설비" },
  { key: "depositionCondi", section: "IDT", label: "성막 조건" },
  { key: "idtProcessMachineName", section: "IDT", label: "Etching 설비" },
  { key: "idtProcessRecipie", section: "IDT", label: "Etching 레시피" },
  { key: "isDualIdt", section: "IDT", label: "Dual IDT" },
  { key: "idt2Id", section: "IDT", label: "IDT2 종류" },
  { key: "idt2Layers", section: "IDT", label: "IDT2 두께", isLayers: true },
  { key: "idt2MachineName", section: "IDT", label: "IDT2 설비" },

  { key: "pstId", section: "Piston", label: "종류" },
  { key: "pstLayers", section: "Piston", label: "두께", isLayers: true },

  { key: "passivationId", section: "Passivation", label: "종류" },
  { key: "passivationLayers", section: "Passivation", label: "Rank", isLayers: true },

  { key: "tcId", section: "SiO2", label: "종류" },
  { key: "tcLayers", section: "SiO2", label: "두께", isLayers: true },
  { key: "tcMachineName", section: "SiO2", label: "설비" },
];

// 화면 표시에 필요한 서버 조인 객체 (비교 대상은 아님)
const EXTRA_COPY_KEYS = ["wafer", "hsType"];

// 기본 정보: 이전 차수에서 같이 불러오는 항목 (2026-11-23 사용자 요청)
// 공정 조건이 아니므로 "불러온 뒤 바뀐 항목" 경고(비교) 대상에서는 제외
const BASIC_COPY_KEYS = ["packageId", "packageSubTypeId", "band", "filterType"];

const clone = <T>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

// ---------------------------------------------------------------- Photo
// photo.vue 는 웨이퍼 종류/Package/Assay Site/IDT 공정/Bridge 등 옵션이 바뀔 때
// photoProcesses 를 처음부터 다시 만든다(설비·Reticle 초기화). 그래서 불러온 값을
// 공정 이름별로 기억해 두고, 다시 만들어진 목록의 빈칸을 채운다.

type PhotoMemory = Record<string, { machineName?: string; reticleName?: string }>;

function buildPhotoMemory(photo: any): PhotoMemory {
  const mem: PhotoMemory = {};
  for (const p of photo?.photoProcesses ?? []) {
    if (p?.processName) mem[p.processName] = { machineName: p.machineName, reticleName: p.reticleName };
  }
  return mem;
}

/** 다시 만들어진 Photo 목록의 비어 있는 설비/Reticle 을 불러온 값으로 채움 */
export function refillPhotoFromMemory(app: FabRequestForm) {
  const mem = revisionGuard.photoMemory;
  if (!mem) return;
  for (const p of app.photo?.photoProcesses ?? []) {
    const m = mem[p.processName];
    if (!m) continue;
    // Nikon 고정 공정(isMutable=false)의 설비는 photo.vue 가 정하므로 건드리지 않음
    if (!p.machineName && m.machineName && p.isMutable !== false) p.machineName = m.machineName;
    if (!p.reticleName && m.reticleName) p.reticleName = m.reticleName;
  }
}

const normalizePhoto = (photo: any) => {
  const out: Record<string, { machineName: string | null; reticleName: string | null }> = {};
  for (const p of photo?.photoProcesses ?? []) {
    if (!p?.processName) continue;
    out[p.processName] = {
      machineName: normalizeValue(p.machineName),
      reticleName: normalizeValue(typeof p.reticleName === "string" ? p.reticleName.trim() : p.reticleName),
    };
  }
  return out;
};

/** source 의 6개 섹션 값을 target 에 복사 (폼이 마운트되지 않은 상태에서 호출할 것) */
export function applyProcessSections(
  target: FabRequestForm,
  source: FabRequestForm,
  sawType: SawType
) {
  const t = target as any;
  const s = source as any;
  for (const f of PROCESS_FIELDS) t[f.key] = clone(s[f.key]);
  for (const k of EXTRA_COPY_KEYS) t[k] = clone(s[k]);
  // 기본 정보: Package / Band / Filter Type / Designer (원본에 값이 있을 때만 덮어씀)
  for (const k of BASIC_COPY_KEYS) if (s[k] != null && s[k] !== "") t[k] = clone(s[k]);
  if (s.designer?.id) {
    // Designer 입력칸은 designer.id / designer.userName 을 보고, designerId 는 User2.vue 가 designer.id 로 맞춤
    t.designer = { ...(t.designer ?? {}), id: s.designer.id, userName: s.designer.userName };
    t.designerId = s.designer.id;
  }
  if (s.photo?.photoProcesses) t.photo = clone(s.photo); // 원본에 Photo 가 없으면 현재 값 유지
  revisionGuard.photoMemory = buildPhotoMemory(s.photo);

  // LoadApplication2 와 동일한 복원 규칙
  t.waferType = s.wafer?.sawTypeId ?? s.waferType;
  t.isDualIdt = s.idt2Id != null;
  for (const f of PROCESS_FIELDS) if (f.isLayers && t[f.key] == null) t[f.key] = [];

  fixLayersBySawType(target, sawType);
}

// ---------------------------------------------------------------- 스냅샷 / 비교

type Snapshot = Record<string, any>;

const normalizeLayers = (layers: Layer[] | undefined | null) =>
  (layers ?? []).map((l) => ({
    material: l?.material ?? "",
    thickness: l?.thickness == null || (l.thickness as any) === "" ? null : Number(l.thickness),
  }));

function normalizeValue(v: any) {
  return v === undefined || v === "" ? null : v;
}

export function takeProcessSnapshot(app: FabRequestForm): Snapshot {
  const a = app as any;
  const snap: Snapshot = {};
  for (const f of PROCESS_FIELDS) {
    snap[f.key] = f.isLayers ? normalizeLayers(a[f.key]) : clone(normalizeValue(a[f.key]));
  }
  snap.__photo = normalizePhoto(a.photo);
  return snap;
}

const show = (v: any) => (v === null || v === undefined ? "(없음)" : String(v));

export function diffProcessSnapshot(before: Snapshot, after: Snapshot): string[] {
  const out: string[] = [];
  for (const f of PROCESS_FIELDS) {
    const b = before[f.key];
    const a = after[f.key];
    if (JSON.stringify(b) === JSON.stringify(a)) continue;

    const title = `[${f.section}] ${f.label}`;
    if (!f.isLayers) {
      out.push(`${title}: ${show(b)} → ${show(a)}`);
      continue;
    }
    const sameStructure =
      b.length === a.length && b.every((l: any, i: number) => l.material === a[i].material);
    if (!sameStructure) {
      const names = (ls: any[]) => ls.map((l) => l.material).join("/") || "(없음)";
      out.push(`${title}: 레이어 구성 변경 (${names(b)} → ${names(a)})`);
      continue;
    }
    b.forEach((l: any, i: number) => {
      if (l.thickness !== a[i].thickness) {
        out.push(`${title} ${l.material}: ${show(l.thickness)} → ${show(a[i].thickness)}`);
      }
    });
  }

  // Photo: 양쪽에 모두 있는 공정만 비교 (공정 추가/삭제는 Package·옵션 선택에 따라 자동으로 바뀌므로 제외)
  const pb = before.__photo ?? {};
  const pa = after.__photo ?? {};
  for (const name of Object.keys(pb)) {
    if (!(name in pa)) continue;
    if (pb[name].machineName !== pa[name].machineName) {
      out.push(`[Photo] ${name} 설비: ${show(pb[name].machineName)} → ${show(pa[name].machineName)}`);
    }
    if (pb[name].reticleName !== pa[name].reticleName) {
      out.push(`[Photo] ${name} Reticle: ${show(pb[name].reticleName)} → ${show(pa[name].reticleName)}`);
    }
  }
  return out;
}

// ---------------------------------------------------------------- 화면 간 공유 상태

export const revisionGuard = reactive({
  productName: "", // 후보를 조회한 P/N
  candidates: [] as PreviousRevision[],
  loadedFrom: "", // 실제로 조건을 불러온 원본 P/N
  baseline: null as Snapshot | null,
  photoMemory: null as PhotoMemory | null,
});

export function resetRevisionGuard() {
  revisionGuard.productName = "";
  revisionGuard.candidates = [];
  revisionGuard.loadedFrom = "";
  revisionGuard.baseline = null;
  revisionGuard.photoMemory = null;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

async function confirmHtml(title: string, html: string): Promise<boolean> {
  try {
    await ElMessageBox.confirm(html, title, {
      confirmButtonText: "그래도 제출",
      cancelButtonText: "취소",
      type: "warning",
      dangerouslyUseHTMLString: true,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * 새 의뢰서 제출 직전 검사. 제출을 계속해도 되면 true.
 * - 이전 차수 기록이 있는데 불러오지 않은 경우 경고
 * - 불러온 조건에서 바뀐 항목이 있으면 목록으로 경고
 */
export async function confirmRevisionChanges(app: FabRequestForm): Promise<boolean> {
  const productName = (app.productName ?? "").trim();

  // P/N 이 조회 시점과 다르면(입력 후 수정 등) 후보를 다시 확인
  if (revisionGuard.productName !== productName) {
    try {
      const candidates = await fetchPreviousRevisionCandidates(productName);
      const prev = parseRevision(revisionGuard.productName);
      const cur = parseRevision(productName);
      const sameRevisionGroup =
        prev && cur && prev.base === cur.base && prev.order === cur.order;
      if (!sameRevisionGroup) {
        revisionGuard.loadedFrom = "";
        revisionGuard.baseline = null;
        revisionGuard.photoMemory = null;
      }
      revisionGuard.productName = productName;
      revisionGuard.candidates = candidates;
    } catch (e) {
      console.error("이전 차수 확인 실패:", e);
      return true; // 조회 실패로 제출을 막지는 않는다
    }
  }

  if (revisionGuard.candidates.length === 0) return true;

  if (!revisionGuard.loadedFrom || !revisionGuard.baseline) {
    const list = revisionGuard.candidates.map((c) => escapeHtml(c.productName)).join(", ");
    return confirmHtml(
      "이전 차수 조건 미적용",
      `<div style="line-height:1.6">
        <p>이 기종에는 이전 차수 기록이 있습니다: <strong>${list}</strong></p>
        <p>이전 차수의 공정 조건을 불러오지 않고 작성되었습니다.</p>
        <p style="margin-top:1em">그래도 제출하시겠습니까?</p>
      </div>`
    );
  }

  const diffs = diffProcessSnapshot(revisionGuard.baseline, takeProcessSnapshot(app));
  if (diffs.length === 0) return true;

  const items = diffs.map((d) => `<li>${escapeHtml(d)}</li>`).join("");
  return confirmHtml(
    "공정 조건 변경 확인",
    `<div style="line-height:1.6">
      <p><strong>${escapeHtml(revisionGuard.loadedFrom)}</strong>에서 불러온 공정 조건 중
      <strong>${diffs.length}개 항목</strong>이 변경되었습니다.</p>
      <ul style="margin:8px 0 8px 18px; max-height:260px; overflow:auto">${items}</ul>
      <p>변경한 내용으로 제출하시겠습니까?</p>
    </div>`
  );
}
