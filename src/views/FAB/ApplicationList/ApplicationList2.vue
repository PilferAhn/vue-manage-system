<template>
  <div class="container">
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="cspLabel" name="csp">
        <ApplicationsByWeek :processData="whcCsp" />
      </el-tab-pane>
      <el-tab-pane :label="wlpLabel" name="wlp">
        <ApplicationsByWeek :processData="whcWlp" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { convertToCamelCase } from "../Common/Application"; // Assuming the utility is stored here
import { getCurrentWeekNumber, getTodayDatetime, adjustDate } from "../../../utils/date-utils";
import { fetchProcessData, processData, showInfo, showInfoByWeek } from "./ApplicationList";
import ApplicationsByWeek from "./ApplicationsByWeek2.vue";
import type { ProcessData } from "../Interface/ApplicationInterface";
import { it } from "node:test";

const currentWeekNumber: number = getCurrentWeekNumber();

// const privious2WeekLabel = (currentWeekNumber - 2).toString() + "주 이후";

const cspLabel = "40주 이후(CSP)";
const wlpLabel = "40주 이후(WLP)";

// Define the active tab, default is 'thisWeek'
const activeTab = ref("csp");
// Handle tab click if you need any additional logic
const handleTabClick = (tab: any) => {
  console.log("Active Tab:", tab.name);
};

