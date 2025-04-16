<script lang="ts">
export default {};
</script>

<template>
  <div>
    <el-table :data="paginatedData" border>
      <el-table-column label="User ID" prop="userId" :align="'center'" />
      <el-table-column label="사용자 명" prop="user" :align="'center'">
        <template #default="scope">{{ scope.row.user.userName }}</template>
      </el-table-column>
      <el-table-column label="부서" prop="department" :align="'center'">
        <template #default="scope">{{ scope.row.user.department }}</template>
      </el-table-column>
      <el-table-column label="Start Time" prop="startDate" :align="'center'">
        <template #default="scope">
          <el-date-picker
            v-model="scope.row.startDate"
            type="datetime"
            placeholder="날짜 및 시간 선택"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
          />          
        </template>
      </el-table-column>
      <el-table-column label="End Time" prop="endDate" :align="'center'">
        <template #default="scope">
          <el-date-picker
            v-model="scope.row.endDate"
            type="datetime"
            placeholder="날짜 및 시간 선택"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
          />          
        </template>
      </el-table-column>

      <el-table-column label="Action" prop="action" :align="'center'">
        <template #default="scope">
          <el-button type="primary" @click="handleUpdate(scope.row)"
            >Update</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; text-align: center"
      background
      layout="prev, pager, next"
      :total="props.userList.length"
      :page-size="pageSize"
      v-model:current-page="currentPage"
    />
  </div>
</template>

<!-- components/AdminTable.vue -->
<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { FabRequestCreateSchedule } from "../../../interface/fab-request-create-schedule";
import { sendPostRequest } from "../../../utils/httpProtocol";
import { getUserId } from "../../../utils/account-utils";
import { updateSchedule } from "../../../utils/Fab/fab-request-create-schedule";

const props = defineProps<{
  userList: FabRequestCreateSchedule[];
}>();

const currentPage = ref(1);
const pageSize = 13;

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return props.userList.slice(start, start + pageSize);
});

function handleUpdate(fabRequest: FabRequestCreateSchedule) {

  console.log(fabRequest)
  updateSchedule(fabRequest)

}
</script>


