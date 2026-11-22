<template>
  <div>
    <!-- 조회 기간: FAB 투입 계획일 기준 (오늘 - N일 ~ 오늘 + 1개월). 기간이 짧을수록 빠름 -->
    <div class="period-bar">
      <span class="period-label">조회 기간</span>
      <el-radio-group v-model="periodDays" size="small" :disabled="isLoading">
        <el-radio-button v-for="d in PERIOD_OPTIONS" :key="d" :label="d" :value="d">{{ d }}일</el-radio-button>
      </el-radio-group>
      <span class="period-range">{{ periodRangeText }}</span>
      <span v-if="isLoading" class="period-loading">조회 중…</span>
    </div>
    <el-tabs v-model="activeTab" type="border-card" v-loading="isLoading">
      <el-tab-pane :label="cspLabel" name="csp">
        <ApplicationMonitorByPackage :fabApp="cspApps" stateKey="csp" :lotProgress="lotProgress" :lotProgressState="lotProgressState" />
      </el-tab-pane>
      <el-tab-pane :label="wlpLabel" name="wlp">
        <ApplicationMonitorByPackage :fabApp="wlpApps" :isWlp="true" stateKey="wlp" :lotProgress="lotProgress" :lotProgressState="lotProgressState" />
      </el-tab-pane>
      <el-tab-pane :label="'개발전달'" name="etc">
        <ApplicationMonitorByPackage :fabApp="etcApps" stateKey="etc" :lotProgress="lotProgress" :lotProgressState="lotProgressState" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { FabRequest } from "../../../../interface/fab-application-rev2";
import { reactive, onMounted, ref, computed, watch } from "vue";
import {
  getApplicationListByDict,
  getApplicationListByDictRev2,
  getLotProgressByProductNames,
  type LotProgress,
} from "../../../../utils/Fab/fab-application-utils";
import { getRole, getUserId } from "../../../../utils/account-utils";
import { usePermissStore } from "../../../../store/permiss";
import ApplicationMonitorByPackage from "./ApplicationMonitorByPackage.vue";
import { useSessionRef } from "../../../../utils/session-state";
import { getAppByPackageType } from "../../../../utils/Fab/fab-application-monitor";
import { FabApplicationForm } from "../../../../interface/mes-interface";
import { getTodayDate, adjustDate } from "../../../../utils/date-utils";

const apps = reactive<FabRequest[]>([]);
const cspApps = reactive<FabRequest[]>([]);
const wlpApps = reactive<FabRequest[]>([]);
const etcApps = reactive<FabRequest[]>([]);
const cspLabel = "CSP";
const wlpLabel = "WLP(BDMP)";
// lot 별 FAB 진행률 (key = lot_id). 'loading' → 조회 중, 'failed' → 조회 실패
const lotProgress = ref<Record<string, LotProgress>>({});
const lotProgressState = ref<"loading" | "done" | "failed">("loading");

// 조회 순번: 기간을 바꿔 다시 조회하면 이전 조회의 늦게 온 결과는 버림
let loadSeq = 0;

async function loadLotProgress(productNames: string[], seq: number) {
  const t0 = performance.now();
  try {
    const result = await getLotProgressByProductNames(productNames);
    if (seq !== loadSeq) return;
    lotProgress.value = result;
    lotProgressState.value = "done";
  } catch (e) {
    if (seq !== loadSeq) return;
    console.error("FAB 진행률 조회 실패:", e);
    lotProgressState.value = "failed";
  }
  console.log(`FAB 진행률 조회: ${((performance.now() - t0) / 1000).toFixed(2)}초`);
}

// 선택한 탭은 F5 후에도 유지 (브라우저 탭을 닫으면 CSP 로 초기화)
const activeTab = useSessionRef<string>("sample_monitor:tab", "csp");

// 조회 기간 (2026-11-22): 모든 사용자 기본 60일. 선택은 F5 후에도 유지
// 측정(전체 조회 권한 기준): 60일 약 7초 / 120일 약 13초 / 180일 약 12초 (180일 = 예전 고정값)
const PERIOD_OPTIONS = [60, 120, 180];
const defaultPeriod = 60;
const periodDays = useSessionRef<number>("sample_monitor:period_days", defaultPeriod);
if (!PERIOD_OPTIONS.includes(periodDays.value)) periodDays.value = defaultPeriod;
const isLoading = ref(false);

