<template>
    <div class="input-container">
      <el-row :gutter="10" class="inline-row">
        <el-form-item label="Product Name" prop="productName">
          <!-- Model Name Input -->
          <el-input
            v-model="props.fabApplication.productName"
            placeholder="Model Name"
            class="small-input"
            style="width: 350px; margin-right: 20px;"
            @input="syncInputValuesFromProductName"
          ></el-input>
  
          <!-- Character Inputs -->
          <!-- <el-input
            v-for="(char, index) in inputValues"
            :key="index"
            v-model="inputValues[index]"
            maxlength="1"
            placeholder=" "
            class="small-input"
            @input="syncProductNameFromInputValues"
          ></el-input> -->
        </el-form-item>
      </el-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from "vue";
  import type { FabRequestForm, SawType } from "../../../interface/fab-application-rev2";
  
  // Props 선언
  const props = defineProps<{
    fabApplication: FabRequestForm;
    sawType: SawType;
  }>();
  
  // 12개의 input을 위한 문자열 배열 초기화
  const inputValues = ref<string[]>(Array(12).fill(""));
  
  // props.fabApplication.productName의 변화를 감지하여 inputValues를 업데이트
  watch(
    () => props.fabApplication.productName,
    (newProductName) => {
      // productName을 한 글자씩 배열로 나눠 inputValues에 반영
      inputValues.value = Array.from(newProductName.padEnd(12, " ")).slice(0, 12);
    },
    { immediate: true } // 초기값 설정
  );
  
  // inputValues의 변화를 감지하여 props.fabApplication.productName을 업데이트
  watch(
    inputValues,
    (newValues) => {
      // 배열의 값을 문자열로 병합하여 productName에 반영
      props.fabApplication.productName = newValues.join("").trim();
    },
    { deep: true }
  );
  
  // Model Name Input에서 inputValues를 업데이트
  function syncInputValuesFromProductName() {
    inputValues.value = Array.from(
      props.fabApplication.productName.padEnd(12, " ")
    ).slice(0, 12);
  }
  
  // 개별 InputValues 변경 시 Model Name 업데이트
  function syncProductNameFromInputValues() {
    props.fabApplication.productName = inputValues.value.join("").trim();
  }
  </script>
  
  <script lang="ts">
  export default {};
  </script>
  
  <style scoped>
  .input-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  
  .inline-row {
    display: flex;
    flex-wrap: nowrap; /* 한 줄에만 표시되도록 설정 */
    align-items: center;
    gap: 5px; /* 입력 칸 사이 간격 설정 */
  }
  
  .small-input {
    width: 40px; /* 입력 필드 크기 조정 */
    text-align: center;
  }
  </style>