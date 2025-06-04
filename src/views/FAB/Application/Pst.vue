<template>
    <div
      v-if="
        props.sawType.pstTypes !== undefined && props.sawType.pstTypes.length > 0
      "
      class="pst-selection-container"
    >
      <!-- PST 타입 선택 -->
      <section class="section">
        <h3 class="section-title">Select Piston</h3>
        <el-select
          v-model="props.fabApplication.pstId"
          placeholder="Select Piston"
          class="custom-select"
          clearable
        >
          <el-option
            v-for="pst in props.sawType.pstTypes"
            :key="pst.pstId"
            :label="pst.name + ' (' + pst.description + ')'"
            :value="pst.pstId"
          ></el-option>
        </el-select>
      </section>
  
      <!-- PST 레이어 테이블 -->
      <section class="section">
        <el-descriptions title="Thickness" :column="4" size="small" :border="true">
          <el-descriptions-item
            v-for="layer in layers"
            :key="layer.idx"
            :label="layer.material"
            :span="1"
          >
            <el-input v-model="layer.thickness"></el-input>
          </el-descriptions-item>
        </el-descriptions>
  
        <!-- <el-table
          :data="layers"
          stripe
          class="custom-table"
          style="min-width: 600px; width: 100%"
        >
  
          <el-table-column
            label="Material"
            :align="'center'"
            width="150"
            prop="material"
          >
            <template #default="scope">
              <div class="material-cell">{{ scope.row.material }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Thickness" :align="'center'">
            <template #default="scope">
              <el-input
                v-model="scope.row.thickness"
                placeholder="Thickness 입력"
                class="custom-input"
              ></el-input>
            </template>
          </el-table-column>
        </el-table> -->
      </section>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { watch, ref, onMounted } from "vue";
  import { getPstLayerOptions } from "../../../utils/Fab/fab-application-pst-utils";
  import type {
    SawType,
    FabRequestForm,
    Layer,
    PstType,
  } from "../../../interface/fab-application-rev2";
  import { convertKeysToCamelCase } from "../../../utils/key-converter";
  
  // Props 정의
  const props = defineProps<{
    fabApplication: FabRequestForm;
    sawType: SawType;
  }>();
  
  const pstTypes = ref<PstType[]>([]);
  const layers = ref<Layer[]>([]);
  
  onMounted(() => {
    if (Object.keys(props.sawType).length !== 0) {
      layers.value = props.fabApplication.pstLayers;
      pstTypes.value = props.sawType.pstTypes;
    }
  });
  
  // waferType 변경 감지
  watch(
    () => props.fabApplication.waferType,
    (newVal) => {
      if (["NS"].includes(props.fabApplication.waferType)) {
        props.fabApplication.pstLayers = [];
        props.fabApplication.pstId = null;
      } else {
        props.fabApplication.pstLayers = [];
        pstTypes.value = props.sawType.pstTypes;
        // pstTypes.value = props.sawType.pstTypes
  
        if (props.sawType.pstTypes.length == 1) {
          props.fabApplication.pstId = pstTypes.value[0].pstId;
        } else {
          layers.value = [];
          props.fabApplication.pstId = undefined;
        }
      }
    }
  );
  
  // const newTableData = ref<object[]>([]);
  // function updateTable() {
  //   for (let i = 0; i < layers.value.length; i++) {
  //     newTableData.value[0][layers[i].material] = layers[i].thickness;
  //   }
  // }
  
  // pstId 변경 감지
  watch(
    () => props.fabApplication.pstId,
    (newVal) => {
      if (props.fabApplication.waferType === "NS") {
        props.fabApplication.pstLayers = [];
      } else {
        if (newVal === undefined || newVal === null) {
          layers.value = [];
          props.fabApplication.pstLayers = [];
          
        } else {
          layers.value = getPstLayerOptions(newVal, props.sawType.pstTypes);
    
          if(props.fabApplication.waferType === "TC" && layers.value?.length == 3){
            layers.value[0].thickness = 5
            layers.value[2].thickness = 5
          }
    
          props.fabApplication.pstLayers = layers.value;
        }
        // updateTable()
      }
    }
  );
  </script>
  
  <script lang="ts">
  export default {};
  </script>
  
  <style scoped>
  /* 전체 컨테이너 스타일 */
  .pst-selection-container {
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* 섹션 스타일 */
  .section {
    margin-bottom: 24px;
  }
  
  /* 섹션 제목 스타일 */
  .section-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    border-left: 4px solid #4caf50;
    padding-left: 8px;
  }
  
  /* 커스텀 드롭다운 스타일 */
  .custom-select {
    width: 300px;
  }
  
  /* 테이블 스타일 */
  .custom-table {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .material-cell {
    font-weight: 500;
    color: #555;
  }
  
  /* 입력 필드 스타일 */
  .custom-input {
    width: 100%;
  }
  </style>