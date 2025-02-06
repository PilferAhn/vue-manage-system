<template>
  <section class="section">
    <h3 class="section-title">HS Wafer 구조 선택</h3>
    <br>
    <el-row :gutter="20" class="align-center">
      <el-col :span="11">
        <el-form-item>
          <el-select
            v-model="props.fabApplication.hsId"
            placeholder="성막 조건 선택"
            class="custom-select"
            clearable
          >
            <el-option
              v-for="opt in hsWaferOptions"
              :key="opt.key"
              :label="opt.label"
              :value="opt.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-table :data="hsLayers">
      <el-table-column label="Index" prop="idx" :align="'center'" />
      <el-table-column label="Name" prop="material" :align="'center'" />
      <el-table-column label="Thickness" :align="'center'">
        <template #default="scope">
          <el-input v-model="scope.row.thickness" :disabled="true"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-form-item
      class="custom-form-item"      
    >
      <el-input
        v-model="props.fabApplication.hsTrimingTarget"
        placeholder="Enter Trimming Value"
        class="custom-input"
        style="width: 300px"
      >
        <template #prepend>Trimming</template>
      </el-input>
    </el-form-item>
    <el-alert v-if="ltThick !== undefined && props.fabApplication.hsTrimingTarget >= ltThick" title="Trimming 값은 LT 값보다 클 수 없습니다" type="error" />
  </section>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, watch, ref, onMounted } from "vue";
import type {
  FabWafer,
  Layer,
  FabRequestForm
} from "../../../../interface/fab-application-rev2";
import type { OptionInterface } from "../../../../interface/option";
import { createHsWaferLayerOption, getHsWaferAngle, getLtThickness } from "../../../../utils/Fab/fab_application-wafer-utils";
import { fabRequestFormRules } from "../../../../utils/rules/fab-application";


const props = defineProps<{
  fabApplication: FabRequestForm;
  hsLayerstackId: string | undefined;
  hsWaferOptions: OptionInterface[];
  hsLayers: Layer[];
  wafer: FabWafer;
}>();


onMounted(() => {
  if(props.fabApplication.hsType !== null && Object.keys(props.fabApplication.hsType).length !== 0){
    // hsLayers.value = createHsWaferLayerOption(props.fabApplication.hsId.toString(), props.wafer);
    // console.log(hsLayers.value)
    hsLayers.value = props.fabApplication.hsType.layers
  }
  
})


const haLayerStackId = ref(props.hsLayerstackId);
const hsLayers = ref<Layer[]>([]);
const ltThick = ref<number | undefined>(undefined)
watch(
  () => props.fabApplication.hsId,
  (newVal) => {
    if (props.fabApplication.hsId !== undefined) {
                
      hsLayers.value = createHsWaferLayerOption(newVal.toString(), props.wafer);
      ltThick.value = getLtThickness(hsLayers.value)
      props.fabApplication.waferAngle = getHsWaferAngle(newVal.toString(), props.wafer)
    }
  }
);

const emit = defineEmits(["update:hsLayerstackId"]);
</script>
<script lang="ts">
export default {};
</script>
<style scoped>
.section {
  margin-bottom: 24px;
}

</style>
