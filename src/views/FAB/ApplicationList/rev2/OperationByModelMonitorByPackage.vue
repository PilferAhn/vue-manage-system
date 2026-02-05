<script lang="ts">
export default {};
</script>

<template>
  <div class="table-wrapper">
    <!-- 검색/옵션 -->
    <div class="toolbar">
      <div class="left">
        <el-select v-model="searchCategory" style="width: 150px">
          <el-option label="Product Name" value="productName" />
          <el-option label="Priority" value="priorityId" />
        </el-select>

        <el-input
          v-model="searchTerm"
          :placeholder="`검색할 ${searchCategory} 입력`"
          clearable
          @clear="handleClear"
          style="width: 300px"
        />

        <el-switch v-model="onlyRunning" active-text="진행중만" inactive-text="전체" />
      </div>
    </div>

    <!-- ✅ 기종별 1줄 + MES 현재공정/진행률 (FAB only) -->
    <el-table :data="filteredRows" row-key="rowKey" :span-method="spanMethod" class="custom-table" border size="small" height="720">
      <el-table-column fixed="left" type="index" label="No" width="55" align="center" />
      <el-table-column fixed="left" prop="productName" label="P/N" width="140" align="center" />
      <el-table-column fixed="left" prop="designer" label="개발자" width="140" align="center" />
      <el-table-column fixed="left" prop="priorityId" label="Priority" width="80" align="center" />
      <el-table-column fixed="left" label="진행중인 LOT 수" width="160" align="center">
        <template #default="{ row }">
          <div class="lotcell">
            <span class="mono">{{ row.lotCount }}</span>
            <el-button
              size="small"
              type="primary"
              plain
              :disabled="row.lotCount === 0 || !row.creationDttm || !row.operationId"
              @click="openWaferDialog(row)"
            >
              Wafer 보기
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="FAB 투입일" width="140" align="center">
        <template #default="{ row }">
          <span class="mono">{{ formatYmd(row.creationDttm)}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="전체 진행률" width="300" align="center">
        <template #default="{ row }">
          <el-progress :percentage="row.overallPct" :stroke-width="14" status="success" />
          <div class="subpct">{{ row.overallPct }}%</div>
        </template>
      </el-table-column>
      <el-table-column  label="FAB OUT 계획일" width="140" align="center">
        <template #default="{ row }">
          <span class="mono">{{ formatYmd(row.wantedFabFinishDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="현재공정" width="280" align="left">
        <template #default="{ row }">
          <div v-if="row.lotCount === 0">-</div>
          <div v-else class="curwrap">
            <el-tag size="small" type="info">FAB</el-tag>
            <span class="mono">{{ row.currentStepLabel || "-" }}</span>
          </div>
        </template>
      </el-table-column>

      

      <el-table-column label="WHC" width="180" align="center">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            plain
            :disabled="row.lotCount === 0"
            @click="openWhcDialog(row)"
          >
            WHC공정 보기
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="waferDialogOpen" title="Wafer 목록" width="640px">
  <div v-loading="waferLoading" class="wafer-dialog">
    <div class="mono mb10 dialog-top">
      <div>
        MATERIAL_ID: {{ waferMaterialId }} / PACKAGE: {{ waferPackageType }}
      </div>
      <div class="rowcount">
        총 {{ waferRows.length }} 건
      </div>
    </div>

    <el-table :data="waferRows" border size="small" height="360">
      <el-table-column type="index" label="No" width="80" align="center" />
      <el-table-column prop="lotId" label="LOT ID" width="200" align="center" />
      <el-table-column prop="operationId" label="Operation ID" width="200" align="center" />
    </el-table>
  </div>

  <template #footer>
    <el-button @click="waferDialogOpen = false">닫기</el-button>
  </template>
  </el-dialog>
  <el-dialog v-model="whcDialogOpen" title="WHC 공정(Transit LOT)" width="1000px">
  <div v-loading="whcLoading" class="whc-dialog">
    <div class="mono mb10 dialog-top">
      <div>
        MATERIAL_ID: {{ whcMaterialId }} / PACKAGE: {{ whcPackageType }}
      </div>
      <div class="rowcount">
        총 {{ whcLots.length }} 건
      </div>
    </div>

    <el-table :data="whcLots" border size="small" height="520">
      <el-table-column type="index" label="No" width="50" align="center" />
      <el-table-column prop="lotId" label="LOT ID" width="120" align="center"/>
      <el-table-column prop="siteInDate" label="WHC 입고" width="150" align="center">
        <template #default="{ row }">
            <span class="mono">{{ formatYmdHm(row.whcArrivedAt)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastDoneOp" label="마지막 완료공정" width="250" align="center"/>
      <el-table-column prop="lastDoneAt" label="완료시간" width="150" align="center">
        <template #default="{ row }">
          <span class="mono">{{ formatYmdHm(row.lastDoneAt)}}</span>
        </template>
     </el-table-column>
      <el-table-column prop="currentOp" label="현재 공정(위치)" width="250" align="center"/>
    </el-table>
  </div>

   <template #footer>
     <el-button @click="whcDialogOpen = false">닫기</el-button>
   </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import type { FabMonitorRow } from "../../../../interface/fab-application-rev2";
import { getTransitLotsByMaterial } from "../../../../utils/Fab/fab-application-utils";
import { ElNotification, TableColumnCtx } from "element-plus";
import { getWafersByMaterial } from "../../../../utils/Fab/fab-application-utils";
import { sendingPostRequestByOptions } from "../../../../utils/httpProtocol";
const props = defineProps<{
  fabApp: FabMonitorRow[];
  packageType: "CSP" | "WLP" | "MODULE" | "ETC";
}>();

onMounted(() => {
  // console.log('props.fabApp',props.fabApp)
});
const waferDialogOpen = ref(false);
const waferLoading = ref(false);
const waferMaterialId = ref<string>("");
const waferPackageType = ref<"CSP" | "WLP" | "MODULE" | "ETC">("CSP");
const waferRows = ref<WaferRow[]>([]);

const mesFabOutMap = ref<Map<string, string>>(new Map());

const whcDialogOpen = ref(false);
const whcLoading = ref(false);
const whcMaterialId = ref<string>("");
const whcPackageType = ref<"CSP" | "WLP" | "MODULE" | "ETC">("CSP");
const whcLots = ref<WhcLotRow[]>([]);


/** =========================
 *  ModelRow
 * ========================= */
type ModelRow = {
  productName: string;
  priorityId?: string;
  designer?: string | null;
  lotCount: number;
  wantedFabFinishDate: string | null;
  overallPct: number;
  currentStepLabel: string;
  creationDttm?: string | null;
  operationId?: string | null;
  rowKey: string;
};

type FabPlanRow = {
  pmname: string; // product name
  ptype2: string; // package type
  pcnt: string;  // quantity 
  psdt: string;  // start date "YYYY-MM-DD"
  pedt: string;  // end date "YYYY-MM-DD"
};

type WaferRow = {
  lotId: string;
  materialId: string;
  creationDttm: string | null;
  operationId: string | null;
};

type MesOp = {
  site_id?: string;
  operation_id?: string;
  name?: string;
};

type MesLot = {
  lotId: string;
  siteInDate: string | null;
  moveinDate?: string | null;
  operation?: MesOp | null;
  child?: MesLot | null;
};

type WhcLotRow = {
  lotId: string;
  whcArrivedAt: string | null;
  lastDoneOp: string | null;
  lastDoneAt: string | null;
  currentOp: string | null;
};

type MesLotWlp = {
  lotId: string;
  originalLotId?: string | null;

  siteInDate?: string | null;
  moveinDate?: string | null;
  startDate?: string | null;

  lotStatus?: string | null;   // RUN/WAIT
  deleteFlag?: string | null;  // "Y" or " "

  operation?: MesOp | null;
};

/** =========================
 *  Search/Filter UI
 * ========================= */
const searchTerm = ref("");
const searchCategory = ref<"productName" | "priorityId">("productName");
const onlyRunning = ref(true);
function handleClear() {
  searchTerm.value = "";
}

const filteredRows = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  let base = modelRows.value;

  if (term) {
    base = base.filter((r) => {
      if (searchCategory.value === "productName") return r.productName.toLowerCase().includes(term);
      if (searchCategory.value === "priorityId") return String(r.priorityId ?? "").includes(term);
      return true;
    });
  }
  if (onlyRunning.value) {
    base = base.filter((r) => r.overallPct < 100);
  }
  return base;
});

/** =========================
 *  Helpers
 * ========================= */
function clampPct(x: number) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, x));
}
function roundPct(x: number) {
  return Math.round(clampPct(x));
}
function formatYmd(v?: string | number | null) {
  if (v === null || v === undefined || v === "") return "-";

  const s = String(v).trim();

  // ✅ 14자리/8자리 숫자: YYYYMMDDhhmmss / YYYYMMDD
  if (/^\d{14}$/.test(s) || /^\d{8}$/.test(s)) {
    const y = s.slice(0, 4);
    const m = s.slice(4, 6);
    const d = s.slice(6, 8);
    return `${y}-${m}-${d}`;
  }

  // ✅ "YYYY-MM-DD ..." / "YYYY/MM/DD ..." / "YYYY.MM.DD ..."
  const m = s.match(/^(\d{4})[-/.](\d{2})[-/.](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  // fallback: Date 파싱 가능하면 사용
  const dt = new Date(s);
  if (!Number.isNaN(dt.getTime())) {
    const y = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }

  return s;
}
//다이얼로그 날짜표시용
function formatYmdHm(v?: string | null) {
  if (!v) return "-";
  const dt = new Date(v);
  if (Number.isNaN(dt.getTime())) return String(v);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}
function toTime(v?: string | null) {
  if (!v) return NaN;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? NaN : t;
}
// 정렬용 
function eventTime(x: MesLotWlp) {
  return (
    toTime(x.moveinDate ?? null) ||
    toTime(x.startDate ?? null) ||
    toTime(x.siteInDate ?? null)
  );
}

function pickEarliest(values: Array<string | null | undefined>) {
  let best: string | null = null;
  let bestT = Infinity;
  for (const v of values) {
    const t = toTime(v ?? null);
    if (!Number.isNaN(t) && t < bestT) {
      bestT = t;
      best = v ?? null;
    }
  }
  return best;
}

const rowSpanByIndex = computed(() => {
  const rows = filteredRows.value;
  const spanArr = new Array<number>(rows.length).fill(1);
  let i = 0;
  while (i < rows.length) {
    const curPn = rows[i].productName;
    let j = i + 1;

    while (j < rows.length && rows[j].productName === curPn) {
      j++;
    }
    const groupLen = j - i;
    // 첫 행만 rowspan = groupLen, 나머지는 0 처리
    spanArr[i] = groupLen;
    for (let k = i + 1; k < j; k++) spanArr[k] = 0;
    i = j;
  }

  return spanArr;
});

// ✅ 실제 span-method
function spanMethod(params: {
  row: ModelRow;
  column: TableColumnCtx<ModelRow>;
  rowIndex: number;
  columnIndex: number;
}) {
  const { column, rowIndex } = params;

  // 병합할 컬럼들만 지정
  const mergeProps = new Set(["productName", "designer", "priorityId"]);
  if (!mergeProps.has(String(column.property ?? ""))) {
    return { rowspan: 1, colspan: 1 };
  }

  const rowspan = rowSpanByIndex.value[rowIndex] ?? 1;
  // 그룹의 첫 행이 아니면 숨김 처리
  if (rowspan === 0) {
    return { rowspan: 0, colspan: 0 };
  }
  return { rowspan, colspan: 1 };
}


function priorityRank(p?: string | number | null) {
  const s = String(p ?? "").trim().toUpperCase();
  // ✅ S, A, B, C 순 (S가 제일 높음)
  const map: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
  return map[s] ?? 0; // 알 수 없으면 가장 낮게
}

const modelRows = computed<ModelRow[]>(() => {
  const out: ModelRow[] = [];
  (props.fabApp ?? []).forEach((app: any, appIdx: number) => {
    const pn = String(app.productName ?? "");
    if (!pn) return;
    const designerName =
      typeof app.designer === "string"
        ? app.designer
        : app.designer?.userName ?? null;
    const priorityId = app?.priorityId ?? null;
    const list = (app.progressList ?? []) as any[];

    list.forEach((mes: any, idx: number) => {
      const overallPct = roundPct(Number(mes?.progress ?? 0));
      const lotCount = Number(mes?.lotNum ?? 0);
      const psdt = formatYmd(mes?.creationDttm ?? "");
      const key = planKey(pn, psdt);
      const mesPedt = mesFabOutMap.value.get(key) ?? null;
      const wantedFabFinishDate = mesPedt ?? (app?.wantedFabFinishDate ?? null);
      const currentStepLabel = mes?.operationName ? `${mes.operationName}` : "-";
      const creationDttm = mes?.creationDttm ?? null;
      const operationId = mes?.operationId ?? null; 

      out.push({
        productName: pn,
        priorityId: priorityId,
        designer: designerName,
        operationId: operationId,
        lotCount,
        wantedFabFinishDate: wantedFabFinishDate,
        overallPct: overallPct,
        currentStepLabel: currentStepLabel,
        creationDttm: creationDttm,
        // ✅ key: MATERIAL_ID + CREATION + OP
        rowKey: `${pn}_${mes?.creationDttm ?? "null"}_${mes?.operationId ?? "null"}`,
      });
    });
  });
  
  // 정렬: priority desc, productName, creation asc(원하면 desc로), operationName asc
  return out.sort((a, b) => {
    const p = priorityRank(b.priorityId) - priorityRank(a.priorityId);
    if (p !== 0) return p;
    
    const ta = String(a.creationDttm ?? "");
    const tb = String(b.creationDttm ?? "");
    if (ta !== tb) return ta.localeCompare(tb);
    
    const pn = String(a.productName ?? "").localeCompare(String(b.productName ?? ""));
    if (pn !== 0) return pn;


    return String(a.currentStepLabel ?? "").localeCompare(String(b.currentStepLabel ?? ""));
  });
});

function planKey(pmname: string, psdt: string) {
  return `${String(pmname).trim()}|${String(psdt).trim()}`;
}

function pickLaterYmd(a?: string, b?: string) {
  if (!a) return b ?? "";
  if (!b) return a;
  return a >= b ? a : b; // YYYY-MM-DD는 문자열 비교로도 OK
}

async function loadMesFabOutPlanDates() {
  const times: number[] = [];
  
  for (const row of props.fabApp ?? []) {
    // ✅ 1순위: MES의 실제 투입일(creationDttm)
    const ymd =
      formatYmd((row as any)?.mes?.creationDttm ?? "") !== "-"
        ? formatYmd((row as any)?.mes?.creationDttm ?? "")
        : formatYmd(row.wantedFabStartDate ?? ""); // (선택) fallback

    if (!ymd || ymd === "-") continue;

    const t = new Date(ymd).getTime();
    if (!Number.isNaN(t)) times.push(t);
  }

  if (times.length === 0) {
    mesFabOutMap.value = new Map();
    return;
  }

  const minDate = new Date(Math.min(...times));
  const maxDate = new Date(Math.max(...times));

  const form = new FormData();
  form.append("date_of_start", formatYmd(minDate.toString())); // "YYYY-MM-DD"
  form.append("date_of_end", formatYmd(maxDate.toString()));

  try {
    const list: FabPlanRow[] = await sendingPostRequestByOptions(
      "/api/fabplans",
      form,
      { contentType: "application/json" }
    );
    console.log(
  "[fabplans] TX787AQX005D only",
  (list ?? []).filter((r: any) => String(r?.pmname ?? "").trim() === "TX787AQX005D")
);
    const map = new Map<string, string>();
    for (const r of list ?? []) {
      const key = planKey(r.pmname,formatYmd(r.psdt));
      const prev = map.get(key);
      map.set(key, pickLaterYmd(prev, r.pedt)); // pedt 최신값 채택
    }
    mesFabOutMap.value = map;

  } catch (e) {
    console.error(e);
    mesFabOutMap.value = new Map();
    ElNotification({
      title: "MES 조회 실패",
      message: "FAB OUT 계획일(/api/fabplans) 조회 중 오류가 발생했습니다.",
      type: "error",
    });
  } finally {
  }
}

watch(
  () => props.fabApp,
  () => loadMesFabOutPlanDates(),
  { immediate: true, deep: true }
);

async function openWaferDialog(row: ModelRow) {
  waferMaterialId.value = row.productName;
  waferPackageType.value = props.packageType;
  waferDialogOpen.value = true;
  waferLoading.value = true;
  waferRows.value = [];

  try {
    const data = await getWafersByMaterial({
      materialId: row.productName,
      creation_dttm: String(row.creationDttm ?? ""),
      operation_id: String(row.operationId ?? ""),
      packageType: props.packageType,
    });

    waferRows.value = Array.isArray(data) ? (data as WaferRow[]) : [];
  } catch (e) {
    console.error(e);
    ElNotification({
      title: "조회 실패",
      message: "Wafer 목록 조회 중 오류가 발생했습니다.",
      type: "error",
    });
  } finally {
    waferLoading.value = false;
  }
}

async function openWhcDialog(row: any) {
  whcMaterialId.value = row.productName; // (= MATERIAL_ID)
  whcPackageType.value = props.packageType; // 탭 기준(=CSP/WLP)
  whcDialogOpen.value = true;
  whcLoading.value = true;
  whcLots.value = [];

  try {
    const lots = await getTransitLotsByMaterial({
      materialId: whcMaterialId.value,
      packageType: whcPackageType.value,
      firstHistory: false,
      prevHistory: false,
    });

    // ✅ CSP 먼저 적용
    if (whcPackageType.value === "CSP") {
      whcLots.value = (lots ?? []).map((x: any) => mapCspLotToWhcRow(x as MesLot));
    } 
    if (whcPackageType.value === "WLP") {
      whcLots.value = mapWlpLotsToWhcRows(lots as MesLotWlp[]);
    }

  } catch (e) {
    console.error(e);
    ElNotification({
      title: "조회 실패",
      message: "Transit LOT 조회 중 오류가 발생했습니다.",
      type: "error",
    });
  } finally {
    whcLoading.value = false;
  }
}


function mapCspLotToWhcRow(root: MesLot): WhcLotRow {
  let parent: MesLot | null = null;
  let node: MesLot | null = root;

  while (node?.child) {
    parent = node;
    node = node.child;
  }

  const leaf = node ?? root;

  return {
    lotId: root.lotId,
    whcArrivedAt: root.siteInDate ?? null,
    currentOp: leaf.operation?.name ?? null,
    lastDoneOp: parent?.operation?.name ?? null,
    lastDoneAt: leaf.moveinDate ?? null, // ✅ leaf movein = 전공정 완료 후 들어온 시간
  };
}


// ✅ WLP flat list -> grouped rows
 function mapWlpLotsToWhcRows(lots: MesLotWlp[]): WhcLotRow[] {
  const groups = new Map<string, MesLotWlp[]>();

  for (const x of lots ?? []) {
    const key = (x.originalLotId ?? x.lotId ?? "").trim();
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(x);
  }

  const out: WhcLotRow[] = [];

  for (const [key, arr] of groups.entries()) {
    const sorted = [...arr].sort((a, b) => eventTime(a) - eventTime(b));

    const cur = sorted[sorted.length - 1];

    // 전공정: 바로 이전부터, 같은 operation 반복이면 스킵
    let prev: MesLotWlp | null = null;
    const curOpId = cur?.operation?.operation_id ?? cur?.operation?.name ?? "";
    for (let i = sorted.length - 2; i >= 0; i--) {
      const opId = sorted[i]?.operation?.operation_id ?? sorted[i]?.operation?.name ?? "";
      if (opId && opId !== curOpId) {
        prev = sorted[i];
        break;
      }
    }

    // WHC 입고시간: 그룹 내 site_in_date 중 earliest
    // (원하면 WH* site_id만 대상으로 좁힐 수도 있음)
    const whcArrivedAt = pickEarliest(sorted.map(r => r.siteInDate ?? null));

    out.push({
      // LOT ID: “현재 레코드의 lot_id”가 화면에서 의미가 가장 큼
      lotId: cur?.lotId ?? key,
      whcArrivedAt,
      currentOp: cur?.operation?.name ?? null,
      lastDoneOp: prev?.operation?.name ?? null,
      lastDoneAt: cur?.moveinDate ?? cur?.startDate ?? null,
    });
  }

  return out;
}

</script>

<style lang="scss" scoped>
.table-wrapper { max-width: 100%; }

.toolbar {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left { display: flex; align-items: center; gap: 10px; }
}

.subpct {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.curwrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.custom-table ::v-deep(.el-table__header-wrapper th) {
  font-weight: bold;
  font-size: 14px;
  background-color: #f3f4f6;
  color: #111827;
  text-align: center;
  border-bottom: 2px solid #d1d5db;
}

.custom-table ::v-deep(.el-table__cell) {
  font-size: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.whc-dialog {
  font-size: 14px;               
}

.whc-dialog .mono {
  font-size: 13px;                
}

.dialog-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.rowcount {
  font-weight: 700;
}

.whc-dialog ::v-deep(.el-table__cell) {
  font-size: 13px;
}

.whc-dialog ::v-deep(.el-table__header-wrapper th) {
  font-size: 14px;
  font-weight: 700;
}

.whc-dialog ::v-deep(.el-button) {
  font-size: 13px;
}

.lotcell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: nowrap;
}
</style>
