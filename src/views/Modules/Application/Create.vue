<template>
  <div>
    <AppTemplate :application="application" application-type="create" />
  </div>
</template>

<script setup lang="ts">
import type { ModuleMeasurementApp } from "../../../interface/module_group/application/application";
import { getUserId, getUserName } from "../../../utils/account-utils";
import {
  initApplication,
  initApplication2,
  initNa,
} from "../../../utils/module_group/application-utils";
import AppTemplate from "./AppTemplate.vue";

const application = initApplication2();
</script>

<style></style>
