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

      <!-- 필터/엑셀 버튼: 표 아래에 있던 것을 위로 옮겨 표가 화면 끝까지 차게 함 -->
      <div class="toolbar-actions">
        <el-button type="info" :plain="!showLotId" @click="showLotId = !showLotId">
          {{ showLotId ? "LOT ID 숨기기" : "LOT ID 보기" }}
        </el-button>
        <el-button type="warning" :plain="!isDealyFab" @click="toggleLateFilter">
          {{ isDealyFab ? "원래 데이터 보기" : "지연 과제 보기" }}
        </el-button>
        <el-button type="warning" :plain="!isDVonly" @click="toggleDVFilter">
          {{ isDVonly ? "Cancel DV" : "DV only" }}
        </el-button>
        <el-button type="warning" :plain="!isTransitedOnly" @click="toggleTransitedFilter">
          {{ isTransitedOnly ? "전체 보기" : "출하완료 보기" }}
        </el-button>
        <el-button type="primary" @click="handleExcelSubmit">
          개발 샘플 진행 상황 EXCEL
        </el-button>
      </div>
    </div>

    <div ref="tableBox">
    <el-table
      :data="filteredApplicationData"
      class="custom-table"
      style="min-width: 1000px"
      :height="tableHeight" scrollbar-always-on
      :default-sort="{ prop: 'wantedFabStartDate', order: 'ascending' }"
      :row-style="{ height: '30px' }"
      :cell-class-name="cellClass"
    >
      <el-table-column
        :fixed="'left'"
        prop="productName"
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
        <!-- 한 줄 표시: 개발자=의뢰자면 이름 한 번, 다르면 "개발자 / 의뢰자". 길면 … 처리, 마우스를 대면 전체 -->
        <template #default="scope">
          <div class="one-line" :title="peopleLabel(scope.row)">{{ peopleLabel(scope.row) }}</div>
        </template>
      </el-table-column>
      
      <el-table-column
        :fixed="'left'"
        prop="priorityId"
        label="Priority"
        width="80"
        :align="'center'"
      />
      
      <!-- Wafer LOT ID: 기본 숨김, 상단 "LOT ID 보기" 버튼으로 표시 -->
      <el-table-column
        v-if="showLotId"
        width="110"
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

      <el-table-column label="FAB 투입일" :align="'center'" width="110" class-name="even-row">
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
        class-name="even-row"
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

      <!-- FAB 진행률: lot 마다 한 줄 막대. 표와 따로 조회되어 도착하면 채워짐 -->
      <el-table-column label="FAB 진행률" :align="'center'" width="150">
        <template #default="scope">
          <div
            v-for="(item, index) in scope.row.lotStatus"
            :key="index"
            class="pbar-line"
            :title="progressTitle(item)"
          >
            <template v-if="progressOf(item) !== null">
              <span class="pbar">
                <span
                  class="pbar-fill"
                  :class="{ done: progressOf(item) === 100, rework: lotProgress?.[item.lotId]?.isRework }"
                  :style="{ width: progressOf(item) + '%' }"
                ></span>
              </span>
              <span class="pbar-txt">{{ progressOf(item) === 100 ? "완료" : Math.round(progressOf(item)!) + "%" }}</span>
            </template>
            <span v-else class="pbar-empty">{{ lotProgressState === "loading" ? "…" : "-" }}</span>
          </div>
        </template>
      </el-table-column>

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

      <el-table-column  :align="'center'" width="90" class-name="even-row">
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

      <el-table-column label="HQ 출하" :align="'center'" width="100" class-name="even-row">
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
      
      <el-table-column
        label="BOX ID"
        width="130"
        :align="'center'"
      >
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ item.lotUdf12 ?? '--' }}
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
    </div>
    <!-- <DialogTemplate
        v-model:visible="dialogTableVisible"
        :fabApplicationId="selectApplicationId"
      ></DialogTemplate> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useFillHeight } from "../../../../utils/use-fill-height";
import { useSessionRef } from "../../../../utils/session-state";

