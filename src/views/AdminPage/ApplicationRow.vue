<template>
  <div>
    <div class="container">
      <div class="search-box" v-if="props.status === 'created'">
        <el-input
          v-model="query.uuid"
          placeholder="QR Code 스켄"
          class="search-input mr10"
          clearable
        ></el-input>

        <!-- New input for Developer or Requester -->
        <el-input
          v-model="query.searchName"
          placeholder="개발자 또는 담당자 이름"
          class="search-input mr10"
          clearable
        ></el-input>

        <el-button type="primary" @click="handleSearch">검색</el-button>
      </div>
      <div class="search-box"  v-else>
        <!-- New input for Developer or Requester -->
        <el-input
          v-model="query.searchName"
          placeholder="개발자 또는 담당자 이름"
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

        <el-table-column prop="condition" label="Condition" align="center">
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
          prop="target_position"
          label="Target"
          align="center"
        ></el-table-column>

        <el-table-column prop="designer" label="개발자" align="center">
        </el-table-column>

        <el-table-column prop="requester" label="담당자" align="center">
        </el-table-column>

        <!-- <el-table-column prop="purpose" label="의뢰목적" align="center">
        </el-table-column> -->

        <el-table-column prop="request_number" label="의뢰 번호" align="center">
        </el-table-column>

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
            <span
              v-else-if="scope.row.status === 'created'"
              :style="{ color: 'orange' }"
              >접수 대기</span
            >
            <span v-else :style="{ color: 'blue' }">측정 종료</span>
          </template>
        </el-table-column>

        <el-table-column label="Action" width="280" align="center">
          <template #default="scope">
            <el-button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="updateDetail(scope.row)"
              >업데이트</el-button
            >
            <el-button
              type="danger"
              size="small"
              style="margin-right: 5px"
              @click="handleDelete(scope.row)"
              >삭제</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange"
        class="pagination-margin"
      ></el-pagination>
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
      <ApplicationDetail :data="rowData" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineProps } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { sendGetRequest } from "../../utils/httpProtocol";
import ApplicationDetail from "./ApplicationDetail.vue";

const props = defineProps<{
  status: string;
}>();

const query = reactive({
  uuid: "",
  searchName: "",
  pageIndex: 1,
  pageSize: 10,
});

interface ApplicationItem {
  uuid: string;
  band: string;
  model_name: string;
  condition: string;
  designer: string;
  requester: string;
  temperature: string;
  product_type: string;
  wafer_type: string;
  date_of_create: string;
  status: string;
  sample_quantity: number;
  test_type: string;
  signal: string;
  purpose: string;
  target_position: string;
}
const applicationList = ref<ApplicationItem[]>([]);

const allData = ref<ApplicationItem[]>([]);
const tableData = ref<ApplicationItem[]>([]);
const pageTotal = ref(0);

const fetchData = async () => {
  try {
    const response = await axios.post("pdt_application/get_application_list", {
      status: props.status,
    });

    allData.value = response.data;

    filterData();
  } catch (error) {
    ElMessage.error("데이터를 불러오는 데 실패했습니다.");
    console.error(error);
  }
};

const filterData = () => {
  // Filter based on UUID and developer/requester name
  const filtered = allData.value.filter(
    (item) =>
      item.uuid.includes(query.uuid) &&
      (item.designer.includes(query.searchName) ||
        item.requester.includes(query.searchName))
  );

  // Pagination logic (remains the same)
  const startIndex = (query.pageIndex - 1) * query.pageSize;
  const endIndex = startIndex + query.pageSize;
  tableData.value = filtered.slice(startIndex, endIndex);
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

const handleDelete = async (row) => {
  ElMessageBox.confirm(
    "삭제된 데이터는 되돌릴 수 없습니다.\n정말로 삭제하시겠습니까?",
    "경고",
    {
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      type: "warning",
    }
  )
    .then(async () => {
      // async 키워드 추가
      try {
        const result = await sendGetRequest(
          "pdt_application/delete_pdt_application",
          row.uuid
        );
        // 성공적으로 삭제된 후의 로직을 여기에 추가
        location.reload(); // 페이지 새로고침
      } catch (error) {
        // 에러 처리 로직을 여기에 추가
        console.error(error);
      }
    })
    .catch(() => {
      // 사용자가 '아니오'를 누르거나 팝업을 닫을 경우, 여기서 처리할 수 있습니다.
    });
};

// useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.
const router = useRouter();

const updateDetail = (row: ApplicationItem) => {
  // `application/application_detail` 페이지로 리디렉트하면서 `uuid`를 파라미터로 전달합니다.
  router.push({ name: "ApplicationDetail", params: { uuid: row.uuid } });
};

const closeDialog = () => {
  visible.value = false;
  idEdit.value = false;
};

const visible1 = ref(false);
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
.pagination-margin {
  margin-top: 20px; /* 원하는 마진 값을 설정하세요 */
}
</style>
