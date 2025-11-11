<script lang="ts">
export default {};
</script>

<template>
  <div class="table-wrapper">
    <!-- 검색어 입력 필드 -->
    <div
      style="
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <div style="display: flex; align-items: center">
        <el-select
          v-model="searchCategory"
          placeholder="검색 기준"
          class="search-dropdown"
          style="width: 150px"
        >
          <el-option label="Designer" value="designer"></el-option>
          <el-option label="Product Name" value="productName"></el-option>
          <el-option label="Week Number" value="weekNumber"></el-option>
        </el-select>

        <el-input
          v-model="searchTerm"
          :placeholder="`검색할 ${searchCategory} 입력`"
          class="search-input mr10"
          clearable
          @clear="handleClear"
          style="width: 300px; margin-left: 15px"
        ></el-input>

        <el-switch
          v-model="isRunningFab"
          active-text="진행 공정 보기"
          inactive-text="모든 공정 보기"
          style="margin-left: 20px"
        ></el-switch>
      </div>
    </div>

    <el-table
      :data="filteredApplicationData"
      class="custom-table"
      style="min-width: 1000px"
      height="670"
      :default-sort="{ prop: 'wantedFabStartDate', order: 'ascending' }"
      :row-style="{ height: '30px' }"
      :cell-class-name="cellClass"
    >
      <el-table-column
        :fixed="'left'"
        type="index"
        label="No"
        width="50"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        :fixed="'left'"
        prop="productName"
        label="P/N"
        width="140"
        :align="'center'"
      />

      <el-table-column
        label="개발자"
        width="110"
        :align="'center'"
        :fixed="'left'"
      >
        <template #default="scope">
          {{ scope.row.designer.userName }} <br />
          {{ scope.row.requester.userName }}
        </template>
      </el-table-column>
      
      <el-table-column
        :fixed="'left'"
        prop="priorityId"
        label="Priority"
        width="80"
        :align="'center'"
      />
      
      <el-table-column
        width="105"
        :align="'center'"
        fixed="left"
      >
        <template #header>
           Wafer<br/>LOT ID
        </template>
        <template #default="scope">
            
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ item.lotId }}
            <br />
          </span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        sortable
        prop="wantedFabStartDate"
        label="FAB 투입 계획일"
        width="110"
        :align="'center'"
      >
        <template #default="scope">
          {{ formatDate(scope.row.wantedFabStartDate) }}
        </template>
      </el-table-column> -->

      <el-table-column label="FAB 투입일" :align="'center'" width="110">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ formatDate(item.creationDate) }}
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="FAB OUT 계획일" width="105" :align="'center'">
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.wantedFabFinishDate) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="FAB 현위치(투입시간)"
        :align="'center'"
        width="320"
      >
        <template #default="scope">
          <span 
            v-for="(item, index) in scope.row.lotStatus"

            :key="index"
            :style="
              testFabOutAlarm(item.operation.operationId, item.moveinDate)
                ? 'color: red;'
                : ''
            "
          >
          <span
              v-if="item['fabOutHistory'] == null"
            >
            {{ item["operation"]["name"] }}
            {{ formatDateTime(item.moveinDate) }}
            <!-- {{ item.operation.operationId }} -->
            
          </span>
          <span v-else>  
            {{ item["fabOutHistory"]["operation"]["name"] }}
            {{formatDate(item["fabOutHistory"]["endDate"])}} </span>
            <br />
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="TEG 완료시간"
        width="200"
        prop="tegFinishedDate"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.measType }} <br />
          {{ scope.row.tegFinishedDate }}
        </template>
      </el-table-column> -->

      <el-table-column label="FAB OUT" :align="'center'" width="100">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <!-- <span v-if="item['operation']['operationId'] === 'OP0E002040'"> -->
              <!-- {{formatDate(item['fabOutHistory']["endDate"])}} -->
              <!-- {{ formatDate(adjustDate(item["moveinDate"], 3)) }} -->
            <!-- </span> -->
            <span
              v-if="item['fabOutHistory'] !== null &&
                item['fabOutHistory']['endDate'] !== null
                // item['secondProbeHistory'] !== null &&
                // item['secondProbeHistory']['startDate'] !== null
              "
            >
              {{formatDate(item["fabOutHistory"]["endDate"])}}
              <!-- {{
                formatDate(
                  adjustDate(item["secondProbeHistory"]["startDate"], 3)
                )
              }} -->
            </span>
            <!-- <span
              v-else-if="
                item['secondProbeHistory'] !== null &&
                item['secondProbeHistory']['endDate'] !== null
              "
            > -->
              <!-- {{formatDate(item["secondProbeHistory"]["endDate"])}} -->
              <!-- {{
                formatDate(adjustDate(item["secondProbeHistory"]["endDate"], 3))
              }} -->
            <!-- </span> -->
            <!-- <span
              v-else-if="
                item['secondProbeHistory'] !== null &&
                item['secondProbeHistory']['startDate'] === null
              "
            >
              SKIP
            </span> -->
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column  :align="'center'" width="90">
        <template #header>
           FAB<br/>진행일
        </template>
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['fabOutHistory'] == null">{{ getFabTime(item) }}</span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column  :align="'center'" width="120">
        <template #header>
           FAB<br/>리드타임
        </template>
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="getFabLeadTime(item, scope.row.wantedFabFinishDate)" v-html="getFabLeadTime(item, scope.row.wantedFabFinishDate)"></span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="출하 현위치(투입시간)"
        :align="'center'"
        width="250"
      >
        <template #default="scope">
          <span 
            v-for="(item, index) in scope.row.lotStatus"

            :key="index"
            :style="
              testFabOutAlarm(item.operation.operationId, item.moveinDate)
                ? 'color: red;'
                : ''
            "
          >
          <span
              v-if="item['fabOutHistory'] !== null"
            >
            {{ item["operation"]["name"] }}
            {{ formatDateTime(item.moveinDate) }}
            <!-- {{ item.operation.operationId }} -->
            
          </span>
          <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="TEG 완료시간"
        width="200"
        prop="tegFinishedDate"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.measType }} <br />
          {{ scope.row.tegFinishedDate }}
        </template>
      </el-table-column> -->

      <el-table-column label="HQ 출하" :align="'center'" width="100">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['operation']['name'] === 'Transit 공정'">
              {{ formatDate(item["moveinDate"]) }}
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>
      
      <el-table-column :align="'center'" width="90">
        <template #header>
          출하<br/>리드타임
        </template>
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
          <span v-if="getShipLeadTime(item)">{{ getShipLeadTime(item) }}</span>
          <span v-else> -- </span>
          <br />
        </span>
        </template>
      </el-table-column>

      <el-table-column label="WHC 도착" :align="'center'" width="120">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['hanoiCsp'] !== null">
              {{ formatDate(item["hanoiCsp"]["creationDate"]) }}
            </span>
            <span v-else-if="item['hanoiWlp'] !== null">
              {{ formatDate(item["hanoiWlp"]["creationDate"]) }}
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Assy In" :align="'center'" width="110">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['hanoiCsp'] !== null">
              {{ formatDate(item["hanoiCsp"]["moveinDate"]) }}
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="WHC 현위치(투입시간)"
        :align="'center'"
        width="1500"
        v-if="!props.isWlp"
      >
        <el-table-column label="플립본딩" width="450" :align="'center'">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.lotStatus" :key="index">
              <span v-if="item['hanoiCsp'] !== null">
                {{ item["hanoiCsp"]["operation"]["name"] }}
                {{ formatDateTime(item["hanoiCsp"]["moveinDate"]) }}
                {{ item["hanoiCsp"]["lotId"] }}
              </span>
              <span v-else>--</span>
              <br />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Package" width="400" :align="'center'">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.lotStatus" :key="index">
              <span
                v-if="
                  item['hanoiCsp'] !== null &&
                  item['hanoiCsp']['child'] !== null
                "
              >
                {{ item["hanoiCsp"]["child"]["operation"]["name"] }}
                {{ formatDateTime(item["hanoiCsp"]["child"]["moveinDate"]) }}
                {{ item["hanoiCsp"]["child"]["lotId"] }}
              </span>
              <span v-else>--</span>
              <br />
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Assy" width="400" :align="'center'">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.lotStatus" :key="index">
              <span
                v-if="
                  item['hanoiCsp'] !== null &&
                  item['hanoiCsp']['child'] !== null &&
                  item['hanoiCsp']['child']['child'] !== null
                "
              >
                {{ item["hanoiCsp"]["child"]["child"]["operation"]["name"] }}
                {{
                  formatDateTime(
                    item["hanoiCsp"]["child"]["child"]["moveinDate"]
                  )
                }}
                {{ item["hanoiCsp"]["child"]["child"]["lotId"] }}
              </span>
              <span v-else>--</span>
              <br />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="최종출하" width="400" :align="'center'">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.lotStatus" :key="index">
              <span
                v-if="
                  item['hanoiCsp'] !== null &&
                  item['hanoiCsp']['child'] !== null &&
                  item['hanoiCsp']['child']['child'] !== null &&
                  item['hanoiCsp']['child']['child']['child'] !== null &&
                  item['hanoiCsp']['child']['child']['child']['child'] !==
                    null &&
                  item['hanoiCsp']['child']['child']['child']['child'][
                    'child'
                  ] !== null
                "
              >
                {{
                  item["hanoiCsp"]["child"]["child"]["child"]["child"]["child"][
                    "operation"
                  ]["name"]
                }}
                {{
                  formatDateTime(
                    item["hanoiCsp"]["child"]["child"]["child"]["child"][
                      "child"
                    ]["moveinDate"]
                  )
                }}
                {{
                  item["hanoiCsp"]["child"]["child"]["child"]["child"]["child"][
                    "lotId"
                  ]
                }}
              </span>
              <span v-else>--</span>
              <br />
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        label="WHC 현위치(투입시간)"
        :align="'center'"
        width="1500"
        v-if="props.isWlp"
      >
        <el-table-column label="현재 공정" width="450" :align="'center'">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.lotStatus" :key="index">
              <span v-if="item['hanoiWlp'] !== null">
                {{ item["hanoiWlp"]["operation"]["name"] }}
                {{ formatDateTime(item["hanoiWlp"]["moveinDate"]) }}
                {{ item["hanoiWlp"]["lotId"] }}
              </span>
              <span v-else>--</span>
              <br />
            </span>
          </template>
        </el-table-column>
      </el-table-column>

       <el-table-column
        label="Wafer ID"
        width="100"
        :align="'center'"
      >
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ item.waferId }}
            <br />
          </span>
        </template>
      </el-table-column>

      
      <el-table-column
        label="WHC 개발팀 입고"
        width="150"
        :align="'center'"
      ></el-table-column>
      <!-- <el-table-column
        label="주차"
        width="70"
        prop="weekNumber"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        label="Destination"
        width="120"
        prop="destination"
        :align="'center'"
      ></el-table-column> -->
      <!-- <el-table-column
          fixed="right"
          label="Action"
          width="100"
          :align="'center'"
          size="samll"
        >
          <template #default="scope"
            ><el-button plain @click="handleVisible(true, scope.row.modelName)">
              의뢰서
            </el-button></template
          >
        </el-table-column> -->
    </el-table>
    <!-- <DialogTemplate
        v-model:visible="dialogTableVisible"
        :fabApplicationId="selectApplicationId"
      ></DialogTemplate> -->
  </div>

  <!-- <el-button type="primary" @click="toggleFilter" class="buttun-section">
      {{ isFiltered ? "원래 데이터 보기" : "중화 69 과제 보기" }}
    </el-button> -->
    <el-button type="warning" @click="toggleLateFilter" class="buttun-section">
      {{ isDealyFab ? "원래 데이터 보기" : "지연 과제 보기" }}
    </el-button>
    <el-button type="warning" @click="toggleDVFilter" class="buttun-section">
      {{ isDVonly ? "Cancel DV" : "DV only" }}
    </el-button>
    <el-button type="primary" @click="handleExcelSubmit" class="buttun-section">
      개발 샘플 진행 상황 EXCEL
    </el-button>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { FabRequest } from "../../../../interface/fab-application-rev2";
