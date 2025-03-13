<template>
  <div>
    <el-table :data="props.applications" border class="table-class">
      <el-table-column prop="group" label="그룹" :align="'center'" width="70" />

      <el-table-column
        prop="waferType"
        label="공정"
        :align="'center'"
        width="60"
      >
        <template #default="scope">{{ scope.row.wafer.sawTypeId }}</template>
      </el-table-column>

      <el-table-column
        prop="priorityId"
        label="긴급도"
        :align="'center'"
        width="70"
      />

      <el-table-column
        prop="packageId"
        label="패키지"
        :align="'center'"
        width="90"
      />

      <el-table-column
        prop="productName"
        label="Product Name"
        :align="'center'"
        width="150"
      />

      <el-table-column prop="note" label="용도" :align="'center'" width="150" />

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
      <el-table-column
        prop="dateOfFabInsert"
        label="투입일"
        :align="'center'"
        width="80"
      />

      <el-table-column label="P/L" :align="'center'" width="150">
        <template #default="scope"
          >{{ scope.row.designer.userName }} /
          {{ scope.row.requester.userName }}</template
        >
      </el-table-column>
      <el-table-column prop="waferType" label="Type" :align="'center'">
        <template #default="scope">{{ scope.row.wafer.sawTypeId }}</template>
      </el-table-column>
      <el-table-column prop="band" label="Band" :align="'center'" width="100">
      </el-table-column>
      <el-table-column label="출하" prop="destinationId" :align="'center'">
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
import DialogTemplate from "../ApplicationLinksDialog.vue";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import {
  getApplicationList,
  sendAppRemoveRequest,
} from "../../../../utils/Fab/fab-application-utils";
import router from "../../../../router";

const props = defineProps<{
  applications: FabRequestForm[];
}>();

const dialogTableVisible = ref(false);
const selectApplication = ref<FabRequestForm>({});

function handleVisible(status: boolean, fabRequestForm: FabRequestForm) {
  dialogTableVisible.value = status;
  selectApplication.value = fabRequestForm;
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

      // 목록 갱신
      props.applications.length = 0;
      const data = await getApplicationList(
        true,
        true,
        true,
        "admin",
        null,
        null,
        true,
        true
      );
      props.applications.push(...data);
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
<style></style>