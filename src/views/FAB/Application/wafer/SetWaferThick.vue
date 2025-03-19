<script lang="ts">
export default {};
</script>
<template>
    <section class="section">
      <el-row :gutter="20" class="align-center">
        <h3 class="section-title">HS Wafer Structure</h3>
        <el-col :span="15"> </el-col>
      </el-row>
      <el-form-item>
        <el-select
          v-model="props.fabApplication.hsId"
          placeholder="Select Wafer"
          class="custom-select"
          clearable
        >
          <el-option
            v-for="opt in props.hsWaferOptions"
            :key="opt.key"
            :label="opt.label"
            :value="opt.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <pre>hsLayers: {{ hsLayers }}</pre>
      <pre>columns: {{ columns }}</pre>
      <pre>newTableData: {{ newTableData }}</pre> -->
  
      <el-table :data="newTableData">
        <el-table-column
          v-for="(col, index) in columns"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :align="'center'"
        >
          <template #default="scope">
            <el-input v-model="scope.row[col.prop]" :disabled="true"></el-input>
          </template>
        </el-table-column>
      </el-table>
  
      <br />
      <el-form-item class="custom-form-item">
        <el-input
          v-model="props.fabApplication.hsTrimingTarget"
          placeholder="Enter Target Value (LT)"
          class="custom-input"
          style="width: 400px"
        >
          <template #prepend>Target Value After Trimming </template>
        </el-input>
      </el-form-item>
  
      <el-alert
        v-if="
          ltThick !== undefined && props.fabApplication.hsTrimingTarget >= ltThick
        "
        title="Trimming 값은 LT 값보다 클 수 없습니다"
        type="error"
      />
    </section>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, watch, ref, computed, onMounted } from "vue";
  import type {
    FabWafer,
    Layer,
    FabRequestForm,
  } from "../../../../interface/fab-application-rev2";
  import type { OptionInterface } from "../../../../interface/option";
  import {
    createHsWaferLayerOption,
    getHsWaferAngle,
    getLtThickness,
  } from "../../../../utils/Fab/fab_application-wafer-utils";
  
  const props = defineProps<{
    fabApplication: FabRequestForm;
    
    hsWaferOptions: OptionInterface[];
    hsLayers: Layer[];
    wafer: FabWafer;
    applicationType: string;
  }>();
  
  
  const hsLayers = ref<Layer[]>([]);
  const newTableData = ref<object[]>([]);
  const ltThick = ref<number | undefined>(undefined);
  
  // 📌 컬럼 데이터 (hsLayers 기반 동적 생성)
  const columns = computed(() => {
    return hsLayers.value.map((layer) => ({
      label: layer.material, // 컬럼 헤더
      prop: layer.material, // 데이터 바인딩 키
    }));
  });
  
  // 📌 테이블 데이터 업데이트 함수
  function updateTable() {
    newTableData.value = [];
    const temp: Record<string, number> = {};
  
    for (let i = 0; i < hsLayers.value.length; i++) {
      temp[hsLayers.value[i].material] = hsLayers.value[i].thickness;
    }
  
    newTableData.value.push(temp);
  }
  
  // 📌 onMounted 시 초기 테이블 설정
  onMounted(() => {
    if (
      props.fabApplication.hsType &&
      Object.keys(props.fabApplication.hsType).length !== 0
    ) {
      hsLayers.value = props.fabApplication.hsType.layers;
      updateTable();
    }
    if (props.applicationType !== "load") {
      props.fabApplication.hsId = undefined;
    }
  });
  
  // 📌 HS Wafer 변경 감지
  watch(
    () => props.fabApplication.hsId,
    (newVal) => {
      
      if (newVal !== undefined && newVal !== null) {
        hsLayers.value = createHsWaferLayerOption(newVal.toString(), props.wafer);
        ltThick.value = getLtThickness(hsLayers.value);
  
        if (props.applicationType !== "load") {
          props.fabApplication.waferAngle = getHsWaferAngle(
            newVal.toString(),
            props.wafer
          );
        }
        updateTable();
      }
    },
    { immediate: true }
  );
  
  // const emit = defineEmits(["update:hsLayerstackId"]);
  </script>
  
  <style scoped>
  .section {
    margin-bottom: 24px;
  }
  </style>