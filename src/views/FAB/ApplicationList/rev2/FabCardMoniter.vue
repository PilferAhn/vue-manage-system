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
    <div class="table-wrapper" :class="{ 'blink-on': isBlinkTime }" ref="tableBox">
      <el-table
        :data="filteredData"
        class="custom-table"
        :border="true"
        :fit="true"
        height="calc(100vh - 92px)" scrollbar-always-on
        :row-style="{ height: '30px' }"
        :lazy="true"
        :row-class-name="cellClass"
      >
        <!-- 모니터 표시용: 열 폭을 고정값(width) 대신 최소값(min-width)으로 → 화면 폭에 맞춰 꽉 차게 늘어남 (2026-11-22) -->
        <el-table-column
          label="Status"
          :align="'center'"
          min-width="190"
        >
          <template #default="scope">
            <!-- 투입예정일까지 3일 초과: 아직 MES 등록 시점 전 → "MES 등록 대기" (투입취소로 보지 않음) -->
            <template v-if="isMesRegistrationPending(scope.row, nowTs)">
              <el-tag type="info">MES 등록 대기</el-tag>
            </template>
            <template v-else-if="scope.row.isFabCardCreated === null">
              <el-tag type="warning">Not Found</el-tag>
              <!-- MES 투입계획과 맞지 않는 Not Found 는 모두 투입 취소로 봄 → 확인 요청 (2026-11-22) -->
              <div
                class="cancel-check"
                :title="scope.row.mesSiblingName
                  ? `MES 투입계획에 없음 (같은 기종은 ${scope.row.mesSiblingName} 만 있음)`
                  : 'MES 투입계획에 P/N·매수·투입예정일이 맞는 건이 없음'"
              >투입취소 확인 요망</div>
            </template>
            <el-tag v-else-if="scope.row.isFabCardCreated" type="success"
              >Completed</el-tag
            >
            <el-tag v-else-if="!scope.row.isFabCardCreated" type="danger"
              >Waiting</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="group"
          label="Group"
          :align="'center'"
          min-width="260"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.designer.department }}
          </template>
        </el-table-column>

        <el-table-column
          prop="productName"
          label="Model Name"
          :align="'center'"
          min-width="260"
        />

        <el-table-column
          label="담당자"
          :align="'center'"
          min-width="200"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.designer.userName }}
          </template>
        </el-table-column>

        <el-table-column
          label="Fab Card 전달일"
          :align="'center'"
          min-width="200"
        >
          <template #default="scope">
            <span>{{ formatDate(scope.row.calFabCardConveyDate()) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="투입예정일" :align="'center'" min-width="200">
          <template #default="scope">
            {{ formatDate(scope.row.wantedFabStartDate) }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="완료일" :min-width="40"   :align="'center'">
          <template #default="scope">
            <span
              :style="{
                color: scope.row.checkFabOutDate() ? 'inherit' : 'red',
              }"
            >
              {{ formatDate(scope.row.wantedFabFinishDate) }}
            </span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  computed,
  ref,
  onMounted,
  reactive,
  watch,
  onBeforeUnmount,
} from "vue";
import { FabRequest } from "../../../../interface/fab-application-rev2";
import { useFillHeight } from "../../../../utils/use-fill-height";

// 표 높이 = 화면 높이 - 상단(헤더 40 + 탭 30 + 본문 여백 위아래 20) → 모니터에 항상 꽉 차게 (2026-11-22)
// 예전 useFillHeight(계산식)는 처음 그릴 때 잡힌 값에 머물러 화면 아래가 비는 경우가 있었음
const tableBox = ref<HTMLElement | null>(null);
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
import { getCurrentWeekNumber, getWeekYearFromWantedFabStart} from "../../../../utils/date-utils";
import { usePermissStore } from "../../../../store/permiss";
import { fetchFabCardRecentWeeks, isMesRegistrationPending } from "../../../../utils/Fab/fab-card-monitor";
const processData = reactive<FabRequest[]>([]);
const currentWeek = reactive<FabRequest[]>([]);
const previousWeek = reactive<FabRequest[]>([]);
const previousWeek2 = reactive<FabRequest[]>([]);
const weekNumber = getCurrentWeekNumber()

const waferQuantity = ref<OptionNumberInterface[]>([]);

// ✅ 사용자가 선택한 날짜
const selectedDate = ref<string | null>(null);

// ✅ 중복되지 않는 날짜 목록 생성 (Set 활용)
const uniqueDates = computed(() => {
  const dates = new Set(currentWeek.map((item) => item.wantedFabStartDate));
  return Array.from(dates).sort();
});

// 현재 시각: 색(주황/빨강)과 "오늘" 기준을 1분마다 갱신 (2026-11-22)
// 예전에는 화면을 연 순간의 시각으로 고정되어, 모니터에 계속 띄워 두면 색이 바뀌지 않았음
const nowTs = ref(Date.now());
let clockTimer: number | undefined;

// 빨간 행 깜박임은 매일 07:00 ~ 22:00 에만 (그 외 시간은 빨간색 그대로, 깜박임 없음). 1분마다 다시 판단
const BLINK_START_HOUR = 7;
const BLINK_END_HOUR = 22;
const isBlinkTime = computed(() => {
  const h = new Date(nowTs.value).getHours();
  return h >= BLINK_START_HOUR && h < BLINK_END_HOUR;
});

const filteredData = computed(() => {
  const todayStart = new Date(nowTs.value);
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
const base = new Date();
const thisWeekDate= new Date(base);
const thisWeekYearForSearch   = getWeekYearFromWantedFabStart(thisWeekDate);

/**
 * 이번 주 + 지난 2주 의뢰서 조회 (2026-11-22 수정)
 * - 예전: 주차 번호에서 1, 2 를 빼고 "올해" 로만 조회 → 1월 첫 1~2주에 작년 말(52·53주) 건이 빠짐, 주차마다 3번 조회
 * - 지금: utils/Fab/fab-card-monitor.ts 의 공용 조회 사용 (로그인 팝업과 같은 기준)
 */
async function fetchRecentWeeks(): Promise<FabRequest[]> {
  // 전체 조회 권한: 권한관리 > fab.review.manage
  const observer = usePermissStore().hasPerm("fab.review.manage") ? null : getUserId();
  return fetchFabCardRecentWeeks(observer);
}

const fetchData = async () => {
  let merged: FabRequest[];
  try {
    merged = await fetchRecentWeeks();
  } catch (error) {
    console.error("Fab Card 목록 조회 실패:", error);
    return; // 조회 실패 시 이전 화면 유지 (5분 뒤 다시 시도)
  }

  merged.sort((a, b) => {
    return (
      new Date(a.wantedFabStartDate).getTime() -
      new Date(b.wantedFabStartDate).getTime()
    );
  });

  // MES 상태를 먼저 채운 뒤 목록을 통째로 교체 (2026-11-22)
  // - 예전: Object.assign 으로 덮어쓰기만 해서, 새로고침 때 건수가 줄면 뒤쪽에 이전 행이 중복으로 남았음
  // - 상태 계산 중에 Waiting/Completed 가 깜빡이지 않도록 교체 전에 계산
  try {
    await getMesFabFormInfo(merged);
  } catch (error) {
    console.error("MES 투입계획 조회 실패:", error);
    return; // MES 조회 실패 시 이전 화면 유지 (5분 뒤 다시 시도)
  }
  processData.splice(0, processData.length, ...merged);
  nowTs.value = Date.now();
};

let refreshInterval: number;

onMounted(async () => {
  priorityList.value = await receivePriorityList();
  waferQuantity.value = createNumberOptions(25);

  await fetchData(); // ✅ 최초 호출

  // ✅ 5분마다 자동 업데이트 (2026-11-22: 10분 → 5분)
  refreshInterval = window.setInterval(async () => {
    await fetchData();
  }, 300000); // 5분

  // 색 기준 시각은 1분마다 갱신 (조회는 하지 않음)
  clockTimer = window.setInterval(() => {
    nowTs.value = Date.now();
  }, 60000);
});

onBeforeUnmount(() => {
  clearInterval(refreshInterval);
  clearInterval(clockTimer);
});

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

// 셀에 적용할 클래스 반환 (기준 시각 = nowTs, 1분마다 갱신)
const cellClass = ({ row, rowIndex, column, columnIndex }) => {
  const now = new Date(nowTs.value);
  const targetDate = new Date(row.calFabCardConveyDate?.());


  if (row.isPending) {
    // if ([0].includes(columnIndex)) {
    //   return "even-row";
    // }
    return "drop-row";
  }
  else if(row.isFabCardCreated){
    return "success-row"
  }
  // MES 등록 대기(투입예정일 3일 초과 + MES 에 아직 없음): 경고색/깜박임 없음
  else if (isMesRegistrationPending(row, nowTs.value)) {
    return "";
  }
   else if (!isNaN(targetDate.getTime()) && !row.isFabCardCreated) {
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours >= 24 && diffHours <= 48) {
      return "warning-row";
    } else if (diffHours >= 0 && diffHours <= 24) {
      return "drop-row";
    } else if (targetDate.getTime() <= now.getTime()) {
      return "drop-row";
    }
  }

  return ;
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
}

/* 모니터 표시용: 화면 폭 전체 사용 (오른쪽 여백 제거), 제목 줄도 크게 */
.custom-table {
  width: 100%;
  font-size: 25px;
}
.custom-table :deep(th.el-table__cell) {
  font-size: 22px;
  font-weight: 700;
  padding: 12px 0;
}

/* 빨강(전달일 24시간 이내/지남, 미완료) (2026-11-22)
   - 07:00 ~ 22:00 (.blink-on) 에는 계속 깜박여서 강조, 그 외 시간은 빨간색 그대로 */
.custom-table ::v-deep(.drop-row) {
  background-color: rgb(235, 29, 29);
  border: 1px solid rgb(235, 29, 29);
  color: black;
  border-radius: 1px;
}
.blink-on .custom-table ::v-deep(.drop-row) {
  animation: fab-card-blink 1s step-end infinite;
}
.custom-table ::v-deep(.drop-row > td.el-table__cell) {
  background-color: transparent;
}
@keyframes fab-card-blink {
  0% {
    background-color: rgb(235, 29, 29);
    color: #ffffff;
  }
  50% {
    background-color: #ffe0e0;
    color: rgb(200, 0, 0);
  }
}

.custom-table ::v-deep(.success-row) {
  background-color: #cce4ff;  /* ✅ 은은하면서도 좀 더 또렷한 파랑 */
  border: 1px solid #99caff;  /* 테두리도 조금 더 진하게 */
  color: #0a1f44;             /* 살짝 어두운 글씨 */
  border-radius: 4px;
}



.custom-table ::v-deep(.warning-row) {
  // box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: #f5d8b3; /* 밝은 회색 */
  border: 1px solid #f5d8b3;
  border-radius: 1px;
  // padding: 4px;
}

/* Not Found 밑 "투입취소 확인 요망" (깜박이는 빨간 행에서도 읽히도록 흰 바탕) */
.cancel-check {
  display: inline-block;
  margin-top: 4px;
  padding: 1px 8px;
  border-radius: 4px;
  background: #ffffff;
  color: #c00000;
  border: 1px solid #c00000;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
  white-space: nowrap;
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
