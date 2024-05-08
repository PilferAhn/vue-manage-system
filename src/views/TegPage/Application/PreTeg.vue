<!-- TegSize.vue -->
<template>
  <div class="teg-size-container">
    <el-form label-position="top" class="teg-size-form">

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="SHORT Pattern No.">
            <el-input v-model="shotPatternNo" placeholder="1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="THRU Pattern No.">
            <el-input v-model="thruPatternNo" placeholder="4"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="OPEN Pattern No.">
            <el-input v-model="openPatternNo" placeholder="6"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="RAW Pattern No.">
            <el-input v-model="rawPatternNo" placeholder="43"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["updatePattern"]);


const shotPatternNo = ref("");
const thruPatternNo = ref("");
const openPatternNo = ref("");
const rawPatternNo = ref("");


// 개별 watch 설정 대신 하나의 함수에서 모든 변경사항을 처리합니다.
const updatePattern = () => {
  emit("updatePattern", {

    shotPatternNo: shotPatternNo.value,
    thruPatternNo: thruPatternNo.value,
    openPatternNo: openPatternNo.value,
    rawPatternNo: rawPatternNo.value,

  });
};

// 모든 ref에 대해 updateSizes 함수를 호출하도록 watch 설정
const refs = [

  shotPatternNo,
  thruPatternNo,
  openPatternNo,
  rawPatternNo,

];
refs.forEach((refItem) => {
  watch(refItem, updatePattern);
});
</script>

<style scoped>
.teg-size-container {
  margin: 20px;
}
.teg-size-form {
  max-width: 1000px; /* Adjust as needed for proper spacing */
}
.el-form-item {
  margin-bottom: 16px; /* Space between form items */
}
</style>
