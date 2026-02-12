<template>
    <section class="section">
      <h3 class="section-title">Wafer</h3>
  
      <div class="options-container">
        <el-select
          v-model="props.fabApplication.waferId"
          placeholder="Select Wafer"
          class="custom-select"
          clearable
          style="width: 400px"
          popper-class="right-lg-popper"
        >
          <el-option
            v-for="opt in availableWafer"
            :key="opt.key"
            :label="opt.label"
            :value="opt.key"
          ></el-option>
        </el-select>
        <div class="checkbox-group">
          <el-checkbox v-model="props.fabApplication.isFreeWafer" label="유상" /> 
          <el-checkbox
            v-if="props.fabApplication.waferType !== 'HS'"
            v-model="props.fabApplication.isMixedWafer"
            label="혼입"
          />       
        </div>
        <el-checkbox v-if="props.fabApplication.waferType === 'HS'"
          v-model="props.fabApplication.isNeededLtEtching"
          label="LTE 진행"
        />
  
      </div>
    </section>
  </template>
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch, onMounted } from "vue";
  import { createWaferOptions } from "../../../../utils/Fab/fab_application-wafer-utils";
  import type { OptionInterface } from "../../../../interface/option";
  import {
    type SawType,
    type FabRequestForm,
    type FabWafer,
    Layer,
    HsType,
  } from "../../../../interface/fab-application-rev2";
  import SelectCheckBoxVue from '../../../Common/SelectCheckBox.vue';
  
  
  const props = defineProps<{
    fabApplication: FabRequestForm;
    sawType: SawType;
  }>();
  
  const availableWafer = ref<OptionInterface[]>([]);
  
  onMounted(() => {
    if (Object.keys(props.sawType).length !== 0) {
      availableWafer.value = createWaferOptions(props.sawType);
    }
    
  });
  
  watch(
    () => props.fabApplication.waferType,
    (newValue) => {
      props.fabApplication.waferId = undefined;
      availableWafer.value = [];
      availableWafer.value = createWaferOptions(props.sawType);
  
      if(newValue === "HS"){
        props.fabApplication.isNeededLtEtching = true
      }
      else{
        props.fabApplication.hsId = null;
        props.fabApplication.hsTrimingTarget = null;
        props.fabApplication.isNeededLtEtching = false
      }
      
      props.fabApplication.isMixedWafer = false;
      props.fabApplication.waferAngle2 = undefined;
      props.fabApplication.waferThickness2 = undefined;
      props.fabApplication.waferQty2 = 0;

      if (availableWafer.value.length == 1) {
        props.fabApplication.waferId = availableWafer.value[0].key;
      } else if (props.fabApplication.waferType === "TC") {
        props.fabApplication.waferId = 2;
      }
      props.fabApplication.waferAngle = undefined;
      props.fabApplication.hsTrimingTarget = null;
    }
  );
  
  watch(
  () => props.fabApplication.isMixedWafer,
  (enabled) => {
    if (props.fabApplication.waferType === "HS") {
      props.fabApplication.isMixedWafer = false;
      return;
    }

    if (!enabled) {
      props.fabApplication.waferAngle2 = undefined;
      props.fabApplication.waferThickness2 = undefined;
      props.fabApplication.waferQty2 = 0;
    } else {
      // 켜면 thickness2는 1번과 동일로 시작
      props.fabApplication.waferThickness2 = props.fabApplication.waferThickness;
      // angle2는 1번으로 시작(사용자가 바꿀 수 있음)
      props.fabApplication.waferAngle2 = props.fabApplication.waferAngle;
      props.fabApplication.waferQty2 = props.fabApplication.waferQty2 ?? 0;
    }
  },
  {immediate:true}
);

  // watch(() => waferId.value , (newVal) => {
  //   props.fabApplication.waferId = parseInt(newVal)
  //   emit("update:waferId", newVal)
  // })
  </script>
  
  <script lang="ts">
  export default {};
  </script>
  
  <style scoped>
  .section {
    margin-bottom: 24px;
  }
  
  .options-container {
    display: flex;
    align-items: center;
    gap: 20px; /* 요소 간 간격 조절 */
  }
  
  .checkbox-group {
    display: flex;
    gap: 10px;
  }
  </style>