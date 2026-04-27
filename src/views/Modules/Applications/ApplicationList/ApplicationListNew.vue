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
              :align="'center'"
            />

            <el-table-column
              label="의뢰번호"
              prop="application_id"
              width="120"
              :align="'center'"
            />
            
             <el-table-column
              label="구분"
              prop="site_type"
              width="90"
              :align="'center'"
            >
              <template #default="{ row }">
                {{ row.site_type === "HQ" ? "본사" : "WHC" }}
              </template>
            </el-table-column>
            
            <el-table-column
              label="P/N"
              prop="pn"
              width="140"
              :align="'center'"
            />

            <el-table-column
              label="의뢰자"
              prop="requester"
              width="120"
              :align="'center'"
            />

            <el-table-column
              label="전체 Status"
              width="120"
              :align="'center'"
            >
              <template #default="{ row }">
                <el-tag :type="applicationStatusTagTypeMap[row.status]" effect="light">
                  {{ applicationStatusLabelMap[row.status] }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              v-for="(label, index) in measurementHeaders"
              :key="label.key"
              :label="label.label"
              width="130"
              :align="'center'"
            >
              <template #default="{ row }">
                <el-tag
                  :type="measurementCellTagType(row[`measurement_${index + 1}`])"
                  effect="light"
                  class="measurement-tag"
                >
                  {{ measurementCellText(row[`measurement_${index + 1}`]) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="생성일" width="140" :align="'center'">
              <template #default="{ row }">
                {{ formatDate(row.created_date) }}
              </template>
            </el-table-column>
            <el-table-column label="수정일" width="140" :align="'center'">
              <template #default="{ row }">
                {{ formatDate(row.modified_date) }}
              </template>
            </el-table-column>

            <el-table-column label="Action" width="120" :align="'center'">
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
import {
  getModuleApplicationNewList,
} from "../../../../utils/module_group/application-utils";

type StatusKey = "waiting" | "in_progress" | "done";
type CellStatus = "none" | "waiting" | "in_progress" | "done";
type SiteType = "HQ" | "WHC";

interface MeasurementCell {
  type: string | null;
  status: CellStatus;
  display_value: string | null;
  display_color: "gray" | "orange" | "green" | "blue";
  expected_done_date: string | null;
  done_date: string | null;
}

interface ModuleApplicationListRow {
  application_id: string;
  pn: string;
  requester: string;
  site_type: SiteType;
  status: StatusKey;
  creator?: string | null;
  modifier?: string | null;
  created_date?: string | null;
  modified_date?: string | null;
  measurement_1: MeasurementCell;
  measurement_2: MeasurementCell;
  measurement_3: MeasurementCell;
  measurement_4: MeasurementCell;
  measurement_5: MeasurementCell;
  measurement_6: MeasurementCell;
}

const router = useRouter();
const appList = ref<ModuleApplicationListRow[]>([]);

const tabs = [
  { label: "대기", name: "waiting" },
  { label: "진행중", name: "in_progress" },
  { label: "완료", name: "done" },
] as const;

const measurementHeaders = [
  { key: "measurement_1", label: "1. Setup" },
  { key: "measurement_2", label: "2. NA" },
  { key: "measurement_3", label: "3. NF" },
  { key: "measurement_4", label: "4. MWA" },
  { key: "measurement_5", label: "5. CA" },
  { key: "measurement_6", label: "6. TCF" },
];

const pageSize = ref(10);
const currentPage = ref(1);

const query = reactive({
  pn: "",
  requester: "",
  siteType: "" as SiteType | "",
});

const activeTabName = ref<StatusKey>("waiting");

watch(
  () => [activeTabName.value, query.pn, query.requester, query.siteType],
  () => {
    currentPage.value = 1;
  }
);

const applicationStatusLabelMap: Record<StatusKey, string> = {
  waiting: "Waiting",
  in_progress: "In progress",
  done: "Completed",
};

const applicationStatusTagTypeMap: Record<
  StatusKey,
  "" | "success" | "warning" | "info" | "primary"
> = {
  waiting: "warning",
  in_progress: "success",
  done: "primary",
};

function measurementCellText(cell: MeasurementCell) {
  if (!cell) return "None";
  if (cell.status === "none") return "None";
  return cell.display_value || "None";
}

function measurementCellTagType(cell: MeasurementCell) {
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
    params: { id: app.application_id },
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