import type { TegApplication } from "../../../../interface/Teg/teg";
import {
  formatDate,
  adjustDate,
  formatDateTime,
} from "../../../../utils/date-utils";
import { cn69ModelNames } from "../../SampleStatus/Cn69List";
import type { ModifiedFabDataInterface } from "../../../../interface/fab";
import {
  getRunningFabReqeust,
  getRunningFabReqeustRev2,
} from "../../../../utils/Fab/fab-application-utils";
import {
  createTableData,
  getLateFab,
  testFabOutAlarm,
  downloadFabPlanExcel,
  getLateFabRev2,
} from "../ApplicationList";
import { onMounted, watch } from "vue";
const props = defineProps<{
  fabApp: FabRequest[];
  tegApp: TegApplication[];
  isWlp?: boolean;
}>();

// 라우터 및 현재 경로 가져오기
const searchTerm = ref("");
const searchCategory = ref("productName"); // 기본 검색 기준을 "Lot ID"로 설정
const isRunningFab = ref(true);
const isDealyFab = ref(false);
const isDVonly = ref(false);
// Clear the search input
function handleClear() {
  searchTerm.value = ""; // Reset search term
}

const dialogTableVisible = ref(false);
const selectApplicationId = ref("");

const filteredApplicationData = computed(() => {
  const term = searchTerm.value.toLowerCase();

  return filteredData.value.filter((item) => {
    let field: any;

    if (searchCategory.value === "designer") {
      field = item.designer?.userName; // 옵셔널 체이닝으로 안전하게 접근
    } else {
      field = item[searchCategory.value];
    }

    if (typeof field === "number") {
      return field.toString().includes(term);
    }

    if (typeof field === "string") {
      return field.toLowerCase().includes(term);
    }
    
    return false;
  });
});

