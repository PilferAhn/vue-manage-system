<template>
  <div>
    <div class="container">
      <el-table
        :data="allData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        :row-class-name="getRowClassName"
      >
        <el-table-column prop="model_name" label="Product Name" align="center">
          <!-- <template #default="scope">
              <el-input v-model="scope.row.model_name" size="small"></el-input>
            </template> -->
        </el-table-column>

        <el-table-column prop="band" label="Band" align="center" width="100px">
          <!-- <template #default="scope">
              <el-input v-model="scope.row.band" size="small"></el-input>
            </template> -->
        </el-table-column>

        <el-table-column prop="condition" label="Status" align="center">
        </el-table-column>

        <el-table-column prop="signal_type" label="Signal" align="center">
        </el-table-column>

        <el-table-column prop="test_type" label="TEST" align="center">
          <!-- <template #default="scope">
              <el-select
                v-model="scope.row.test_type"
                placeholder="예) Fuse Max"
                size="small"
              >
                <el-option key="Max Fuse " label="Max Fuse" value="Max Fuse" />
                <el-option key="AMR" label="AMR" value="AMR" />
                <el-option key="Life" label="Life" value="Life" />
                <el-option key="Aging" label="Aging" value="Aging" />
              </el-select>
            </template> -->
        </el-table-column>

        <el-table-column
          prop="sample_quantity"
          label="수량"
          align="center"
          width="70px"
        >
        </el-table-column>

        <el-table-column prop="designer" label="개발자" align="center">
        </el-table-column>

        <el-table-column prop="requester" label="담당자" align="center">
        </el-table-column>

        <!-- <el-table-column prop="purpose" label="의뢰목적" align="center">
        </el-table-column> -->

        <el-table-column label="상태" align="center">
          <template #default="scope">
            <span
              v-if="scope.row.status === 'in progress'"
              :style="{ color: 'green' }"
              >측정 진행 중</span
            >
            <span
              v-else-if="scope.row.status === 'reserved'"
              :style="{ color: 'orange' }"
              >측정 대기</span
            >
            <span v-else :style="{ color: 'blue' }">측정 종료</span>
          </template>
        </el-table-column>

        <el-table-column label="Action" width="280" align="center">
          <template #default="scope">
            <!-- <el-button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="handleUpdate(scope.row)"
              >업데이트</el-button
            >
            <el-button
              type="danger"
              size="small"
              style="margin-right: 5px"
              @click="handleDelete(scope.row)"
              >삭제</el-button
            > -->
            <el-button
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
              >자세히</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination" v-if="props.status === 'created'">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div> -->
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
    <el-dialog
      title="제품 상세 정보"
      v-model="visible1"
      width="700px"
      destroy-on-close
    >
      <RequestDetail :data="rowData" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineProps } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { getLastThursday, formatDate } from "../../utils/utility";
import { applicationRules } from "../../utils/FromRule";
import { useRouter } from "vue-router";

// const props = defineProps<{
//   status: string;
// }>();

const query = reactive({
  productName: "",
  pageIndex: 1,
  pageSize: 10,
});

const getRowClassName = ({ row }) => {
  if (row.status === "in progress") {
    return "in-progress";
  } else if (row.status === "waiting") {
    return "waiting";
  }
  return "";
};

interface ApplicationItem {
  uuid: string;
  band: string;
  model_name: string;
  condition: string;
  designer: string;
  requester: string;
  product_type: string;
  wafer_type: string;
  status: string;
  sample_quantity: string;
  signal_type: string;
}

const allData = ref<ApplicationItem[]>([]);
const tableData = ref<ApplicationItem[]>([]);
const pageTotal = ref(0);

const fetchData = async () => {
  try {
    //props.status = 'finished'
    const response = await axios.post("pdt_application/get_application_list", {
      status: "reserved",
    });

    allData.value = response.data;

    // filterData();
  } catch (error) {
    ElMessage.error("데이터를 불러오는 데 실패했습니다.");
    console.error(error);
  }
};

// const filterData = () => {
//   // 제품 이름으로 필터링
//   const filtered = allData.value.filter((item) =>
//     item.model_name.toLowerCase().includes(query.productName.toLowerCase())
//   );

//   // 페이지네이션을 위한 인덱스 계산
//   const startIndex = (query.pageIndex - 1) * query.pageSize;
//   const endIndex = startIndex + query.pageSize;

//   // 현재 페이지에 표시될 데이터 슬라이스
//   tableData.value = filtered.slice(startIndex, endIndex);
//   // 전체 페이지 수를 위한 전체 필터링된 항목 수 업데이트
//   pageTotal.value = filtered.length;
// };

// const handleSearch = () => {
//   query.pageIndex = 1;
//   filterData();
// };

// const handlePageChange = (val: number) => {
//   query.pageIndex = val;
//   filterData();
// };

onMounted(fetchData);

// const visible = ref(false);
// const idEdit = ref(false);
// const rowData = ref({});
// const handleDetail = (row: ApplicationItem) => {
//   rowData.value = row;
//   visible1.value = true;
// };

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const handleDetail = (row: ApplicationItem) => {
  // `application/application_detail` 페이지로 리디렉트하면서 `uuid`를 파라미터로 전달합니다.
  router.push({ name: "MeasurementDetail", params: { uuid: row.uuid } });
};

// const closeDialog = () => {
//   visible.value = false;
//   idEdit.value = false;
// };

// const visible1 = ref(false);
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
}

.in-progress {
  background-color: green; /* 녹색 배경 */
}

.waiting {
  background-color: grey; /* 회색 배경 */
}
.search-input {
  width: 200px;
}
.mr10 {
  margin-right: 10px;
}
</style>
