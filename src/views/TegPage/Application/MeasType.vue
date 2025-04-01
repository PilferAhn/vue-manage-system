<template>
  <div>
    <el-form-item label="측정 종류">
      <el-checkbox-group v-model="selectedMeasTypes" @change="emitUpdate">
        <el-checkbox-button
          v-for="type in newMeasTypes"
          :key="type"
          :label="type"
          :value="type"
          class="meas-type-button"
        >
          {{ type }}
        </el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { newMeasTypes } from "../Common/ApplicationTypes";
import type {
  TegApplication as TegApplicationInterface,
  TestTypeOptions as TestTypeOptionsInterface,
} from "../Common/ApplicationTypes";

// Define props to receive processData
const props = defineProps<{
  applicationData: TegApplicationInterface;
  applicationType: string;
}>();

// 정의된 이벤트
const emit = defineEmits(["updateMeasInfo"]);

const selectedMeasTypes = ref<string[]>(["TEG"]);

// 중복을 허용하지 않을 버튼 (TCF와 TEG)
const mutuallyExclusiveTypes = ["TCF", "TEG"];

const emitUpdate = () => {
  const newMeasInfo = selectedMeasTypes.value.map((type) => ({
    measType: type,
    freqSectionInfo: [], // 해당 부분은 나중에 채울 예정
  }));

  // 부모 컴포넌트로 새로운 measInfo 배열을 전송
  emit("updateMeasInfo", newMeasInfo);
};

// 중복 선택 방지 로직
const preventMutualExclusion = () => {
  const hasTCF = selectedMeasTypes.value.includes("TCF");
  const hasTEG = selectedMeasTypes.value.includes("TEG");

  // TCF와 TEG가 동시에 선택되면 하나를 제거
  if (hasTCF && hasTEG) {
    // TEG 버튼이 가장 마지막에 선택되었다면 TCF를 제거하고, 그 반대의 경우는 TEG를 제거
    const lastSelected =
      selectedMeasTypes.value[selectedMeasTypes.value.length - 1];
    if (lastSelected === "TEG") {
      selectedMeasTypes.value = selectedMeasTypes.value.filter(
        (type) => type !== "TCF"
      );
    } else if (lastSelected === "TCF") {
      selectedMeasTypes.value = selectedMeasTypes.value.filter(
        (type) => type !== "TEG"
      );
    }
  }
};

// onMounted(async () => {
  
//   console.log(props.applicationData)
//   if(props.applicationData.measInfo.length > 0){
//     console.log(props.applicationData.measInfo);
//   }
//   // if (props.applicationData.measInfo[0].measType === "TCF") {
//   //   selectedMeasTypes.value.length = 0;
//   //   selectedMeasTypes.value = ["TCF"];
//   // }
// });

// watch(()=> props.applicationData.measInfo , (newVal) => {
//   console.log(newVal)
//   if(newVal.length >= 1){
//     selectedMeasTypes.value.length = 0;
//     if(props.applicationData.measInfo[0].measType === "TCF"){
//       selectedMeasTypes.value.length = 0
//       selectedMeasTypes.value = ["TCF"]
//     }
//     else{
//       selectedMeasTypes.value.length = 0
//       selectedMeasTypes.value = ["TEG"]
//     }
//   }
// })

// selectedMeasTypes의 변화를 감지하여 중복 선택을 방지하고, emitUpdate 함수를 호출
watch(
  selectedMeasTypes,
  (newVal) => {
    preventMutualExclusion();
    emitUpdate();
  },
  { immediate: true }
);
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

<script lang="ts">
export default {};
</script>
