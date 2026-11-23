<template>
  <!-- WJC 사용자: 메인 화면만 일본어 (달력 월/요일 등 Element Plus 기본 문구 포함). 그 외는 상위 설정 그대로 -->
  <el-config-provider :locale="isJa ? jaLocale : undefined">
  <div class="dev-dash">
    <!-- 윗줄: 왼쪽(사용자 정보+바로가기) 높이에 오른쪽(요약+My Form List)을 맞춘다 → 빈칸 없음 -->
    <el-row :gutter="20" class="top-row mgb20">
      <!-- 왼쪽: 사용자 정보 + 바로가기 -->
      <el-col :span="7" class="left-col">
        <el-card shadow="hover" class="mgb20">
          <div class="user-info">
            <el-avatar :size="90" :src="imgurl" />
            <div class="user-info-cont">
              <div class="user-info-name">{{ userName }}</div>
              <div>{{ department || "RF개발팀" }}</div>
            </div>
          </div>
          <div class="user-info-list">
            {{ t("접속 시간") }}
            <span>{{ currentDateTime }}</span>
          </div>
        </el-card>

        <el-card shadow="hover" class="fill-card">
          <template #header><span class="card-title">{{ t("바로가기") }}</span></template>
          <div class="create-state">
            {{ t("샘플 의뢰서 작성") }}
            <el-tag v-if="canCreate === true" type="success" size="small">{{ t("지금 작성 가능") }}</el-tag>
            <el-tag v-else-if="canCreate === false" type="info" size="small">{{ t("작성 기간 아님") }}</el-tag>
          </div>
          <div class="quick-links">
            <el-button type="primary" @click="go('FabApplication2')">{{ t("샘플 의뢰서 작성") }}</el-button>
            <!-- 내 의뢰서 목록(PDT/TEG): 왼쪽 메뉴에 없고 메인 바로가기로만 들어가는 화면 (기존 메인의 "작성된 의뢰 항목") -->
            <el-button v-if="canOpenMyApplications" @click="go('MyApplications')">{{ t("작성된 의뢰 항목 (TEG/PDT)") }}</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 오른쪽: 내 진행 현황 + My Form List -->
      <el-col :span="17" class="right-col">
        <div class="right-inner">
        <el-card shadow="hover" class="mgb20" :body-style="{ padding: '12px 20px' }">
          <!-- P/N 기준 (가장 덜 진행된 LOT 의 단계) -->
          <div class="stat-grid">
            <div class="stat">
              <div class="stat-num c-gray">{{ stats.waiting }}</div>
              <div class="stat-label">{{ t("투입 대기") }}</div>
            </div>
            <div class="stat">
              <div class="stat-num c-blue">{{ stats.fab }}</div>
              <div class="stat-label">FAB</div>
            </div>
            <div class="stat">
              <div class="stat-num c-purple">{{ stats.hq }}</div>
              <div class="stat-label">{{ t("HQ·출하") }}</div>
            </div>
            <div class="stat">
              <div class="stat-num c-orange">{{ stats.whc }}</div>
              <div class="stat-label">WHC</div>
            </div>
            <div class="stat">
              <div class="stat-num c-green">{{ stats.done }}</div>
              <div class="stat-label">{{ t("WHC 입고") }}</div>
            </div>
            <div class="stat">
              <div class="stat-num">{{ myForms.length }}</div>
              <div class="stat-label">{{ t("작성한 의뢰서") }}</div>
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="fill-card">
          <template #header>
            <div class="card-head">
              <span class="card-title">{{ t("My Form List") }} <small>{{ t("(최근 작성/수정 순)") }}</small></span>
              <el-button link type="primary" @click="go('FabApplicationListRev2')">{{ t("전체 보기 ›") }}</el-button>
            </div>
          </template>
          <el-table
            :data="myForms"
            v-loading="formLoading"
            height="100%"
            size="small"
            border
            :empty-text="t('작성한 의뢰서가 없습니다')"
            @row-click="openApp"
            class="click-rows"
          >
            <el-table-column prop="productName" :label="t('Product Name')" width="150" align="center" />
            <el-table-column prop="packageId" :label="t('패키지')" width="90" align="center" />
            <el-table-column prop="note" :label="t('용도')" min-width="200" align="center" show-overflow-tooltip />
            <el-table-column prop="quantity" :label="t('매수')" width="60" align="center" />
            <el-table-column :label="t('생성일')" width="100" align="center">
              <template #default="{ row }">{{ formatDate(row.createdDate) }}</template>
            </el-table-column>
            <el-table-column :label="t('수정일')" width="150" align="center">
              <template #default="{ row }">
                <span v-if="row.updatedDate" class="updated">{{ formatDate(row.updatedDate) }}</span>
                <span v-else class="muted">-</span>
                <!-- 수정자 MES: 마우스를 대면 MES 가 바꾼 내용 표시 -->
                <span v-if="row.updaterId === 'MES' || row.updater?.id === 'MES'" class="mes-mark" @click.stop>
                  <MesChangeBadge :product-name="row.productName" :translate="true" />
                </span>
              </template>
            </el-table-column>
            <!-- 핵심 동작: 여기서 측정 의뢰서(TEG/WHC/PDT/CSP/Fab Card)를 입력 → 크게, 눈에 띄게 -->
            <el-table-column :label="t('의뢰서 입력')" width="150" align="center" fixed="right" class-name="form-col">
              <template #default="{ row }">
                <el-button type="primary" class="form-btn" @click.stop="openFormDialog(row)">
                  <el-icon class="form-btn-icon"><EditPen /></el-icon>{{ t("의뢰서 입력") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <ApplicationLinksDialog v-model:visible="formDialogVisible" :fabApplication="selectedForm" :translate="true" />
        </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- 내 샘플 모니터: Sample Monitor 화면의 표를 그대로 사용 (본인 샘플만). 표 안에서 가로 스크롤 -->
    <el-card shadow="hover" class="mgb20">
      <template #header>
        <div class="card-head">
          <span class="card-title">{{ t("내 샘플 모니터") }} <small>{{ t("(투입계획 최근 180일 · 표를 좌우로 스크롤)") }}</small></span>
          <el-button link type="primary" @click="go('FabApplicationList3')">{{ t("전체 보기 ›") }}</el-button>
        </div>
      </template>
      <el-tabs v-model="monitorTab" type="border-card" v-loading="sampleLoading">
        <el-tab-pane :label="`CSP (${cspApps.length})`" name="csp">
          <ApplicationMonitorByPackage
            :fabApp="cspApps"
            stateKey="dash_csp"
            :lotProgress="lotProgress"
            :lotProgressState="progressState"
            :fixedHeight="520"
            :translate="true"
          />
        </el-tab-pane>
        <el-tab-pane :label="`WLP(BDMP) (${wlpApps.length})`" name="wlp">
          <ApplicationMonitorByPackage
            :fabApp="wlpApps"
            :isWlp="true"
            stateKey="dash_wlp"
            :lotProgress="lotProgress"
            :lotProgressState="progressState"
            :fixedHeight="520"
            :translate="true"
          />
        </el-tab-pane>
        <el-tab-pane :label="`${t('개발전달')} (${etcApps.length})`" name="etc">
          <ApplicationMonitorByPackage
            :fabApp="etcApps"
            stateKey="dash_etc"
            :lotProgress="lotProgress"
            :lotProgressState="progressState"
            :fixedHeight="520"
            :translate="true"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 달력: 내 샘플 일정 -->
    <el-card shadow="hover">
      <template #header>
        <div class="card-head">
          <span class="card-title">{{ t("내 샘플 일정") }}</span>
          <span class="legend">
            <i class="dot ev-plan"></i>{{ t("투입 계획") }}
            <i class="dot ev-in"></i>{{ t("FAB 투입") }}
            <i class="dot ev-outplan"></i>{{ t("OUT 계획") }}
            <i class="dot ev-out"></i>FAB OUT
            <i class="dot ev-whc"></i>{{ t("WHC 도착") }}
            <span class="legend-holiday">{{ isJa ? "赤字 = 韓国の祝日" : "빨간 글씨 = 공휴일" }}</span>
          </span>
        </div>
      </template>
      <el-calendar v-model="calDate">
        <template #date-cell="{ data }">
          <!-- 한국 공휴일: 날짜 빨간색 + 이름 (WJC 사용자는 일본어 이름, 마우스를 대면 "韓国の祝日") -->
          <div class="cal-day" :class="{ holiday: KOREAN_HOLIDAYS[data.day] }">
            {{ data.date.getDate() }}
            <span
              v-if="KOREAN_HOLIDAYS[data.day]"
              class="holiday-name"
              :title="isJa ? `韓国の祝日: ${KOREAN_HOLIDAYS[data.day].ja}` : KOREAN_HOLIDAYS[data.day].ko"
            >{{ isJa ? `${KOREAN_HOLIDAYS[data.day].ja}(韓国)` : KOREAN_HOLIDAYS[data.day].ko }}</span>
          </div>
          <div class="cal-events">
            <div
              v-for="(ev, i) in events[data.day] || []"
              :key="i"
              class="cal-ev"
              :class="ev.kind"
              :title="`${t(ev.label)} · ${ev.productName}`"
            >
              {{ ev.productName }}
            </div>
          </div>
        </template>
      </el-calendar>
    </el-card>
  </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, onDeactivated, ref } from "vue";
import { useRouter } from "vue-router";
import imgurl from "../../assets/img/img.jpg";
import ApplicationLinksDialog from "../FAB/ApplicationList/ApplicationLinksDialog.vue";
import MesChangeBadge from "../FAB/Common/MesChangeBadge.vue";
import ApplicationMonitorByPackage from "../FAB/ApplicationList/rev2/ApplicationMonitorByPackage.vue";
import { FabRequest } from "../../interface/fab-application-rev2";
import { getAppByPackageType } from "../../utils/Fab/fab-application-monitor";
import { useSessionRef } from "../../utils/session-state";
import { usePermissStore } from "../../store/permiss";
import { getUserId, getUserName, getDepartment } from "../../utils/account-utils";
import { t, isJapaneseUser } from "../../utils/i18n";
import jaLocale from "element-plus/es/locale/lang/ja";
import { KOREAN_HOLIDAYS } from "../../utils/korean-holidays";

const isJa = isJapaneseUser();
import { formatDate } from "../../utils/date-utils";
import {
  canCreateFabRequest,
  getApplicationListByDict,
  getApplicationListByDictRev2,
  getLotProgressByProductNames,
  type LotProgress,
} from "../../utils/Fab/fab-application-utils";

const router = useRouter();
const userName = getUserName();
const department = getDepartment();
const userId = getUserId();

// ── 접속 시간 ─────────────────────────────
const currentDateTime = ref("");
let timer: number | undefined;
function tick() {
  const n = new Date();
  const p = (v: number) => String(v).padStart(2, "0");
  const h = n.getHours();
  currentDateTime.value = `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} ${p(h % 12 || 12)}:${p(
    n.getMinutes()
  )}:${p(n.getSeconds())} ${h >= 12 ? "PM" : "AM"}`;
}

function go(name: string) {
  router.push({ name });
}
function openApp(row: any) {
  if (row?.productName) router.push({ name: "LoadApplication2", params: { productName: row.productName } });
}

// ── 의뢰서 작성 가능 여부 ───────────────────
const canCreate = ref<boolean | null>(null);

// "내 의뢰서 목록" 화면 권한(ms_keys "2"): 없으면 버튼을 숨겨 403 화면으로 가지 않게 함
const canOpenMyApplications = usePermissStore().key.includes("2");

// ── 내 샘플 모니터 (Sample Monitor 와 같은 조회 조건 + 본인 기준) ──
const myApps = ref<any[]>([]);
const sampleLoading = ref(true);
const lotProgress = ref<Record<string, LotProgress>>({});
const progressState = ref<"loading" | "done" | "failed">("loading");
const monitorTab = useSessionRef<string>("dev_dashboard:monitor_tab", "csp");

const monitorApps = computed(() => myApps.value.map((item) => new FabRequest(item)));
const cspApps = computed(() => getAppByPackageType(monitorApps.value, ["CSP"], ["WHC"]));
const wlpApps = computed(() => getAppByPackageType(monitorApps.value, ["WLP", "BDMP"], ["WHC"]));
const etcApps = computed(() => getAppByPackageType(monitorApps.value, ["CSP", "WLP", "BDMP"], ["개발전달"]));

function ymd(d: Date) {
  return formatDate(d.toISOString());
}

async function loadSamples() {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 180);
  const to = new Date(today);
  to.setMonth(to.getMonth() + 1);
  try {
    myApps.value = await getApplicationListByDictRev2({
      users: true,
      wafer: true,
      idt_type: true,
      hs_type: true,
      idt_layers: false,
      lot_status: true,
      is_pending: false,
      is_active: true,
      order_by: "wanted_fab_start_date",
      order_dir: "desc",
      wanted_fab_start_date_start: `${ymd(from)}T00:00:00`,
      wanted_fab_start_date_end: `${ymd(to)}T23:59:59`,
      observer_id: userId, // 항상 본인 기준 (전체 조회 권한과 무관)
    });
  } catch (e) {
    console.error("내 샘플 조회 실패:", e);
  } finally {
    sampleLoading.value = false;
  }

  const names = myApps.value.map((a) => a.productName).filter(Boolean);
  if (names.length === 0) {
    progressState.value = "done";
    return;
  }
  try {
    lotProgress.value = await getLotProgressByProductNames(names);
    progressState.value = "done";
  } catch (e) {
    console.error("FAB 진행률 조회 실패:", e);
    progressState.value = "failed";
  }
}

