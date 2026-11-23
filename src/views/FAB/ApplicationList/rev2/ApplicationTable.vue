<script lang="ts">
export default {};
</script>
<template>
  <!-- 상단 한 줄: 왼쪽 통계/범례, 오른쪽 투입일 필터 + 엑셀 (2026-11-23: 아래에 있던 엑셀 버튼을 위로) -->
  <div class="review-toolbar">
    <ApplicationTableHeader
      class="toolbar-stats"
      :process-data="props.processData"
      :week-number="props.weekNumber"
    />
    <div class="toolbar-actions">
      <el-select
        v-if="['w2150108'].includes(getUserId())"
        v-model="selectedDate"
        class="date-filter"
        placeholder="📅 투입일 선택"
        clearable
      >
        <el-option
          v-for="date in uniqueDates"
          :key="date"
          :label="formatDate(date)"
          :value="date"
        />
      </el-select>
      <el-button :loading="isLoading" @click="loadData" title="의뢰서와 Fab Card 작성 여부를 다시 불러옵니다">새로고침</el-button>
      <el-button type="success" :loading="isDownloading" @click="handleDownloadExcel">
        {{ isDownloading ? "엑셀 만드는 중… (약 30초)" : "엑셀 다운로드" }}
      </el-button>
    </div>
  </div>
  <div class="table-wrapper" ref="tableBox">
    <el-table
      v-loading="isLoading"
      :data="filteredData"
      class="custom-table"
      style="min-width: 1000px"
      :border="true"
      :height="tableHeight" scrollbar-always-on
      :row-style="{ height: '30px' }"
      :lazy="true"
      :row-class-name="cellClass"
    >
      <el-table-column
        type="index"
        label="No"
        width="50"
        :align="'center'"
        fixed="left"
      ></el-table-column>

      <el-table-column
        label="FABCARD"
        width="105"
        :align="'center'"
        fixed="left"
      >
        <template #default="scope">
          <el-tag v-if="!scope.row.isFabCardCreated" type="danger">No</el-tag>
          <el-tag v-else type="success">Yes</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="group"
        label="Group"
        width="140"
        :align="'center'"
        fixed="left"
      >
        <template #default="scope">
          {{ scope.row.designer.department }}
        </template>
      </el-table-column>
      <el-table-column
        prop="process"
        label="Tech"
        width="75"
        :align="'center'"
      >
        <template #default="scope">
          <span class="uppercase">{{ scope.row.wafer.sawTypeId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        prop="priorityId"
        label="Priority"
        width="85"
        :align="'center'"
        fixed="left"
      >
        <template #default="scope">
          <el-select v-model="scope.row.priorityId">
            <el-option
              v-for="prioriyOption in priorityList"
              :key="prioriyOption.key"
              :value="prioriyOption.value"
              :label="prioriyOption.label"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        prop="priorityId"
        label="Priority"
        width="85"
        :align="'center'"
        fixed="left"
      />

      <el-table-column
        prop="packageId"
        label="PKG"
        width="80"
        :align="'center'"
        fixed="left"
      />
      <el-table-column
        prop="productName"
        label="Model Name"
        width="140"
        :align="'center'"
        fixed="left"
      />
      <el-table-column prop="note" label="목적" width="300" :align="'center'" />
      <el-table-column prop="is_aoi" label="AOI" width="70" :align="'center'">
        <template #default="scope">
          <el-tag v-if="scope.row.isAoi" type="success">Yes</el-tag>
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        prop="quantity"
        label="수량"
        width="90"
        :align="'center'"
      >
        <template #default="scope">
          <el-select v-model="scope.row.quantity">
            <el-option
              v-for="numberOption in createNumberOptions(25)"
              :key="numberOption.key"
              :value="numberOption.value"
              :label="numberOption.label"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        prop="quantity"
        label="수량"
        width="90"
        :align="'center'"
      />

      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        prop="code"
        label="Code"
        width="80"
        :align="'center'"
      >
        <template #default="scope">
          <el-select v-model="scope.row.code">
            <el-option label="C" value="C"></el-option>
            <el-option label="H" value="H"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        prop="code"
        label="Code"
        width="80"
        :align="'center'"
      ></el-table-column>

      <!-- FAB Insert Date를 날짜 선택기로 수정 -->
      <el-table-column
        label="담당자"
        fixed="left"
        width="150"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.designer.userName }}
        </template>
      </el-table-column>

      <el-table-column label="주 차" prop="weekNumber" :align="'center'" width="90">
        <template #default="scope">
          <el-select v-model="scope.row.weekNumber">
            <!-- ISO 주차는 해에 따라 53주까지 있음 (2026년도 53주) -->
            <el-option
              v-for="weekNum in 53"
              :key="weekNum"
              :value="weekNum"
              :label="weekNum.toString()"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        width="160"
        :align="'center'"
        label="투입일"
      >
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.wantedFabStartDate"
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else label="투입일" width="110" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.wantedFabStartDate) }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        width="160"
        :align="'center'"
        label="완료일"
      >
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.wantedFabFinishDate"
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else label="완료일" width="120" :align="'center'">
        <template #default="scope">
          <span
            :style="{ color: scope.row.checkFabOutDate() ? 'inherit' : 'red' }"
          >
            {{ formatDate(scope.row.wantedFabFinishDate) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Fab Card 전달일" width="130" :align="'center'">
        <template #default="scope">
          <span>{{ formatDate(scope.row.calFabCardConveyDate()) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="waferCompany"
        label="Wafer 제조사"
        width="70"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.wafer.waferCompany }}
        </template>
      </el-table-column>
      <el-table-column
        prop="waferAngle"
        label="Wafer Angle"
        width="70"
        :align="'center'"
      />
      <el-table-column
        prop="waferThickness"
        label="Wafer Thickness"
        width="90"
        :align="'center'"
      />
      <el-table-column
        prop="waferType"
        label="Wafer Type"
        width="80"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.wafer.sawTypeId }}
        </template>
      </el-table-column>
      <el-table-column
        prop="idtMachineName"
        label="Machine Name"
        width="80"
        :align="'center'"
      />
      <el-table-column
        prop="idtThickness"
        label="막두께"
        width="300"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.createWaferInfo() }}
        </template>
      </el-table-column>

      <!-- getUserId() -->
      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        label="엔지니어 Call"
        :align="'center'"
      >
        <template #default="scope">
          <el-select v-model="scope.row.isNeedEngineerCall">
            <el-option
              v-for="option in createBooleanOptions()"
              :key="option.key"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-else label="엔지니어 Call" :align="'center'">
        <template #default="scope">
          <el-tag v-if="scope.row.isNeedEngineerCall == true" type="success"
            >Yes</el-tag
          >
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="MST" :align="'center'" prop="isMst">
        <template #default="scope">
          <el-tag v-if="scope.row.mstThickness !== null" type="success"
            >Yes</el-tag
          >
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Dual IDT" :align="'center'">
        <template #default="scope">
          <!-- {{ scope.row.idt2Id }} -->
          <el-tag v-if="scope.row.idt2Id !== null" type="success">Yes</el-tag>
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>

      <!-- v-if="['w2150108', 'admin'].includes(getUserId())" -->
      <el-table-column width="160" :align="'center'" label="MASK 입고일 IDT">
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.idtMaskArrivalDate"
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column v-else label="MASK 입고일 IDT" width="110" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.idtMaskArrivalDate) }}
        </template>
      </el-table-column> -->

      <!-- v-if="['w2150108', 'admin'].includes(getUserId())" -->
      <el-table-column width="160" :align="'center'" label="MASK 입고일 PST">
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.pstMaskArrivalDate"
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column v-else label="MASK 입고일 IDT" width="120" :align="'center'">
        <template #default="scope">
          <span
            :style="{ color: scope.row.checkFabOutDate() ? 'inherit' : 'red' }"
          >
            {{ formatDate(scope.row.pstMaskArrivalDate) }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column label="비고" prop="note" width="180" :align="'center'">
        <template #default="scope">
          {{ scope.row.createTrimmingInfo() }}
        </template>
      </el-table-column>
      <el-table-column
        label="HS W/F 조건"
        prop="hsWaferInfo"
        width="400"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.createHsWaferCondition() }}
        </template>
      </el-table-column>

      <!--         v-if="
          getUserId() === 'admin' ||
          getRole() === 'group leader' ||
          getUserId() === 'w2150108'"
        " -->

      <el-table-column
        v-if="permiss.hasPerm('fab.review.manage')"
        fixed="right"
        label="Action"
        width="235"
        :align="'center'"
      >
        <template #default="scope">
          <!-- <el-button
            type="primary"
            size="small"
            @click="updateStatus(scope.row, 'confirm')"
          >
            확정
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(scope.row)"
          >
            Update
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="
              confirmAction(
                scope.row,
                props.weekNumber + 1,
                true,
                'updateWeekNumber'
              )
            "
            >Delay</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="confirmAction(scope.row, 0, true, 'pending')"
          >
            Drop
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { FabRequest } from "../../../../interface/fab-application-rev2";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import type { OptionInterface } from "../../../../interface/option";
import { useFillHeight } from "../../../../utils/use-fill-height";
import { updatePendingStatus, updateWeekNumber } from "../ApplicationsByWeek";
import { formatDate } from "../../Common/Application";
import { getUserId } from "../../../../utils/account-utils";
import { usePermissStore } from "../../../../store/permiss";
import { partialUpdateForm, receivePriorityList } from "../../../../utils/Fab/fab-application-utils";
import { createBooleanOptions, createNumberOptions } from "../../../../utils/utility";
import { downloadReviewExcel } from "../../../../utils/Fab/fab-aplication-review-utils";
import { getFabAppForReview, getMesFabFormInfo } from "./ApplicationTable";
import ApplicationTableHeader from "./ApplicationTableHeader.vue";

