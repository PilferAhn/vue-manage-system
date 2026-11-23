<script lang="ts">
export default {};
</script>
<template>
  <!-- Fab Card 작성 현황 (모니터 표시용). 조회/판정 기준은 utils/Fab/fab-card-monitor.ts -->
  <div class="table-wrapper" :class="{ 'blink-on': isBlinkTime }">
    <!-- 높이 = 화면 높이 - 상단(헤더 40 + 탭 30 + 본문 여백 20) → 모니터에 항상 꽉 차게 -->
    <el-table
      :data="filteredData"
      class="custom-table"
      border
      fit
      height="calc(100vh - 92px)"
      scrollbar-always-on
      :row-style="{ height: '30px' }"
      :row-class-name="rowClass"
    >
      <!-- 열 폭은 최소값(min-width) → 화면 폭에 맞춰 꽉 차게 늘어남 -->
      <el-table-column label="Status" align="center" min-width="190">
        <template #default="scope">
          <!-- 투입예정일까지 3일 초과 + MES 에 없음: 아직 MES 등록 시점 전 → "MES 등록 대기" (투입취소로 보지 않음) -->
          <el-tag v-if="isMesRegistrationPending(scope.row, nowTs)" type="info">MES 등록 대기</el-tag>
          <template v-else-if="scope.row.isFabCardCreated === null">
            <el-tag type="warning">Not Found</el-tag>
            <!-- MES 투입계획과 맞지 않는 Not Found 는 모두 투입 취소로 보고 확인 요청 -->
            <div
              class="cancel-check"
              :title="scope.row.mesSiblingName
                ? `MES 투입계획에 없음 (같은 기종은 ${scope.row.mesSiblingName} 만 있음)`
                : 'MES 투입계획에 P/N·매수·투입예정일이 맞는 건이 없음'"
            >투입취소 확인 요망</div>
          </template>
          <el-tag v-else-if="scope.row.isFabCardCreated" type="success">Completed</el-tag>
          <el-tag v-else type="danger">Waiting</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Group" align="center" min-width="260" show-overflow-tooltip>
        <template #default="scope">{{ scope.row.designer.department }}</template>
      </el-table-column>

      <el-table-column prop="productName" label="Model Name" align="center" min-width="260" />

      <el-table-column label="담당자" align="center" min-width="200" show-overflow-tooltip>
        <template #default="scope">{{ scope.row.designer.userName }}</template>
      </el-table-column>

      <el-table-column label="Fab Card 전달일" align="center" min-width="200">
        <template #default="scope">{{ formatDate(scope.row.calFabCardConveyDate()) }}</template>
      </el-table-column>

      <el-table-column label="투입예정일" align="center" min-width="200">
        <template #default="scope">{{ formatDate(scope.row.wantedFabStartDate) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { FabRequest } from "../../../../interface/fab-application-rev2";
import { formatDate } from "../../Common/Application";
import { getUserId } from "../../../../utils/account-utils";
import { usePermissStore } from "../../../../store/permiss";
import { getMesFabFormInfo } from "./ApplicationTable";
import { fetchFabCardRecentWeeks, isMesRegistrationPending } from "../../../../utils/Fab/fab-card-monitor";

const REFRESH_MS = 5 * 60 * 1000; // 목록 자동 새로고침 5분
const CLOCK_MS = 60 * 1000; // 색/깜박임 기준 시각 갱신 1분 (조회 없음)
// 빨간 행 깜박임은 매일 07:00 ~ 22:00 에만 (그 외 시간은 빨간색 그대로)
const BLINK_START_HOUR = 7;
const BLINK_END_HOUR = 22;

const processData = reactive<FabRequest[]>([]);

// 현재 시각: 색(주황/빨강), "오늘", 깜박임 시간대를 1분마다 다시 판단 (화면을 계속 띄워 두는 용도)
const nowTs = ref(Date.now());