/**
 * 요약용 LOT 단계
 *  0 투입 대기 → 1 FAB → 2 HQ 후공정(FAB OUT 후) → 3 출하 이동(Transit) → 4 WHC 공정 → 5 WHC 입고(Stock in RND)
 */
function lotStage(lot: any): number {
  const whcRoot = lot?.hanoiCsp ?? lot?.hanoiWlp ?? null;
  if (whcRoot) {
    let node = whcRoot;
    while (node?.child) node = node.child;
    return lot?.hanoiCsp && node?.operation?.name === "Stock in RND" ? 5 : 4;
  }
  if (lot?.operation?.operationId === "TRANSIT") return 3;
  if (lot?.fabOutHistory != null) return 2;
  return 1;
}

const stats = computed(() => {
  const s = { waiting: 0, fab: 0, hq: 0, whc: 0, done: 0 };
  for (const app of myApps.value) {
    const lots: any[] = app.lotStatus ?? [];
    const stage = lots.length === 0 ? 0 : Math.min(...lots.map(lotStage));
    if (stage === 0) s.waiting++;
    else if (stage === 1) s.fab++;
    else if (stage === 2 || stage === 3) s.hq++;
    else if (stage === 4) s.whc++;
    else s.done++;
  }
  return s;
});

// ── My Form List ───────────────────────────
const myForms = ref<any[]>([]);
const formLoading = ref(true);
const formDialogVisible = ref(false);
const selectedForm = ref<any>({});
function openFormDialog(row: any) {
  selectedForm.value = row;
  formDialogVisible.value = true;
}