// 표 높이 = 화면 아래 끝까지 (엑셀 버튼을 위로 옮겨 아래 여백은 본문 여백만)
const tableBox = ref<HTMLElement | null>(null);
const { height: tableHeight } = useFillHeight(tableBox, 20);

// Action 컬럼 권한: 권한관리 > fab.review.manage
const permiss = usePermissStore();

const props = defineProps<{
  processData: FabRequest[];
  weekNumber: number;
  weekYear: number;
}>();

// 투입일 필터 (w2150108 전용)
const selectedDate = ref<string | null>(null);
const uniqueDates = computed(() => Array.from(new Set(props.processData.map((item) => item.wantedFabStartDate))).sort());
const filteredData = computed(() =>
  selectedDate.value ? props.processData.filter((item) => item.wantedFabStartDate === selectedDate.value) : props.processData
);

const priorityList = ref<OptionInterface[]>([]);

async function handleUpdate(row: FabRequest) {
  const partOfFabForm: FabRequestForm = {
    productName: row.productName,
    priorityId : row.priorityId,
    quantity : row.quantity,
    code : row.code,
    weekNumber : row.weekNumber,
    wantedFabStartDate : row.wantedFabStartDate,
    wantedFabFinishDate : row.wantedFabFinishDate,
    isNeedEngineerCall : row.isNeedEngineerCall,
    idtMaskArrivalDate : row.idtMaskArrivalDate,
    pstMaskArrivalDate : row.pstMaskArrivalDate
  };
  Object.assign(row, await partialUpdateForm(partOfFabForm)); 
}

