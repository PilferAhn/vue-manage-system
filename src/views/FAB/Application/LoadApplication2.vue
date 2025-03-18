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
    band,
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
  const route = useRoute(); // Access the route
  const app = reactive<FabRequestForm>({});
  const isLoad = ref<boolean>(false);
  
  const sawTypes = reactive<SawType[]>([]);
  const sawType = reactive<SawType>({});
  
  // Function to fetch the application data from the server
  const fetchApplication = async (productName: any) => {
    try {
      const url = serverUrl + "/fab_monitoring_rev2/get_fab_request";
      const formData = new FormData();
      formData.append("product_name", productName);
  
      const response = await axios.post(url, formData);
      const convertedData = convertPep8ToCamelCase2(response.data);
      
      // Assign the converted data to processData
      Object.assign(app, convertedData);
              
      app.currentProductName = app.productName
      if(app.photo === null){
        app.photo = initPhoto()
      }
  
      if(app.idt2Id !== null){
        app.isDualIdt = true  
      }
  
      if(app.bom !== null){
        app.isNewBom = true
      }
      
      if(app.bom2 !== null){
        app.isNewBom2 = true
      }
  
      app.waferType = app.wafer.sawTypeId;
    
      const response1 = await axios.get(
        serverUrl + "/fab_monitoring_rev2/get_saw_types_list"
      );
      const rawData = response1.data;
      
      Object.assign(sawTypes, convertPep8ToCamelCase2(rawData));
      Object.assign(
        sawType,
        defineSawTypeByWaferType(app.wafer.sawTypeId, sawTypes)
      );        
  
      isLoad.value = true;
    } catch (error) {
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