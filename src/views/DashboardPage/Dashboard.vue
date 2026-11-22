<template>
  <!-- admin: 기존 메인 화면 / 그 외: 개발자용 메인 화면 (2026-11-22)
       기존 화면 원본: Dashboard.vue.bak_20261122 -->
  <AdminDashboard v-if="isAdmin" />
  <DeveloperDashboard v-else />
</template>

<script setup lang="ts" name="dashboard">
import AdminDashboard from "./AdminDashboard.vue";
import DeveloperDashboard from "./DeveloperDashboard.vue";
import { getUserId } from "../../utils/account-utils";

const isAdmin = getUserId() === "admin";
</script>
