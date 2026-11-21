<template>
  <div ref="tableBox">
    <el-table v-if="isLoad" :data="applications" border class="table-class" :height="tableHeight">
      <el-table-column
        prop="user.designer.department"
        label="그룹"
        :align="'center'"
        width="160"
      >
        <template #default="scope">
          {{ scope.row.designer.department }}
        </template>
      </el-table-column>

      <el-table-column
        prop="waferType"
        label="공정"
        :align="'center'"
        width="55"
      >
        <template #default="scope">{{ scope.row.wafer.sawTypeId }}</template>
      </el-table-column>

      <el-table-column
        prop="priorityId"
        label="긴급도"
        :align="'center'"
        width="65"
      />

      <el-table-column
        prop="packageId"
        label="패키지"
        :align="'center'"
        width="90"
        :filters="packageFilters"
        :filter-method="filterByPackage"
      />

      <el-table-column
        prop="productName"
        label="Product Name"
        :align="'center'"
        width="150"
      />

      <el-table-column
        prop="note"
        label="용도"
        :align="'center'"
        width="200"
        show-overflow-tooltip
      />

      <el-table-column
        prop="quantity"
        label="매수"
        :align="'center'"
        width="60"
      />
      <el-table-column
        prop="code"
        label="투입코드"
        :align="'center'"
        width="60"
      />
      <!-- <el-table-column
        prop="dateOfFabInsert"
        label="투입일"
        :align="'center'"
        width="80"
      /> -->

      <el-table-column label="P/L" :align="'center'" width="150" show-overflow-tooltip>
        <template #default="scope"
          >{{ scope.row.designer.userName }} /
          {{ scope.row.requester.userName }}</template
        >
      </el-table-column>
      <el-table-column prop="waferType" label="Type" :align="'center'">
        <template #default="scope">{{ scope.row.wafer.sawTypeId }}</template>
      </el-table-column>
      <el-table-column prop="band" label="Band" :align="'center'" width="100" show-overflow-tooltip>
      </el-table-column> 
      <el-table-column label="출하" prop="destinationId" :align="'center'">
      </el-table-column>
      <el-table-column label="생성일" prop="createdDate" width="100" :align="'center'" :formatter="callFormatDate" sortable>
      </el-table-column>
      <el-table-column label="수정일" prop="updatedDate" width="100" :align="'center'" sortable :sort-method="sortByUpdatedDate">
        <template #default="scope">
          <span v-if="scope.row.updatedDate" class="updated-date">{{ formatDate(scope.row.updatedDate) }}</span>
          <span v-else class="empty-cell">-</span>
        </template>
      </el-table-column>
      <el-table-column label="수정자" width="90" :align="'center'" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.updater?.userName ?? "-" }}
        </template>
      </el-table-column>
      <el-table-column
        label="Action"
        :align="'center'"
        width="280"
        fixed="right"
      >
        <template #default="scope">
          <el-button @click="handleButton('view', scope.row)" size="small"
            >View Detail</el-button
          >
          <el-button plain @click="handleVisible(true, scope.row)" size="small">
            의뢰서
          </el-button>
          <el-button
            plain
            @click="handleDelete(scope.row)"
            type="danger"
            size="small"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <DialogTemplate
      v-model:visible="dialogTableVisible"
      :fabApplication="selectApplication"
    ></DialogTemplate>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { useFillHeight } from "../../../../utils/use-fill-height";

// 표 높이 = 화면 아래 끝까지 (본문 여백 10 + 여유). 이전에는 높이 제한이 없어 페이지 전체가 스크롤됨
const tableBox = ref<HTMLElement | null>(null);
const { height: tableHeight } = useFillHeight(tableBox, 16);
import DialogTemplate from "../ApplicationLinksDialog.vue";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import {
  getApplicationListByDict,
  sendAppRemoveRequest,
} from "../../../../utils/Fab/fab-application-utils";
import router from "../../../../router";
import { getUserId } from "../../../../utils/account-utils";
import { usePermissStore } from "../../../../store/permiss";
import { adjustDate, getTodayDate } from "../../../../utils/date-utils";
import { formatDate } from "../../Common/Application";

