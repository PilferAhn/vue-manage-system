<template>
  <div>
    <Application
      v-if="isLoad"
      :application-data="tegApp"
      :application-type="'create'"
    ></Application>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { TegApplication } from "../../../interface/Teg/teg";
import { FabRequestForm } from "../../../interface/fab-application-rev2";
import {
  getAppRev2ByProductName,
  allocFabFormToTegForm,
} from "../../../utils/Fab/fab-application-utils";
import { initTegApplication } from "../Common/utility";
import Application from "./Application.vue";
import type {
  TegApplication as TegApplicationInterface,
  TestTypeOptions as TestTypeOptionsInterface,
} from "../Common/ApplicationTypes";

const route = useRoute();
const tegApp = ref<TegApplicationInterface>();
const fabApp = ref<FabRequestForm>();
const isLoad = ref<Boolean>(false);

onMounted(async () => {
  try {
    isLoad.value = false;
    tegApp.value = initTegApplication();
    
    fabApp.value = await getAppRev2ByProductName(
      route.params.productName as string
    ); // Promise 처리    
    allocFabFormToTegForm(fabApp.value, tegApp.value);
    tegApp.value.modelName = fabApp.value.productName
    isLoad.value = true;
  } catch (error) {
    console.error("Error fetching FabRequestForm in watch:", error);
  }
});

// watch(
//   () => route.params.productName as string,
//   async (newVal) => {
//     try {
//       console.log("여기냐2")
//       isLoad.value = false;
//       fabApp.value = await getAppRev2ByProductName(newVal); // Promise 처리
//       tegApp.value = initTegApplication();
//       allocFabFormToTegForm(fabApp.value, tegApp.value);
//       isLoad.value = true;
//     } catch (error) {
//       console.error("Error fetching FabRequestForm in watch:", error);
//     }
//   }
// );
</script>

<style></style>
