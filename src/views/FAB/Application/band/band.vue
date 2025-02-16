<template>
  <el-form-item label="Band">
    <el-select v-model="props.fabApplication.band">
      <el-option v-for="band in newBandList" :key="band.bandCombinationId"
      :label="band.label" :value="band.bandCombinationId"></el-option>
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import { on } from "events";
import type {
  FabRequestForm,
  band,
} from "../../../../interface/fab-application-rev2";
import { watch, onMounted, ref } from "vue";

const props = defineProps<{
  fabApplication: FabRequestForm;
  bandList: band[];
}>();

const newBandList = ref<band[]>([]);

onMounted(() => {
  newBandList.value = props.bandList;
});

watch(()=>props.bandList, (newVal)=>{
    newBandList.value = newVal
})

watch(
  () => props.fabApplication.freqRange,
  (newVal) => {
    if (newVal !== undefined && newVal !== null) {
      newBandList.value = [];
      for (let i = 0; i < props.bandList.length; i++) {
        if (
          props.fabApplication.freqRange ===
          props.bandList[i].bandGroupId
        ) {
          newBandList.value.push(props.bandList[i]);
        }
      }
    }
  }
);
</script>
<script lang="ts">
export default {};
</script>
<style></style>