// 표 높이 = 화면 아래 끝까지 (탭 안쪽 여백 15 + 본문 여백 10 + 여유)
const tableBox = ref<HTMLElement | null>(null);
const { height: tableHeight } = useFillHeight(tableBox, 30);
import type { FabRequest } from "../../../../interface/fab-application-rev2";
import {
  formatDate,
  formatDateTime,
} from "../../../../utils/date-utils";
import { cn69ModelNames } from "../../SampleStatus/Cn69List";
import type { ModifiedFabDataInterface } from "../../../../interface/fab";
import {
  getRunningFabReqeustRev2,
  type LotProgress,
} from "../../../../utils/Fab/fab-application-utils";
import {
  testFabOutAlarm,
  getLateFabRev2,
} from "../ApplicationList";
import { onMounted, watch } from "vue";
import * as xlsx from "xlsx";
import ExcelJS, { Alignment, Borders, FillPattern } from "exceljs";
import {saveAs} from "file-saver";
import { holidaysList } from "../../../../utils/date-utils";
const props = defineProps<{
  fabApp: FabRequest[];
  isWlp?: boolean;
  /** 검색어/필터를 F5 후에도 유지하기 위한 탭별 저장 키 (csp / wlp / etc) */
  stateKey?: string;
  /** lot 별 FAB 진행률 (key = lot_id) */
  lotProgress?: Record<string, LotProgress>;
  lotProgressState?: "loading" | "done" | "failed";
}>();

/** 개발자 칸 한 줄 표시용 */
function peopleLabel(row: any): string {
  const d = row?.designer?.userName ?? "";
  const r = row?.requester?.userName ?? "";
  if (!r || r === d) return d || "-";
  if (!d) return r;
  return `${d} / ${r}`;
}

/**
 * lot 의 FAB 진행률(0~100). 모르면 null.
 * FAB OUT 이력이 있거나, 출하(TRANSIT)/하노이로 넘어간 lot 은 MES 진행 목록에서 빠지므로 완료(100)로 본다.
 */
function progressOf(item: any): number | null {
  const p = props.lotProgress?.[item?.lotId]?.progress;
  if (typeof p === "number" && p >= 100) return 100;
  const site = String(item?.operation?.siteId ?? "");
  if (item?.fabOutHistory != null || item?.operation?.operationId === "TRANSIT" || site.startsWith("HANOI")) return 100;
  return typeof p === "number" ? Math.max(0, p) : null;
}

function progressTitle(item: any): string {
  const info = props.lotProgress?.[item?.lotId];
  const pct = progressOf(item);
  if (pct === null) return props.lotProgressState === "failed" ? "진행률 조회 실패" : "";
  if (pct === 100 && !(info && (info.progress ?? 0) >= 100)) return `${item?.lotId}: FAB 완료`;
  const seq = info?.currentSeqNo != null && info?.totalSeqNo ? ` (공정 ${info.currentSeqNo}/${info.totalSeqNo})` : "";
  return `${item?.lotId}: ${pct === 100 ? "FAB 완료" : pct.toFixed(1) + "%"}${seq}${info?.isRework ? " · 재작업 중" : ""}`;
}

