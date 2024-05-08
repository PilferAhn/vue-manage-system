<template>
  <el-card shadow="hover" style="height: 403px">
    <template #header>
      <div class="clearfix">
        <span>최근 의뢰 내역</span>
        <el-button size = 'small' style="float: right;" @click = "viewMyApplicationForm"
          >지난 의뢰 보기</el-button
        >
        <el-button size = 'small' style="float: right; " @click="writeApplicationForm"
          >의뢰서 작성</el-button
        >
      </div>
    </template>

    <el-table :show-header="false" :data="applications" style="width: 100%">
      <el-table-column width="40">
        <template #default="scope">
          <el-checkbox v-model="scope.row.status"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <div
            class="todo-item"
            :class="{
              'todo-item-del': scope.row.status,
            }"
          >
            {{ scope.row.model_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <div
            class="todo-item"
            :class="{
              'todo-item-del': scope.row.status,
            }"
          >
            {{ scope.row.test_type }}
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <div
            class="todo-item"
            :class="{
              'todo-item-del': scope.row.status,
            }"
          >
            {{ scope.row.sample_quantity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <div
            v-if="scope.row.status === 'created'"
            class="todo-item"
            :class="{
              'todo-item-del': scope.row.status,
            }"
          >
            의뢰서 작성 완료
          </div>
          <div
            v-else-if="scope.row.status === 'in progress'"
            class="todo-item"
            :class="{
              'todo-item-del': scope.row.status,
            }"
          >
            측정 진행 중
          </div>
          <div
            v-else-if="scope.row.status === 'finished'"
            class="todo-item"
            :class="{
              'todo-item-del': scope.row.status,
            }"
          >
            측정 완료
          </div>
          <div
            v-else
            class="todo-item"
            :class="{
              'todo-item-del': scope.row.status,
            }"
          >
            측정 대기
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <el-button
            class="primary"
            size="small"
            @click="viewAppDetail(scope.row)"
            >자세히 보기</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import axios from "../../utils/request";
import { useRouter } from "vue-router";

interface application {
  uuid: string;
  model_name: string;
  request_number: string;
  condition: string;
  sample_numbers: string[];
  sample_quantity: string;
  status: string;
  test_type: string;
}

const applications = ref<application[]>([]);

interface re {
  requester: string;
}

const requesterName = localStorage.getItem("ms_username");

const requesterInfo = ref<re>({
  requester: requesterName,
});


// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const getProductData = async () => {
  try {
    const { data } = await axios.post(
      "/pdt_application/send_application_info",
      requesterInfo.value
    );

    
    applications.value = data;
  } catch (error) {
    console.error("Error fetching application type list:", error);
    throw error;
  }
};


onMounted(() => {
  getProductData();
});



const viewAppDetail = (row: application) => {
  // `application/application_detail` 페이지로 리디렉트하면서 `uuid`를 파라미터로 전달합니다.
  router.push({ name: "MeasurementDetail", params: { uuid: row.uuid } });
};

const writeApplicationForm = () => {
  router.push({name : "PDTApplication"})
}

const viewMyApplicationForm = () => {
  router.push({name : "MyProductApplicationList"})
}

</script>
