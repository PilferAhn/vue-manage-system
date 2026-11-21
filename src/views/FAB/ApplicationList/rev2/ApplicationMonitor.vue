<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane :label="cspLabel" name="csp">
        <ApplicationMonitorByPackage :fabApp="cspApps" />
      </el-tab-pane>
      <el-tab-pane :label="wlpLabel" name="wlp">
        <ApplicationMonitorByPackage :fabApp="wlpApps" :isWlp="true" />
      </el-tab-pane>
      <el-tab-pane :label="'개발전달'" name="etc">
        <ApplicationMonitorByPackage :fabApp="etcApps" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { FabRequest } from "../../../../interface/fab-application-rev2";
import { reactive, onMounted, ref } from "vue";
import {
  getApplicationListByDict,
  getApplicationListByDictRev2,
} from "../../../../utils/Fab/fab-application-utils";
import { getRole, getUserId } from "../../../../utils/account-utils";
import { usePermissStore } from "../../../../store/permiss";
import ApplicationMonitorByPackage from "./ApplicationMonitorByPackage.vue";
import { getAppByPackageType } from "../../../../utils/Fab/fab-application-monitor";
import { FabApplicationForm } from "../../../../interface/mes-interface";
import { getTodayDate, adjustDate } from "../../../../utils/date-utils";

const apps = reactive<FabRequest[]>([]);
const cspApps = reactive<FabRequest[]>([]);
const wlpApps = reactive<FabRequest[]>([]);
const etcApps = reactive<FabRequest[]>([]);
const cspLabel = "CSP";
const wlpLabel = "WLP(BDMP)";
const activeTab = ref("csp"); // 기본 선택 탭

onMounted(async () => {
  const today = getTodayDate();             
  const fabStartDate =  (()=>{
    const d = new Date(`${today}T00:00:00`);
    d.setDate(d.getDate() - 180);
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;               // "YYYY-MM-DD"
  })();
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
  } catch (error) {
    console.error("Error fetching application list:", error);
  }

  const end = performance.now(); // 종료 시간 (ms)
  const seconds = ((end - start) / 1000).toFixed(3); // 소수점 3자리까지
  console.log(`onMounted Execution Time: ${seconds}초`);
});
</script>

<style></style>