// 검색/필터 상태: 탭별로 sessionStorage 에 저장 → F5 후에도 유지 (브라우저 탭을 닫으면 초기화)
const sk = (name: string) => `sample_monitor:${props.stateKey ?? "default"}:${name}`;
const searchTerm = useSessionRef<string>(sk("searchTerm"), "");
const searchCategory = useSessionRef<string>(sk("searchCategory"), "productName");
// 검색 기준은 Designer / Product Name 두 가지만 (Priority, Week Number 제거). 예전에 저장된 값이면 기본값으로
if (!["designer", "productName"].includes(searchCategory.value)) searchCategory.value = "productName";
const isRunningFab = useSessionRef<boolean>(sk("isRunningFab"), true);
const isDealyFab = useSessionRef<boolean>(sk("isDealyFab"), false);
const isDVonly = useSessionRef<boolean>(sk("isDVonly"), false);
const isTransitedOnly = useSessionRef<boolean>(sk("isTransitedOnly"), false);
// Wafer LOT ID 열 표시 여부 (기본 숨김, F5 후에도 유지)
const showLotId = useSessionRef<boolean>(sk("showLotId"), false);
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

  if (isTransitedOnly.value) {
    // Keep only the lotStatus.operationId 'TRANSIT'
    const filteredTransited = tempApp.value.map((item) => {
      return {
        ...item,
        lotStatus: item.lotStatus.filter((lot) =>
          lot.operation.operationId === 'TRANSIT'
        ),
      };
    });

    // Filter applications that have length > 0 in lotStatus
    tempApp.value = filteredTransited.filter((item) =>
      item.lotStatus.length > 0
    );
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
  // 강조 열(FAB 투입일, FAB 현위치, FAB 진행일, HQ 출하)은 각 열의 class-name="even-row" 로 지정
  // (예전에는 열 순번으로 판단해서 열을 추가/삭제하면 엉뚱한 열이 강조됨)
  return "";
};

