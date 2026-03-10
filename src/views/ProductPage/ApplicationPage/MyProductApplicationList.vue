<template>
  <div>
    <div class="container">
      <div class="search-box">
        <el-input
          v-model="query.productName"
          placeholder="제품 이름"
          class="search-input mr10"
          clearable
        ></el-input>
        <el-button type="primary" @click="handleSearch">검색</el-button>
      </div>

      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="model_name"
          label="Product Name"
          :align="'center'"
        >
        </el-table-column>

        <el-table-column
          prop="band"
          label="Band"
          :align="'center'"
          width="100px"
        >
        </el-table-column>

        <el-table-column prop="condition" label="Condition" :align="'center'">
        </el-table-column>

        <el-table-column prop="signal_type" label="Signal" :align="'center'">
        </el-table-column>

        <el-table-column prop="test_type" label="TEST" :align="'center'">
        </el-table-column>

        <el-table-column prop="temperature" label="온도" :align="'center'">
        </el-table-column>

        <el-table-column
          prop="sample_quantity"
          label="수량"
          :align="'center'"
          width="65px"
        >
        </el-table-column>

        <el-table-column prop="designer" label="개발자" :align="'center'">
        </el-table-column>

        <el-table-column prop="requester" label="담당자" :align="'center'">
        </el-table-column>

        <el-table-column prop="purpose" label="의뢰목적" :align="'center'">
        </el-table-column>

        <el-table-column label="작성일" :align="'center'">
          <template #default="scope">
            {{ formatDate(scope.row.date_of_created) }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="status"
          label="상태"
          :align="'center'"
        ></el-table-column> -->

        <el-table-column label="Action" width="150" :align="'center'">
          <template #default="scope">
            <el-button type="" size="small" @click="handleDetail(scope.row)"
              >자세히</el-button
            >
            <!-- <el-button
              type="danger"
              size="small"
              :disabled= "!isDisabled(scope.row.status)"
              @click="handleDelete(scope.row)"
              >삭제</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :title="idEdit ? '제품 편집' : '제품 추가'"
      v-model="visible"
      width="500px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <!-- TableEdit 컴포넌트 내용 -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { deletePdtApplication } from "../../../utils/Pdt/application-utils";
import { formatDate } from "../../../utils/date-utils";

const query = reactive({
  productName: "",
  pageIndex: 1,
  pageSize: 10,
});

interface ApplicationItem {
  uuid: string;
  band: string;
  model_name: string;
  condition: string;
  designer: string;
  signal_type: string;
  requester: string;
  status: string;
  test_type: string;
  prupose: string;
  sample_quantity: string;
  temperature: string;
  date_of_created;
}
const applicationList = ref<ApplicationItem[]>([]);

// 비활성화 조건 함수
const isDisabled = (status: string): boolean => {
  let flag = false
  if(["reserved", "created"].includes(status)){
    flag = true
  }
  return flag;
};

const allData = ref<ApplicationItem[]>([]);
const tableData = ref<ApplicationItem[]>([]);
const pageTotal = ref(0);

const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "요소기술그룹" : "요소기술그룹";

const fetchData = async () => {
  try {
    const response = await axios.post("pdt_application/get-my-applications", {
      requester: name,
    });
    console.log(response.data);

    allData.value = response.data;

    filterData();
  } catch (error) {
    ElMessage.error("데이터를 불러오는 데 실패했습니다.");
    console.error(error);
  }
};

const filterData = () => {
  // 제품 이름으로 필터링
  const filtered = allData.value.filter((item) =>
    item.model_name.toLowerCase().includes(query.productName.toLowerCase())
  );

  // 페이지네이션을 위한 인덱스 계산
  const startIndex = (query.pageIndex - 1) * query.pageSize;
  const endIndex = startIndex + query.pageSize;

  // 현재 페이지에 표시될 데이터 슬라이스
  tableData.value = filtered.slice(startIndex, endIndex);
  // 전체 페이지 수를 위한 전체 필터링된 항목 수 업데이트
  pageTotal.value = filtered.length;
};

const handleSearch = () => {
  query.pageIndex = 1;
  filterData();
};

const handlePageChange = (val: number) => {
  query.pageIndex = val;
  filterData();
};

onMounted(fetchData);

const visible = ref(false);
const idEdit = ref(false);
const rowData = ref({});
// const handleDetail = (row: ApplicationItem) => {
//   rowData.value = row;
//   visible1.value = true;
// };

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const handleDelete = (row: ApplicationItem) => {
  if(deletePdtApplication(row.uuid)){
    filterData()
  }
}

const handleDetail = (row: ApplicationItem) => {
  // `application/application_detail` 페이지로 리디렉트하면서 `uuid`를 파라미터로 전달합니다.
  router.push({
    name: "MyProductApplicationDetail",
    params: { uuid: row.uuid },
  });
};

const closeDialog = () => {
  visible.value = false;
  idEdit.value = false;
};
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
}
.search-input {
  width: 200px;
}
.mr10 {
  margin-right: 10px;
}
</style>
