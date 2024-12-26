<template>
  <!-- <div class="group-count">
    <div v-for="(count, group) in groupCounts" :key="group" class="group-box">
      <span>{{ group }}: {{ count }}개</span>
    </div>
  </div> -->

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
          <el-option label="Product Name" value="modelName"></el-option>
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

      <!-- <div style="display: flex; align-items: center">
        <el-date-picker
          v-model="firstDate"
          type="date"
          placeholder="시작 날짜"
          style="width: 150px; margin-right: 5px"
        ></el-date-picker>

        <span style="margin: 0 5px">~</span>

        <el-date-picker
          v-model="lastDate"
          type="date"
          placeholder="종료 날짜"
          style="width: 150px; margin-right: 10px"
        ></el-date-picker>

        <el-button type="primary" style="margin-left: 10px"> 검색 </el-button>
      </div> -->
    </div>

    <el-table
      :data="filteredApplicationData"
      class="custom-table"
      style="min-width: 1000px"
      height="670"
      :row-style="{ height: '30px' }"
      :cell-class-name="cellClass"
    >
      <el-table-column
        :fixed="'left'"
        type="index"
        label="No"
        width="70"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        :fixed="'left'"
        label="주차"
        width="70"
        prop="weekNumber"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        :fixed="'left'"
        prop="modelName"
        label="P/N"
        width="140"
        :align="'center'"
      />

      <el-table-column
        label="개발자"
        width="120"
        :align="'center'"
        :fixed="'left'"
      >
        <template #default="scope">
          {{ scope.row.designer }} <br />
          {{ scope.row.requester }}
        </template>
      </el-table-column>

      <el-table-column
        label="LOT ID"
        width="120"
        :align="'center'"
        fixed="left"
      >
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index" >
            {{ item.lotId }} 
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="FAB 투입 계획일" width="110" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.wantedFabStartDate) }}
        </template>
      </el-table-column>
      <el-table-column label="FAB 투입일" :align="'center'" width="130">
        <template #default="scope"> 
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ formatDate(item.creationDate) }}
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="FAB Out 계획일" width="105" :align="'center'">
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.wantedFabFinishDate) }}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column
        label="FAB 현위치(투입시간)"
        :align="'center'"
        width="270"
      >
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index" :style="testFabOutAlarm(item.operation.operationId, item.moveinDate) ? 'color: red;' : ''">
            {{ item["operation"]["name"] }}
            {{ formatDateTime(item.moveinDate) }}
            <!-- {{ item.operation.operationId }} -->
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="WHC 출하 예정일" :align="'center'" width="120">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['operation']['operationId'] === 'OP0E002040'">
              {{ formatDate(adjustDate(item["moveinDate"], 3)) }}
            </span>
            <span
              v-else-if="
                item['secondProbeHistory'] !== null &&
                item['secondProbeHistory']['startDate'] !== null
              "
            >
              {{
                formatDate(
                  adjustDate(item["secondProbeHistory"]["startDate"], 3)
                )
              }}
            </span>
            <span
              v-else-if="
                item['secondProbeHistory'] !== null &&
                item['secondProbeHistory']['endDate'] !== null
              "
            >
              {{
                formatDate(adjustDate(item["secondProbeHistory"]["endDate"], 3))
              }}
            </span>
            <span
              v-else-if="
                item['secondProbeHistory'] !== null &&
                item['secondProbeHistory']['startDate'] === null
              "
            >
              SKIP
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="WHC 출하" :align="'center'" width="120">
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

      <el-table-column label="WHC 도착" :align="'center'" width="120">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['hanoiCsp'] !== null">
              {{ formatDate(item["hanoiCsp"]["creationDate"]) }}
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Assy In 예정일" :align="'center'" width="105">
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
        label="WHC 개발팀 입고"
        width="150"
        :align="'center'"
      ></el-table-column>
      <el-table-column
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
      </el-table-column>
    </el-table>
    <DialogTemplate
      v-model:visible="dialogTableVisible"
      :fabApplicationId="selectApplicationId"
    ></DialogTemplate>
  </div>

  <el-button type="primary" @click="toggleFilter" class="buttun-section">
    {{ isFiltered ? "원래 데이터 보기" : "중화 69 과제 보기" }}
  </el-button>
  <el-button type="warning" @click="toggleLateFilter" class="buttun-section">
    {{ isDealyFab ? "원래 데이터 보기" : "지연 과제 보기" }}
  </el-button>
  <el-button type="primary" @click="handleExcelSubmit" class="buttun-section">
    개발 샘플 진행 상황 EXCEL
  </el-button>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, watch } from "vue";