async function loadForms() {
  try {
    const data = await getApplicationListByDict({
      users: "True",
      wafer: "True",
      idt_type: "False",
      hs_type: "True",
      idt_layers: "False",
      order_by: "created_date",
      order_dir: "desc",
      observer_id: userId, // 항상 본인 기준
    });
    // 생성일/수정일 중 최신 시각 순 (재투입·수정된 의뢰서가 위로)
    const lastModified = (a: any) =>
      Math.max(a.createdDate ? new Date(a.createdDate).getTime() : 0, a.updatedDate ? new Date(a.updatedDate).getTime() : 0);
    myForms.value = [...(data ?? [])].sort((a, b) => lastModified(b) - lastModified(a));
  } catch (e) {
    console.error("My Form List 조회 실패:", e);
  } finally {
    formLoading.value = false;
  }
}

// 홈 버튼 / 다른 화면 이동 시: 열려 있던 의뢰서 팝업을 닫아 덮개가 남지 않게 한다
function onGoHome() {
  formDialogVisible.value = false;
}
window.addEventListener("go-home", onGoHome);
onBeforeUnmount(() => window.removeEventListener("go-home", onGoHome));
onDeactivated(() => (formDialogVisible.value = false));

// ── 달력 ───────────────────────────────────
const calDate = ref(new Date());
type CalEvent = { kind: string; label: string; productName: string };

