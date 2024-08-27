<template>
  <div>
    <div v-if="tableData.length != 0" class="container">
      <div class="search-box">
        <el-input
          v-model="query.model_name"
          placeholder="Model 검색"
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
        :row-class-name="getRowClassName"
      >
        <el-table-column
          prop="model_name"
          label="Product Name"
          align="center"
          width="150"
        >
        </el-table-column>

        <el-table-column prop="band" label="Band" align="center" width="100px">
          <template #default="scope">
            <span v-if="scope.row.band.length > 5">{{ scope.row.band.substring(0,4) }}</span>
            <span v-else>{{ scope.row.band }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="condition" label="Status" align="center">
        </el-table-column>

        <el-table-column prop="signal_type" label="Signal" align="center">
        </el-table-column>

        <el-table-column prop="target_position" label="Target" align="center">
        </el-table-column>

        <el-table-column prop="test_type" label="TEST" align="center">
        </el-table-column>

        <el-table-column prop="designer" label="개발자" align="center">
        </el-table-column>

        <el-table-column prop="requester" label="담당자" align="center">
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
            <span v-else :style="{ color: 'blue' }">측정 종료</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="request_number" label="의뢰 번호" align="center">
        </el-table-column>      
        <!-- <el-table-column label="시작" align="center">
          <template #default="scope">
            <span>{{ moment(scope.row.date_of_created).format('YY/MM/DD') }}</span>            
          </template>
        </el-table-column> -->
        <el-table-column label="측정 완료" align="center">
          <template #default="scope">
            <span v-if="scope.row.status === 'finished'">{{ moment(scope.row.date_of_finished).format('YY/MM/DD') }}</span>            
            <span v-else>-</span>
          </template>        
        </el-table-column>

        <el-table-column label="Action" width="100" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
              >자세히</el-button
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
    <div v-else>
      <div class="container">
        <div class="search-box">
          <el-input
            v-model="query.model_name"
            placeholder="Model 검색"
            class="search-input mr10"
            clearable
          ></el-input>
          <el-button type="primary" @click="handleSearch">검색</el-button>
        </div>
        <el-empty description="진행중인 측정 의뢰가 없습니다."></el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { getLastThursday, formatDate } from "../../../utils/utility";
import { applicationRules } from "../../../utils/FromRule";
import { useRouter } from "vue-router";
import moment from 'moment';

const props = defineProps<{
  testType: string;
  searchType: string;
  status: string;
}>();

const getRowClassName = ({ row }) => {
  if (row.status === "in progress") {
    return "in-progress";
  } else if (row.status === "waiting") {
    return "waiting";
  }
  return "";
};

const query = reactive({
  model_name: "",
  pageIndex: 1,
  pageSize: 13,
});

// 로컬 저장소에서 저장된 값을 불러와서 초기화합니다.
onMounted(() => {
  query.model_name = localStorage.getItem("modelSearchQuery") || "";
  fetchData();
});

// model_name이 변경될 때마다 이를 로컬 저장소에 저장합니다.
watch(
  () => query.model_name,
  (newValue) => {
    localStorage.setItem("modelSearchQuery", newValue);
  }
);

// // 로컬 저장소에서 저장된 값을 불러와서 초기화합니다.
// onMounted(() => {
//   query.model_name = localStorage.getItem("modelSearchQuery") || "";
//   fetchData();
// });

// // model_name이 변경될 때마다 이를 로컬 저장소에 저장합니다.
// watch(() => query.model_name, (newValue) => {
//   localStorage.setItem("modelSearchQuery", newValue);
// });

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
  request_number: string;
  target_position: string;
  date_of_created : string;
  date_of_finished : string;
}

const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "RF개발팀" : "RF개발팀";



const allData = ref<ApplicationItem[]>([]);
const tableData = ref<ApplicationItem[]>([]);
const pageTotal = ref(0);

const fetchData = async () => {
  try {
    //props.status = 'finished'
    const response = await axios.post(
      "pdt_application/get_application_list_by_test_type",
      {
        status: props.status,
        test_type: props.testType,
        search_type: props.searchType,
        user_name: name,
      }
    );

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
    item.model_name.toLowerCase().includes(query.model_name.toLowerCase())
  );

  // 페이지네이션을 위한 인덱스 계산
  const startIndex = (query.pageIndex - 1) * query.pageSize;
  const endIndex = startIndex + query.pageSize;

  // 현재 페이지에 표시될 데이터 슬라이스
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

onMounted(() => {
  const reloadOnBack = () => {
    window.location.reload();
  };

  window.addEventListener("popstate", reloadOnBack);

  // 페이지를 벗어날 때 이벤트 리스너 제거
  onUnmounted(() => {
    window.removeEventListener("popstate", reloadOnBack);
  });
});

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

  router.push({ name: "MeasurementInfo", params: { uuid: row.uuid } });
};

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
.pagination-margin {
  margin-top: 20px; /* 원하는 마진 값을 설정하세요 */
}
</style>
