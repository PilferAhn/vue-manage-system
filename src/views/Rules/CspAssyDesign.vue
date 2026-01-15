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
import imgUrl from "./../../assets/img/CSP_Ass'y_Design_Rule_Rev.11_R2.pdf"

</script>

<style>

</style>