async function confirmAction(
  row: FabRequest,
  weekNumber: number,
  isPending: boolean,
  type: string
) {
  const actionText =
    type === "updateWeekNumber" ? "다음 주로 연기" : "보류 처리";

  try {
    await ElMessageBox.confirm(
      `해당 항목을 "${actionText}" 하시겠습니까?`,
      "확인",
      {
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        type: "warning",
      }
    );

    // 사용자가 확인을 누르면 실행
    await handleStatus(row, weekNumber, isPending, type);

    ElMessage({
      type: "success",
      message: `"${actionText}" 처리되었습니다.`,
    });
  } catch (error) {
    // 사용자가 취소를 누르면 아무 작업도 하지 않음
    ElMessage({
      type: "info",
      message: `"${actionText}" 작업이 취소되었습니다.`,
    });
  }
}

async function handleStatus(
  row: FabRequest,
  weekNumber: number,
  isPending: boolean,
  type: string
) {
  if (type === "updateWeekNumber") {
    updateWeekNumber(row, weekNumber);
  } else {
    updatePendingStatus(row, isPending);
  }
  // 목록 + Fab Card 작성 여부까지 다시 불러옴 (예전에는 MES 확인을 빼고 불러와 작성 여부가 'No' 로 보였음)
  await loadData();
}

