<script lang="ts">
export default {};
</script>
<template>
  <div class="container">
    <!-- Element Plus Table -->
    <ApplicationTableHeader
      :process-data="currentWeek"
      :week-number="weekNumber"
    />
    <div class="table-wrapper">
      <el-table
        :data="filteredData"
        class="custom-table"
        style="min-width: 1000px"
        :border="true"
        height="700"
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
          label="FabCard 작성유무"
          width="80"
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
          label="Process"
          width="75"
          :align="'center'"
        >
          <template #default="scope">
            <span class="uppercase">{{ scope.row.wafer.sawTypeId }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="priorityId"
          label="Priority"
          width="85"
          :align="'center'"
          fixed="left"
        />

        <el-table-column
          prop="packageId"
          label="Package"
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
        <el-table-column
          prop="note"
          label="목적"
          width="300"
          :align="'center'"
        />
        <!-- <el-table-column prop="is_aoi" label="AOI" width="70" :align="'center'">
          <template #default="scope">
            <el-tag v-if="scope.row.isAoi" type="success">Yes</el-tag>
            <el-tag v-else type="danger">No</el-tag>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          prop="quantity"
          label="수량"
          width="80"
          :align="'center'"
        />

        <el-table-column
          prop="code"
          label="Code"
          width="80"
          :align="'center'"
        ></el-table-column> -->

        <!-- FAB Insert Date를 날짜 선택기로 수정 -->
        <el-table-column label="담당자" width="150" :align="'center'">
          <template #default="scope">
            {{ scope.row.designer.userName }}
          </template>
        </el-table-column>

        <el-table-column label="투입일" width="110" :align="'center'">
          <template #default="scope">
            {{ formatDate(scope.row.wantedFabStartDate) }}
          </template>
        </el-table-column>

        <el-table-column label="완료일" width="120" :align="'center'">
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

        <el-table-column label="Fab Card 전달일" width="130" :align="'center'">
          <template #default="scope">
            <span>{{ scope.row.calFabCardConveyDate() }}</span>
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

        <el-table-column label="엔지니어 Call" :align="'center'">
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
            {{ formatDate(scope.row.idtMaskArrivalDate) }}
          </template>
        </el-table-column>
        <!-- <el-table-column v-else label="MASK 입고일 IDT" width="110" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.idtMaskArrivalDate) }}
        </template>
      </el-table-column> -->

        <!-- v-if="['w2150108', 'admin'].includes(getUserId())" -->
        <el-table-column
          width="160"
          :align="'center'"
          label="MASK 입고일 PST"
          prop="pstMaskArrivalDate"
        >
          <template #default="scope">
            {{ formatDate(scope.row.pstMaskArrivalDate) }}
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
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted, reactive, watch } from "vue";
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
import ApplicationTableHeader from "./ApplicationTableHeader.vue";
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
  todayStart.setHours(0, 0, 0, 0); // 오늘 00:00:00

  return processData.filter((item) => {
    

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

onMounted(async () => {
  priorityList.value = await receivePriorityList();
  waferQuantity.value = createNumberOptions(25);
  await getFabAppForReview(currentWeek, weekNumber, getUserId());
  await getFabAppForReview(previousWeek, weekNumber - 1, getUserId());

  // 두 주차 데이터 합치기
  const merged = [...currentWeek, ...previousWeek];

  merged.sort((a, b) => {
    return (
      new Date(a.wantedFabStartDate).getTime() -
      new Date(b.wantedFabStartDate).getTime()
    );
  });

  // processData에 덮어쓰기 (깊은 복사 필요하면 아래 방식)
  Object.assign(processData, merged);

  await getMesFabFormInfo(processData);
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

    if (diffHours >= 0 && diffHours <= 24) {
      return "warning-row";
    } else if (targetDate.getTime() <= now.getTime()) {
      return "warning-row";
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
  font-size: 12px;
  padding-right: 10px;
  margin-right: 10px;
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
  background-color: rgb(250, 214, 214);
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
