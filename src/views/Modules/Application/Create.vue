<template>
  <div>
    <AppTemplate :application="application" application-type="create" />
  </div>
</template>

<script setup lang="ts">
import {
  initApplication2,
} from "../../../utils/module_group/application-utils";
import AppTemplate from "./AppTemplate.vue";

const application = initApplication2();
</script>

<style></style>
