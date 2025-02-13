<template>
  <AppTemplate :application="application" application-type="create" />


</template>

<script setup lang="ts">
import type { Application } from "../../../interface/Modules/Application/application";
import { initApplication } from "../../../utils/moduleGroup/application-utiles";
import AppTemplate from "./AppTempalte.vue";

const { application } = initApplication();

</script>

<style></style>
