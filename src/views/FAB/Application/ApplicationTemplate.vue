<template>
  <div>
    <el-form
      ref="fabFormRef"
      :model="props.fabApplication"
      :rules="fabRequestFormRules"
      :label-position="'top'"
      label-width="auto"
    >
      <!-- Split Screen Layout -->
      <div style="display: flex; gap: 20px; margin-top: 20px">
        <!-- Left Side: Application -->
        <div style="flex: 1; border-right: 1px solid #ccc; padding-right: 10px">
          <!-- <User
            v-model:designer="props.fabApplication.designer"
            v-model:designerId="props.fabApplication.designerId"
            v-model:requester="props.fabApplication.requester"
            v-model:requesterId="props.fabApplication.requesterId"
          ></User> -->

          <ApplicationContent
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          ></ApplicationContent>

          <Buttons
            v-model:fabApplication="props.fabApplication"
            :fabFormRef="fabFormRef"
            :application-type="props.applicationType"
          ></Buttons>
        </div>

        <!-- Right Side: Wafer and Deposition -->
        <div style="flex: 1; padding-left: 10px">
          <PhotoSection
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"            
          />
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
          ></Pst>
          <Ct
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          ></Ct>
          <Passivation
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          ></Passivation>
          <Seed
            v-if="sawType && sawType.seedTypes && sawType.seedTypes.length > 0"
            v-model:fabApplication="props.fabApplication"
            :sawType="sawType"
          ></Seed>
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
  }
);
</script>

<script lang="ts">
export default {
  components: {},
};
</script>

<style scoped>
/* @import "../../../assets/css/fab-request-form.css"; */
</style>
