<template>
  <div
    v-if="isLoad"
    style="display: flex; justify-content: space-between; gap: 20px"
  >
    <div style="flex: 1">
      <SolderWeekly
        :chart-title="previousMonth.split('-')[1]"
        :raw-data="rawData2"
      ></SolderWeekly>
    </div>
    <div style="flex: 1">
      <SolderWeekly
        :chart-title="referenceMonth.split('-')[1]"
        :raw-data="rawData1"
      ></SolderWeekly>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import SolderWeekly from "./SolderWeekly.vue";
import {
  formatDate,
  convertDateTimeToDateTimeString,
} from "../../../../utils/date-utils";
import { getMeasurementHistoryByDate } from "./solder-static-utils";
import type { MeasurementData } from "./temp";
const props = defineProps<{
  dateString: string;
}>();

const referenceMonth = ref("");
const previousMonth = ref("");
const result1 = ref<any>({});
const result2 = ref<any>({});
const rawData1 = ref<MeasurementData[]>([]);
const rawData2 = ref<MeasurementData[]>([]);
const isLoad = ref(false);
const yMax = ref(0);

referenceMonth.value = getAdjustedMonthDate(props.dateString, 0);
previousMonth.value = getAdjustedMonthDate(props.dateString, -1);

const firstDate = ref("");
const lastDate = ref("");

watch(
  () => props.dateString,
  async (newVal, oldVal) => {
    isLoad.value = false;

    referenceMonth.value = getAdjustedMonthDate(props.dateString, 0);
    previousMonth.value = getAdjustedMonthDate(props.dateString, -1);

    result1.value = getMonthStartAndEnd(referenceMonth.value);
    result2.value = getMonthStartAndEnd(previousMonth.value);

    rawData1.value = await getMeasurementHistoryByDate(
      result1.value.startDate,
      result1.value.endDate
    );
    rawData2.value = await getMeasurementHistoryByDate(
      result2.value.startDate,
      result2.value.endDate
    );

    console.log(rawData1.value)
    isLoad.value = true;
  }
);

onMounted(async () => {
  result1.value = getMonthStartAndEnd(referenceMonth.value);
  result2.value = getMonthStartAndEnd(previousMonth.value);

  rawData1.value = await getMeasurementHistoryByDate(
    result1.value.startDate,
    result1.value.endDate
  );
  rawData2.value = await getMeasurementHistoryByDate(
    result2.value.startDate,
    result2.value.endDate
  );

  isLoad.value = true;
});

function getAdjustedMonthDate(
  inputDateStr: string,
  adjustValue: number
): string {
  // 입력받은 날짜 문자열을 Date 객체로 변환
  const inputDate = new Date(inputDateStr);

  inputDate.setMonth(inputDate.getMonth() + adjustValue); // 다음 달

  // 조정된 날짜를 YYYY-MM-DD 형태로 반환
  return convertDateTimeToDateTimeString(inputDate);
}

function getMonthStartAndEnd(inputDateStr: string): {
  startDate: string;
  endDate: string;
} {
  const inputDate = new Date(inputDateStr);

  // 유효하지 않은 날짜 확인
  if (isNaN(inputDate.getTime())) {
    console.error("Invalid date string:", inputDateStr);
    return { startDate: "", endDate: "" };
  }

  // 해당 월의 첫째 날 구하기
  const firstDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);

  // 해당 월의 마지막 날 구하기
  const lastDay = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth() + 1,
    0
  );

  // YYYY-MM-DD 형식으로 반환
  return {
    startDate: convertDateTimeToDateTimeString(firstDay),
    endDate: convertDateTimeToDateTimeString(lastDay),
  };
}
</script>

<style>
.bar-container {
  border: 2px solid #ddd; /* Optional: Border for better visual separation */
  padding: 10px;
  border-radius: 10px; /* Optional: Rounded corners */
}
</style>
