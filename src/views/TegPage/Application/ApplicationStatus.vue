<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">
    <el-input
      v-model="statusMessage"      
    />
  </el-form-item>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { waferInformation } from "./../../../utils/tegTypes";
import { ElInput } from "element-plus";

const props = defineProps<{
  modelValue: string;
  label?: string;
  rules?: Array<any>;
  prop?: string;
  placeholder: String;
  waferInformation: waferInformation[];
}>();

const internalValue = ref(props.modelValue);
const localWaferInformation = ref<waferInformation[]>([
  ...props.waferInformation,
]);

const statusMessage = ref('');

watch(() => props.waferInformation, (newWaferInfos) => {
  const statuses = newWaferInfos.map(info => info.waferStatus);
  if (statuses.every(status => status === 'waiting')) {
    statusMessage.value = '측정 대기';
  } else if (statuses.includes('start')) {
    statusMessage.value = '측정 진행중';
  } else if (statuses.every(status => status === 'cancel' || status === 'finished')) {
    statusMessage.value = '측정 완료';
  } else {
    statusMessage.value = '측정 진행중'; // 기본 값이나 다른 상태를 처리할 메시지
  }
}, { deep: true });

// watch(
//   () => props.waferInformation, // waferInformation 배열을 감시 대상으로 설정
//   (newWaferInfos, oldWaferInfos) => {
//     // 새로운 배열의 각 웨이퍼 정보를 반복하면서 개별 waferStatus를 감시합니다.
//     newWaferInfos.forEach((waferInfo, index) => {
//       // 이전 정보와 새 정보를 비교하여 변화가 있는지 확인합니다.
//       if (!oldWaferInfos || oldWaferInfos[index]?.waferStatus !== waferInfo.waferStatus) {
//         console.log(`Wafer ${waferInfo.waferName} status changed from: ${oldWaferInfos[index]?.waferStatus} to: ${waferInfo.waferStatus}`);
//       }
//     });
//   },
//   { deep: true } // 배열 내부의 객체까지 감시하기 위해 deep 옵션 사용
// );


// watch(
//   () => props.waferInformation,
//   (newVal) => {
//     props.waferInformation;
//     localWaferInformation.value = [...newVal];
//   },
//   { deep: true }
// );
</script>
