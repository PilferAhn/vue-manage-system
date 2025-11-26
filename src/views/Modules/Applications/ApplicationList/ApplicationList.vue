<template>
  <div>
    <el-table :data="appList">
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
      <!-- <el-table-column label="의뢰자 / 담당자" :align="'center'">
        <template #default="scope">
          {{ scope.row.requester / scope.row.measurer }}
        </template>
      </el-table-column> -->
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
      <!-- <el-table-column
        label="Status"
        prop="applicationStatus"
        :align="'center'"
      ></el-table-column> -->
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
          <!-- <el-button type="primary" @click="exportToExcel(scope.row)" style="margin-left: 8px;">
             Excel   
      </el-button> -->
    </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, reactive } from "vue";
import { getApplicationList } from "../../../../utils/module_group/application-list-utils";
import type { ModuleMeasurementApp } from "../../../../interface/module_group/application/application";
import { formatDate } from "../../../../utils/date-utils";
const router = useRouter();
const appList = reactive<ModuleMeasurementApp[]>([]);

onMounted(async () => {
  Object.assign(
    appList,
    await getApplicationList({ order_by: "created_date" })
  );
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
</style>
