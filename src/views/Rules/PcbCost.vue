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
import imgUrl from "./../../assets/img/DAISHO DENSHI_SAMPLE QUOTATION TABLE_KR(250312).pdf"

</script>

<style>

</style>