const isFiltered = ref(false);
const temp = ref<FabRequest[]>([]);

const filteredData = computed(() => {
  // 다시 생각해보기,
  // 일단..
  // running === ture 의 의미를 정리하기
  // 한개라도 완료된게 아니면 아직 running이다.
  const tempApp = ref<FabRequest[]>([]);

  if (!isRunningFab.value) {
    tempApp.value = props.fabApp;
  } else {
    tempApp.value = getRunningFabReqeustRev2(props.fabApp);
  }

  if (isDealyFab.value) {
    tempApp.value = getLateFabRev2(tempApp.value);
  } else {
    tempApp.value = tempApp.value;
  }

  if (isDVonly.value) {
    // Filter by first character 'D' in productName
    tempApp.value = tempApp.value.filter((item) => item.productName.charAt(0) === 'D');
  }

  if (isFiltered.value) {
    temp.value = [];

    tempApp.value.forEach((item) => {
      const modelName = item.productName.split("@")[0].toLowerCase();

      // cn69ModelNames와 비교
      if (cn69ModelNames.includes(modelName)) {
        temp.value.push(item);
      }
    });

    return temp.value;
  }

  return tempApp.value;
});

// 셀에 적용할 클래스 반환
const cellClass = ({ row, rowIndex, column, columnIndex }) => {
  // 예: 짝수 행에만 스타일을 적용
  if ([5, 7, 9, 12].includes(columnIndex)) {
    return "even-row";
  }

  return "";
};

