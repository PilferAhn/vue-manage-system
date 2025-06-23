<template>
    <div class="container" v-if="isLoad">
      <!-- Pass processData to the child component -->
      <!-- <Application :processData="processData" :applicationType="'load'" /> -->
      <ApplicationTemplate
        :fab-application="app"
        :options="sawTypes"
        :sawType="sawType"
        applicationType="load"
      ></ApplicationTemplate>
  
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, reactive } from "vue";
  import type { ProcessData } from "../Interface/ApplicationInterface";
  import axios from "axios";
  import type {
    FabRequestForm,
    SawType,
    Layer,
    Epoxy,
    IdtType,
    TcType,
    PstType,
    passivationType,
    seedType
  } from "../../../interface/fab-application-rev2";
  import {
    convertKeysToCamelCase,
    convertPep8ToCamelCase2,
    
  } from "../../../utils/key-converter";
  import ApplicationTemplate from "./ApplicationTemplate.vue";
  import { useRoute } from "vue-router";
  import { getBandList } from "../../../utils/Fab/fab-application-utils";
  import { defineSawTypeByWaferType } from "../../../utils/Fab/fab_application-wafer-utils";
  import { initPhoto } from "../../../utils/Fab/photo-utils";
  import { serverUrl } from "../../../utils/Fab/fab-application-utils";
  import { initBom } from "../../../utils/Fab/bom-utils";
  
  const isLoad = ref<boolean>(false);
  const route = useRoute(); // Access the route
  
  const app = reactive<FabRequestForm>({});
  const sawTypes = reactive<SawType[]>([]);
  const sawType = reactive<SawType>({});
  
  // Function to fetch the application data from the server
  
  const fetchApplication = async (productName: any) => {
    try {
      // Get form data
      let appData: FabRequestForm = {};
      {
        const url = serverUrl + "/fab_monitoring_rev2/get_fab_request";
        const formData = new FormData();
        formData.append("product_name", productName);
        const response = await axios.post(url, formData);
        appData  = convertPep8ToCamelCase2(response.data) as FabRequestForm;
      }
            
      // Get SawType
      let sawTypesData:SawType[] = []
      {
        const response1 = await axios.get(
          serverUrl + "/fab_monitoring_rev2/get_saw_types_list");
        const rawData = response1.data;
        sawTypesData = convertPep8ToCamelCase2(rawData) as SawType[];
      }
      const sawTypeData: SawType = defineSawTypeByWaferType(appData.wafer.sawTypeId, sawTypesData)

      // Setup Origilal productName
      appData.currentProductName = appData.productName

      // Restore Other properties
      appData.photo = appData.photo ?? initPhoto();            
      appData.waferType = appData.wafer.sawTypeId;
      appData.isDualIdt = appData.idt2Id != null;

      if(appData.packageId === "CSP" && appData.destinationId !== "개발전달" && !appData.bom) {
        appData.bom = initBom();
        appData.bomMainCode = "";
        appData.isNewBom = true;
      }
      if(appData.bom  != null){
        appData.isNewBom = true
        appData.bom.epoxy ??= { modelName: "" } as Epoxy;
      }
      
      if(appData.bom2 != null){
        appData.isNewBom2 = true
        appData.bom2.epoxy ??= { modelName: "" } as Epoxy;
      }

      // Fix layers
      const fixLayers = (targetId: any, targetLayers: Layer[], type: any[], searchFucnc :CallableFunction) => {
        // console.log("Target Id: ", targetId);
        // console.log("Target Layers: ", targetLayers)
        // console.log("Types: ", type);
        
        if (targetId != null) {
          const layers: Layer[] = type.find(
            (item) => searchFucnc(item, targetId)
          )?.layers ?? [];
          
          // console.log("CallableFunction: ", toString(CallableFunction));
          
          if (layers.length !== targetLayers.length) {
            targetLayers.splice(0, targetLayers.length, ...layers);
          }
        }
      }

      // console.log("idtLayers");
      fixLayers(appData.idtId, appData.idtLayers, sawTypeData.idtTypes, (type: IdtType, id: any) => type.idtId === id);
      // console.log("idt2Layers");
      fixLayers(appData.idt2Id, appData.idt2Layers, sawTypeData.idtTypes, (type: IdtType, id: any) => type.idtId === id);
      // console.log("tcLayers");
      fixLayers(appData.tcId, appData.tcLayers, sawTypeData.tcTypes, (type: TcType, id: any) => type.tcId === id);
      // console.log("pstLayers");
      fixLayers(appData.pstId, appData.pstLayers, sawTypeData.pstTypes, (type: PstType, id: any) => type.pstId === id);
      // console.log("seedLayers");
      fixLayers(appData.seedId, appData.seedLayers, sawTypeData.seedTypes, (type: seedType, id: any) => type.seedId === id);
      // console.log("passivationLayers");
      fixLayers(appData.passivationId, appData.passivationLayers, sawTypeData.passivationTypes, (type: passivationType, id: any) => type.passivationId === id);

      
      // Assign the converted data to processData
      Object.assign(app, appData);
      Object.assign(sawTypes, sawTypesData);
      Object.assign(sawType, sawTypeData);

      isLoad.value = true;
    } 
    catch (error) {
      console.error("Error fetching application:", error);
    }
  };
  
  // Watch the `uuid` route parameter, fetch data immediately and when it changes
  watch(
    () => route.params.productName, // Watching route parameter change
    (productName) => {
      if (productName) {
        ``;
        fetchApplication(productName); // Fetch data when uuid changes
      }
    },
    { immediate: true } // Trigger immediately on component mount
  );
  </script>
  
  <style></style>