// Define processData arrays for different tabs
const processDataArray = ref<ProcessData[]>([]); // For this week's data
const thisWeekDataArray = ref<ProcessData[]>([]); // For this week's data
const whcCsp = ref<ProcessData[]>([]); // For last week's data
const whcWlp = ref<ProcessData[]>([]); // For next week's data
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

  showInfo(processDataArray);

  processDataArray.forEach((processData, index) => {
    try {
      if (processData.lotStatus.length > 0) {
        processData.lotStatus.forEach((lotStatus, lotIndex) => {
          if (lotStatus.hanoiCsp !== null) {
            processData.hanoiIndex = index;
            processData.hanoiSiteIn = lotStatus["hanoi_csp"]["creation_date"];

            // find step 1
            if (lotStatus["hanoi_csp"]["child"] !== null) {
              processData.step1Operation =
                lotStatus["hanoi_csp"]["child"]["operation"]["name"];
              processData.step1OperationStart =
                lotStatus["hanoi_csp"]["child"]["movein_date"];
              processData.step1LotId =
                lotStatus["hanoi_csp"]["child"]["lot_id"];

              // find step 2
              if (lotStatus["hanoi_csp"]["child"]["child"] !== null) {
                processData.step2Operation =
                  lotStatus["hanoi_csp"]["child"]["child"]["operation"]["name"];
                processData.step2OperationStart =
                  lotStatus["hanoi_csp"]["child"]["child"]["movein_date"];
                processData.step2LotId =
                  lotStatus["hanoi_csp"]["child"]["child"]["lot_id"];

                // find step 3
                if (
                  lotStatus["hanoi_csp"]["child"]["child"]["child"] !== null
                ) {
                  processData.step3Operation =
                    lotStatus["hanoi_csp"]["child"]["child"]["child"][
                      "operation"
                    ]["name"];
                  processData.step3OperationStart =
                    lotStatus["hanoi_csp"]["child"]["child"]["child"][
                      "movein_date"
                    ];
                  processData.step3LotId =
                    lotStatus["hanoi_csp"]["child"]["child"]["child"]["lot_id"];
                  // find step 4
                  if (
                    lotStatus["hanoi_csp"]["child"]["child"]["child"][
                      "child"
                    ] !== null
                  ) {
                    processData.step4Operation =
                      lotStatus["hanoi_csp"]["child"]["child"]["child"][
                        "child"
                      ]["operation"]["name"];
                    processData.step4OperationStart =
                      lotStatus["hanoi_csp"]["child"]["child"]["child"][
                        "child"
                      ]["movein_date"];

                    processData.step4LotId =
                      lotStatus["hanoi_csp"]["child"]["child"]["child"][
                        "child"
                      ]["lot_id"];

                    if (
                      lotStatus["hanoi_csp"]["child"]["child"]["child"][
                        "child"
                      ]["child"] !== null
                    ) {
                      processData.step5Operation =
                        lotStatus["hanoi_csp"]["child"]["child"]["child"][
                          "child"
                        ]["child"]["operation"]["name"];
                      processData.step5OperationStart =
                        lotStatus["hanoi_csp"]["child"]["child"]["child"][
                          "child"
                        ]["child"]["movein_date"];
                      processData.step5LotId =
                        lotStatus["hanoi_csp"]["child"]["child"]["child"][
                          "child"
                        ]["child"]["lot_id"];
                    }
                  }
                }
              }
            } else {
              processData.step1Operation =
                lotStatus["hanoi_csp"]["operation"]["name"];
              processData.step1OperationStart =
                lotStatus["hanoi_csp"]["movein_date"];
              processData.step1LotId = lotStatus["hanoi_csp"]["lot_id"];
            }

            if (lotStatus["hanoi_csp"]["child"] === null) {
              processData.hanoiOperation =
                lotStatus["hanoi_csp"]["operation"]["name"];
              processData.hanoiOperationStart =
                lotStatus["hanoi_csp"]["movein_date"];
            } else {
              if (lotStatus["hanoi_csp"]["child"]["child"] === null) {
                processData.hanoiOperation =
                  lotStatus["hanoi_csp"]["child"]["operation"]["name"];
                processData.hanoiOperationStart =
                  lotStatus["hanoi_csp"]["child"]["movein_date"];
                processData.hanoiStep = "(Package)";
                // console.log(processData.modelName)
                // console.log(lotStatus["hanoi_csp"]["child"])
              } else {
                processData.hanoiStep = "(Assay)";
                processData.hanoiOperation =
                  lotStatus["hanoi_csp"]["child"]["child"]["operation"]["name"];
                processData.hanoiOperationStart =
                  lotStatus["hanoi_csp"]["child"]["child"]["movein_date"];
              }
            }
          }

          let maxsq = -999;


          if (
            lotStatus.judgeFlag === "P" ||
            lotStatus.judgeFlag === "H" ||
            lotStatus.judgeFlag === "S"
          ) {
            if (processData.hanoiTransite === undefined) {
              if (lotStatus["operation"]["operation_id"] === "TRANSIT") {
                processData.feIndex = lotIndex;
                processData.feOperationStart = lotStatus["movein_date"];
                processData.feSiteIn = lotStatus["creation_date"];
                processData.feOperation = lotStatus["operation"]["name"];
                processData.hanoiTransite = true;
                processData.estToHanoi = undefined
                return;
              } else if (lotStatus.historySeq > maxsq) {
                maxsq = lotStatus.historySeq;
                processData.maxHistorySeq = lotIndex;
                processData.feIndex = lotIndex;
                processData.feOperationStart = lotStatus["movein_date"];
                processData.feSiteIn = lotStatus["creation_date"];
                processData.feOperation = lotStatus["operation"]["name"];
                if(lotStatus["operation"]["name"] === "개발 프로브 2차"){
                   processData.estToHanoi = adjustDate(getTodayDatetime(), 3)
                }

              }
            }
          }
        });
      }
    } catch {
      // console.log(processData);
    }
  });

  return { maxHistorySeq, processDataIndex, lotStatusIndex };
}

let tempName = "";
onMounted(async () => {
  // fetchProcessData 함수로 데이터 가져오기
  processDataArray.value = await fetchProcessData();
  getMaxHistorySeqAndIndexFromProcessData(processDataArray.value);
  // showInfoByWeek(processDataArray.value)

  processDataArray.value.forEach((processData, index) => {
    if (processData["destination"] === "WHC_CSP") {
      whcCsp.value.push(processData);
    } else if (processData["destination"] === "WHC_WLP") {
      whcWlp.value.push(processData);
    } else {
    }
  });
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
