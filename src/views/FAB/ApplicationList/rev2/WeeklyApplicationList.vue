<template>
  <div>
    <el-row>
      <WeeklyApplicationRangePicker
        v-model:start="createdDateStart"
        v-model:end="createdDateEnd"
      ></WeeklyApplicationRangePicker>
      <ApplicationActions
        :applications="applications"
        @refresh="fetchApplications"
        @download-excel="handleExcelDownload"
        @delete-selected="handleDeleteSelected"
        @add-application="handleAddApplication"
      />
    </el-row>
    <WeeklyApplicationTable
      v-if="isLoad"
      :applications="applications"
    ></WeeklyApplicationTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import WeeklyApplicationTable from "./WeeklyApplicationTable.vue";
import WeeklyApplicationRangePicker from "./WeeklyApplicationRangePicker.vue";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import {
  adjustDate,
  convertDateTimeToDateTimeString,
  getDateOfThisWeek,
  formatDateTime,
} from "../../../../utils/date-utils";
import {
  getApplicationList,
  sendAppRemoveRequest,
} from "../../../../utils/Fab/fab-application-utils";
import ApplicationActions from "./ApplicationActions.vue";

const createdDateStart = ref<string>("");
const createdDateEnd = ref<string>("");
const applications = reactive<FabRequestForm[]>([]);
const isLoad = ref<boolean>(false);

onMounted(async () => {
  try {
    // getApplicationList를 호출하고 결과를 기다림
    isLoad.value = true;
    createdDateStart.value = formatDateTime(
      convertDateTimeToDateTimeString(getDateOfThisWeek("Tuesday"))
    );
    createdDateEnd.value = adjustDate(createdDateStart.value, 7);
    const data = await getApplicationList(
      true,
      true,
      true,
      "admin",
      null,
      null
    );
    applications.push(...data); // 가져온 데이터를 reactive 배열에 추가
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
});

async function fetchApplications() {
  try {
    // isLoad.value = false;
    // createdDateStart.value = formatDateTime(convertDateTimeToDateTimeString(getDateOfThisWeek("Tuesday")));
    // createdDateEnd.value = adjustDate(createdDateStart.value, 7);
    // const data = await getApplicationList(true, true, true, "admin", createdDateStart.value, createdDateEnd.value);
    // applications.splice(0, applications.length, ...data);
    // isLoad.value = true;
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
}

// 📌 추가된 기능 핸들러
const handleExcelDownload = () => {
  console.log("어디가 먼저 실행?");
};

const handleDeleteSelected = (selectedItems: string[]) => {
  console.log("삭제할 항목:", selectedItems);
};

const handleAddApplication = () => {
  console.log("새로운 신청 추가 실행");
};
</script>
<script lang="ts">
export default {};
</script>
<style>
.table-class {
  font-size: small;
}
</style>