// 의뢰서 + MES(Fab Card 작성 여부) 조회. 탭을 처음 열 때와 [새로고침] 에서만 실행
const isLoading = ref(false);
async function loadData() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    await getFabAppForReview(props.processData, props.weekNumber, props.weekYear, getUserId());
    await getMesFabFormInfo(props.processData);
  } catch (e) {
    console.error("Form Review 조회 실패:", e);
    ElMessage.error("목록을 불러오지 못했습니다. 새로고침을 눌러 다시 시도해 주세요.");
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  // 우선순위 목록은 의뢰서 조회와 같이(병렬로) 불러옴
  const [priorities] = await Promise.all([receivePriorityList(), loadData()]);
  priorityList.value = priorities;
});

// 엑셀: 이 탭의 전체 의뢰서(투입일 필터와 무관)를 투입계획서 양식으로. 만드는 데 약 30초 → 그동안 버튼 잠금
const isDownloading = ref(false);
async function handleDownloadExcel() {
  if (isDownloading.value) return;
  if (!props.processData.length) {
    ElMessage.warning("다운로드할 의뢰서가 없습니다.");
    return;
  }
  isDownloading.value = true;
  try {
    await downloadReviewExcel(props.processData);
  } finally {
    isDownloading.value = false;
  }
}

// 행 색: 보류 = 연한 빨강, Fab Card 미작성인데 전달일이 24시간 이내이거나 지남 = 주황
function cellClass({ row }: { row: FabRequest }): string {
  if (row.isPending) return "drop-row";
  const conveyDate = new Date(row.calFabCardConveyDate?.());
  if (!row.isFabCardCreated && !isNaN(conveyDate.getTime())) {
    const diffHours = (conveyDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (diffHours <= 24) return "warning-row";
  }
  return "";
}
</script>

<style lang="scss" scoped>
/* 상단 한 줄: 왼쪽 통계/범례(넘치면 줄바꿈), 오른쪽 필터 + 엑셀 */
.review-toolbar {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}
.toolbar-stats {
  flex: 1;
  min-width: 0;
  margin-bottom: 0;
}
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}
.date-filter {
  width: 170px;
}

.table-wrapper {
  max-width: 100%;
}

/* 글씨 12px → 14px (2026-11-23 요청: 2pt 크게) */
.custom-table {
  font-size: 14px;
}
/* 선명하게 (2026-11-23): 기본 회색 글씨(#909399/#606266)가 연회색 배경에서 흐릿해 보여 진한 색으로 */
.custom-table :deep(th.el-table__cell) {
  background-color: #e8edf4;
  color: #1f2937;
  font-weight: 700;
}
.custom-table :deep(td.el-table__cell) {
  color: #1f2937;
}

.custom-table ::v-deep(.drop-row) {
  // box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: rgb(250, 217, 217);
  border: 1px solid rgb(250, 217, 217);
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

</style>