const events = computed(() => {
  const map: Record<string, CalEvent[]> = {};
  const seen = new Set<string>(); // 같은 날 같은 P/N 같은 종류는 한 번만 (LOT 이 여러 개여도)
  const add = (date: string | undefined | null, kind: string, label: string, productName: string) => {
    if (!date) return;
    const key = formatDate(date);
    if (!key) return;
    const id = `${key}|${kind}|${productName}`;
    if (seen.has(id)) return;
    seen.add(id);
    (map[key] ||= []).push({ kind, label, productName });
  };
  for (const app of myApps.value) {
    const pn = app.productName ?? "-";
    const lots: any[] = app.lotStatus ?? [];
    if (lots.length === 0) add(app.wantedFabStartDate, "ev-plan", "투입 계획", pn);
    for (const lot of lots) {
      add(lot.creationDate, "ev-in", "FAB 투입", pn);
      if (lot.fabOutHistory?.endDate) add(lot.fabOutHistory.endDate, "ev-out", "FAB OUT", pn);
      const whcRoot = lot.hanoiCsp ?? lot.hanoiWlp;
      if (whcRoot?.creationDate) add(whcRoot.creationDate, "ev-whc", "WHC 도착", pn);
    }
    const allOut = lots.length > 0 && lots.every((l) => l.fabOutHistory?.endDate);
    if (!allOut) add(app.wantedFabFinishDate, "ev-outplan", "FAB OUT 계획", pn);
  }
  return map;
});

