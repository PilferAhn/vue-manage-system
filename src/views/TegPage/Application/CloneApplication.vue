<template>
  <Application
    :application-data="applicationForm"
    :application-type="'clone'"
  ></Application>
</template>

<script setup lang="ts">
import Application from "./Application.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { defaultTegApplicationForm } from "../../../utils/tegTypes";
import { cloneApplicationDetail } from "./LoadTegApplication";
import type { TegApplication as TegApplicationInterface } from "../Common/ApplicationTypes";

const route = useRoute();

const applicationForm: TegApplicationInterface = defaultTegApplicationForm();

// UUID 변경 감지
watch(
  () => route.params.uuid,
  (newUuid) => {
    if (newUuid) {
      // getApplicationDetail(newUuid, tegApplicationForm);
      cloneApplicationDetail(newUuid as string, applicationForm);
    }
  },
  { immediate: true }
); // immediate: true 옵션으로 컴포넌트 마운트 시 즉시 실행
</script>

<style></style>
