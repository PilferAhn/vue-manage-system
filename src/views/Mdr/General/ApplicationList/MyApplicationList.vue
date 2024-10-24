<template>
  <div class="container">
    <ChildComponent :mdr-applications="mdrApplications" :user-type="'user'" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ChildComponent from "./ApplicationList.vue"; // 자식 컴포넌트 임포트
import type { MdrApplication } from "../../Common/Interface";
import { dummyMdrApplications } from "../../Common/DummyData";

const mdrApplications = ref<MdrApplication[]>([]);

// 데이터를 할당 (dummyMdrApplications를 사용하거나, API 호출 가능)
mdrApplications.value = dummyMdrApplications;
</script>

<!-- <template>
  <div class="container">
    <el-table-v2
      :data="mdrApplications"
      :columns="columns"
      :width="1400"
      :height="400"
      :row-class="rowClass"
    >
    </el-table-v2>
  </div>
</template>

<script lang="tsx" setup>
import { Timer } from "@element-plus/icons-vue";
import { ref, onMounted, h } from "vue";
import axios from "axios";
import type { MdrApplication } from "../../Common/Interface";
import { dummyMdrApplications } from "../../Common/DummyData";
import type { Column, RowClassNameGetter } from "element-plus";

import dayjs from "dayjs";
import {
  ElButton,
  ElIcon,
  ElTag,
  ElTooltip,
  TableV2FixedDir,
} from "element-plus";

const mdrApplications = ref<MdrApplication[]>([]);
mdrApplications.value = dummyMdrApplications;

const columns: Column<any>[] = [
  {
    key: "moduleName",
    title: "Module Name",
    width: 150,
    dataKey: "moduleName",
  },
  {
    key: "productName",
    title: "Product Name",
    width: 150,
    dataKey: "productName",
  },
  {
    key: "category",
    title: "Category",
    width: 150,
    dataKey: "category",
  },
  {
    key: "packageType",
    title: "Package Type",
    width: 150,
    dataKey: "packageType",
  },
  {
    key: "waferType",
    title: "Wafer Type",
    width: 150,
    dataKey: "waferType",
  },
  {
    key: "band",
    title: "Band",
    width: 120,
    dataKey: "band",
  },
  {
    key: "designer",
    title: "Designer",
    width: 150,
    dataKey: "designer",
  },
  {
    key: "requester",
    title: "Requester",
    width: 150,
    dataKey: "requester",
  },

  {
    key: "psNumber",
    title: "PS Number",
    width: 150,
    dataKey: "psNumber",
  },
  {
    key: "gantPlanDate",
    title: "Date",
    dataKey: "gantPlanDate",
    width: 150,
    // fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData: date }) =>
      h(
        ElTooltip,
        { content: dayjs(date).format("YYYY/MM/DD") },
        {
          default: () =>
            h("span", { class: "flex items-center" }, [
              h(ElIcon, { class: "mr-3" }, { default: () => h(Timer) }),
              dayjs(date).format("YYYY/MM/DD"),
            ]),
        }
      ),
  },
  {
    key: "executionDate",
    title: "Date",
    dataKey: "executionDate",
    width: 150,
    // fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData: date }) =>
      h(
        ElTooltip,
        { content: dayjs(date).format("YYYY/MM/DD") },
        {
          default: () =>
            h("span", { class: "flex items-center" }, [
              h(ElIcon, { class: "mr-3" }, { default: () => h(Timer) }),
              dayjs(date).format("YYYY/MM/DD"),
            ]),
        }
      ),
  },
  {
    key: "result",
    title: "Result",
    width: 150,
    dataKey: "result",
  },
  {
    key: "operations",
    title: "Action",
    cellRenderer: () =>
      h("div", [
        // h(ElButton, { size: "small" }, { default: () => "Edit" }), // Function slot for 'Edit'
        h(
          ElButton,
          { size: "small", type: "primary" },
          { default: () => "확정" }
        ),
        h(
          ElButton,
          { size: "small", type: "warning" },
          { default: () => "삭제" }
        ),
      ]),
    width: 300,
    align: "center",
    flexGrow: 1,
  },
];

const rowClass = ({ rowData }: { rowData: { result: string } }) => {
  if (rowData.result === "Pass") {
    return "bg-green-100"; // Pass인 경우 그린
  } else if (rowData.result === "Fail") {
    return "bg-red-100"; // Fail인 경우 레드
  }
  return ""; // 나머지는 기본값
};

// onMounted(async () => {
//   try {
//     const response = await axios.get<MdrApplication[]>("/api/mdr-applications"); // 서버에서 데이터를 가져옴
//     mdrApplications.value = response.data;
//   } catch (error) {
//     console.error("Error fetching data", error);
//   }
// });
</script>

<style scoped>
.el-table-v2 {
  margin-top: 20px;
}

/* el-table-v2의 각 셀에 테두리 스타일 추가 */
.el-table-v2__cell {
  border: 1px solid #dcdfe6; /* 셀의 테두리 색상 */
}

/* 각 셀을 둘러싼 테두리 색상을 조절하거나 추가 커스터마이징 가능 */
.el-table-v2__row {
  border-bottom: 1px solid #dcdfe6;
}

.bg-green-100 {
  background-color: #d4edda;
}

.bg-red-100 {
  background-color: #f8d7da;
}
</style> -->
