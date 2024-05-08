<template>
  <div>
    <el-form-item label="측정 종류">
      <el-checkbox-group v-model="selectedMeasTypes" @change="emitUpdate">
        <el-checkbox-button
          v-for="type in measTypes"
          :key="type"
          :label="type"
          :value="type"
          class="meas-type-button">
          {{ type }}
        </el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { measTypes, FreqSectionInfo } from "../../../utils/waferApplicationHelper";

// 정의된 이벤트
const emit = defineEmits(['updateMeasInfo']);

const selectedMeasTypes = ref<string[]>([]);


const emitUpdate = () => {
  const newMeasInfo = selectedMeasTypes.value.map(type => ({
    measType: type,
    freqSectionInfo: [] // 해당 부분은 나중에 채울 예정
  }));
  
  // 부모 컴포넌트로 새로운 measInfo 배열을 전송
  emit('updateMeasInfo', newMeasInfo);
  
}

// selectedMeasTypes의 변화를 감지하여 emitUpdate 함수를 호출
watch(selectedMeasTypes, emitUpdate, { immediate: true });
</script>

<style scoped>


.el-checkbox-button {
  margin-right: 5px;
  margin-bottom: 10px; /* Space between buttons */
  border: none; /* Remove default border */
  background-color: #f7f7f7; /* Slight grey background */
  color: #333; /* Dark text for better readability */
  border-radius: 4px; /* Rounded corners */
  transition: all 0.3s ease; /* Smooth transition for hover effects */
}

.el-checkbox-button:hover {
  transform: translateY(-2px); /* Slight raise effect on hover */
  background-color: #e1e9ee; /* Lighter background on hover */
}
</style>
