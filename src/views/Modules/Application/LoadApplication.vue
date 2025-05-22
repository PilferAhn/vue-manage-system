<script lang="ts">
export default {};
</script>
<template>
  <div>
    <AppTemplate :application="application" application-type="load" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { reactive, watch } from "vue";
import { sendGetRequest } from "../../../utils/httpProtocol";
import { ModuleMeasurementApp } from "../../../interface/module_group/application/application";
import AppTemplate from "./AppTemplate.vue";
import { initApplication2 } from "../../../utils/module_group/application-utils";
import {
  convertPep8ToCamelCase2,
  convertKeysToCamelCase,
} from "../../../utils/key-converter";
const route = useRoute(); // Access the route
// const application = reactive<ModuleMeasurementApp>({});
const application = initApplication2();
// Watch the `uuid` route parameter, fetch data immediately and when it changes

watch(
  () => route.params.id, // Watching route parameter change
  async (id) => {
    if (id) {
      const url = "/module/get_app_by_id";

      const tempApp = await sendGetRequest(url, id as any);

      Object.assign(application, convertPep8ToCamelCase2(tempApp));      
      if (application.nfApp !== null) {
        application.isNa = true;
      }

      if (application.naApp !== null) {
        application.isNa = true;
      }

      //   fetchApplication(id); // Fetch data when uuid changes
    }
  },
  { immediate: true } // Trigger immediately on component mount
);
</script>

<style></style>
