<template>
  <div class="container">
    <!-- Tabs for This Week, Last Week, and Next Week -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="priviousWeekLabel" name="lastWeek">
        <ApplicationsByWeek
          v-if="activeTab === 'lastWeek'"
          :processData="lastWeekDataArray"
          :week-number="lastWeekNumberForSearch"
          :week-year="lastWeekYearForSearch"
        />
      </el-tab-pane>

      <el-tab-pane :label="currentWeekLabel" name="thisWeek">
        <ApplicationsByWeek
          v-if="activeTab === 'thisWeek'"
          :processData="applications"
          :week-number="thisWeekNumberForSearch"
          :week-year="thisWeekYearForSearch"
        />
      </el-tab-pane>
      <el-tab-pane :label="nextWeekLabel" name="nextWeek">
        <ApplicationsByWeek
          v-if="activeTab === 'nextWeek'"
          :processData="nextWeekDataArray"
          :week-number="nextWeekNumberForSearch"
          :week-year="nextWeekYearForSearch"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { getCurrentWeekNumber, getWeekYearFromWantedFabStart } from "../../../../utils/date-utils";
import { fetchProcessData } from ".././ApplicationList";
import ApplicationsByWeek from "./ApplicationTable.vue";
import type { ProcessData } from "../../Interface/ApplicationInterface";
import {
  FabRequestForm,
  FabRequest,
} from "../../../../interface/fab-application-rev2";
import {
  getApplicationList,
  getApplicationListByDict,
} from "../../../../utils/Fab/fab-application-utils";
import { getUserId } from "../../../../utils/account-utils";

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

const priviousWeekLabel =
  lastWeekNumber + "주 투입분 - (지난 주)";
const currentWeekLabel = thisWeekNumber + "주 투입분 작성- (이번 주)";
const nextWeekLabel =
  nextWeekNumber + "주 투입분 - (다음 주 )"
// const currentWeekNumber: number = getCurrentWeekNumber();
// const currentWeekLabel = (currentWeekNumber + 1).toString() + "주 투입분 작성- (이번 주)"
// const priviousWeekLabel =
//   (currentWeekNumber).toString() +
//   "주 투입분 - (지난 주)"
// const nextWeekLabel =
//   (currentWeekNumber + 2).toString() +
//   "주 투입분 - (다음 주 )" 

// Define the active tab, default is 'thisWeek'
const activeTab = ref("thisWeek");
// Handle tab click if you need any additional logic
const handleTabClick = (tab: any) => {
  console.log("Active Tab:", tab.name);
};

// Define processData arrays for different tabs
const processDataArray = ref<FabRequest[]>([]); // For this week's data
const thisWeekDataArray = ref<FabRequest[]>([]); // For this week's data
const lastWeekDataArray = ref<FabRequest[]>([]); // For last week's data
const nextWeekDataArray = ref<FabRequest[]>([]); // For next week's data
const isLoad = ref<boolean>(false);
const applications = reactive<FabRequest[]>([]);


</script>

<style scoped>
/* Add margin or padding to give extra space for the scrollbar */
.container {
  padding-right: 30px; /* Increases space between the scroll bar and the table */
}

.custom-table {
  box-sizing: border-box;
  padding-right: 20px; /* Adds padding inside the table for extra space */
  margin-right: 10px; /* Adds a margin outside the table */
}

.uppercase {
  text-transform: uppercase;
}
</style>
