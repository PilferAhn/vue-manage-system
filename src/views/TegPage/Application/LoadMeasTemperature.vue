<template>
    <div v-if="isTCF">
      <!-- 온도 조건 선택 가능하도록 조건부 렌더링 적용 -->
      <el-form-item label="온도 조건">
        <!-- <el-select
          v-model="selectedCount"
          placeholder="Select number of temperatures"
        >
          <el-option v-for="num in 6" :key="num" :label="num" :value="num" />
        </el-select> -->
      </el-form-item>
  
      <el-form-item>
        <!-- 동적으로 생성된 온도 입력 필드 -->
        <!-- <el-row :gutter="10">
          <el-col
            :span="calculateSpan(displayInputs.length)"
            v-for="(input, index) in displayInputs"
            :key="index"
          >
            <el-form-item :class="{ 'error-input': inputErrors[index] }">
              <el-input
                v-model="displayInputs[index]"
                placeholder="Enter temperature"
                @input="validateInput(index)"
              />
              <span v-if="inputErrors[index]" class="error-text"
                >Please enter a valid number</span
              >
            </el-form-item>
          </el-col>          
        </el-row> -->
        <el-input v-model = "props.temperature"></el-input>
      </el-form-item>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from "vue";
  import { MeasInfo } from "../../../utils/waferApplicationHelper";
  
  const props = defineProps<{ measInfo: MeasInfo[], temperature : any }>();
  const emit = defineEmits(["updateTemperature"]);
  
  const selectedCount = ref(1);
  const temperatureInputs = ref(Array(1).fill("")); // 초기값 설정
  const inputErrors = ref(Array(1).fill(false)); // 초기 오류 상태 설정
  
  const isTCF = computed(() => {
    return props.measInfo.some((info) => info.measType === "TCF");
  });
  
  watch(
    selectedCount,
    (newValue) => {
      temperatureInputs.value = Array(newValue).fill("");
      inputErrors.value = Array(newValue).fill(false);
    },
    { immediate: true }
  );
  
  watch(
    temperatureInputs,
    (newValues) => {
      emit("updateTemperature", newValues);
    },
    { deep: true }
  );
  
  const displayInputs = computed(() => temperatureInputs.value);
  
  function validateInput(index) {
    const regex = /^[+-]?(\d+(\.\d+)?|\.\d+)$/;
    inputErrors.value[index] = !regex.test(temperatureInputs.value[index]);
  }
  
  const calculateSpan = (length) => {
    return length <= 5 ? 24 / length : 4; // 5개 이하면 전체 폭에서 균등 분할, 5개 이상은 span을 4로 설정
  };
  </script>
  
  <style scoped>
  .el-form-item {
    margin-bottom: 10px; /* 폼 아이템 사이의 간격 */
  }
  .el-input {
    width: 100%; /* 입력 필드 전체 너비 사용 */
  }
  .error-input input {
    border-color: red; /* 에러 시 입력 필드 테두리 색상 */
  }
  .error-text {
    color: red; /* 에러 메시지 색상 */
    font-size: 0.85em; /* 에러 메시지 폰트 크기 */
    margin-top: 2px; /* 에러 메시지와 입력 필드 간의 간격 */
  }
  </style>
  