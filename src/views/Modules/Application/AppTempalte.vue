<template>
  <!-- {{ props.applicationData }} -->
  <el-form
    :model="props.application"
    label-position="top"
    label-width="100px"
    ref="applicationForm"
  >
    <div class="container">
      <common-content
        :application="props.application"
        :application-type="props.applicationType"
      ></common-content>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import type { Application } from "../../../interface/Modules/Application/application";
import CommonContent from "./CommonContent.vue";
const props = defineProps<{
  application: Application;
  applicationType: string;
}>();
console.log(props.application)
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
@import "../../../assets/style/solderAppStyle.css";
</style>
