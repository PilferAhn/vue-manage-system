<template>
  <section class="section">
    <h3 class="section-title">Wafer</h3>
    <br>
    <el-select
      v-model="props.fabApplication.waferId"
      placeholder="Select Wafer"
      class="custom-select"
      clearable
    >
      <el-option
        v-for="opt in availableWafer"
        :key="opt.key"
        :label="opt.label"
        :value="opt.key"
      ></el-option>
    </el-select>
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

const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
  
}>();

const availableWafer = ref<OptionInterface[]>([]);

onMounted(()=> {

  
  if(Object.keys(props.sawType).length !== 0){
    availableWafer.value = createWaferOptions(props.sawType);    
  }

})

watch(
  () => props.fabApplication.waferType,
  (newValue) => {    
    props.fabApplication.waferId = undefined
    availableWafer.value = []
    availableWafer.value = createWaferOptions(props.sawType);
    
    if(availableWafer.value.length == 1){
      props.fabApplication.waferId = availableWafer.value[0].key
    }
    props.fabApplication.waferAngle = undefined
    props.fabApplication.hsTrimingTarget = null    
  }
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
</style>
