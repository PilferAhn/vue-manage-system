<template>
  <!-- admin: 기존 메인 화면(AdminDashboard.vue) / 그 외: 개발자용 메인 화면(DeveloperDashboard.vue) (2026-11-22) -->
  <AdminDashboard v-if="isAdmin" />
  <DeveloperDashboard v-else />
</template>

<script setup lang="ts" name="dashboard">
import AdminDashboard from "./AdminDashboard.vue";
import DeveloperDashboard from "./DeveloperDashboard.vue";
import { getUserId } from "../../utils/account-utils";

const isAdmin = getUserId() === "admin";
</script>
