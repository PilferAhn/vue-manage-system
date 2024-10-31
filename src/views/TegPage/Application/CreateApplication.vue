<template>
  <Application
    :application-data="application"
    :application-type="'create'"
  ></Application>
</template>

<script lang="ts" setup>
import Application from "./Application.vue";
import { initTegApplication2, initTegApplication } from "../Common/utility";
import type { TegApplication as TegApplicationInterface } from "../Common/ApplicationTypes";

const application: TegApplicationInterface = initTegApplication();
</script>

<style></style>


