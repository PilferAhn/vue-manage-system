<template>
  <ApplicationTemplate
    :fab-application="fabApplication"        
    applicationType="create"
    :options="sawTypes"
    :sawType="sawType"
  />
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";
import ApplicationTemplate from "./ApplicationTemplate.vue";
import { initBom } from "../../../utils/Fab/bom-utils";
import {
  SawType,
  FabWafer,
  FabWaferRecommendation,
  PstType,
  HsType,
  PstLayer,
  TcType,
  IdtType,
  IdtMachine,
  Layer,
  band,
  Bom
} from "./../../../interface/fab-application-rev2";
import {
  initFabApplication,
  initFabApplication2,
  initFabApplication3,
  getBandList,
} from "../../../utils/Fab/fab-application-utils";

import { getUserId, getUserName } from "../../../utils/account-utils";
import axios from "axios";
//   import type { FabApplicationInterface  } from "../../interface/fab";

const bom = initBom();
const { fabApplication } = initFabApplication3(bom);
const bandList = ref<band[]>([]);
const sawTypes = reactive<SawType[]>([]);
const sawType = reactive<SawType>({});

onMounted(async () => {
  fabApplication.requester.userName = getUserName();
  fabApplication.requester.id = getUserId();
  fabApplication.requesterId = getUserId();

  // fabApplication.designer.userName = getUserName();
  // fabApplication.designer.id = getUserId();
  // fabApplication.designerId = getUserId();
  
  try {
    
    const response = await axios.get(
      "http://10.29.11.124:40000/fab_monitoring_rev2/get_saw_types_list"
    );

    const rawData = response.data;    
    Object.assign(sawTypes , convertPep8ToCamelCase2(rawData))

    
  } catch (error) {
    console.error("Error fetching saw types:", error);
  }
});
</script>

<style>
/* 스타일 정의 */
</style>
