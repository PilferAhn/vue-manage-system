<template></template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";

const isAllowGfl = ref<boolean>(false);
const isAllowCap = ref<boolean>(false);
const isAllowMoreEnergy = ref<boolean>(false);
const isAllowPadDicing = ref<boolean>(false);
const sawTypeId = ref<string>(null);
const packageId = ref<string>(null);
const destination = ref<string>(null);
const idtProcess = ref<string>(null);

const trackedValues = computed(() => ({
  sawTypeId: sawTypeId.value,
  packageId: packageId.value,
  destination: destination.value,
  idtProcess: idtProcess.value,
}));

watch(
  trackedValues,
  (newValues) => {
    if (
      newValues.sawTypeId !== null &&
      newValues.packageId !== null &&
      newValues.destination !== null &&
      newValues.idtProcess !== null
    ) {
      if (newValues.sawTypeId === "NS") {
        isAllowGfl.value = true;
      } else {
        isAllowGfl.value = false;
      }

      isAllowCap.value = ["TC", "NS"].includes(newValues.sawTypeId);
      isAllowPadDicing.value = ["NS", "HS"].includes(newValues.sawTypeId) && newValues.packageId !== "WLP";
      isAllowMoreEnergy.value = ["NS", "HS"].includes(newValues.sawTypeId);

      if (!isAllowCap) {isCap = Null}

      

      console.log("하나 이상의 값이 null입니다:", newValues);
    } else {
      console.log("모든 값이 유효합니다:", newValues);
    }
  },
  { deep: true }
);

// watch(()=> sawWaferId, (newVal) => {

//     if(newVal === "NS"){
//         isAllowGfl.value = true
//     }
//     else{
//         isAllowGfl.value = false
//     }

//     if(["TC", "NS"].includes( newVal)){
//         isAllowCap.value = true
//     }
//     else{
//         isAllowCap.value = false
//     }

//     if(["NS", "HS"].includes(newVal)){
//         isAllowMoreEnergy.value = true

//         if(packageId !== "WLP"){
//             isAllowPadDicing.value = true
//         }

//     }
//     else{
//         isAllowMoreEnergy.value = false
//     }

// })
</script>

<style></style>
