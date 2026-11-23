<template>
  <!-- Form Review: 지난 주 / 이번 주 / 다음 주 투입분 탭
       lazy: 처음 열 때만 불러오고, 한 번 연 탭은 그대로 유지 → 탭을 오가도 다시 조회/다시 그리지 않음 (2026-11-23)
       (예전 v-if 는 탭을 누를 때마다 표를 지우고 의뢰서·MES 조회와 그리기를 처음부터 반복해 느렸음) -->
  <div class="review-page">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane :label="priviousWeekLabel" name="lastWeek" lazy>
        <ApplicationsByWeek
          :processData="lastWeekDataArray"
          :week-number="lastWeekNumberForSearch"
          :week-year="lastWeekYearForSearch"
        />
      </el-tab-pane>

      <el-tab-pane :label="currentWeekLabel" name="thisWeek" lazy>
        <ApplicationsByWeek
          :processData="applications"
          :week-number="thisWeekNumberForSearch"
          :week-year="thisWeekYearForSearch"
        />
      </el-tab-pane>
      <el-tab-pane :label="nextWeekLabel" name="nextWeek" lazy>
        <ApplicationsByWeek
          :processData="nextWeekDataArray"
          :week-number="nextWeekNumberForSearch"
          :week-year="nextWeekYearForSearch"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { getCurrentWeekNumber, getWeekYearFromWantedFabStart } from "../../../../utils/date-utils";
import ApplicationsByWeek from "./ApplicationTable.vue";
import { FabRequest } from "../../../../interface/fab-application-rev2";

function getInputWeekInfoFromWriteDate(writeDate: Date) {
  // 작성한 주의 "다음 주"가 실제 투입 주
  const target = new Date(writeDate);
  target.setDate(target.getDate() + 7);

  return {
    weekNumber: getCurrentWeekNumber(target),
    weekYear: getWeekYearFromWantedFabStart(target),
  };
}


//기준:'작성 주차'
const base = new Date();

//지난주
const lastWeekDate= new Date(base);
lastWeekDate.setDate(base.getDate()-7);
const {
  weekNumber: lastWeekNumber,
  weekYear: lastWeekYear,
} = getInputWeekInfoFromWriteDate(lastWeekDate);
const lastWeekNumberForSearch = getCurrentWeekNumber(lastWeekDate);
const lastWeekYearForSearch   = getWeekYearFromWantedFabStart(lastWeekDate);

//이번주
const thisWeekDate= new Date(base);
const {
  weekNumber: thisWeekNumber,
  weekYear: thisWeekYear,
} = getInputWeekInfoFromWriteDate(thisWeekDate);
const thisWeekNumberForSearch = getCurrentWeekNumber(thisWeekDate);
const thisWeekYearForSearch   = getWeekYearFromWantedFabStart(thisWeekDate);

//다음주
const nextWeekDate=new Date(base);
nextWeekDate.setDate(nextWeekDate.getDate() + 7);
const {
  weekNumber: nextWeekNumber,
  weekYear: nextWeekYear,
} = getInputWeekInfoFromWriteDate(nextWeekDate);
const nextWeekNumberForSearch = getCurrentWeekNumber(nextWeekDate);
const nextWeekYearForSearch   = getWeekYearFromWantedFabStart(nextWeekDate);

const priviousWeekLabel = lastWeekNumber + "주 투입분 - (지난 주)";
const currentWeekLabel = thisWeekNumber + "주 투입분 작성 - (이번 주)";
const nextWeekLabel = nextWeekNumber + "주 투입분 - (다음 주)";

const activeTab = ref("thisWeek");

// 탭별 의뢰서 목록 (각 탭의 ApplicationTable 이 열릴 때 채움)
// (reactive 배열: ApplicationTable 이 같은 배열 안의 내용을 바꿔 채움)
const lastWeekDataArray = reactive<FabRequest[]>([]);
const applications = reactive<FabRequest[]>([]);
const nextWeekDataArray = reactive<FabRequest[]>([]);
</script>

<style scoped>
.review-page :deep(.el-tabs__header) {
  margin-bottom: 8px;
}
</style>
