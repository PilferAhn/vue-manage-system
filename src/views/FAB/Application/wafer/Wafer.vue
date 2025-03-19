<script lang="ts">
export default {};
</script>
<template>
  <div class="deposition-container">
    <SelectWafer
      :fabApplication="props.fabApplication"
      :sawType="sawType"
    ></SelectWafer>

    <WaferDetails
      :fabApplication="props.fabApplication"
      :wafer-id="waferId"
      :sawType="sawType"
      v-model:hsWaferOptions="hsWaferOptions"
      v-model:hs-layers="hsLayers"
      v-model:wafer="wafer"
      :applicationType="props.applicationType"
    />

    <HSWaferSettings
      v-if="props.fabApplication.waferType === 'HS'"
      :fabApplication="props.fabApplication"
      
      :hsWaferOptions="hsWaferOptions"
      :hsLayers="hsLayers"
      :wafer="wafer"
      :applicationType="props.applicationType"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed, ref, watch } from "vue";
import {
  getFabWaferFromWaferId,
  createWaferOptions,
  createHsWaferCondition,
  createHsWaferLayerOption,
} from "../../../../utils/Fab/fab_application-wafer-utils";
import {
  type SawType,
  type FabRequestForm,
  type FabWafer,
  Layer,
  HsType,
} from "../../../../interface/fab-application-rev2";
import SelectWafer from "./SelectWafer.vue";
import WaferDetails from "./SelectWaferDetail.vue";
import HSWaferSettings from "./SetWaferThick.vue";
import { OptionInterface } from "../../../../interface/option";

// props 및 emit 정의
const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
  applicationType: string;
}>();

const emit = defineEmits(["update:fabApplication"]);

const hsWaferOptions = ref<OptionInterface[]>([]);
const waferId = ref("");
const wafer = ref<FabWafer>({});
const hsLayers = ref<Layer[]>([]);
const hsLayerstackId = ref<string | undefined>(undefined);
const localFabApplication = computed({
  get: () => props.fabApplication,
  set: (newValue) => emit("update:fabApplication", newValue),
});
</script>



<style scoped>
/* 전체 컨테이너 스타일 */
.deposition-container {
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

/* 입력과 선택 요소 스타일 */
.flex-container {
  display: flex;
  gap: 20px;
}

.custom-input {
  width: 100%;
}

.custom-select {
  width: 100%;
}

.custom-form-item {
  margin-bottom: 0; /* 기본 마진 제거 */
}
</style>
