<template>
  <div>
    <el-table v-if="isLoad" :data="applications">
      <el-table-column
        prop="quantity"
        label="매수"
        :align="'center'"        
      />
      <el-table-column
        prop="code"
        label="투입코드"
        :align="'center'"        
      />
      <el-table-column
        prop="dateOfFabInsert"
        label="투입일"
        :align="'center'"        
      />
      <el-table-column
        prop="productName"
        label="Product Name"
        :align="'center'"        
      />
      <el-table-column
        prop="productName"
        label="Product Name"
        :align="'center'"        
      />
      <el-table-column label="P/L" :align="'center'">
        <template #default="scope"
          >{{ scope.row.designer.userName }} /
          {{ scope.row.requester.userName }}</template
        >
      </el-table-column>
      <el-table-column
        prop="waferType"
        label="Type"

        :align="'center'"
      >
        <template #default="scope">{{ scope.row.wafer.sawTypeId }}</template>
      </el-table-column>
      <el-table-column label="Band" :align="'center'">
        <template #default="scope">
          {{ scope.row.bandCombinationId }}
        </template>
      </el-table-column>
      <el-table-column
        label="출하"
        prop="destinationId"

        :align="'center'"
      >
      </el-table-column>
      <el-table-column label="Action" :align="'center'">
        <template #default="scope">
          <el-button @click="handleButton('view', scope.row)">자세히</el-button>
          <el-button plain @click="handleVisible(true, scope.row)">
            의뢰서
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

import DialogTemplate from "../ApplicationLinksDialog.vue";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import { getApplicationList } from "../../../../utils/Fab/fab-application-utils";
import router from "../../../../router";

const applications = reactive<FabRequestForm[]>([]);
const isLoad = ref<boolean>(false);

const dialogTableVisible = ref(false);
const selectApplication = ref<FabRequestForm>({});

function handleVisible(status: boolean, fabRequestForm: FabRequestForm) {
  dialogTableVisible.value = status;
  selectApplication.value = fabRequestForm;
}



onMounted(async () => {
  try {
    // getApplicationList를 호출하고 결과를 기다림
    const data = await getApplicationList(true, true, true, "admin");
    applications.push(...data); // 가져온 데이터를 reactive 배열에 추가
    isLoad.value = true;
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
});

function handleButton(action: string, application: FabRequestForm) {
  if (action === "view") {
    router.push({
      name: "LoadApplication2",
      params: { productName: application.productName },
    });
  }
}
</script>
<script lang="ts">
export default {};
</script>
<style></style>
