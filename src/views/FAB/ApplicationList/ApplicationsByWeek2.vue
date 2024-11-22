<template>
  <!-- <div class="group-count">
    <div v-for="(count, group) in groupCounts" :key="group" class="group-box">
      <span>{{ group }}: {{ count }}개</span>
    </div>
  </div> -->

  <div class="table-wrapper">
    <!-- 검색어 입력 필드 -->
    <div style="margin-bottom: 10px">
      <el-select
        v-model="searchCategory"
        placeholder="검색 기준"
        class="search-dropdown"
        style="width: 150px"
      >
        <el-option label="Designer" value="designer"></el-option>
        <el-option label="Product Name" value="modelName"></el-option>
      </el-select>

      <el-input
        v-model="searchTerm"
        :placeholder="`검색할 ${searchCategory} 입력`"
        class="search-input mr10"
        clearable
        @clear="handleClear"
        style="width: 300px"
      ></el-input>
    </div>

    <el-table
      :data="filteredApplicationData"
      class="custom-table"
      style="min-width: 1000px"
      height="640"
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
        label="주차"
        width="50"
        prop="weekNumber"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        :fixed="'left'"
        prop="modelName"
        label="P/N"
        width="90"
        :align="'center'"
      />

      <el-table-column
        label="개발자"
        width="80"
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
        width="100"
        :align="'center'"
        fixed="left"
      >
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ item.lot_id }}
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="FAB 투입 계획일" width="90" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.wantedFabStartDate) }}
        </template>
      </el-table-column>
      <el-table-column label="FAB 투입일" :align="'center'" width="90">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ formatDate(item.creation_date) }}
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="FAB Out - 계획일" width="90" :align="'center'">
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.wantedFabFinishDate) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="현위치(투입시간)" :align="'center'" width="200">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            {{ item["operation"]["name"] }}
            {{ formatDateTime(item.movein_date) }}
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="WHC 출하 예정일" :align="'center'" width="90">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['operation']['operation_id'] === 'OP0E002040'">
              {{ formatDate(adjustDate(item["movein_date"], 3)) }}
            </span>
            <span
              v-else-if="
                item['second_probe_history'] !== null &&
                item['second_probe_history']['start_date'] !== null
              "
            >
              {{
                formatDate(
                  adjustDate(item["second_probe_history"]["start_date"], 3)
                )
              }}
            </span>
            <span
              v-else-if="
                item['second_probe_history'] !== null &&
                item['second_probe_history']['end_date'] !== null
              "
            >
              {{
                formatDate(
                  adjustDate(item["second_probe_history"]["end_date"], 3)
                )
              }}
            </span>
            <span
              v-else-if="
                item['second_probe_history'] !== null &&
                item['second_probe_history']['start_date'] === null
              "
            >
              SKIP
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="WHC 출하" :align="'center'" width="90">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['operation']['name'] === 'Transit 공정'">
              {{ formatDate(item["movein_date"]) }}
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="WHC 도착" :align="'center'" width="90">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['hanoi_csp'] !== null">
              {{ formatDate(item["hanoi_csp"]["creation_date"]) }}
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Assy In 예정일" :align="'center'" width="80">
      </el-table-column>

      <el-table-column label="Assy In" :align="'center'" width="110">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.lotStatus" :key="index">
            <span v-if="item['hanoi_csp'] !== null">
              {{ formatDate(item["hanoi_csp"]["movein_date"]) }}
            </span>
            <span v-else> -- </span>
            <br />
          </span>
        </template>
      </el-table-column>

      <el-table-column label="현위치(투입시간)" :align="'center'" width="1500">
        <el-table-column label="플립본딩" width="400" :align="'center'">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.lotStatus" :key="index">
              <span
                v-if="
                  item['hanoi_csp'] !== null &&
                  item['hanoi_csp']['child'] !== null
                "
              >
                {{ item["hanoi_csp"]["child"]["operation"]["name"] }}
                {{ formatDateTime(item["hanoi_csp"]["child"]["movein_date"]) }}
                {{ item["hanoi_csp"]["child"]["lot_id"] }}
              </span>
              <span
                v-else-if="
                  item['hanoi_csp'] !== null &&
                  item['hanoi_csp']['child'] === null
                "
              >
                {{ item["hanoi_csp"]["operation"]["name"] }}
                {{ formatDateTime(item["hanoi_csp"]["movein_date"]) }}
                {{ item["hanoi_csp"]["lot_id"] }}
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
                  item['hanoi_csp'] !== null &&
                  item['hanoi_csp']['child'] !== null &&
                  item['hanoi_csp']['child']['child'] !== null
                "
              >
                {{ item["hanoi_csp"]["child"]["child"]["operation"]["name"] }}
                {{
                  formatDateTime(
                    item["hanoi_csp"]["child"]["child"]["movein_date"]
                  )
                }}
                {{ item["hanoi_csp"]["child"]["child"]["lot_id"] }}
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
                  item['hanoi_csp'] !== null &&
                  item['hanoi_csp']['child'] !== null &&
                  item['hanoi_csp']['child']['child'] !== null &&
                  item['hanoi_csp']['child']['child']['child'] !== null &&
                  item['hanoi_csp']['child']['child']['child']['child'] !== null
                "
              >
                {{
                  item["hanoi_csp"]["child"]["child"]["child"]["child"][
                    "operation"
                  ]["name"]
                }}
                {{
                  formatDateTime(
                    item["hanoi_csp"]["child"]["child"]["child"]["child"][
                      "movein_date"
                    ]
                  )
                }}
                {{
                  item["hanoi_csp"]["child"]["child"]["child"]["child"][
                    "lot_id"
                  ]
                }}
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
                  item['hanoi_csp'] !== null &&
                  item['hanoi_csp']['child'] !== null &&
                  item['hanoi_csp']['child']['child'] !== null &&
                  item['hanoi_csp']['child']['child']['child'] !== null &&
                  item['hanoi_csp']['child']['child']['child']['child'] !==
                    null &&
                  item['hanoi_csp']['child']['child']['child']['child'][
                    'child'
                  ] !== null
                "
              >
                {{
                  item["hanoi_csp"]["child"]["child"]["child"]["child"][
                    "child"
                  ]["operation"]["name"]
                }}
                {{
                  formatDateTime(
                    item["hanoi_csp"]["child"]["child"]["child"]["child"][
                      "child"
                    ]["movein_date"]
                  )
                }}
                {{
                  item["hanoi_csp"]["child"]["child"]["child"]["child"][
                    "child"
                  ]["lot_id"]
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
  <el-button type="primary" @click="handleExcelSubmit" class="buttun-section">
    투입 계획서 EXCEL 다운로드
  </el-button>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed } from "vue";
import type { ProcessData } from "../Interface/ApplicationInterface";
import {
  handleDateChange as externalHandleDateChange,
  updateStatus,
} from "./ApplicationsByWeek";
import {
  downloadExcel,
  syncFabFormToFabExcel,
  downloadFabPlanExcel,
} from "./ApplicationList";
import { formatDate, formatDateTime } from "../Common/Application";
import { getTodayDatetime, adjustDate } from "../../../utils/date-utils";
import MyApplicationList from "../../Mdr/General/ApplicationList/MyApplicationList.vue";
import DialogTemplate from "./ApplicationLinksDialog.vue";
import { cn69ModelNames } from "../SampleStatus/Cn69List";
import type { FabExcel } from "../../../interface/fab";
const props = defineProps<{
  processData: ProcessData[];
}>();

// 라우터 및 현재 경로 가져오기
const searchTerm = ref("");
const searchCategory = ref("modelName"); // 기본 검색 기준을 "Lot ID"로 설정

// Clear the search input
function handleClear() {
  searchTerm.value = ""; // Reset search term
}

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
    const field = item[searchCategory.value] as string;
    return field && field.toLowerCase().includes(term);
  });
});