const groupCounts = computed(() => {
  return props.fabApp.reduce((acc, item) => {
    acc[item.group] = (acc[item.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
});

const modifiedFabData = ref<ModifiedFabDataInterface[]>([]);

function  normalizeHolidayDate(str: string): string {
  const s = str.trim();

  // 이미 YYYY-MM-DD 형태인 경우
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // "YYYY. M. D." 형태인 경우
  const m = s.match(/^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.$/);
  if (m) {
    const [, year, month, day] = m;
    return [
      year,
      month.padStart(2, "0"),
      day.padStart(2, "0"),
    ].join("-");
  }

  // 그 외에는 Date로 한 번 파싱 후 YYYY-MM-DD로 포맷
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m2 = String(d.getMonth() + 1).padStart(2, "0");
    const d2 = String(d.getDate()).padStart(2, "0");
    return `${y}-${m2}-${d2}`;
  }

  console.warn("[normalizeHolidayDate] Unknown format:", str);
  return s;
}

const customHolidays = ref<string[]>(
  holidaysList.map((d) => normalizeHolidayDate(d))
);



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

  return base
  // return `${base} ${
  //   delta > 0
  //     ? `<span style="color:red;">(${diffTxt})</span>`
  //     : `<span style="color:blue;">(${diffTxt})</span>`
  // }`;
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

const EXCEL_HEADERS = [
  "P/N",
  "개발자",
  "의뢰자",
  "우선순위",
  "Wafer LOT ID",
  "FAB 투입일",
  "FAB OUT 계획일",
  "FAB 현위치(투입시간)",
  "FAB OUT",
  "FAB 진행일",
  "FAB 리드타임",
  "출하 현위치(투입시간)",
  "HQ 출하",
  "출하 리드타임",
  "WHC 도착",
  "Assy In",
  "WHC 현위치(투입시간)",
  "Wafer ID",
];

// ⬇️ HTML 섞인 텍스트 정리 (리드타임 diff는 색상 span이 있어서 제거)
function stripHtml(s?: string | null) {
  if (!s) return "";
  return s.replace(/<[^>]*>/g, "").trim();
}

// ⬇️ "x.x일" 같은 표시를 숫자(업무일)로만 뽑고 싶을 때
function parseBizDays(label?: string | null): number | null {
  if (!label) return null;
  const m = label.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

// ⬇️ 데이터 → 엑셀용 JSON 로우로 변환
function buildExcelRows(source: any[]): any[] {
  const rows: any[] = [];

  source.forEach((app) => {
    const pn = app.productName ?? "";
    const designer = app?.designer?.userName ?? "";
    const requester = app?.requester?.userName ?? "";
    const priority = app?.priorityId ?? "";
    const wantedFabFinishDate = app?.wantedFabFinishDate ?? null;

    (app?.lotStatus ?? []).forEach((st: any) => {
      const lotId = st?.lotId ?? "";
      const waferId = st?.waferId ?? "";
      const fabIn = st?.creationDate ?? null;
      const fabOut = st?.fabOutHistory?.endDate ?? null;

      // ✅ 기존 화면 로직 복제
      const fabWhere = st?.fabOutHistory == null
        ? `${st?.operation?.name ?? ""} ${formatDateTime(st?.moveinDate)}`
        : `${st?.fabOutHistory?.operation?.name ?? ""} ${formatDate(st?.fabOutHistory?.endDate)}`;

      const fabProgressLabel =
          st?.fabOutHistory == null
          ? getWorkingDays(workingDaysFloat(fabIn, new Date(), customHolidays.value))
          : "";
      const fabLeadHtml = getFabLeadTime({ fabOutHistory: st?.fabOutHistory, creationDate: fabIn }, wantedFabFinishDate);
      const fabLeadLabel = stripHtml(fabLeadHtml);

      const isTransit = st?.operation?.name === "Transit 공정";
      const hqShip = isTransit ? st?.moveinDate : null;
      const shipLeadLabel = getWorkingDays(workingDaysFloat(fabOut, hqShip, customHolidays.value));

      // ⬇⬇⬇ 추가: 출하/WHC 현위치 텍스트
      const shipWhere = buildShipWhere(st);
      const whcWhere = buildWhcWhere(st, props.isWlp); // WLP 탭이면 hanoiWlp, 아니면 hanoiCsp 체인
      // ⬆⬆⬆

      const whcArrive =
        st?.hanoiCsp?.creationDate ??
        st?.hanoiWlp?.creationDate ?? null;
      const assyIn = st?.hanoiCsp?.moveinDate ?? null;

      rows.push({
        "P/N": pn,
        "개발자": designer,
        "의뢰자": requester,
        "우선순위": priority,
        "Wafer LOT ID": lotId,
        "FAB 투입일": fabIn ? formatDate(fabIn) : "",
        "FAB OUT 계획일": wantedFabFinishDate ? formatDate(wantedFabFinishDate) : "",
        "FAB 현위치(투입시간)": fabWhere || "",
        "FAB OUT": fabOut ? formatDate(fabOut) : "",
        "FAB 진행일": fabProgressLabel ?? "",
        "FAB 리드타임": fabLeadLabel ?? "",
        "출하 현위치(투입시간)": shipWhere,
        "HQ 출하": hqShip ? formatDate(hqShip) : "",
        "출하 리드타임": shipLeadLabel ?? "",
        "WHC 도착": whcArrive ? formatDate(whcArrive) : "",
        "Assy In": assyIn ? formatDate(assyIn) : "",
        "WHC 현위치(투입시간)": whcWhere,
        "Wafer ID": waferId ?? "",
      });
    });
  });

  return rows;
}

function buildShipWhere(st: any): string {
  if (st?.fabOutHistory == null) return ""; // 화면도 이 경우 '--'
  const op = st?.operation?.name ?? "";
  const ts = st?.moveinDate ? formatDateTime(st.moveinDate) : "";
  return [op, ts].filter(Boolean).join(" ");
}

// WHC 현위치: 화면은 WLP/비-WLP로 분기해서 가장 "현재 공정"의 name/투입시간/lotId를 보여줌.
// 엑셀에서는 가장 '깊이 있는' 노드를 찾아 1줄 요약으로 넣자.
function buildWhcWhere(st: any, isWlp?: boolean): string {
  // WLP 모드
  if (isWlp) {
    const w = st?.hanoiWlp;
    if (!w) return "";
    const op = w?.operation?.name ?? "";
    const ts = w?.moveinDate ? formatDateTime(w.moveinDate) : "";
    const lot = w?.lotId ?? "";
    return [op, ts, lot].filter(Boolean).join(" ");
  }

  // CSP 체인: hanoiCsp -> child -> child -> ...
  let node = st?.hanoiCsp;
  if (!node) return "";

  // 가장 깊은 child까지 내려가기
  let cur = node;
  while (cur?.child) cur = cur.child;

  const op = cur?.operation?.name ?? "";
  const ts = cur?.moveinDate ? formatDateTime(cur.moveinDate) : "";
  const lot = cur?.lotId ?? "";
  return [op, ts, lot].filter(Boolean).join(" ");
}

async function handleExcelSubmit() {
  try {
    const data = filteredApplicationData.value ?? [];
    const rows = buildExcelRows(data);
    const headers = EXCEL_HEADERS;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("개발 샘플 진행", {
      views: [{ state: "frozen", ySplit: 1 }]  // 헤더 고정
    });

    ws.addRow(headers);

    rows.forEach((r) => {
      ws.addRow(headers.map(h => r[h] ?? ""));
    });

   //컬럼 폭 자동 비슷하게(최소 12, 최대 40)
   headers.forEach((h, i) => {
      const maxLen = Math.max(
        h.length,
        ...rows.map(r => String(r[h] ?? "").length)
      );
      ws.getColumn(i + 1).width = Math.min(Math.max(12, maxLen + 2), 40);
    });


    const headerFill: FillPattern = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2F5597" } }; // #2F5597
    const headerFont = { bold: true, color: { argb: "FFFFFFFF" } };
    const headerAlignment: Partial<Alignment>  = { vertical: "middle", horizontal: "center", wrapText: true };
    const borderThin: Partial<Borders> = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };

    const headerRow = ws.getRow(1);
    headerRow.height = 22;
    headerRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = headerAlignment;
      cell.border = borderThin;
    });

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      row.height = 18; // (엑셀의 자동높이는 완전 자동이 아님. wrapText용 기본값)
      row.eachCell((cell) => {
        cell.border = borderThin;
        cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
      });
    }

    ws.autoFilter = {
      from: { row: 1, column: 1 },
      to:   { row: 1, column: headers.length },
    };
    // const headerFill = { patternType: "solid", fgColor: { rgb: "4F81BD" } }; // 짙은 파랑
    // for (let C = range.s.c; C <= range.e.c; ++C) {
    //   const addr = XLSX.utils.encode_cell({ r: 0, c: C }); // 1행(0-index)
    //   if (!ws[addr]) continue;
    //   ws[addr].s = ws[addr].s || {};
    //   ws[addr].s.fill = headerFill;
    //   ws[addr].s.font = { bold: true, color: { rgb: "FFFFFF" } };
    //   ws[addr].s.alignment = { horizontal: "center", vertical: "center" };
    // }

    const ts = new Date();
    const yyyy = ts.getFullYear();
    const mm = String(ts.getMonth() + 1).padStart(2, "0");
    const dd = String(ts.getDate()).padStart(2, "0");
    const hh = String(ts.getHours()).padStart(2, "0");
    const mi = String(ts.getMinutes()).padStart(2, "0");
    const fn = `개발샘플_진행상황_${yyyy}${mm}${dd}_${hh}${mi}.xlsx`;

    // 6) 다운로드
     const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fn);
  } catch (err) {
    console.error("Excel export failed:", err);
  }
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

const toggleTransitedFilter = () => {
  isTransitedOnly.value = !isTransitedOnly.value;
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

/* 개발자 칸: 한 줄, 넘치면 … */
.one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* FAB 진행률: 다른 열의 lot 한 줄(23px)과 높이를 맞춰 줄이 어긋나지 않게 함 */
.pbar-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 23px;
}
.pbar {
  position: relative;
  flex: 1;
  max-width: 80px;
  height: 8px;
  border-radius: 4px;
  background: #e4e7ed;
  overflow: hidden;
}
.pbar-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 4px;
  background: #409eff;
}
.pbar-fill.rework {
  background: #e6a23c;
}
.pbar-fill.done {
  background: #67c23a;
}
.pbar-txt {
  width: 34px;
  text-align: right;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.pbar-empty {
  color: #c0c4cc;
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}
.toolbar-actions .el-button + .el-button {
  margin-left: 0;
}
</style>
