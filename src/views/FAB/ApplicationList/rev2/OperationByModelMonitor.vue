<script lang="ts">
export default {};
</script>

<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane :label="cspLabel" name="csp">
        <OperationByModelMonitorByPackage
          :fabApp="cspApps"
          packageType="CSP"
        />
      </el-tab-pane>

      <el-tab-pane :label="wlpLabel" name="wlp">
        <OperationByModelMonitorByPackage
          :fabApp="wlpApps"
          packageType="WLP"
        />
      </el-tab-pane>

      <el-tab-pane :label="'개발전달'" name="etc">
        <OperationByModelMonitorByPackage
          :fabApp="etcApps"
          packageType="ETC"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
// import { getApplicationListByDictRev2 } from "../../../../utils/Fab/fab-application-utils";
import { getRole, getUserId } from "../../../../utils/account-utils";
import OperationByModelMonitorByPackage from "./OperationByModelMonitorByPackage.vue";
import { getAppByPackageTypeForProgressMonitoring } from "../../../../utils/Fab/fab-application-monitor";
import { getTodayDate } from "../../../../utils/date-utils";
import { MesProgressRow } from "../../../../interface/fab-application-rev2";
import { getFabMonitorRowsByWantedDate } from "../../../../utils/Fab/fab-application-utils";
import { FabMonitorRow } from "../../../../interface/fab-application-rev2";

const cspApps = reactive<FabMonitorRow[]>([]);
const wlpApps = reactive<FabMonitorRow[]>([]);
const etcApps = reactive<FabMonitorRow[]>([]);

const cspLabel = "CSP";
const wlpLabel = "WLP(BDMP)";
const activeTab = ref("csp");

onMounted(async () => {
  const today = getTodayDate();
  const fabStartDate = (() => {
    const d = new Date(`${today}T00:00:00`);
    d.setDate(d.getDate() - 180);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  })();

  const fabEndDate = (() => {
    const d = new Date(`${today}T00:00:00`);
    d.setMonth(d.getMonth() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  })();
  const start = performance.now();

  try {
    
  const rows = await getFabMonitorRowsByWantedDate({
                  wantedStart: `${fabStartDate}T00:00:00`,
                  wantedEnd: `${fabEndDate}T23:59:59`,
                  observerId:
                    getUserId() !== "admin" && getRole() !== "group leader"
                      ? getUserId()
                      : null,
                  });
    console.log('rows',rows)
    Object.assign(cspApps, getAppByPackageTypeForProgressMonitoring(rows, ["CSP"], ["WHC"]));
    Object.assign(wlpApps, getAppByPackageTypeForProgressMonitoring(rows, ["WLP", "BDMP"], ["WHC"]));
    Object.assign(etcApps, getAppByPackageTypeForProgressMonitoring(rows, ["CSP", "WLP", "BDMP"], ["개발전달"]));
  } catch (error) {
    console.error("Error fetching application list:", error);
  }

  const end = performance.now();
  console.log(`onMounted Execution Time: ${((end - start) / 1000).toFixed(3)}초`);
});
</script>

<style></style>
