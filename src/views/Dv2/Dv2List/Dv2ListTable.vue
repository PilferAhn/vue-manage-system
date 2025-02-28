<template>
  <el-table
    :data="paginatedData"
    :span-method="tableSpanMethod"
    class="custom-table"
    height="690"
  >
    <el-table-column
      label="P/N"
      prop="partName"
      :align="'center'"
      width="165"
      fixed="left"
    >
      <template #default="scope">
        <el-input v-model="scope.row.productName" class="table-input" />
      </template>
    </el-table-column>

    <el-table-column
      label="관리자"
      prop="user"
      :align="'center'"
      width="100"
      fixed="left"
    >
      <template #default="scope">
        <el-input v-model="scope.row.supporter" class="table-input1" />
      </template>
    </el-table-column>

    <el-table-column
      label="CER(DV2목표)"
      prop="dateOfCer"
      :align="'center'"
      width="130"
    >
      <template #default="scope">
        <!-- <el-input v-model="scope.row.dateOfCer" class="table-input1" /> -->
        <el-date-picker
          v-model="scope.row.dateOfCer"
          type="date"
          placeholder="Pick a day"
          :size="'small'"
          style="width: 100px"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </template>
    </el-table-column>

    <!--el-table-column
        label="Status"
        prop="status"
        :align="'center'"
        width="100"
      >
      
        <template #default="scope">
          <el-input v-model="scope.row.status" class="table-input" />
        </template>
      </el-table-column-->

    <el-table-column label="現段階 現 단계" :align="'center'">
      <!-- FAB IN / FAB ESTIMATED IN 같은 Column 내에서 2줄 배치 -->
      <el-table-column label="차수" prop="turn" :align="'center'" width="75">
        <template #default="scope">
          <el-input v-model="scope.row.turn" class="table-input" />
        </template>
      </el-table-column>

      <el-table-column
        label="MDR"
        prop="dateOfMdr"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <!-- <el-input v-model="scope.row.dateOfMdr" class="table-input1" /> -->
          <el-date-picker
            v-model="scope.row.dateOfMdr"
            type="date"
            placeholder="Pick a day"
            :size="'small'"
            style="width: 100px"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="FAB IN"
        prop="dateOfFab"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.isEditable">
            <!-- <el-input v-model="scope.row.dateOfFabIn" class="table-input1" /> -->
            <el-date-picker
              v-model="scope.row.dateOfEstimatedFabIn"
              type="date"
              placeholder="Pick a day"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              :size="'small'"
              style="width: 100px"
            />
          </span>
          <span v-else>{{ scope.row.dateOfFabIn }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="현재공정"
        prop="currentStage"
        :align="'center'"
        width="180"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.currentStage"
            class="table-input2"
          ></el-input>
          <br/>
          <el-date-picker
              v-model="scope.row.locationTime"
              type="date"
              placeholder="Pick a day"
              format="YYYY/MM/DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :size="'small'"
              style="width: 150px"
            />

          <!-- <span v-if="scope.row.locationTime === null">
            <el-input
              v-model="scope.row.currentStage"
              class="table-input"
            ></el-input>
            <br />
            {{ scope.row.locationTime }}
          </span>
          <span v-else> {{ scope.row.currentStage }}</span> -->
        </template>
      </el-table-column>

      <el-table-column
        label="FAB OUT"
        prop="dateOfFabOut"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.isEditable">
            <!-- <el-input
              v-model="scope.row.dateOfEstimatedDCOut"
              class="table-input1"/> -->
            <el-date-picker
              v-model="scope.row.dateOfEstimatedFabOut"
              type="date"
              placeholder="Pick a day"
              :size="'small'"
              style="width: 100px"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </span>
          <span v-else>{{ scope.row.dateOfFabOut }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="HQ OUT"
        prop="dateOfHqOut"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.isEditable">
            <!-- <el-input
              v-model="scope.row.dateOfEstimatedHqOut"
              class="table-input1"/> -->
            <el-date-picker
              v-model="scope.row.dateOfEstimatedHqOut"
              type="date"
              placeholder="Pick a day"
              :size="'small'"
              style="width: 100px"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </span>
          <span v-else>{{ scope.row.dateOfHqOut }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="WHC IN"
        prop="dateOfWhcIn"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.isEditable">
            <!-- <el-input
              v-model="scope.row.dateOfEstimatedWhcIn"
              class="table-input1"/> -->
            <el-date-picker
              v-model="scope.row.dateOfEstimatedWhcIn"
              type="date"
              placeholder="Pick a day"
              :size="'small'"
              style="width: 100px"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </span>
          <span v-else>{{ scope.row.dateOfWhcIn }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Assy In"
        prop="dateOfAssyIn"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.isEditable">
            <!-- <el-input v-model="scope.row.dateOfEstimatedAssyIn" class="table-input1"/> -->
            <el-date-picker
              v-model="scope.row.dateOfEstimatedAssyIn"
              type="date"
              placeholder="Pick a day"
              :size="'small'"
              style="width: 100px"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </span>
          <span v-else>{{ scope.row.dateOfAssyIn }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="D/C OUT"
        prop="dateOfDCOut"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.isEditable">
            <!-- <el-input v-model="scope.row.dateOfEstimatedDCOut" class="table-input1"/> -->
            <el-date-picker
              v-model="scope.row.dateOfEstimatedDCOut"
              type="date"
              placeholder="Pick a day"
              :size="'small'"
              style="width: 100px"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </span>
          <span v-else>{{ scope.row.dateOfDCOut }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Meas In"
        prop="dateOfMeasIn"
        :align="'center'"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.isEditable">
            <!-- <el-input v-model="scope.row.dateOfEstimatedMeasIn" class="table-input1"/> -->
            <el-date-picker
              v-model="scope.row.dateOfEstimatedMeasIn"
              type="date"
              placeholder="Pick a day"
              :size="'small'"
              style="width: 100px"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </span>
          <span v-else>{{ scope.row.dateOfMeasIn }}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column
      label="영업"
      prop="salesTerritory"
      :align="'center'"
      width="80"
    >
      <template #default="scope">
        <el-input v-model="scope.row.salesTerritory" class="table-input" />
      </template>
    </el-table-column>
    <!-- TECH 관련 (rowSpan=2) -->
    <el-table-column label="TECH" :align="'center'">
      <el-table-column label="CHIP" prop="chip" :align="'center'" width="80">
        <template #default="scope">
          <el-input v-model="scope.row.chip" class="table-input" />
        </template>
      </el-table-column>
      <el-table-column label="PKG" prop="package" :align="'center'" width="110">
        <template #default="scope">
          <!-- <el-input v-model="scope.row.package" class="table-input" /> -->
          <el-select v-model="scope.row.package">
            <el-option
              v-for="option in packageOptions"
              :key="option.key"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table-column>
    <!-- 프로젝트 관련 (rowSpan=2) -->
    <el-table-column label="Project" :align="'center'">
      <el-table-column label="Main" prop="main" :align="'center'" width="70">
        <template #default="scope">
          <el-input v-model="scope.row.main" class="table-input" />
        </template>
      </el-table-column>
      <el-table-column label="Sub" prop="sub" :align="'center'" width="70">
        <template #default="scope">
          <el-input v-model="scope.row.sub" class="table-input" />
        </template>
      </el-table-column>
      <el-table-column label="고객" prop="client" :align="'center'" width="80">
        <template #default="scope">
          <el-input v-model="scope.row.client" class="table-input" />
        </template>
      </el-table-column>
    </el-table-column>

    <el-table-column label="Type" prop="category" :align="'center'">
      <template #default="scope">
        <el-input v-model="scope.row.category" class="table-input" />
      </template>
    </el-table-column>

    <el-table-column label="Band" prop="band" :align="'center'" width="100">
      <template #default="scope">
        <el-input v-model="scope.row.band" class="table-input" />
      </template>
    </el-table-column>
    <el-table-column
      label="특이사항"
      prop="fabPartNumber"
      :align="'center'"
      width="300"
    >
      <template #default="scope">
        <el-input v-model="scope.row.fabPartNumber" class="table-input" />
      </template>
    </el-table-column>

    <el-table-column label="Priority" prop="dvrPriority" :align="'center'">
      <template #default="scope">
        <el-input v-model="scope.row.priority" class="table-input" />
      </template>
    </el-table-column>
    <el-table-column
      label="Action"
      prop="action"
      :align="'center'"
      fixed="right"
      width="160"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="handleUpdate(scope.row, getNextRow(scope.$index))"
        >
          Update
        </el-button>
        <el-button type="danger" size="small" @click="handleRemove(scope.row)">
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 페이지네이션 -->
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="dv2TableData.length"
    :page-sizes="[1, 3, 5, 7]"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handlePageChange"
    style="margin-top: 10px"
  />
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";
import type { Dv2 } from "../../../interface/Dv2/dv2-list-interface";
import {
  getModelNameList,
  removeDv2,
  sendDv2,
  updateDv2TableData,
} from "../../../utils/Dv2/dv2-list-utils";

import { getPackageList } from "../../../utils/utility";
import { ref, computed } from "vue";
import { OptionInterface } from "../../../interface/option";
import { sendPostRequest } from "../../../utils/httpProtocol";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";
import { formatDate } from "../../../utils/date-utils";
import { FabApplicationForm } from "../../FAB/Interface/mes-interface";
import { getFabRequestFormByModelNames } from "../../FAB/ApplicationList/ApplicationList";
import { cursorTo } from "readline";

const props = defineProps<{
  dv2TableData: Dv2[];
  fabApp: FabApplicationForm[];
}>();
const dv2Data = ref<Dv2[]>([]);
const packageOptions = ref<OptionInterface[]>([]);

// ✅ `dv2` 데이터를 로컬 상태로 복사
// const localDv2Table: Ref<Dv2[]> = ref({ ...props.dv2TableData });
const localDv2Table = ref<Dv2[]>([]);
const localFabApp = ref<FabApplicationForm[]>([]);

const pageSize = ref(28); // 페이지당 표시할 개수 (기본값: 7)
const currentPage = ref(1); // 현재 페이지
// 페이지네이션 적용된 데이터 (현재 페이지의 데이터만 가져옴)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return localDv2Table.value.slice(start, start + pageSize.value);
});

// 페이지 크기 변경 이벤트
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 페이지 변경 시 첫 페이지로 이동
};

// 현재 페이지 변경 이벤트
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

function getNextRow(index) {
  if (index < localDv2Table.value.length - 1) {
    return localDv2Table.value[index + 1]; // 다음 행 반환
  }
  return null; // 마지막 행이면 null 반환
}

const tableSpanMethod = ({ row, column, rowIndex }: any) => {
  if (
    [
      "salesTerritory",
      "fabPartNumber",
      "main",
      "sub",
      "client",
      "category",
      "band",
      "partName",
      "chip",
      "package",
      "group",
      "status",
      "dvrPriority",
      "turn",
      "currentStage",
      "dateOfConfirm",
      "action",
    ].includes(column.property)
  ) {
    return row.isFirstRow ? [2, 1] : [0, 0]; // 첫 번째 줄만 rowSpan=2
  }
  return [1, 1]; // 기본적으로 rowSpan=1
};

onMounted(async () => {
  localDv2Table.value = props.dv2TableData;
  packageOptions.value = await getPackageList();
  localFabApp.value = props.fabApp;
});

watch(
  () => props.dv2TableData,
  (newVal) => {
    localDv2Table.value = newVal;
  }
);

watch(
  () => props.fabApp,
  (newVal) => {
    localFabApp.value = newVal;
  }
);

const handleRemove = async (row: Dv2) => {
  if (await removeDv2(row)) {
    const formData = new FormData();
    formData.append("order_by", "date_of_estimated_cer");
    formData.append("order_dir", "asc");
    const data = await sendPostRequest("/dv2/get_dv2_list", formData);
    dv2Data.value = convertPep8ToCamelCase2(data);

    localDv2Table.value = dv2Data.value.flatMap((row) => [
      // dv2TableData.value = dv2Data.flatMap((row) => [
      {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: true,
        dateOfFabIn: row.dateOfEstimatedFabIn, // 두 번째 줄: 예상 FAB IN 값
        dateOfFabOut: row.dateOfEstimatedFabOut, // 두 번째 줄: 예상 FAB OUT 값
        dateOfMdr: row.dateOfEstimatedMdr,
        isEditable: true,
        dateOfHqOut: row.dateOfEstimatedHqOut,
        dateOfWhcIn: row.dateOfEstimatedWhcIn,
        dateOfAssyIn: row.dateOfEstimatedAssyIn,
        dateOfDCOut: row.dateOfEstimatedDCOut,
        dateOfMeasIn: row.dateOfEstimatedMeasIn,
        dateOfCer: row.dateOfEstimatedCer,
        supporter: row.supporter,
      },
      {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: false,
        dateOfFabIn: null,
        dateOfFabOut: null,
        dateOfMdr: row.dateOfMdr,
        isEditable: false,
        dateOfHqOut: null,
        dateOfWhcIn: null,
        dateOfAssyIn: null,
        dateOfDCOut: null,
        dateOfMeasIn: null,
        dateOfCer: row.dateOfCer,
        supporter: row.designer,
      },
    ]);

    localFabApp.value = await getFabRequestFormByModelNames(
      getModelNameList(localDv2Table.value),
      localFabApp.value
    );
    updateDv2TableData(localFabApp.value, localFabApp.value);
  }
};

const handleUpdate = async (cuurentRow: Dv2, nextRow: Dv2) => {
  const tempEstMdr = cuurentRow.dateOfMdr;
  const tempEstCer = cuurentRow.dateOfCer;
  // 다음 줄의 MDR 시간.
  cuurentRow.dateOfEstimatedMdr = cuurentRow.dateOfMdr;
  cuurentRow.dateOfEstimatedCer = cuurentRow.dateOfCer;
  cuurentRow.dateOfMdr = nextRow.dateOfMdr;
  cuurentRow.dateOfCer = nextRow.dateOfCer;
  const res = sendDv2(cuurentRow, "update");
  cuurentRow.dateOfMdr = tempEstMdr;
  cuurentRow.dateOfCer = tempEstCer;

  // if (res) {

  //
  // }
};
</script>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.custom-table ::v-deep(.el-warning) {
  background-color: hsl(
    0,
    76%,
    23%
  ) !important; /* Ensure the background changes */
  color: hsl(0, 68%, 12%) !important;
  font-size: 30px !important;
}

/* 헤더 스타일 */
.custom-table ::v-deep(.el-table__header-wrapper th) {
  font-weight: bold;
  font-size: 14px;
  background-color: #f1f5f9;
  color: #333;
  border: 1px solid #d1d5db;
  height: 20px;
}

/* 셀 스타일 */
.custom-table ::v-deep(.el-table__cell) {
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  font-size: 13px;
  color: #4b5563;
  height: 40px;
}

/* Hover 효과 */
.custom-table ::v-deep(.el-table__row:hover .el-table__cell) {
  background-color: #f3f4f6;
}

.custom-table ::v-deep(.even-row) {
  box-shadow: inset 0px 1px 2px 3px rgba(218, 24, 24, 0.3);
  background-color: rgb(243, 235, 235);
  border-radius: 1px;

  // padding: 4px;
}

.custom-table ::v-deep(.el-table__row.el-warning .el-table__cell) {
  background-color: hsl(0, 61%, 90%) !important;
  color: hsl(0 75% 7%) !important;
}

/* Vue 3 (Scoped 스타일 사용 시) */
::v-deep(.table-input .el-input__inner) {
  width: 100%;
  /* padding: 2px 4px; */
  border: none;
  background: transparent;
  text-align: center;
  font-size: 14px;
  height: 40px;
}

/* Vue 3 (Scoped 스타일 사용 시) */
::v-deep(.table-input1 .el-input__inner) {
  width: 100%;
  /* padding: 2px 4px; */
  border: none;
  background: transparent;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  height: 20px;
}

/* Vue 3 (Scoped 스타일 사용 시) */
::v-deep(.table-input2 .el-input__inner) {
  width: 100%;
  /* padding: 2px 4px; */
  border: none;
  background: transparent;
  text-align: center;
  font-size: 12px;
  // font-weight: bold;
  height: 20px;
}

/* 입력창이 focus되었을 때 테두리 추가 */
/* .table-input:focus,
.table-input:focus-within {
  border: 1px solid #409eff;
  background: #ffffff;
} */
</style>
