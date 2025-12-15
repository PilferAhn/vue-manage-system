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
          <!-- 🔍 검색 박스 -->
          <div class="search-box">
            <el-input
              v-model="query.search_term"
              placeholder="기종명 검색"
              class="search-input mr10"
              clearable
            />
            <el-button type="primary" @click="handleSearch">검색</el-button>
          </div>

          <!-- 📋 상태 + 검색으로 필터된 리스트 -->
          <el-table :data="pagedList">
            <el-table-column
              type="index"
              label="No"
              :align="'center'"
            />
            <el-table-column
              label="기종명"
              prop="productName"
              width="140"
              :align="'center'"
            />
            <el-table-column
              label="조립차수"
              prop="assemblyOrder"
              width="80"
              :align="'center'"
            />
            <el-table-column label="자재 전달 일자" width="140" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfDeliveryDate) }}
              </template>
            </el-table-column>
            <el-table-column label="완료 요청 일자" width="140" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfExpectedFinished) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Mold"
              prop="mold"
              width="80"
              :align="'center'"
            />
            <el-table-column
              label="목적"
              prop="purpose"
              :align="'center'"
            />
            <el-table-column label="생성일" width="140" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfCreated) }}
              </template>
            </el-table-column>
            <el-table-column
              label="NA Status"
              width="120"
              :align="'center'"
            >
              <template #default="{ row }">
                <el-tag
                  :type="statusTagTypeMap[getNaStatus(row)]"
                  effect="light"
                >
                  {{ statusLabelMap[getNaStatus(row)] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="NF Status"
              width="120"
              :align="'center'"
            >
              <template #default="{ row }">
                <el-tag
                  :type="statusTagTypeMap[getNfStatus(row)]"
                  effect="light"
                >
                  {{ statusLabelMap[getNfStatus(row)] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Action" width="140" :align="'center'">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button type="success" @click="handleButtons(scope.row)">
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
      <!-- <el-tab-pane label="대기" name="waiting" >
        <div class="tab-content">
          <el-table :data="waitingList">
            <el-table-column
              type="index"
              label="No"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="기종명"
              prop="productName"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="조립차수(Order Sheet)"
              prop="smtHistory"
              :align="'center'"
            ></el-table-column>
            <el-table-column label="자제 전달 일자" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfDeliveryDate) }}
              </template>
            </el-table-column>
            <el-table-column label="완료 요청 일자" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfExpectedFinished) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Mold"
              prop="mold"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="목적"
              prop="purpose"
              :align="'center'"
            ></el-table-column>
            <el-table-column label="생성일" prop="dateOfCreated" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfCreated) }}
              </template></el-table-column
            >
            <el-table-column label="Action" :align="'center'">
              <template #default="scope">
                <div class =  "action-buttons">
                  <el-button type="success" @click="handleButtons(scope.row)"
                   >자세히</el-button
                  >
                  </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
        
      <el-tab-pane label="진행중" name="in_progress">
        <div class="tab-content">
          <el-table :data="inProgressList">
            <el-table-column
              type="index"
              label="No"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="기종명"
              prop="productName"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="조립차수(Order Sheet)"
              prop="smtHistory"
              :align="'center'"
            ></el-table-column>
            <el-table-column label="자제 전달 일자" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfDeliveryDate) }}
              </template>
            </el-table-column>
            <el-table-column label="완료 요청 일자" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfExpectedFinished) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Mold"
              prop="mold"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="목적"
              prop="purpose"
              :align="'center'"
            ></el-table-column>
            <el-table-column label="생성일" prop="dateOfCreated" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfCreated) }}
              </template></el-table-column
            >
            <el-table-column label="Action" :align="'center'">
              <template #default="scope">
                <div class =  "action-buttons">
                  <el-button type="success" @click="handleButtons(scope.row)"
                   >자세히</el-button
                  >
                  </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
        
      <el-tab-pane label="완료" name="finished">
        <div class="tab-content">
          <el-table :data="finishedList">
            <el-table-column
              type="index"
              label="No"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="기종명"
              prop="productName"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="조립차수(Order Sheet)"
              prop="smtHistory"
              :align="'center'"
            ></el-table-column>
            <el-table-column label="자제 전달 일자" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfDeliveryDate) }}
              </template>
            </el-table-column>
            <el-table-column label="완료 요청 일자" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfExpectedFinished) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Mold"
              prop="mold"
              :align="'center'"
            ></el-table-column>
            <el-table-column
              label="목적"
              prop="purpose"
              :align="'center'"
            ></el-table-column>
            <el-table-column label="생성일" prop="dateOfCreated" :align="'center'">
              <template #default="scope">
                {{ formatDate(scope.row.dateOfCreated) }}
              </template></el-table-column
            >
            <el-table-column label="Action" :align="'center'">
              <template #default="scope">
                <div class =  "action-buttons">
                  <el-button type="success" @click="handleButtons(scope.row)"
                   >자세히</el-button
                  >
                  </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, reactive, ref, computed, watch} from "vue";
