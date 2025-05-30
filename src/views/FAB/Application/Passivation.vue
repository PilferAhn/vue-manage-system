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

    <el-table :data="props.fabApplication.passivationLayers">
      <el-table-column label="Mat" prop="material"></el-table-column>
      <!-- <el-table-column label="Thickness" prop="thickness">
          <template #default="scope">
            <el-input v-model="scope.row.thickness"></el-input>
          </template>
        </el-table-column> -->
      <el-table-column label="Rank">
        <template #default="scope">
          <el-select v-model="scope.row.thickness" clearable>
            <el-option
              v-for="opt in passRankOptions"
              :key="opt.key"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import {
  type SawType,
  type Layer,
  type FabRequestForm,
  type IdtType,
  passivationType,
} from "../../../interface/fab-application-rev2";
import {
  OptionInterface,
  OptionNumberInterface,
} from "../../../interface/option";

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
  "X35",
  "X40",
  "X45",
  "X55",
  "X65",
  "X75",
  "X85",
  "X95",
  "X105",
  "X115",
];

const passRankOptions = ref<OptionNumberInterface[]>([
  
  { key: 2, label: "X10", value: 10 },
  { key: 5, label: "X25", value: 25 },
  { key: 6, label: "X30", value: 30 },
  { key: 7, label: "X35", value: 35 },
  { key: 8, label: "X40", value: 40 },
  { key: 9, label: "X45", value: 45 },
  { key: 10, label: "X50", value: 50 },
  { key: 11, label: "X55", value: 55 },  
  { key: 13, label: "X65", value: 65 },

]);

watch(
  () => props.fabApplication.passivationId,
  (newVal) => {
    if (newVal !== undefined && newVal !== null) {
      passivation.value = props.sawType.passivationTypes.find(
        (pass) => pass.passivationId == newVal
      );

      props.fabApplication.passivationLayers = passivation.value.layers;
    }
  }
);

watch(
  () => props.fabApplication.waferType,
  (newVal) => {
    if (
      newVal !== null &&
      newVal !== undefined &&
      props.sawType.passivationTypes !== undefined &&
      props.sawType.passivationTypes !== null
    ) {
      // props.fabApplication.passivationId = undefined;
      // props.fabApplication.passivationLayers = [];
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
        props.fabApplication.passivationId = parseInt(
          passOptions.value[0].value
        );
      }
      
    }
  },
  {
    immediate: true,
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
