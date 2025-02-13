<template>
  <div
    class="tc-selection-container"
    v-if="props.sawType.tcTypes && props.sawType.tcTypes.length > 0"
  >
    <!-- Thickness 선택 -->
    <section class="section">
      <h3 class="section-title">SiO2</h3>
      <el-select
        v-model="props.fabApplication.tcId"
        placeholder="Download Thickness 선택"
        class="custom-select"
        clearable
      >
        <el-option
          v-for="optWafer in props.sawType.tcTypes"
          :key="optWafer.tcId"
          :label="optWafer.name"
          :value="optWafer.tcId"
        ></el-option>
      </el-select>
    </section>

    <!-- Layer 테이블 -->
    <section class="section">
      <el-table :data="layerOptions" stripe class="custom-table">
        <!-- Index 컬럼 -->
        <el-table-column
          prop="idx"
          label="Index"
          :align="'center'"
          width="100"
        ></el-table-column>

        <!-- Material Name 컬럼 -->
        <el-table-column
          prop="material"
          label="Material Name"
          :align="'center'"
          width="150"
        ></el-table-column>

        <!-- Thickness 컬럼 -->
        <el-table-column label="Thickness" :align="'center'">
          <template #default="scope">
            <el-input
              v-model="scope.row.thickness"
              placeholder="Enter thickness"
              class="custom-input"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import type {
  SawType,
  FabRequestForm,
  Layer,
} from "../../../interface/fab-application-rev2";
import { getLayerOptions } from "../../../utils/Fab/fab-application-tc-utils";

// Props 정의
const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();

const layerOptions = ref<Layer[]>([]);

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
      } else {
        props.fabApplication.tcLayers = [];
      }
    } else {
      props.fabApplication.tcId = null;
      props.fabApplication.tcLayers = [];
    }
  }
);

// tcId 변경 감지
watch(
  () => props.fabApplication.tcId,
  (newVal) => {
    if (newVal !== undefined && newVal !== null) {
      layerOptions.value = getLayerOptions(newVal, props.sawType.tcTypes);
      props.fabApplication.tcLayers = layerOptions.value;
    }
  }
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

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 12px;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
}

/* 드롭다운 스타일 */
.custom-select {
  width: 300px;
}

/* 테이블 스타일 */
.custom-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
}

/* 입력 필드 스타일 */
.custom-input {
  width: 100%;
}
</style>