const isBlinkTime = computed(() => {
  const h = new Date(nowTs.value).getHours();
  return h >= BLINK_START_HOUR && h < BLINK_END_HOUR;
});

// 보류 건 제외. 완료(Completed) 건은 전달일까지만 표시, 미완료 건은 계속 표시
const filteredData = computed(() => {
  const todayStart = new Date(nowTs.value);
  todayStart.setHours(0, 0, 0, 0);
  return processData.filter((item) => {
    if (item.isPending) return false;
    const conveyDate = new Date(item.calFabCardConveyDate());
    return !item.isFabCardCreated || conveyDate.getTime() >= todayStart.getTime();
  });
});

/** 이번 주 + 지난 2주 의뢰서 조회 → MES 상태 판정 → 목록 통째로 교체 (실패 시 이전 화면 유지) */
async function fetchData() {
  // 전체 조회 권한: 권한관리 > fab.review.manage
  const observer = usePermissStore().hasPerm("fab.review.manage") ? null : getUserId();
  let apps: FabRequest[];
  try {
    apps = await fetchFabCardRecentWeeks(observer);
    apps.sort((a, b) => new Date(a.wantedFabStartDate).getTime() - new Date(b.wantedFabStartDate).getTime());
    // 상태를 먼저 계산한 뒤 교체 → 새로고침 순간 Waiting/Completed 가 깜빡이지 않음
    await getMesFabFormInfo(apps);
  } catch (error) {
    console.error("Fab Card 목록/MES 투입계획 조회 실패:", error);
    return; // 다음 새로고침 때 다시 시도
  }
  processData.splice(0, processData.length, ...apps);
  nowTs.value = Date.now();
}

/** 행 색: 완료 파랑 / 미완료는 전달일까지 24~48시간 주황, 24시간 이내·지남 빨강. MES 등록 대기는 색 없음 */
function rowClass({ row }: { row: FabRequest }): string {
  if (row.isFabCardCreated) return "success-row";
  if (isMesRegistrationPending(row, nowTs.value)) return "";
  const conveyDate = new Date(row.calFabCardConveyDate?.());
  if (isNaN(conveyDate.getTime())) return "";
  const diffHours = (conveyDate.getTime() - nowTs.value) / (1000 * 60 * 60);
  if (diffHours <= 24) return "drop-row";
  if (diffHours <= 48) return "warning-row";
  return "";
}

let refreshTimer: number | undefined;
let clockTimer: number | undefined;

onMounted(async () => {
  await fetchData();
  refreshTimer = window.setInterval(fetchData, REFRESH_MS);
  clockTimer = window.setInterval(() => (nowTs.value = Date.now()), CLOCK_MS);
});

onBeforeUnmount(() => {
  window.clearInterval(refreshTimer);
  window.clearInterval(clockTimer);
});
</script>

<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
}

/* 모니터 표시용: 화면 폭 전체 사용, 제목 줄도 크게 */
.custom-table {
  width: 100%;
  font-size: 25px;
}
.custom-table :deep(th.el-table__cell) {
  font-size: 22px;
  font-weight: 700;
  padding: 12px 0;
}

/* 빨강(전달일 24시간 이내/지남, 미완료): 07:00 ~ 22:00 (.blink-on) 에는 깜박임, 그 외 시간은 빨간색 그대로 */
.custom-table :deep(.drop-row) {
  background-color: rgb(235, 29, 29);
  color: black;
}
.blink-on .custom-table :deep(.drop-row) {
  animation: fab-card-blink 1s step-end infinite;
}
.custom-table :deep(.drop-row > td.el-table__cell) {
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

/* 완료: 파랑 */
.custom-table :deep(.success-row) {
  background-color: #cce4ff;
  color: #0a1f44;
}

/* 전달일 24~48시간: 주황 */
.custom-table :deep(.warning-row) {
  background-color: #f5d8b3;
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
</style>