const groupCounts = computed(() => {
  return props.fabApp.reduce((acc, item) => {
    acc[item.group] = (acc[item.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
});

const modifiedFabData = ref<ModifiedFabDataInterface[]>([]);

const customHolidays = ref<string[]>([
  // '2025-09-18'
  // '2024-12-25','2025-01-01', ...
]);

const getWorkingDays = (n: number | null, digits = 1) =>
  n == null ? null : `${n.toFixed(digits)}일`;

function workingDaysFloat(
  startVal?: string | Date,
  endVal?: string | Date,
  extraHolidays: string[] = []
): number | null {
  const toDate = (v?: string | Date | null) => {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    let s = String(v).trim();

    // 이미 타임존이 있으면 그대로 신뢰 (Z, +09:00, -04:00 등)
    if (/[zZ]$/.test(s) || /[+\-]\d{2}:\d{2}$/.test(s)) {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    // 날짜만 있으면 자정 보정
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      s += 'T00:00:00';
    } else {
      // 공백 → T 로 ISO 정규화 (Safari 대응)
      s = s.replace(' ', 'T');
    }
    // KST 가정
    const withTz = `${s}+09:00`;
    const d = new Date(withTz);
    return isNaN(d.getTime()) ? null : d;
  };

  const dayStart = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const nextDayStart = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
  const addDays = (d: Date, n: number) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const toYMD = (d: Date) => {
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  };
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6; // 일/토

  let s = toDate(startVal);
  let e = toDate(endVal);
  if (!s || !e) return null;

  // 역순이면 음수 부호로
  let sign = 1;
  if (s > e) {
    [s, e] = [e, s];
    sign = -1;
  }

  const HOL = new Set(extraHolidays.map((x) => x.trim()));
  const msPerHour = 1000 * 60 * 60;
  let cursor = dayStart(s);
  const endDay = dayStart(e);
  let workHours = 0;

  while (cursor <= endDay) {
    if (!(isWeekend(cursor) || HOL.has(toYMD(cursor)))) {
      const segStart = new Date(
        Math.max(dayStart(cursor).getTime(), s.getTime())
      );
      const segEnd = new Date(
        Math.min(nextDayStart(cursor).getTime(), e.getTime())
      );
      const hours = Math.max(0, (segEnd.getTime() - segStart.getTime()) / msPerHour);
      workHours += hours;
    }
    cursor = addDays(cursor, 1);
  }
  return sign * (workHours / 24);
}

function getFabTime(item: any): string | null {
  const fabIn = item?.creationDate;
  return getWorkingDays(workingDaysFloat(fabIn, new Date(), customHolidays.value));
}

function diffDaysNumber(startStr?: string, endStr?: string): number | null {
  if (!startStr || !endStr) return null;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return (new Date(start).getTime() - new Date(end).getTime()) / (1000 * 60 * 60 * 24);
}

function getFabLeadTime(item: any, wantedFabFinishDate?: string): string | null {
  const fabIn = item?.creationDate;
  const fabOut = item?.fabOutHistory?.endDate;
  if (!fabIn || !fabOut) return null;

  const lead = workingDaysFloat(fabIn, fabOut, customHolidays.value);
  if (lead == null) return null;

  if (!wantedFabFinishDate) return getWorkingDays(lead);

  const delta = workingDaysFloat(wantedFabFinishDate, fabOut, customHolidays.value);
  if (delta == null || Math.abs(delta) < 1e-9) return getWorkingDays(lead);

  const base = getWorkingDays(lead);
  const diffTxt = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`;

  return `${base} ${
    delta > 0
      ? `<span style="color:red;">(${diffTxt})</span>`
      : `<span style="color:blue;">(${diffTxt})</span>`
  }`;
}


// function traceWorkingDaysFloat(
//   startVal?: string | Date,
//   endVal?: string | Date,
//   extraHolidays: string[] = []
// ) {
//   //  REPLACE: 이 함수 내부의 toDate를 위와 동일한 것으로 교체
//   const toDate = (v?: string | Date | null) => {
//     if (!v) return null;
//     if (v instanceof Date) return isNaN(v.getTime()) ? null : v;

//     let s = String(v).trim();
//     if (/[zZ]$/.test(s) || /[+\-]\d{2}:\d{2}$/.test(s)) {
//       const d = new Date(s);
//       return isNaN(d.getTime()) ? null : d;
//     }
//     if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += 'T00:00:00';
//     else s = s.replace(' ', 'T');

//     const withTz = `${s}+09:00`;
//     const d = new Date(withTz);
//     return isNaN(d.getTime()) ? null : d;
//   };

//   const dayStart = (d: Date) =>
//     new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
//   const nextDayStart = (d: Date) =>
//     new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
//   const addDays = (d: Date, n: number) =>
//     new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
//   const toYMD = (d: Date) => {
//     const m = `${d.getMonth() + 1}`.padStart(2, '0');
//     const day = `${d.getDate()}`.padStart(2, '0');
//     return `${d.getFullYear()}-${m}-${day}`;
//   };
//   const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

//   let s = toDate(startVal);
//   let e = toDate(endVal);
//   if (!s || !e) return { totalDays: null, rows: [] };

//   let sign = 1;
//   if (s > e) {
//     [s, e] = [e, s];
//     sign = -1;
//   }

//   const HOL = new Set(extraHolidays.map((x) => x.trim()));
//   const msPerHour = 1000 * 60 * 60;

//   let cursor = dayStart(s);
//   const endDay = dayStart(e);
//   let workHours = 0;
//   const rows: any[] = [];

//   while (cursor <= endDay) {
//     const ymd = toYMD(cursor);
//     const weekend = isWeekend(cursor);
//     const holiday = HOL.has(ymd);

//     const segStart = new Date(Math.max(dayStart(cursor).getTime(), s.getTime()));
//     const segEnd = new Date(Math.min(nextDayStart(cursor).getTime(), e.getTime()));
//     const hours = Math.max(0, (segEnd.getTime() - segStart.getTime()) / msPerHour);

//     if (!(weekend || holiday)) workHours += hours;

//     rows.push({
//       ymd,
//       weekend,
//       holiday,
//       segStart: segStart.toISOString(),
//       segEnd: segEnd.toISOString(),
//       hoursAdded: !(weekend || holiday) ? hours : 0,
//     });

//     cursor = addDays(cursor, 1);
//   }

//   return { totalDays: sign * (workHours / 24), rows };
// }

function getShipLeadTime(item: any): string | null {
  const fabOut = item?.fabOutHistory?.endDate;
  const isTransit = item?.operation?.name === "Transit 공정";
  const shipIn = isTransit ? item?.moveinDate : null;
  if (!fabOut || !shipIn) return null;
  return getWorkingDays(workingDaysFloat(fabOut, shipIn, customHolidays.value));

//   const fabOut = "2025-10-30T17:00:00";          // 실제 FAB OUT
// const transit = "2025-11-05T09:27:00";         // Transit move-in
// const hol = customHolidays.value;              // 네가 넣는 휴무일 리스트

// const t = traceWorkingDaysFloat(fabOut, transit, hol);
// console.table(t.rows);
// console.log("TOTAL:", t.totalDays);
// return null;;
}

function handleExcelSubmit() {
}

function diffDaysWithDecimal(startStr?: string, endStr?: string): string | null {
  if (!startStr || !endStr) return null;

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24); // **시간까지 포함한 정확한 일수**

  if (diffDays < 0) return null;

  return `${diffDays.toFixed(1)}일`; // 소수점 1자리
}

// 필터 토글 함수
const toggleFilter = () => {
  isFiltered.value = !isFiltered.value;
};

const toggleLateFilter = () => {
  isDealyFab.value = !isDealyFab.value;
};

const toggleDVFilter = () => {
  isDVonly.value = !isDVonly.value;
};

</script>

<style lang="scss" scoped>
/* 글로벌 적용 */

.custom-table ::v-deep(.el-table__header-wrapper th) {
  font-weight: bold; /* 두껍게 */
  font-size: 16px; /* 크기를 키워 가독성 향상 */
  background-color: #f1f1f1; /* 연한 회색 배경 */
  font-family: "Times New Roman", Times, serif; /* Times New Roman 글꼴 설정 */
  color: #222; /* 진한 텍스트 색상 */
  text-align: center; /* 중앙 정렬 */
  border-bottom: 2px solid #ccc; /* 구분을 위한 아래 테두리 */
}

.custom-table ::v-deep(.even-row) {
  box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: rgb(243, 235, 235);
  border-radius: 1px;

  // padding: 4px;
}

.custom-table ::v-deep(.el-table__cell) {
  font-size: 14px; /* 약간 큰 텍스트 */
  // padding: 10px 5px; /* 셀 여백 추가 */
  color: #333; /* 일반 텍스트 색상 */
  background-color: #ffffff; /* 흰색 배경 */
  border-bottom: 1px solid #e0e0e0; /* 셀 구분을 위한 테두리 */
}

.custom-table ::v-deep(.el-table__cell.highlighted-cell) {
  font-weight: bold; /* 강조 */
  color: #1a73e8; /* 파란색 텍스트 */
}

.table-wrapper {
  max-width: 100%;
}

.custom-table {
  font-size: 12px;
  padding-right: 10px;
  margin-right: 10px;
  /* font-weight: 700; */
}

.group-count {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.group-box {
  background-color: #f0f9ff;
  border: 1px solid #dbeafe;
  padding: 5px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 12px;
  color: #1e40af;
}

.buttun-section {
  margin-top: 15px;
}
</style>