const applications = reactive<FabRequestForm[]>([]);
const isLoad = ref<boolean>(false);

const dialogTableVisible = ref(false);
const selectApplication = ref<FabRequestForm>({});

  const packageFilters = [
  { text: "CSP", value: "CSP" },
  { text: "WLP", value: "WLP" },
  { text: "BDMP", value: "BDMP" },
];

function filterByPackage(value: string, row: FabRequestForm) {
  return (row.packageId ?? "") === value;
}

function handleVisible(status: boolean, fabRequestForm: FabRequestForm) {
  dialogTableVisible.value = status;
  selectApplication.value = fabRequestForm;
}

// 전체 조회 권한: 권한관리 > fab.my_list.view_all
const permiss = usePermissStore();

/** 생성일/수정일 중 최신 시각 (재투입된 의뢰서가 위로 오도록 정렬 기준으로 사용) */
function lastModifiedTime(app: FabRequestForm): number {
  const created = app.createdDate ? new Date(app.createdDate).getTime() : 0;
  const updated = app.updatedDate ? new Date(app.updatedDate).getTime() : 0;
  return Math.max(created || 0, updated || 0);
}

async function loadApplications() {
  const option: Record<string, string> = {
    users: "True",
    wafer: "True",
    idt_type: "False",
    hs_type: "True",
    idt_layers: "True",
    order_by: "created_date",
    order_dir: "desc",
  };

  if (!permiss.hasPerm("fab.my_list.view_all")) {
    option["observer_id"] = getUserId();
  } else {
    // 생성일 또는 수정일(재투입)이 180일 이내인 의뢰서
    option["modified_date_start"] = adjustDate(getTodayDate(), -180);
  }

  const data = await getApplicationListByDict(option);
  data.sort((a, b) => lastModifiedTime(b) - lastModifiedTime(a));

  applications.length = 0;
  applications.push(...data);
}

onMounted(async () => {
  try {
    await loadApplications();
    isLoad.value = true;
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
});

function callFormatDate(row, column, cellValue) {
  return formatDate(cellValue);
}

function sortByUpdatedDate(a: FabRequestForm, b: FabRequestForm) {
  const ta = a.updatedDate ? new Date(a.updatedDate).getTime() : 0;
  const tb = b.updatedDate ? new Date(b.updatedDate).getTime() : 0;
  return ta - tb;
}

function handleButton(action: string, application: FabRequestForm) {
  if (action === "view") {
    router.push({
      name: "LoadApplication2",
      params: { productName: application.productName },
    });
  }
}

async function handleDelete(application: FabRequestForm) {
  try {
    await ElMessageBox.confirm(
      "이 의뢰서를 영구적으로 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.",
      "경고",
      {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      }
    );

    console.log("✅ YES 선택 - 삭제 요청 실행 중...");

    // 삭제 요청 실행
    const isDeleted = await sendAppRemoveRequest(application);

    if (isDeleted) {
      ElNotification({
        title: "삭제 완료",
        message: "의뢰서가 성공적으로 삭제되었습니다.",
        type: "success",
        duration: 3000,
      });

      await loadApplications();
    } else {
      throw new Error("삭제 요청이 실패했습니다.");
    }
  } catch (error) {
    console.log("❌ NO 선택 또는 오류 발생:", error);

    ElNotification({
      title: "삭제 실패",
      message: "의뢰서 삭제에 실패했습니다. 다시 시도해주세요.",
      type: "error",
      duration: 3000,
    });
  }
}
</script>
<script lang="ts">
export default {};
</script>
<style>
.table-class {
  font-size: small;
}
</style>

<style scoped>
.updated-date {
  color: var(--el-color-warning);
  font-weight: 600;
}

.empty-cell {
  color: var(--el-text-color-placeholder);
}

.ellipsis-text {
  display: inline-block;
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
