
<template>
  <div>
    <CspRequestTemplete :application-data="applicationData" :application-type="'create'" />
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { reactive } from "vue";
import CspRequestTemplete from "./CspRequestTemplate.vue";
import { initializeApplicationData } from "../../../utils/cspRequestFormUtill";
const applicationData = reactive(initializeApplicationData());
const email = ref('')

</script>
  