function ymdOffset(base: string, days: number, months = 0): string {
  const d = new Date(`${base}T00:00:00`);
  d.setDate(d.getDate() + days);
  d.setMonth(d.getMonth() + months);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const periodRangeText = computed(() => {
  const today = getTodayDate();
  return `FAB 투입 계획일 ${ymdOffset(today, -periodDays.value)} ~ ${ymdOffset(today, 0, 1)}`;
});

onMounted(() => loadApps());
watch(periodDays, () => loadApps());

async function loadApps() {
  const seq = ++loadSeq;
  isLoading.value = true;
  // 기간을 바꿔 다시 조회할 때 이전 결과 비우기
  apps.length = 0;
  cspApps.length = 0;
  wlpApps.length = 0;
  etcApps.length = 0;
  lotProgress.value = {};
  lotProgressState.value = "loading";

  const today = getTodayDate();
  const fabStartDate = ymdOffset(today, -periodDays.value);
  const fabEndDate = (() => {
    const d = new Date(`${today}T00:00:00`);
    d.setMonth(d.getMonth() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`; // "YYYY-MM-DD"
  })();
  const start = performance.now(); // 시작 시간 (ms)

  // TEG 완료 목록 조회는 제거함: "TEG 완료시간" 컬럼이 주석 처리되어 결과를 쓰지 않으면서
  // 요청서 조회를 순차로 지연시키고, 실패 시 화면 전체가 비는 문제가 있었음.
  // 컬럼을 되살릴 경우 getTegApplicationsByFinishDateStatus 를 요청서 조회와 병렬로 호출할 것.

  try {
    let para = {
      users: true,
      wafer: true,
      idt_type: true,
      hs_type: true,
      idt_layers: false,
      lot_status: true,
      is_pending: false,
      is_active: true,
      order_by: "wanted_fab_start_date",
      order_dir: 'desc',
      wanted_fab_start_date_start: `${fabStartDate}T00:00:00`,
      wanted_fab_start_date_end: `${fabEndDate}T23:59:59`,
    };

    // 전체 조회 권한: 권한관리 > fab.monitor.view_all
    if (!usePermissStore().hasPerm("fab.monitor.view_all")) {
      para["observer_id"] = getUserId();
    }

    // Object.assign(apps, await getApplicationListByDictRev2(para));
    const rawApps = await getApplicationListByDictRev2(para);
    if (seq !== loadSeq) return; // 그 사이 기간이 바뀜

    Object.assign(
      apps,
      rawApps.map((item) => new FabRequest(item))
    );

    // apps.forEach((app) => app.createMesInfo())

    Object.assign(cspApps, getAppByPackageType(apps, ["CSP"], ["WHC"]));
    Object.assign(
      wlpApps,
      getAppByPackageType(apps, ["WLP", "BDMP"], ["WHC"])
    );
    Object.assign(
      etcApps,
      getAppByPackageType(apps, ["CSP", "WLP", "BDMP"], ["개발전달"])
    );

    console.log("Fetched app count:", apps.length);

    // FAB 진행률: 표를 먼저 보여주고 따로 조회해서 도착하면 채움 (await 하지 않음 → 표 표시 시간에 영향 없음)
    loadLotProgress(apps.map((a) => a.productName).filter(Boolean) as string[], seq);
  } catch (error) {
    console.error("Error fetching application list:", error);
  } finally {
    if (seq === loadSeq) isLoading.value = false;
  }

  const end = performance.now(); // 종료 시간 (ms)
  const seconds = ((end - start) / 1000).toFixed(3); // 소수점 3자리까지
  console.log(`Sample Monitor 조회(${periodDays.value}일): ${seconds}초`);
}
</script>

<style scoped>
.period-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.period-label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}
.period-range {
  font-size: 12px;
  color: #909399;
}
.period-loading {
  font-size: 12px;
  color: var(--el-color-primary);
}
</style>
