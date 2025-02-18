<template>
  <el-tabs type="border-card">
    <el-tab-pane
      v-for="(tab, index) in tabs"
      :key="index"
      :label="tab.label"
    >
      <LongInputText2
        v-model="props.fabApplication[tab.modelKey]"
        class="custom-input"
        :row-cnt="'4'"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import LongInputText2 from "../../Common/LongInputText2.vue";
import type { FabRequestForm, SawType } from "../../../interface/fab-application-rev2";

const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();

// 탭 배열 (label과 v-model에 들어갈 키값을 저장)
const tabs = [
  { label: "노광", modelKey: "photoNote" },
  { label: "메탈", modelKey: "metalNote" },
  { label: "유전막", modelKey: "dielectricLayerNote" },
  { label: "BP(두께)", modelKey: "bpThicknessNote" },
  { label: "BP(Probe)", modelKey: "bpProbeNote" },
  { label: "PA(CD)", modelKey: "paNote" },
  { label: "에칭", modelKey: "etchingNote" },
];
</script>
