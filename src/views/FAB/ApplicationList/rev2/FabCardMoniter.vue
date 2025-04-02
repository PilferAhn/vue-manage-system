<script lang="ts">
export default {};
</script>
<template>
  <div>
    <!-- Element Plus Table -->
    <!-- <ApplicationTableHeader
      :process-data="currentWeek"
      :week-number="weekNumber"
    /> -->
    <div class="table-wrapper">
      <el-table
        :data="filteredData"
        class="custom-table"
        :border="true"
        :fit="true"
        :row-style="{ height: '30px' }"
        :lazy="true"
        :row-class-name="cellClass"
      >
        <el-table-column
          type="index"
          label="No"
          :align="'center'"
          fixed="left"
          :min-width="30"
        ></el-table-column>

        <el-table-column
          label="FabCard 작성유무"
          :align="'center'"
          fixed="left"
          :min-width="30"
        >
          <template #default="scope">
            <el-tag v-if="!scope.row.isFabCardCreated" type="danger">No</el-tag>
            <el-tag v-else type="success">Yes</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="group"
          label="Group"
          :align="'center'"
          fixed="left"
          :min-width="60"
        >
          <template #default="scope">
            {{ scope.row.designer.department }}
          </template>
        </el-table-column>

        <el-table-column
          prop="process"
          label="Process"
          fixed="left"
          :align="'center'"
          :min-width="30"
        >
          <template #default="scope">
            <span class="uppercase">{{ scope.row.wafer.sawTypeId }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="productName"
          label="Model Name"
          :align="'center'"
          fixed="left"
          :min-width="50"
        />

        <el-table-column label="담당자" :align="'center'" :min-width="50">
          <template #default="scope">
            {{ scope.row.designer.userName }}
          </template>
        </el-table-column>

        <el-table-column label="투입일" :align="'center'" :min-width="50">
          <template #default="scope">
            {{ formatDate(scope.row.wantedFabStartDate) }}
          </template>
        </el-table-column>

        <el-table-column label="완료일" :min-width="50"   :align="'center'">
          <template #default="scope">
            <span
              :style="{
                color: scope.row.checkFabOutDate() ? 'inherit' : 'red',
              }"
            >
              {{ formatDate(scope.row.wantedFabFinishDate) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Fab Card 전달일" :align="'center'" :min-width="50"  >
          <template #default="scope">
            <span>{{ scope.row.calFabCardConveyDate() }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted, reactive, watch, onBeforeUnmount  } from "vue";
import { FabRequest } from "../../../../interface/fab-application-rev2";
import {
  handleDateChange as externalHandleDateChange,
  updatePendingStatus,
  updateStatus,
  updateWeekNumber,
} from "../ApplicationsByWeek";
import InputText from "../../Common/InputText.vue";
import { formatDate } from "../../Common/Application";
import { convertKeysToPEP8 } from "../../../../utils/key-converter";
import { getRole, getUserId } from "../../../../utils/account-utils";
import {
  getApplicationListByDict,
  sendingForm,
} from "../../../../utils/Fab/fab-application-utils";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import { ElMessageBox, ElMessage } from "element-plus";
import { receivePriorityList } from "../../../../utils/Fab/fab-application-utils";
import {
  OptionInterface,
  OptionNumberInterface,
} from "../../../../interface/option";
import { createBooleanOptions } from "../../../../utils/utility";
import { downloadExcelWithCountdown } from "../../../../utils/Fab/fab-aplication-review-utils";
import { getFabAppForReview, getMesFabFormInfo } from "./ApplicationTable";
import ApplicationTableHeader from "./FabCardMoniterHeader.vue";
import { createNumberOptions } from "../../../../utils/utility";

const processData = reactive<FabRequest[]>([]);
const currentWeek = reactive<FabRequest[]>([]);
const previousWeek = reactive<FabRequest[]>([]);
const weekNumber = 14;

const waferQuantity = ref<OptionNumberInterface[]>([]);

// ✅ 사용자가 선택한 날짜
const selectedDate = ref<string | null>(null);

// ✅ 중복되지 않는 날짜 목록 생성 (Set 활용)
const uniqueDates = computed(() => {
  const dates = new Set(currentWeek.map((item) => item.wantedFabStartDate));
  return Array.from(dates).sort();
});

const filteredData = computed(() => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // 오늘 00:00:00 기준

  return processData.filter((item) => {
    if (item.isPending) return false; // ✅ pending이면 제거

    const itemDate = new Date(item.calFabCardConveyDate());
    return !item.isFabCardCreated || itemDate.getTime() >= todayStart.getTime();
  });
});


// ✅ 필터 초기화 (날짜 선택 해제)
const clearFilter = () => {
  selectedDate.value = null;
};

const handleDateChange2 = (date: string) => {
  selectedDate.value = date;
};

const priorityList = ref<OptionInterface[]>([]);
// emit 정의
const emit = defineEmits<{
  (e: "update:currentWeek", updatedData: FabRequest[]): void;
}>();

const fetchData = async () => {
  await getFabAppForReview(currentWeek, weekNumber, getUserId());
  await getFabAppForReview(previousWeek, weekNumber - 1, getUserId());

  const merged = [...currentWeek, ...previousWeek];

  merged.sort((a, b) => {
    return (
      new Date(a.wantedFabStartDate).getTime() -
      new Date(b.wantedFabStartDate).getTime()
    );
  });

  Object.assign(processData, merged);
  await getMesFabFormInfo(processData);
};

let refreshInterval: number;

onMounted(async () => {
  priorityList.value = await receivePriorityList();
  waferQuantity.value = createNumberOptions(25);

  await fetchData(); // ✅ 최초 호출

  // ✅ 10분마다 자동 업데이트
  refreshInterval = window.setInterval(async () => {
    await fetchData();
  }, 600000); // 10분
});

onBeforeUnmount(() => {
  clearInterval(refreshInterval);
});

// onMounted(async () => {
//   priorityList.value = await receivePriorityList();
//   waferQuantity.value = createNumberOptions(25);
//   await getFabAppForReview(currentWeek, weekNumber, getUserId());
//   await getFabAppForReview(previousWeek, weekNumber - 1, getUserId());

//   // 두 주차 데이터 합치기
//   const merged = [...currentWeek, ...previousWeek];

//   merged.sort((a, b) => {
//     return (
//       new Date(a.wantedFabStartDate).getTime() -
//       new Date(b.wantedFabStartDate).getTime()
//     );
//   });

//   // processData에 덮어쓰기 (깊은 복사 필요하면 아래 방식)
//   Object.assign(processData, merged);

//   await getMesFabFormInfo(processData);
// });

const isDownloading = ref(false);
const countdown = ref(20);

const handleDownloadExcel = async () => {
  if (!currentWeek.length) {
    console.warn("📌 데이터가 없습니다.");
    return;
  }

  isDownloading.value = true;
  countdown.value = 20;

  await downloadExcelWithCountdown(
    currentWeek,
    (remainingTime) => {
      countdown.value = remainingTime;
    },
    () => {
      isDownloading.value = false;
    }
  );
};

const now = new Date();
// 셀에 적용할 클래스 반환
const cellClass = ({ row, rowIndex, column, columnIndex }) => {
  // 예: 짝수 행에만 스타일을 적용
  const targetDate = new Date(row.calFabCardConveyDate?.());
  if (row.isPending) {
    // if ([0].includes(columnIndex)) {
    //   return "even-row";
    // }
    return "drop-row";
  } else if (!isNaN(targetDate.getTime()) && !row.isFabCardCreated) {
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if(diffHours >= 24 && diffHours <= 48){
      return "warning-row";
    }
    else if (diffHours >= 0 && diffHours <= 24) {
      return "drop-row";
    } else if (targetDate.getTime() <= now.getTime()) {
      return "drop-row";
    }
  }
  return "";
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  max-width: 100%;
  /* overflow-x: auto; */
}

.custom-table {
  font-size: 20px;
  padding-right: 10px;
  margin-right: 10px;
}

.custom-table ::v-deep(.drop-row) {
  // box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: rgb(235, 29, 29);
  border: 1px solid rgb(235, 29, 29);
  color: black;
  border-radius: 1px;
  // padding: 4px;
}

.custom-table ::v-deep(.warning-row) {
  // box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: #f5d8b3; /* 밝은 회색 */
  border: 1px solid #f5d8b3;
  border-radius: 1px;
  // padding: 4px;
}

.buttun-section {
  margin-top: 15px;
}

.el-table__row.important-row {
  background-color: rgb(0, 255, 0);
}

.el-table__row.warning-row {
  background-color: rgb(233, 215, 181);
}

.el-table__row.danger-row {
  background-color: rgb(230, 12, 12);
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}
</style>