const fabExcels = ref<FabExcel[]>([]);

// 필터링 상태를 관리하는 변수
const isFiltered = ref(false);
const temp = ref<ProcessData[]>([]);
// 특정 material_id가 포함된 항목들만 필터링한 배열

const filteredData = computed(() => {
  if (isFiltered.value) {
    temp.value = [];

    props.processData.forEach((item) => {
      const modelName = item.modelName.split("@")[0].toLowerCase();

      // cn69ModelNames와 비교
      if (cn69ModelNames.includes(modelName)) {
        temp.value.push(item);
      }
    });

    return temp.value;
  }

  return props.processData;
});

// 필터 토글 함수
const toggleFilter = () => {
  isFiltered.value = !isFiltered.value;
};

// emit 정의
const emit = defineEmits<{
  (e: "update:processData", updatedData: ProcessData[]): void;
}>();

// 셀에 적용할 클래스 반환
const cellClass = ({ row, rowIndex, column, columnIndex }) => {
  // 예: 짝수 행에만 스타일을 적용
  if (columnIndex == 9) {
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
  fabExcels.value = [];
  fabExcels.value = syncFabFormToFabExcel(filteredData.value, fabExcels.value);
  downloadFabPlanExcel(fabExcels.value);
}
</script>

<style>
.even-row {
  /* 더 진한 음영 효과 */
  box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.3);

  /* 연한 배경색 */
  background-color: rgb(250, 200, 200);

  /* 선택 사항: 모서리 둥글게 */
  border-radius: 4px;
  padding: 4px;
}

.custom-table ::v-deep(.el-table__header-wrapper th.highlighted-header) {
  background-color: rgb(
    228,
    78,
    78
  ) !important; /* 적용을 위한 !important 추가 */
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
