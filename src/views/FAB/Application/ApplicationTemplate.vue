<template>
  <div>
    <el-form
      ref="fabFormRef"
      :model="props.fabApplication"
      :rules="fabRequestFormRules"
      label-position="top"
      label-width="auto"
    >
      <!-- Split Screen Layout -->
      <div class="form-container">
        <!-- Left Side: Application -->
        <div class="left-section">
          <ApplicationContent
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          />

          <Buttons
            v-model:fabApplication="props.fabApplication"
            :fabFormRef="fabFormRef"
            :application-type="props.applicationType"
          />
        </div>

        <!-- Right Side: Wafer and Deposition -->
        <div class="right-section">
          <Wafer
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
            :applicationType="props.applicationType"
          />
          <Deposition
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          />
          <Pst
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          />
          <PhotoSection
            v-if="props.fabApplication.photo !== null"
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          />

          <Ct
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          />
          <Passivation
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          />
          <Seed
            v-if="sawType?.seedTypes?.length > 0"
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive } from "vue";
import { SawType, band } from "./../../../interface/fab-application-rev2";
import { defineSawTypeByWaferType } from "../../../utils/Fab/fab_application-wafer-utils";
import Wafer from "./wafer/Wafer.vue";
import Deposition from "./Deposition.vue";
import Ct from "./Ct.vue";
import Pst from "./Pst.vue";
import Seed from "./seed/seed.vue";
import Passivation from "./Passivation.vue";
import ProductName from "./ProductName.vue";
import Buttons from "./Buttons.vue";
import ApplicationContent from "./ApplicationContent.vue";
import type { FabRequestForm } from "./../../../interface/fab-application-rev2";
import PhotoSection from "./photo/photo.vue";
import { fabRequestFormRules } from "../../../utils/rules/fab-application";
import type { FormInstance } from "element-plus";
import IdtProcess from "./IdtProcess.vue";
import Bom from "./bom/Bom.vue";
const fabFormRef = ref<FormInstance | null>(null);

const props = defineProps<{
  fabApplication: FabRequestForm;
  applicationType: string;
  options: SawType[];
  sawType: SawType;
}>();

const sawType = reactive<SawType>({ ...props.sawType });

watch(
  () => props.fabApplication.waferType,
  (newVal, oldVal) => {
    Object.assign(sawType, defineSawTypeByWaferType(newVal, props.options));
    console.log(sawType.passivationTypes);
  }
);
</script>

<script lang="ts">
export default {
  components: {},
};
</script>

<style scoped>
.form-container {
  display: flex;
  width: 100%;
  justify-content: space-between; /* 공백이 없도록 조정 */
  align-items: flex-start;
}

.section-box {
  flex: 1;
  padding: 20px;
  box-sizing: border-box; /* 패딩과 테두리를 포함하여 정확한 크기 유지 */
}

.left-section {
  width: 50%;
  margin-right: 10px; /* border-right 대신 margin 사용 */
}

.right-section {
  width: 50%;
}

/* 반응형 디자인 - 화면이 너무 작아질 때 */
@media (max-width: 1024px) {
  .form-container {
    flex-direction: column;
  }

  .left-section,
  .right-section {
    flex: 1 1 auto;
    width: 100%;
    border-right: none;
  }
}
</style>
