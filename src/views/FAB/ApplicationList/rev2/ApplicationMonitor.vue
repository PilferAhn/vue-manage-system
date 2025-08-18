<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane :label="cspLabel" name="csp">
        <ApplicationMonitorByPackage :fabApp="cspApps" :teg-app="tegApp" />
      </el-tab-pane>
      <el-tab-pane :label="wlpLabel" name="wlp">
        <ApplicationMonitorByPackage :fabApp="wlpApps" :teg-app="tegApp" :isWlp="true" />
      </el-tab-pane>
      <el-tab-pane :label="'ETC'" name="etc">
        <ApplicationMonitorByPackage :fabApp="etcApps" :teg-app="tegApp" />
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
import ApplicationMonitorByPackage from "./ApplicationMonitorByPackage.vue";
import { getAppByPackageType } from "../../../../utils/Fab/fab-application-monitor";
import { TegApplication } from "../../../../interface/Teg/teg";
import { getTegApplicationsByFinishDateStatus } from "../../../../utils/tegUtility";
import { FabApplicationForm } from "../../../../interface/mes-interface";

const apps = reactive<FabRequest[]>([]);
const cspApps = reactive<FabRequest[]>([]);
const wlpApps = reactive<FabRequest[]>([]);
const etcApps = reactive<FabRequest[]>([]);
const cspLabel = "CSP";
const wlpLabel = "WLP(BDMP)";
const activeTab = ref("csp"); // 기본 선택 탭
const tegApp = ref<TegApplication[]>([]);

onMounted(async () => {
  const start = performance.now(); // 시작 시간 (ms)

  tegApp.value = await getTegApplicationsByFinishDateStatus(
    "2024-02-14 00:00:00",
    "finished"
  );

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
      order_by: "created_date",
    };

    if (getUserId() !== "admin" && getRole() !== "group leader") {
      para["observer_id"] = getUserId();
    }

    // Object.assign(apps, await getApplicationListByDictRev2(para));
    const rawApps = await getApplicationListByDictRev2(para);

    Object.assign(
      apps,
      rawApps.map((item) => new FabRequest(item))
    );

    apps.forEach((app, index) => {
      for (let i = 0; i < tegApp.value.length; i++) {
        if (app.productName === tegApp.value[i].modelName) {
          app.tegFinishedDate = tegApp.value[i].dateOfFinish;
          app.measType = tegApp.value[i].measType;
        }
      }
    });

    // apps.forEach((app) => app.createMesInfo())

    Object.assign(cspApps, getAppByPackageType(apps, ["CSP"], ["WHC", "WTC", "개발전달"]));
    Object.assign(
      wlpApps,
      getAppByPackageType(apps, ["WLP", "BDMP"], ["WHC", "WTC"])
    );
    Object.assign(
      etcApps,
      getAppByPackageType(apps, ["WLP", "BDMP"], ["개발전달"])
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
