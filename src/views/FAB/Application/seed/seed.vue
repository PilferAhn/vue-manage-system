<template>
  <div class="deposition-container">
    <section class="section">
      <idt-process
        :fab-application="props.fabApplication"
        :saw-type="props.sawType"
      />
    </section>

    <div v-if="props.fabApplication.isSeedSio2">
      <div class="align-center">
        <h3 class="section-title">SiO2Seed</h3>
        <!-- Seed 버튼 -->
      </div>

      <!-- <el-checkbox-button size="large" v-model="isSeedActive"
      >Activate Seed Information</el-checkbox-button
    > -->
      <!-- Seed 버튼이 활성화된 경우에만 정보 표시 -->
      <section class="section">
        <!-- <el-select v-model="props.fabApplication.seedId">
        <el-option
          v-for="opt in seedOptions"
          :key="opt.key"
          :label="opt.label"
          :value="opt.key"
        ></el-option>
      </el-select> -->
        <!-- <br />
      <br /> -->
        <el-table :data="props.fabApplication.seedLayers">
          <el-table-column label="Material" prop="material"></el-table-column>
          <el-table-column label="Thickness">
            <template #default="scope">
              <el-input v-model="scope.row.thickness"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import {
  seedType,
  type FabRequestForm,
  type SawType,
} from "../../../../interface/fab-application-rev2";
import type { OptionInterface } from "../../../../interface/option";
import IdtProcess from "../IdtProcess.vue";

// props 정의
const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();

const isSeedActive = ref(false); // Seed 활성화 상태
const seedOptions = ref<OptionInterface[]>([]);
const sType = ref<seedType>();

onMounted(() => {
  initializeSeedOptions();
  props.fabApplication.seedId = null;
  props.fabApplication.seedLayers = [];
});

watch(
  () => props.fabApplication.isSeedSio2,
  (newVal) => {
    isSeedActive.value = newVal;
    props.fabApplication.seedId = null;
    props.fabApplication.seedLayers = [];
    
    if(!newVal){      
    }
    else{
      initializeSeedOptions()
      // props.fabApplication.seedLayers = sType.value.layers;
    }

  }
);

watch(
  () => props.fabApplication.seedId,
  (newVal) => {
    if (props.fabApplication.seedId !== undefined && props.fabApplication.seedId !== null) {
      sType.value = props.sawType.seedTypes.find(
        (seed) => seed.seedId == newVal
      );
      props.fabApplication.seedLayers = sType.value.layers;
    }
  }
);

watch(
  () => props.sawType,
  () => {
    props.fabApplication.seedId = undefined;
    props.fabApplication.seedLayers = [];

    initializeSeedOptions();
    isSeedActive.value = false;
  }
);

function initializeSeedOptions() {
  seedOptions.value.length = 0;
  for (let i = 0; i < props.sawType.seedTypes.length; i++) {
    seedOptions.value.push({
      key: props.sawType.seedTypes[i].seedId,
      label: props.sawType.seedTypes[i].name,
      value: props.sawType.seedTypes[i].seedId.toString(),
    });
  }
  if (seedOptions.value.length == 1) {
    props.fabApplication.seedId = parseInt(seedOptions.value[0].value);
  }
}
</script>
<script lang="ts">
export default {};
</script>
<style scoped>
.align-center {
  display: flex;
  align-items: center;
  gap: 8px; /* Seed 버튼과 제목 간격 */
}
.deposition-container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.section {
  margin-top: 16px;
}
.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
}
</style>
