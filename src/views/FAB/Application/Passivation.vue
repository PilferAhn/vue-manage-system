<template>
  
  <div class="deposition-container" v-if="passOptions.length > 0">
    <h3 class="section-title">Passivation 정보</h3>
    
    <!-- <el-select
      v-model="props.fabApplication.passivationId"
      placeholder="Passivation Info"
    >
      <el-option
        v-for="pass in passOptions"
        :key="pass.key"
        :label="pass.label"
        :value="pass.key"
      ></el-option>
    </el-select> -->      
    
    <el-table :data="layers">
      <el-table-column label="Mat" prop="material"></el-table-column>
      <!-- <el-table-column label="Thickness" prop="thickness">
        <template #default="scope">
          <el-input v-model="scope.row.thickness"></el-input>
        </template>
      </el-table-column> -->
      <el-table-column label="Rank">
        <template #default="scope">
          <el-select v-model="scope.row.thickness">
            <el-option
              v-for="opt in passvationRandList"
              :key="opt"
              :label="opt"
              :value="opt"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import {
  type SawType,
  type Layer,
  type FabRequestForm,
  type IdtType,
  passivationType,
} from "../../../interface/fab-application-rev2";
import { OptionInterface } from "../../../interface/option";

const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();

const passOptions = ref<OptionInterface[]>([]);
const layers = ref<Layer[]>([]);
const passivation = ref<passivationType>();
const passvationRandList = [
  "X5",
  "X10",
  "X15",
  "X25",
  "X30",
  "X45",
  "X55",
  "X65",
  "X75",
  "X85",
  "X95",
  "X105",
  "X115",
];

// const passvationRandList = [
//   5,
//   10,
//   15,
// ];



watch(
  () => props.fabApplication.passivationId,
  (newVal) => {
    if (newVal !== undefined) {
      passivation.value = props.sawType.passivationTypes.find(
        (pass) => pass.passivationId == newVal
      );
      if (passivation.value === undefined) {
        layers.value = [];
      } else {        
        layers.value = passivation.value.layers;        
        props.fabApplication.passivationLayers = passivation.value.layers;
      }
    }
  }
);

watch(
  () => props.fabApplication.waferType,
  () => {
    props.fabApplication.passivationId = undefined;
    props.fabApplication.passivationLayers = [];
    // layers.value.length = 0;
    passOptions.value.length = 0;
    
    if (props.sawType.passivationTypes.length > 0) {
      for (let i = 0; i < props.sawType.passivationTypes.length; i++) {
        passOptions.value.push({
          key: props.sawType.passivationTypes[i].passivationId,
          label: props.sawType.passivationTypes[i].name,
          value: props.sawType.passivationTypes[i].passivationId.toString(),
        });
      }
    }
    if (passOptions.value.length == 1) {
      props.fabApplication.passivationId = parseInt(passOptions.value[0].value);
    }
  }
);
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
