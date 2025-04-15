<script lang="ts">
export default {};
</script>
<template>
  <div>
    <Application
      :application-data="tegApp"
      :application-type="'load'"
    ></Application>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { watch, ref, onMounted } from "vue";
import type {
  TegApplication as TegApplicationInterface,
  TestTypeOptions as TestTypeOptionsInterface,
} from "../Common/ApplicationTypes";
import { getApplicationDetail } from "./LoadTegApplication";
import { initTegApplication } from "../Common/utility";
import Application from "./Application.vue";

const tegApp = ref<TegApplicationInterface>();
tegApp.value = initTegApplication();
const route = useRoute();

// UUID 변경 감지
watch(
  ()  => route.params.uuid,
  async (newUuid) => {
    if (newUuid) {
      await getApplicationDetail(newUuid, tegApp.value);
      
    }
  }
  //   { immediate: true }
); // immediate: true 옵션으로 컴포넌트 마운트 시 즉시 실행

onMounted(async () => {  
  await getApplicationDetail(route.params.uuid, tegApp.value);
  
});
</script>

<style></style>
