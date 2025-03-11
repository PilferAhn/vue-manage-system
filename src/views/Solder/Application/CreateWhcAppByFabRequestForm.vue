<template>
    <div>
      <!-- {{ fabApp }} -->
      <SolderApplicationTemplate
        v-if="isLoad"
        :application-data="solderApplication"
        :application-type="'create'"
      ></SolderApplicationTemplate>
    </div>
  </template>
  
  <script setup lang="ts">
  import { allocFabFormToWhcForm } from "../../../utils/Solder/application-utils";
  import { initializeApplicationData } from "../../../utils/solderApplicationUtil";
  import { useRoute } from "vue-router";
  import { ref, watch, computed, onMounted } from "vue";
  import SolderApplicationTemplate from "./SolderApplicationTemplate.vue";
  import { FabRequestForm } from "../../../interface/fab-application-rev2";
  import { getAppRev2ByProductName } from "../../../utils/Fab/fab-application-utils";
  
  const route = useRoute();
  const fabApp = ref<FabRequestForm>();
  const solderApplication = initializeApplicationData();
  const isLoad = ref<Boolean>(false);
  const productName = computed(() => route.params.productName as string);
  
  // Watch the `uuid` route parameter, fetch data immediately and when it changes
  // watch(
  //   () => productName, // Watching route parameter change
  //   async (newVal) => {
  //     if (newVal) {
  //       // await getApplicationByModelName(fabApplication , modelName as string); // Fetch data when uuid changes
  //       // copyMatchingKeys(fabApplication, solderApplication); // fabApplication의 키값 출력
  //       // insertDataFromFabRequestForm(solderApplication, fabApplication)
  
  //       fabApp.value = await getAppRev2ByProductName(newVal);
  //       allocFabFormToWhcForm(fabApp.value, solderApplication);
  //       isLoad.value = true;
  //     }
  //   },
  //   { immediate: true } // Trigger immediately on component mount
  // );
  
  onMounted(async () => {
    fabApp.value = await getAppRev2ByProductName(
      route.params.productName as string
    );
  
    allocFabFormToWhcForm(fabApp.value, solderApplication);
    isLoad.value = true;
  });
  
  watch(
    productName,
    async (newVal) => {
      if (newVal) {
        fabApp.value = await getAppRev2ByProductName(newVal);
        allocFabFormToWhcForm(fabApp.value, solderApplication);
        isLoad.value = true;
      }
    }
    // { immediate: true }
  );
  </script>
  
  <style></style>