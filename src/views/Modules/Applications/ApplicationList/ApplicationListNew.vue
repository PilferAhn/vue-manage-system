<template>
  <div>
    <el-tabs v-model="activeTabName" type="border-card">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <div class="tab-content">
          <div class="search-box">
            <el-select
              v-model="query.siteType"
              placeholder="사이트"
              clearable
              class="mr10 site-select"
              @change="fetchList"
            >
              <el-option label="본사" value="HQ" />
              <el-option label="WHC" value="WHC" />
            </el-select>

            <el-input
              v-model="query.pn"
              placeholder="P/N 검색"
              class="search-input mr10"
              clearable
              @keyup.enter="fetchList"
            />

            <el-input
              v-model="query.requester"
              placeholder="의뢰자 검색"
              class="search-input mr10"
              clearable
              @keyup.enter="fetchList"
            />

            <el-button type="primary" @click="fetchList">검색</el-button>
          </div>

          <el-table :data="pagedList" border>
            <el-table-column
              type="index"
              label="No"
              width="60"
              align="center"
            />

            <el-table-column
              label="의뢰번호"
              prop="applicationId"
              width="120"
              align="center"
            />

            <el-table-column
              label="구분"
              prop="siteType"
              width="90"
              align="center"
            >
              <template #default="{ row }">
                {{ row.siteType === "HQ" ? "본사" : "WHC" }}
              </template>
            </el-table-column>

            <el-table-column
              label="P/N"
              prop="pn"
              width="140"
              align="center"
            />

            <el-table-column
              label="의뢰자"
              prop="requester"
              width="120"
              align="center"
            />

            <el-table-column
              label="전체 Status"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  :type="applicationStatusTagTypeMap[row.status]"
                  effect="light"
                >
                  {{ applicationStatusLabelMap[row.status] }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              v-for="(header, index) in measurementHeaders"
              :key="header.key"
              :label="header.label"
              width="135"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  :type="measurementCellTagType(row[`measurement${index + 1}`])"
                  effect="light"
                  class="measurement-tag"
                >
                  {{ measurementCellText(row[`measurement${index + 1}`]) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="생성일" width="140" align="center">
              <template #default="{ row }">
                {{ formatDate(row.createdDate) }}
              </template>
            </el-table-column>

            <el-table-column label="수정일" width="140" align="center">
              <template #default="{ row }">
                {{ formatDate(row.modifiedDate) }}
              </template>
            </el-table-column>

            <el-table-column label="Action" width="120" align="center" fixed="right">
              <template #default="{ row }">
                <div class="action-buttons">
                  <el-button type="success" @click="handleButtons(row)">
                    자세히
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-box">
            <el-pagination
              background
              layout="prev, pager, next, total"
              :page-size="pageSize"
              :current-page="currentPage"
              :total="filteredList.length"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, reactive, ref, computed, watch } from "vue";
import { formatDate } from "../../../../utils/date-utils";
import { getModuleApplicationNewList,
  type ModuleApplicationListRow,
  type ModuleApplicationStatus,
  type ModuleMeasurementCell, } from "../../../../utils/module_group/application-utils";

type MeasurementCell = ModuleMeasurementCell;
type SiteType = "HQ" | "WHC";

const router = useRouter();
const appList = ref<ModuleApplicationListRow[]>([]);

const tabs = [
  { label: "대기", name: "waiting" },
  { label: "진행중", name: "in_progress" },
  { label: "완료", name: "done" },
] as const;

const measurementHeaders = [
  { key: "measurement1", label: "1. Setup" },
  { key: "measurement2", label: "2. NA" },
  { key: "measurement3", label: "3. NF" },
  { key: "measurement4", label: "4. MWA" },
  { key: "measurement5", label: "5. CA" },
  { key: "measurement6", label: "6. TCF" },
  { key: "measurement7", label: "7. 비선형" },
  { key: "measurement8", label: "8. Probe SPL" },
  { key: "measurement9", label: "9. Probe D/E" },
  { key: "measurement10", label: "10. EVB 조립" },
];

const pageSize = ref(10);
const currentPage = ref(1);

const query = reactive({
  pn: "",
  requester: "",
  siteType: "" as SiteType | "",
});

const activeTabName = ref<ModuleApplicationStatus>("waiting");

watch(
  () => [activeTabName.value, query.pn, query.requester, query.siteType],
  () => {
    currentPage.value = 1;
  }
);

const applicationStatusLabelMap: Record<ModuleApplicationStatus, string> = {
  waiting: "Waiting",
  in_progress: "In progress",
  done: "Completed",
};

const applicationStatusTagTypeMap: Record<
  ModuleApplicationStatus,
  "" | "success" | "warning" | "info" | "primary"
> = {
  waiting: "warning",
  in_progress: "success",
  done: "primary",
};

function measurementCellText(cell?: MeasurementCell) {
  if (!cell) return "None";
  if (cell.status === "none") return "None";
  return cell.displayValue || "None";
}

function measurementCellTagType(cell?: MeasurementCell) {
  if (!cell) return "info";

  if (cell.status === "none") return "info";
  if (cell.status === "waiting") return "warning";
  if (cell.status === "in_progress") return "success";
  return "primary";
}

const filteredList = computed(() => {
  return appList.value.filter((app) => app.status === activeTabName.value);
});

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredList.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

async function fetchList() {
  try {
    const result = await getModuleApplicationNewList({
      pn: query.pn,
      requester: query.requester,
      siteType: query.siteType,
      orderBy: "created_date",
      orderDir: "desc",
    });

    appList.value = result || [];
  } catch (error) {
    console.error(error);
  }
}

const handleButtons = (app: ModuleApplicationListRow) => {
  router.push({
    name: "LoadModuleApplicationNew",
    params: { id: app.applicationId },
  });
};

onMounted(async () => {
  await fetchList();
});
</script>

<style scoped>
.tab-content {
  padding-top: 8px;
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-input {
  flex: 1;
}

.site-select {
  width: 120px;
}

.mr10 {
  margin-right: 10px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-buttons .el-button {
  height: 28px;
  font-size: 13px;
  padding: 0 12px;
}

.pagination-box {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.measurement-tag {
  width: 100%;
  justify-content: center;
}
</style>