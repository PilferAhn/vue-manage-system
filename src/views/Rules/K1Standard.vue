<!-- PdfViewer.vue -->
<template>
    <div class="pdf-wrapper">
        <!-- <el-avatar :src="imgUrl" /> -->
      <iframe
        :src="imgUrl"
        width="100%"
        height="800px"
        style="border: none;"
      ></iframe>
    </div>
  </template>

<script setup lang="ts">
import imgUrl from "./../../assets/img/K1standard_260108.png"

</script>

<style>

</style>