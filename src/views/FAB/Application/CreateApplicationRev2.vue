<template>
    <ApplicationTemplate v-if="isOnTime"
      :fab-application="fabApplication"        
      applicationType="create"
      :options="sawTypes"
      :sawType="sawType"
    />
    <ApplicationUnavailableMessage v-else></ApplicationUnavailableMessage>
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
    canCreateFabRequest,
  } from "../../../utils/Fab/fab-application-utils";
  // import {generateMachineOptionsForEtching} from "../../../utils/Fab/fab-application-deposition.utils"
  import { OptionInterface } from "../../../interface/option";
  import { getUserId, getUserName } from "../../../utils/account-utils";
  import axios from "axios";
import ApplicationUnavailableMessage from "./ApplicationUnavailableMessage.vue";
import { sendGetRequest, sendPostRequest } from "../../../utils/httpProtocol";
  
  const bom = initBom();
  const { fabApplication } = initFabApplication3(bom);
  const bandList = ref<band[]>([]);
  const sawTypes = reactive<SawType[]>([]);
  const sawType = reactive<SawType>({});
  const isOnTime = ref<boolean>(true)
  onMounted(async () => {
    fabApplication.requester.userName = getUserName();
    fabApplication.requester.id = getUserId();
    fabApplication.requesterId = getUserId();
    try {
      const response = await axios.get(
        "/fab_monitoring_rev2/get_saw_types_list"
      );
      const rawData = response.data;    
      Object.assign(sawTypes , convertPep8ToCamelCase2(rawData))  
    } catch (error) {
      console.error("Error fetching saw types:", error);
    }
    console.log('sawTypes', sawTypes);
    isOnTime.value = false
    isOnTime.value = await canCreateFabRequest()
    
  });

  function checkxxx(){

  }
  </script>
  
  <style>
  /* 스타일 정의 */
  </style>