import {
  handleDateChange as externalHandleDateChange,
  updateStatus,
} from "./ApplicationsByWeek";
import { createTableData, getLateFab, testFabOutAlarm, downloadFabPlanExcel } from "./ApplicationList";
import { formatDate, formatDateTime } from "../Common/Application";
import { getTodayDatetime, adjustDate } from "../../../utils/date-utils";
import MyApplicationList from "../../Mdr/General/ApplicationList/MyApplicationList.vue";
import type { FabApplicationForm } from "../../../interface/mes-interface";
import DialogTemplate from "./ApplicationLinksDialog.vue";
import { cn69ModelNames } from "../SampleStatus/Cn69List";
import type { ModifiedFabDataInterface } from "../../../interface/fab";
import { getRunningFabReqeust } from "../../../utils/Fab/fab-application-utils";

const props = defineProps<{
  processData: FabApplicationForm[];
}>();

// 라우터 및 현재 경로 가져오기
const searchTerm = ref("");
const searchCategory = ref("modelName"); // 기본 검색 기준을 "Lot ID"로 설정
const isRunningFab = ref(true);
const isDealyFab = ref(false);
// Clear the search input
function handleClear() {
  searchTerm.value = ""; // Reset search term
}

const firstDate = adjustDate(getTodayDatetime(), -30);
const lastDate = getTodayDatetime();

const dialogTableVisible = ref(false);
const selectApplicationId = ref("");
function handleVisible(status: boolean, id: string) {
  dialogTableVisible.value = status;
  selectApplicationId.value = id;
}


const filteredApplicationData = computed(() => {
  const term = searchTerm.value.toLowerCase();

  return filteredData.value.filter((item) => {
    // 선택한 검색 기준을 기준으로 필터링
    const field = item[searchCategory.value];

    // field가 number 타입이면 toString()으로 변환 후 비교
    if (typeof field === 'number') {
      return field.toString().includes(term);
    }

    // field가 string 타입이면 기존 로직 사용
    if (typeof field === 'string') {
      return field.toLowerCase().includes(term);
    }

    // 기타 타입은 필터링 제외
    return false;
  });
});

const modifiedFabData = ref<ModifiedFabDataInterface[]>([]);

// 필터링 상태를 관리하는 변수
const isFiltered = ref(false);
const temp = ref<FabApplicationForm[]>([]);
// 특정 material_id가 포함된 항목들만 필터링한 배열

// watch(isRunningFab , (newVal , oldVal)=> {

//   isRunningFab.value = newVal
//   console.log(isRunningFab.value)

// })

const filteredData = computed(() => {
  // 다시 생각해보기,
  // 일단..
  // running === ture 의 의미를 정리하기
  // 한개라도 완료된게 아니면 아직 running이다.
  const tempApp = ref<FabApplicationForm[]>([]);

  if (!isRunningFab.value) {
    tempApp.value = props.processData;
  } else {
    tempApp.value = getRunningFabReqeust(props.processData);
  }
  
  if (isDealyFab.value){
    tempApp.value = getLateFab(tempApp.value)
  }
  else{
    tempApp.value = tempApp.value
  }

  if (isFiltered.value) {
    temp.value = [];

    tempApp.value.forEach((item) => {
      const modelName = item.modelName.split("@")[0].toLowerCase();

      // cn69ModelNames와 비교
      if (cn69ModelNames.includes(modelName)) {
        temp.value.push(item);
      }
    });

    return temp.value;
  }

  return tempApp.value;
});

// 필터 토글 함수
const toggleFilter = () => {
  isFiltered.value = !isFiltered.value;
};

const toggleLateFilter = () => {
  isDealyFab.value = !isDealyFab.value;
};

// emit 정의
const emit = defineEmits<{
  (e: "update:processData", updatedData: FabApplicationForm[]): void;
}>();

// 셀에 적용할 클래스 반환
const cellClass = ({ row, rowIndex, column, columnIndex }) => {
  // 예: 짝수 행에만 스타일을 적용
  if ([5, 7, 9, 12].includes(columnIndex)) {
    return "even-row";
  }
  
  return "";
};

const groupCounts = computed(() => {
  return props.processData.reduce((acc, item) => {
    acc[item.group] = (acc[item.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
});

function handleExcelSubmit() {
  modifiedFabData.value = [];
  modifiedFabData.value = createTableData(
    filteredData.value,
    modifiedFabData.value
  );
  downloadFabPlanExcel(modifiedFabData.value);
}
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
