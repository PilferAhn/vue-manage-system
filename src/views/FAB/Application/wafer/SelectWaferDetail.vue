<template>
  <section class="section">
    <h3 class="section-title">Wafer 세부 설정</h3>
    <br />
    <div class="flex-container">
      <el-form-item class="custom-form-item" prop="waferAngle">
        <el-input
          v-model="props.fabApplication.waferAngle"
          placeholder="Enter Angle"
          class="custom-input"
          style="width: 230px"
        >
          <template #prepend>LT CUT</template>
        </el-input>
      </el-form-item>

      <el-form-item
        class="custom-form-item"
        prop="waferThickness"
        v-if="props.fabApplication.waferType !== 'HS'"
      >
        <el-input
          v-model="props.fabApplication.waferThickness"
          placeholder="Enter Thickness"
          class="custom-input"
          style="width: 230px"
        >
          <template #prepend>Thickness</template>
        </el-input>
      </el-form-item>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch, onMounted } from "vue";
import {
  getFabWaferFromWaferId,
  createAngleAndThickOptions,
  createHsWaferCondition,
} from "../../../../utils/Fab/fab_application-wafer-utils";
import type { OptionInterface } from "../../../../interface/option";
import type {
  SawType,
  FabWafer,
  FabRequestForm,
  Layer,
} from "../../../../interface/fab-application-rev2";

// Props 및 Emit 정의
const props = defineProps<{
  fabApplication: FabRequestForm;
  waferId: string;
  sawType: SawType;
  hsWaferOptions: OptionInterface[];
  hsLayers: Layer[];
  wafer: FabWafer;
  applicationType: string;
}>();

const angleAndThickOption = ref<OptionInterface[]>([]);
const wafer = ref<FabWafer>({});

// 로컬 상태 정의

const waferThickness = ref(0);
const angAndThink = ref("");

const emit = defineEmits([
  "update:hsWaferOptions",
  "update:hsLayers",
  "update:wafer",
]);

onMounted(() => {
  if (props.applicationType === "load") {
    wafer.value = getFabWaferFromWaferId(
      props.fabApplication.waferId.toString(),
      props.sawType.wafers
    );
    if (props.fabApplication.waferType === "HS") {
        // props.fabApplication.waferThickness = 500;
        emit("update:hsWaferOptions", createHsWaferCondition(wafer.value));
        emit("update:wafer", wafer.value);
        emit("update:hsLayers", createHsWaferCondition(wafer.value));
      }
  }
});

watch(
  () => props.fabApplication.waferId,
  (newVal) => {
    angleAndThickOption.value = [];
    props.fabApplication.waferAngle = 43;
    props.fabApplication.waferThickness = 0;
    waferThickness.value = 0;
    angAndThink.value = "";

    if (props.fabApplication.waferId !== undefined) {
      wafer.value = getFabWaferFromWaferId(newVal.toString(), props.sawType.wafers);
      props.fabApplication.waferId = parseInt(newVal.toString());
      angleAndThickOption.value = createAngleAndThickOptions(
        props.sawType,
        wafer.value.size,
        wafer.value.waferCompany,
        wafer.value.waferType,
        props.fabApplication.waferType
      );

      if (props.fabApplication.waferType === "HS") {
        props.fabApplication.waferThickness = 500;
        emit("update:hsWaferOptions", createHsWaferCondition(wafer.value));
        emit("update:wafer", wafer.value);
        emit("update:hsLayers", createHsWaferCondition(wafer.value));
      }
    }
  }
);

watch(
  () => angAndThink.value,
  (newVal) => {
    const tempList = newVal.split(",");
    if (tempList.length === 2) {
      props.fabApplication.waferAngle = parseFloat(tempList[0]);
      props.fabApplication.waferThickness = parseInt(tempList[1]);
    }
  }
);

// Watch로 부모 업데이트
//   watch(localAngle, (newValue) => emit("update:angle", newValue));
//   watch(localThickness, (newValue) => emit("update:thickness", newValue));
//   watch(localAngAndThink, (newValue) => emit("update:angAndThink", newValue));
</script>
<script lang="ts">
export default {};
</script>
<style scoped>
.flex-container {
  display: flex;
  gap: 20px;
}
</style>
