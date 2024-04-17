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
        <!-- <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">추가</el-button> -->
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="cnt"
          label="No"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="product_name"
          label="Product Name"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="lot_id"
          label="Lot ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="wafer_id"
          label="Wafer ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="meas_type"
          label="Meas Type"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="date_of_reserve_str"
          label="접수"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="date_of_finish_str"
          label="완료 예정"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="자세히" width="280" align="center">
          <template #default="scope">
            <el-button type="info" size="small" @click="handleDetail(scope.row)"
              >자세히</el-button
            >
          </template>
        </el-table-column> -->
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
    
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";



interface WaitingItem {
  cnt: number;
  product_name: string;
  lot_id: string;
  wafer_id: string;
  meas_type: string;
  designer: string;
  status: string;
  date_of_reserve_str: string;
  date_of_finish_str: string;
}

const query = reactive({
  productName: "",
  pageIndex: 1,
  pageSize: 10,
});

const allData = ref<WaitingItem[]>([]);
const tableData = ref<WaitingItem[]>([]);
const pageTotal = ref(0);

const fetchData = async () => {
  try {
    const response = await axios.get("/measurement/send_waiting_list");
    allData.value = Object.values(response.data.waiting_list).map(
      (item: any) => ({
        cnt: item.cnt,
        product_name: item.product_name,
        lot_id: item.lot_id,
        wafer_id: item.wafer_id,
        meas_type: item.meas_type,
        status: item.status,
        date_of_reserve: item.date_of_reserve,
        designer: item.designer,
        date_of_reserve_str: item.date_of_reserve_str,
        date_of_finish_str: item.date_of_finish_str,
      })
    );
    pageTotal.value = allData.value.length;
    filterData();
  } catch (error) {
    ElMessage.error("데이터를 불러오는 데 실패했습니다.");
    console.error(error);
  }
};

const filterData = () => {
  const filtered = allData.value.filter((item) =>
    item.product_name.toLowerCase().includes(query.productName.toLowerCase())
  );
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
