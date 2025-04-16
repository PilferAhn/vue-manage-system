<template>
    <!-- {{props.fabApplication.tcLayers}} -->
    <div
      class="tc-selection-container"
      v-if="props.sawType.tcTypes && props.sawType.tcTypes.length > 0"
    >
      <!-- Thickness 선택 -->
      <section class="section-row">
        <h3 class="section-title">SiO2</h3>
        <el-table :data="layerOptions" stripe class="custom-table" border>
          <el-table-column
            prop="material"
            label="Material Name"
            :align="'center'"
          ></el-table-column>
  
          <el-table-column label="Thickness" :align="'center'">
            <template #default="scope">
              <el-input
                v-model="scope.row.thickness"
                class="custom-input"
              ></el-input>
            </template>
          </el-table-column>        
          <el-table-column label="Machine" :align="'center'">
            <template #default="scope">
              <el-select v-model="props.fabApplication.tcMachineName">
                <el-option
                  v-for="machine in machineList"
                  :key="machine.key"
                  :label="machine.label"
                  :value="machine.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </section>
  
      <!-- Layer 테이블 -->
      <section class="section"></section>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, onMounted } from "vue";
  import type {
    SawType,
    FabRequestForm,
    Layer,
  } from "../../../interface/fab-application-rev2";
  import {
    getLayerOptions,
    createMachineList,
  } from "../../../utils/Fab/fab-application-tc-utils";
  import { OptionInterface } from "../../../interface/option";
  
  // Props 정의
  const props = defineProps<{
    fabApplication: FabRequestForm;
    sawType: SawType;
  }>();
  
  const machineList = ref<OptionInterface[]>([]);
  
  const layerOptions = ref<Layer[]>([]);
  const machineName = ref<string>("");
  onMounted(() => {
    if (Object.keys(props.sawType).length !== 0) {
      layerOptions.value = props.fabApplication.tcLayers;
    }
  });
  
  // waferType 변경 감지
  watch(
    () => props.fabApplication.waferType,
    (newVal) => {
      if (newVal === "TC") {

        if (props.sawType.tcTypes.length == 1) {
          props.fabApplication.tcId = props.sawType.tcTypes[0].tcId;
          machineList.value = createMachineList(
            props.sawType.tcTypes[0].tcMachines
          );
          console.log(machineList.value)
        } else {
          props.fabApplication.tcLayers = [];
        }
  
        // machineList.value=props.sawType.tcTypes.
      } else {
        props.fabApplication.tcId = null;
        props.fabApplication.tcLayers = [];
      }
    },
    {immediate : true}
  );
  
  // tcId 변경 감지
  watch(
    () => props.fabApplication.tcId,
    (newVal) => {
      if (newVal !== undefined && newVal !== null) {        


        layerOptions.value = getLayerOptions(newVal, props.sawType.tcTypes);
        
        if(props.fabApplication.tcLayers.length === 0){
          props.fabApplication.tcLayers = layerOptions.value;
        }
        else{
          layerOptions.value = props.fabApplication.tcLayers
        }
        
      }
    },
    {immediate : true}
  );
  </script>
  
  <script lang="ts">
  export default {};
  </script>
  
  <style scoped>
  /* 전체 컨테이너 스타일 */
  .tc-selection-container {
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* 카드 타이틀 스타일 */
  .card-title {
    background-color: #f5f5f5;
    padding: 12px 16px;
    border-left: 4px solid #4caf50;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  .card-title .title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }
  
  /* 섹션 스타일 */
  .section {
    margin-bottom: 24px;
  }
  
  .section-row {
    display: flex;
    align-items: center; /* 높이 맞추기 */
    gap: 16px; /* 제목과 테이블 사이 간격 */
  }
  
  .section-title {
    white-space: nowrap; /* 줄바꿈 방지 */
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    border-left: 4px solid #4caf50;
    padding-left: 8px;
    min-width: 100px; /* 제목의 최소 너비 설정 */
  }
  
  .custom-table {
    flex: 1; /* 테이블이 남은 공간 차지 */
    border-radius: 8px;
    overflow: hidden;
  }
  </style>