import { getApplicationList } from "../../../../utils/module_group/application-list-utils";
import type { ModuleMeasurementApp } from "../../../../interface/module_group/application/application";
import { formatDate } from "../../../../utils/date-utils";
const router = useRouter();
const appList = reactive<ModuleMeasurementApp[]>([]);
type StatusForList = "none" | "waiting" | "in_progress" | "completed";
const tabs = [
  { label: "대기", name: "waiting" },
  { label: "진행중", name: "in_progress" },
  { label: "완료", name: "finished" },
] as const;
type StatusKey = (typeof tabs)[number]["name"];

// 🔹 페이지네이션 상태
const pageSize = ref(10);
const currentPage = ref(1);     

// 🔹 실제 테이블에 뿌리는 리스트 (슬라이스 적용)
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredList.value.slice(start, end);
});

const query = reactive({
  search_term: "",
});

const activeTabName = ref<StatusKey>("waiting"); // 기본은 대기
watch(
  () => [activeTabName.value, query.search_term],
  () => {
    currentPage.value = 1;
  }
);

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const getStatus = (app: ModuleMeasurementApp): StatusKey => {
  const hasNa = app.isNa && app.naApp;
  const hasNf = app.isNf && app.nfApp;

  // ✅ 1) NA만 있는 경우
  if (hasNa && !hasNf) {
    if (app.naApp!.finishedDate) return "finished";
    if (app.naApp!.completionDueDate) return "in_progress";
    return "waiting";
  }

  // ✅ 2) NF만 있는 경우
  if (hasNf && !hasNa) {
    if (app.nfApp!.finishedDate) return "finished";
    if (app.nfApp!.completionDueDate) return "in_progress";
    return "waiting";
  }

  // ✅ 3) NA + NF 둘 다 있는 경우
  if (hasNa && hasNf) {
    const naFinished = !!app.naApp!.finishedDate;
    const nfFinished = !!app.nfApp!.finishedDate;
    const naDue = !!app.naApp!.completionDueDate;
    const nfDue = !!app.nfApp!.completionDueDate;

    // (isNa && isNf) 이고 finishedDate 둘 다 있으면 → finished
    if (naFinished && nfFinished) return "finished";

    // (isNa && isNf) 이고 completionDueDate 둘 다 있으면 → in_progress
    if (naDue || nfDue) return "in_progress";

    // 그 외 조합(한쪽만 완료/진행중 등)은 일단 waiting 으로 처리
    return "waiting";
  }
};

const getNaStatus = (app: ModuleMeasurementApp): StatusForList => {
  const hasNa = app.isNa && app.naApp;

  // NA 자체가 없으면
  if (!hasNa) return "none";
  // 완료일 있으면 Completed
  if (app.naApp!.finishedDate) return "completed";
  // 예정일 있으면 In progress
  if (app.naApp!.completionDueDate) return "in_progress";
  // 나머지는 Waiting
  return "waiting";
};

const getNfStatus = (app: ModuleMeasurementApp): StatusForList => {
  const hasNf = app.isNf && app.nfApp;

  // NF 자체가 없으면
  if (!hasNf) return "none";
  // 완료일 있으면 Completed
  if (app.nfApp!.finishedDate) return "completed";
  // 예정일 있으면 In progress
  if (app.nfApp!.completionDueDate) return "in_progress";
  // 나머지는 Waiting
  return "waiting";
};

// 화면에 찍을 라벨
const statusLabelMap: Record<StatusForList, string> = {
  none: "None",
  waiting: "Waiting",
  in_progress: "In progress",
  completed: "Completed",
};

const statusTagTypeMap: Record<StatusForList, "" | "success" | "warning" | "info" | "primary"> = {
  none: "info",
  waiting: "warning",
  in_progress: "success",
  completed: "primary",
};

const filteredList = computed(() => {
  const statusFiltered = appList.filter(
    (app) => getStatus(app) === activeTabName.value
  );
  
  const term = query.search_term?.trim().toLowerCase();
  if (!term) return statusFiltered;

  return statusFiltered.filter((app) => {
    const productName = (app.productName ?? "").toLowerCase();
    return productName.includes(term)
  });
});

const handleSearch = () => {
  console.log("search term:", query.search_term);
};


onMounted(async () => {
  const result = await getApplicationList({ order_by: "date_of_created"})
  Object.assign(appList, result);
  console.log(appList);
});

const handleButtons = (app: ModuleMeasurementApp) => {
  router.push({
    name: "LoadModuleApplication",
    params: { id: app.id },
  });
};

const exportToExcel = (app: ModuleMeasurementApp) => {
  console.log('excel click')
  
  // // 간단한 예시: JSON 다운로드
  // const blob = new Blob([JSON.stringify(app, null, 2)], {
  //   type: "application/json",
  // });
  // const url = URL.createObjectURL(blob);
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = `Application_${app.id}.json`; // 실제로는 .xlsx 등으로 변경 가능
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};
</script>

<style>
.tab-content {
  padding-top: 8px; /* 탭 헤더와 테이블 사이 약간의 간격 */
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-input {
  flex: 1;
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
</style>