onMounted(() => {
  tick();
  timer = window.setInterval(tick, 1000);
  canCreateFabRequest()
    .then((v: any) => (canCreate.value = v === true))
    .catch(() => (canCreate.value = null));
  loadSamples();
  loadForms();
});
onBeforeUnmount(() => window.clearInterval(timer));
</script>

<style scoped>
.mgb20 {
  margin-bottom: 20px;
}

/* 윗줄 높이 맞춤
   - 왼쪽 열이 줄 높이를 정하고, 바로가기 카드가 남은 높이를 채움
   - 오른쪽 열은 그 높이 안에 들어가도록 고정, My Form List 표가 남은 높이를 채움(표 안에서 스크롤) */
.top-row {
  align-items: stretch;
  min-height: 540px; /* 윗줄 높이 확보 → 바로가기/My Form List 가 아래로 늘어남 (모든 사용자 공통) */
}
.left-col {
  display: flex;
  flex-direction: column;
}
.right-col {
  position: relative;
}
.right-inner {
  position: absolute;
  inset: 0 10px; /* gutter 20 의 좌우 padding 만큼 */
  display: flex;
  flex-direction: column;
}
.fill-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.fill-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
}
.card-title {
  font-weight: 600;
  font-size: 15px;
}
.card-title small {
  font-weight: 400;
  color: #999;
  margin-left: 4px;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 사용자 정보 (기존 메인 화면과 동일한 형태) */
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 16px;
}
.user-info-cont {
  padding-left: 30px;
  flex: 1;
  font-size: 14px;
  color: #999;
}
.user-info-name {
  font-size: 26px;
  color: #222;
}
.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}
.user-info-list span {
  margin-left: 40px;
}

/* 요약 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}
.stat {
  text-align: center;
  padding: 8px 0;
  background: #f7f8fa;
  border-radius: 6px;
}
.stat-num {
  font-size: 24px;
  font-weight: bold;
}
.stat-label {
  font-size: 13px;
  color: #888;
}
.c-blue {
  color: rgb(45, 140, 240);
}
.c-green {
  color: rgb(70, 180, 90);
}
.c-gray {
  color: #909399;
}
.c-orange {
  color: #e6a23c;
}
.c-purple {
  color: #8e6bd8;
}

/* 바로가기 */
.create-state {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.quick-links .el-button {
  margin-left: 0;
  width: 100%;
}

.click-rows :deep(tbody tr) {
  cursor: pointer;
}

/* My Form List: 의뢰서 입력 열 강조 */
.click-rows :deep(th.form-col) {
  background: #ecf5ff;
  color: var(--el-color-primary);
  font-weight: 700;
}
.click-rows :deep(td.form-col) {
  background: #f5f9ff;
}
.form-btn {
  width: 124px;
  height: 28px;
  font-weight: 600;
}
.form-btn-icon {
  margin-right: 4px;
}
.muted {
  color: var(--el-text-color-placeholder);
}
.updated {
  color: var(--el-color-warning);
  font-weight: 600;
}
.mes-mark {
  margin-left: 4px;
  font-size: 11px;
}

/* 달력 */
.legend {
  font-size: 12px;
  color: #666;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin: 0 4px 0 12px;
  vertical-align: -1px;
}
:deep(.el-calendar-table .el-calendar-day) {
  height: 96px;
  padding: 4px 6px;
}
.cal-day {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
}
.cal-day.holiday {
  color: #f56c6c;
  font-weight: 600;
}
.holiday-name {
  font-size: 11px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
}
.legend-holiday {
  margin-left: 14px;
  color: #f56c6c;
  font-weight: 600;
}
.cal-events {
  max-height: 64px;
  overflow-y: auto;
}
.cal-events::-webkit-scrollbar {
  width: 0;
}
.cal-ev {
  font-size: 11px;
  line-height: 16px;
  padding: 0 4px;
  margin-top: 2px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}
.ev-plan {
  background: #909399;
}
.ev-in {
  background: rgb(45, 140, 240);
}
.ev-outplan {
  background: #e6a23c;
}
.ev-out {
  background: rgb(70, 180, 90);
}
.ev-whc {
  background: #8e6bd8;
}
</style>
