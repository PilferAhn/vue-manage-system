<template>
  <div class="container">
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="privious2WeekLabel" name="old">
        <ApplicationsByWeek :processData="oldWeekDataArray" />
      </el-tab-pane>
      <el-tab-pane :label="priviousWeekLabel" name="lastWeek">
        <ApplicationsByWeek :processData="lastWeekDataArray" />
      </el-tab-pane>
      <el-tab-pane :label="currentWeekLabel" name="thisWeek">
        <ApplicationsByWeek :processData="thisWeekDataArray" />
      </el-tab-pane>
      <el-tab-pane :label="nextWeekLabel" name="nextWeek">
        <ApplicationsByWeek :processData="nextWeekDataArray" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { convertToCamelCase } from "../Common/Application"; // Assuming the utility is stored here
import { getCurrentWeekNumber } from "../../../utils/date-utils";
import { fetchProcessData } from "./ApplicationList";
import ApplicationsByWeek from "./ApplicationsByWeek2.vue";
import type { ProcessData } from "../Interface/ApplicationInterface";
import { it } from "node:test";

const currentWeekNumber: number = getCurrentWeekNumber();
const currentWeekLabel = currentWeekNumber.toString() + "주";
const priviousWeekLabel = (currentWeekNumber - 1).toString() + "주";
const privious2WeekLabel = (currentWeekNumber - 2).toString() + "주";
const nextWeekLabel = (currentWeekNumber + 1).toString() + "주";

const oldLabel = "OLD";

// Define the active tab, default is 'thisWeek'
const activeTab = ref("thisWeek");
// Handle tab click if you need any additional logic
const handleTabClick = (tab: any) => {
  console.log("Active Tab:", tab.name);
};

// Define processData arrays for different tabs
const processDataArray = ref<ProcessData[]>([]); // For this week's data
const thisWeekDataArray = ref<ProcessData[]>([]); // For this week's data
const lastWeekDataArray = ref<ProcessData[]>([]); // For last week's data
const nextWeekDataArray = ref<ProcessData[]>([]); // For next week's data
const oldWeekDataArray = ref<ProcessData[]>([]); // For next week's data

function getMaxHistorySeqAndIndexFromProcessData(
  processDataArray: ProcessData[]
): {
  maxHistorySeq: number | null;
  processDataIndex: number | null;
  lotStatusIndex: number | null;
} {

  
  if (!processDataArray || processDataArray.length === 0) {
    return {
      maxHistorySeq: null,
      processDataIndex: null,
      lotStatusIndex: null,
    };
  }

  let maxHistorySeq = null;
  let processDataIndex = null;
  let lotStatusIndex = null;

  processDataArray.forEach((processData, index) => {
    if (processData.lotStatus.length > 0) {
      processData.lotStatus.forEach((lotStatus, lotIndex) => {
        let maxsq = -999;
        let maxIndex = 0;

        if (lotStatus.judge_flag === "P" || lotStatus.judge_flag === "H") {
          if (lotStatus.history_seq > maxsq) {
            maxsq = lotStatus.history_seq;
            processData.maxHistorySeq = lotIndex;

            processData.feIndex = lotIndex;
            processData.feOperationStart = lotStatus["movein_date"];
            processData.feSiteIn = lotStatus["creation_date"];
            processData.feOperation = lotStatus["operation"]["name"];
          }
        }

        if (lotStatus.hanoi_csp !== null) {
          processData.hanoiIndex = index;
          processData.hanoiSiteIn = lotStatus["hanoi_csp"]["creation_date"];

          if (lotStatus["hanoi_csp"]["child"] === null) {
            processData.hanoiOperation =
              lotStatus["hanoi_csp"]["operation"]["name"];
            processData.hanoiOperationStart =
              lotStatus["hanoi_csp"]["movein_date"];
          } else {
            processData.hanoiOperation =
              lotStatus["hanoi_csp"]["child"]["child"]["operation"]["name"];
            processData.hanoiOperationStart =
              lotStatus["hanoi_csp"]["child"]["child"]["movein_date"];
          }
        }
      });
    }
  }
);

  return { maxHistorySeq, processDataIndex, lotStatusIndex };
}

let tempName = "";
onMounted(async () => {
  // fetchProcessData 함수로 데이터 가져오기
  processDataArray.value = await fetchProcessData();
  getMaxHistorySeqAndIndexFromProcessData(processDataArray.value);
  const materialIdList = ["XG80ANC@1A", "XG80ANC@1B", "H942FA0@1A"];
  for (let i = 0; i < processDataArray.value.length; i++) {
    const item = processDataArray.value[i];

    if (materialIdList.includes(item.modelName)) {
      console.log(item);
    }

    if (item.weekNumber === currentWeekNumber) {
      thisWeekDataArray.value.push(item);
    } else if (item.weekNumber === currentWeekNumber - 1) {
      lastWeekDataArray.value.push(item);
    } else if (item.weekNumber === currentWeekNumber + 1) {
      // 다음 주 데이터 조건 수정
      nextWeekDataArray.value.push(item);
    } else {

      let name = item.modelName.split("@")[0]
      name = name + "-M,"
      tempName += name
      oldWeekDataArray.value.push(item);
    }
  }
  // console.log(tempName)
});
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
