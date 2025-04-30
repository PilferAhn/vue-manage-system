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
        label="SMT 이력"
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
          <el-button type="success" @click="handleButtons(scope.row)"
            >자세히</el-button
          >
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
</script>

<style></style>
