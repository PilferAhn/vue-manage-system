<template>
    <div class="section">
      <h3>{{ header }}</h3>
      <div class="checkbox-group">
        <el-checkbox
          v-if="isAllowBridge"
          v-model="props.fabApplication.hasBridge"
          label="브릿지"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowIdtOxi"
          v-model="props.fabApplication.isIdtOxi"
          label="IDT-Oxi"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowSeedSio2"
          v-model="props.fabApplication.isSeedSio2"
          label="SiO2Seed"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowGfl"
          v-model="props.fabApplication.isGfl"
          label="GFL"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowRrPs2"
          v-model="props.fabApplication.isRrPs2"
          label="RR PS2 적용"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowCap"
          v-model="props.fabApplication.isCap"
          label="Cap"
        ></el-checkbox>
        <el-checkbox
          v-model="props.fabApplication.isDualIdt"
          label="Dual-IDT"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowMst"
          v-model="props.fabApplication.isMst"
          label="MST"
        ></el-checkbox>
        <el-checkbox
          v-model="props.fabApplication.isToneInverted"
          label="Pad 6um 적용(톤반전)"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowPadDicing"
          v-model="props.fabApplication.isPadDl"
          label="PAD D/L유무"
        ></el-checkbox>
        <el-checkbox
          v-model="props.fabApplication.isNeedExtraShot"
          label="TEG Shot 추가(더블샷)"
        ></el-checkbox>
        <el-checkbox
          v-if="isAllowMoreEnergy"
          v-model="props.fabApplication.isMoreEnergy"
          is_more_energy
          label="산포 개선 노광량 사용"
        ></el-checkbox>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from "vue";
  import type {
    FabRequestForm,
    SawType,
    IdtType,
  } from "../../../interface/fab-application-rev2";
  
  // props 정의
  const props = defineProps<{
    fabApplication: FabRequestForm;
    sawType: SawType;
  }>();
  
  const isAllowBridge  = ref<boolean>(false);
  const isAllowGfl = ref<boolean>(false);
  const isAllowCap = ref<boolean>(false);
  const isAllowMoreEnergy = ref<boolean>(false);
  const isAllowPadDicing = ref<boolean>(false);
  const isAllowIdtOxi = ref<boolean>(false);
  const isAllowSio2 = ref<boolean>(false);
  const isAllowRrPs2 = ref<boolean>(false);
  const isAllowMst = ref<boolean>(false);
  const isAllowDualIdt = ref<boolean>(false);
  const isAllowSeedSio2 = ref<boolean>(false);
  const header = ref<string>("");
  const trackedValues = computed(() => ({
    sawTypeId: props.sawType.sawTypeId,
    packageId: props.fabApplication.packageId,
    destinationId: props.fabApplication.destinationId,
    idtProcessId: props.fabApplication.idtProcessId,
  }));
  
  watch(
    trackedValues,
    (newValues) => {
      if (
        newValues.sawTypeId !== null &&
        newValues.packageId !== null &&
        newValues.destinationId !== null &&
        newValues.idtProcessId !== null
      ) {
        isAllowIdtOxi.value = ["NS", "HS"].includes(newValues.sawTypeId);
        isAllowBridge.value = ["NS", "HS"].includes(newValues.sawTypeId);
        isAllowGfl.value = newValues.sawTypeId === "NS";
        isAllowCap.value = ["TC", "NS"].includes(newValues.sawTypeId);
        isAllowRrPs2.value = newValues.sawTypeId === "TC";
        isAllowPadDicing.value =
          ["NS", "HS"].includes(newValues.sawTypeId) &&
          newValues.packageId !== "WLP";
        isAllowMoreEnergy.value = ["NS", "HS"].includes(newValues.sawTypeId);
  
        isAllowMst.value = newValues.sawTypeId === "TC";
  
        isAllowSeedSio2.value = ["NS", "HS"].includes(newValues.sawTypeId);
  
        if (newValues.sawTypeId === "TC") {
          header.value = "Extra Process Information [TC]";
        } else {
          header.value = "Extra Process Information [HS / NS]";
        }
  
        if (newValues.sawTypeId === "TC") {
          isAllowMoreEnergy.value = false;
          props.fabApplication.isMoreEnergy = true;
        } else {
          isAllowMoreEnergy.value = true;
          // props.fabApplication.isMoreEnergy = false;
        }
        
        console.log(isAllowBridge.value)
        console.log(props.fabApplication.hasBridge)
        if(!isAllowBridge.value){
          props.fabApplication.hasBridge = false
        }


        if (!isAllowIdtOxi.value) {
          props.fabApplication.isIdtOxi = null;
        }
  
        if (!isAllowSeedSio2.value) {
          props.fabApplication.isSeedSio2 = null;
          props.fabApplication.seedId = null;
        } else {
          if (props.fabApplication.seedId !== null) {
            props.fabApplication.isSeedSio2 = true;
          }
        }
  
        if (!isAllowGfl.value) {
          props.fabApplication.gflThickness = null;
        } else {
          if (props.fabApplication.gflThickness === null) {
            props.fabApplication.isGfl = false;
          }
          else{
            props.fabApplication.isGfl = true
          }
        }
  
        if (!isAllowCap.value) {
          props.fabApplication.isCap = null;
        }
  
        if (!isAllowRrPs2.value) {
          props.fabApplication.isRrPs2 = null;
        }
  
        if (!isAllowPadDicing.value) {
          props.fabApplication.isPadDl = null;
        }
  
        if (!isAllowMst.value) {
          props.fabApplication.isMst = null;
        } else {
          if (props.fabApplication.mstThickness !== null) {
            props.fabApplication.isMst = true;
          }
        }
      }
    },
    { deep: true, immediate: true }
  );
  </script>
  
  <script lang="ts">
  export default {};
  </script>
  
  <style scoped>
  /* 전체 섹션 스타일 */
  .section {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: #f9f9f9;
  }
  
  /* 제목 스타일 */
  h3 {
    margin-bottom: 12px;
    font-size: 18px;
    color: #333;
  }
  
  h4 {
    margin-bottom: 8px;
    font-size: 16px;
    color: #555;
  }
  
  /* 체크박스 그룹 스타일 */
  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  </style>