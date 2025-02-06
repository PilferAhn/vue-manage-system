<template>
  <PdtTemplate v-if="isLoad" :app="pdtApp" appType="clone"></PdtTemplate>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { FabRequestForm } from "../../../interface/fab-application-rev2";
import { getAppRev2ByProductName } from "../../../utils/Fab/fab-application-utils";
import { allocFabFormToPdtForm } from "../../../utils/Pdt/application-utils";
import PdtTemplate from "./Template.vue";
import * as PdtUtils from "../ApplicationPage/Application";

const route = useRoute();
const fabApp = ref<FabRequestForm>();
const pdtApp = ref<PdtUtils.PDTRequestFormType | null>(null);

const isLoad = ref<Boolean>(false);

const productName = computed(() => route.params.productName as string);
// const productName = ref<string>("");
// productName.value = route.params.productName as string

// watch(
//   () => ,
//   (newVal) => {
//     productName.value = newVal as string;
//     console.log(productName.value)
//   }
// );

watch(
  productName,
  async (newVal) => {
    try {

      isLoad.value = false;
      // usePDTRequestForm의 form 가져오기
      // PdtUtils.resetForm(pdtApp.value, "")
      pdtApp.value = PdtUtils.usePDTRequestForm2();      
      fabApp.value = await getAppRev2ByProductName(newVal); // Promise 처리
      allocFabFormToPdtForm(fabApp.value, pdtApp.value);
      isLoad.value = true;

    } catch (error) {
      console.error("Error fetching FabRequestForm in watch:", error);
    }
  },
  { immediate: true }
);
</script>

<style></style>
