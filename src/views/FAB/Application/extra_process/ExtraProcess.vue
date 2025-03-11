<template>
    <div class="container" v-if="props.fabApplication.isGfl || props.fabApplication.isMst">
      <div v-if="props.fabApplication.isGfl"></div>
      <el-row :gutter="20" class="form-row">
        <el-col :span="6" v-if="props.fabApplication.isGfl">
          <InputNumber
            v-model="props.fabApplication.gflThickness"
            label="GFL 증착"
            placeholder=""
            :disable="false"
            class="wide-select"
          />
        </el-col>
        <el-col :span="6" v-if="props.fabApplication.isMst">
          <InputNumber
            v-model="props.fabApplication.mstThickness"
            label="MST 트리머 Target"
            placeholder=""
            :disable="false"
            class="wide-select"
          />
        </el-col>
      </el-row>
      <br />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, onMounted } from "vue";
  import {
    seedType,
    type FabRequestForm,
    type SawType,
  } from "../../../../interface/fab-application-rev2";
  import InputNumber from "../../../Common/InputNumber.vue";
  // props 정의
  const props = defineProps<{
    fabApplication: FabRequestForm;
    sawType: SawType;
  }>();
  
  watch(()=>props.fabApplication.isGfl, (newVal) => {
    if(!newVal){
      props.fabApplication.gflThickness = null
    }
  })
  
  watch(() => props.fabApplication.isMst, (newVal) => {
    if(!newVal){
      props.fabApplication.mstThickness = null
    }
  })
  
  </script>
  <script lang="ts">
  export default {};
  </script>
  
  <style></style>