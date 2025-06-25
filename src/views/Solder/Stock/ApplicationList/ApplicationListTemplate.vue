<template>
  <div>
    <!-- Search Input -->
    <!-- <div style="margin-bottom: 20px; display: flex; justify-content: flex-start; align-items: center;">
      <el-input
        v-model="searchTerm"
        placeholder="Model Name 검색"
        clearable
        style="width: 300px;"
        @clear="handleClear"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>
    </div> -->

    <!-- Table -->
    <el-table
      :data="filteredData"
      style="width: 100%; font-size: 16px; padding: 20px"
      :border="true"
      :header-cell-style="{
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
        fontSize: '18px',
      }"
      :row-style="{ height: '50px' }"
            class="custom-table"
      :row-class-name="tableRowClassName"
    >
    <el-table-column label="No" width="60" :align="'center'">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="modelName"
        label="PN_FAB"
        width="170"
        :align="'center'"
      ></el-table-column>
       <el-table-column
        prop="materialId"
        label="PN_WHC"
        width="170"
        :align="'center'"
      ></el-table-column>
      
      <el-table-column
        prop="designer"
        label="Designer"
        width="110"
        :align="'center'"
      ></el-table-column>
   
  
    <!-- <el-table-column v-if="name==='admin'"
        
        label="ID"
        width="150"
        :align="'center'"
      >

      <template #default="scope">
        
      </template>
    </el-table-column> -->

    <!-- <el-table-column v-if="name === 'admin'" label="Designer" width="150" :align="'center'">
  <template #default="scope">
    <el-autocomplete
      v-model="scope.row.designer"
      :fetch-suggestions="(queryString, cb) => querySearch(queryString, cb)"
      placeholder="Enter user name"
      @select="(item) => handleSelect(item, scope.row)"
      clearable
      :disabled ="scope.row.isFound"
    ></el-autocomplete>
    <el-select v-model="scope.row.designer">
      <el-option v-for="(u , index) in userList"
      :key="index"
      :label="u.userName"
      :value="u.userName"
      ></el-option>
    </el-select>
  </template>
</el-table-column> -->

      <el-table-column
        v-if="props.operationType === 'reel'"
        prop="reelId"
        label="Reel ID"
        width="170"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        v-else
        prop="reelId"
        label="Assay ID"
        width="170"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        prop="location"
        label="Location"
        width="100"
        :align="'center'"
      ></el-table-column>

      <el-table-column label="Received Date" width="120" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.dateOfCreated) }}
        </template>
      </el-table-column>

      <el-table-column
        label="Receiver"
        width="150"
        prop="receiver"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        prop="quantity"
        label="Total"
        width="100"
        :align="'center'"
      ></el-table-column>

      <el-table-column label="Remain" width="100" :align="'center'">
        <template #default="scope">
          {{ scope.row.quantity - scope.row.assumedQuantity }}
        </template>
      </el-table-column>

      <!-- Button Column -->
      <el-table-column label="Actions" width="200" :align="'center'">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(scope.row)"
          >
            View Detail
          </el-button>
          <el-button
          type="success"
          size="small"
          @click="handleUpdate(scope.row)"
          >
          Update
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from "vue";
import type { StockInfo } from "../../../../interface/stock";
import { useUserOptions } from "../../../Common/utility";
import { formatDate } from "../../../../utils/date-utils";
import { useRouter } from "vue-router";
import { getUserList } from "../../../../utils/user-utils";
import { User } from "../../../../interface/user";
import { sendPostRequest, sendPostRequestByInterface } from "../../../../utils/httpProtocol";
import { convertKeysToCamelCase, convertKeysToPEP8 } from "../../../../utils/key-converter";


const props = defineProps<{
  stockInfoList: StockInfo[];
  operationType: string;
}>();

const name = localStorage.getItem("ms_username");

const {userOptions}  = useUserOptions();

const userList = ref<User[]>([]);

const searchTerm = ref(""); // 검색어
const router = useRouter();

const isUserListLoading = ref(true); // 로딩 상태 추가

onMounted(async () => {
  getUserList().then((data) => {
    userList.value = data;
    isUserListLoading.value = false; // 데이터 로드 완료 후 UI 활성화
  });
});


const filteredData = computed(() => {
  console.time("⏳ Filtering Execution Time"); // 시작 시간 측정

  props.stockInfoList.forEach((stock) => {
    for (let i = 0; i < userList.value.length; i++) {
      if (stock.designer !== null && stock.designer === userList.value[i].userName) {
        stock.isFound = true;
      }
    }
  });

  if (!searchTerm.value) {
    console.timeEnd("⏳ Filtering Execution Time"); // 종료 시간 측정
    return props.stockInfoList;
  }

  const result = props.stockInfoList.filter((item) =>
    item.modelName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );

  console.timeEnd("⏳ Filtering Execution Time"); // 종료 시간 측정
  return result;
});


function handleClear() {
  searchTerm.value = ""; // 검색어 초기화
}

function handleDetail(row: StockInfo) {
  router.push({
    name: "LoadLotStock",
    params: { id: row.id },
  });
}

async function handleUpdate(row: StockInfo) {
  const vals = convertKeysToPEP8(row);

  try {
    const response = await sendPostRequestByInterface(`/reel/update_reel_request/${row.id}`, vals);

    if (response?.success === false) {
      console.error("❌ Update failed:", response.error);
      alert(`Update failed: ${response.error}`); // 사용자에게 알림 표시
    } else {
      console.log("✅ Update successful:", response);
      alert("Update successful!"); // 성공 메시지
    }
  } catch (error) {
    console.error("❌ Unexpected error in handleUpdate:", error);
  }
}



const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: StockInfo;
  rowIndex: number;
}) => {
  if (!row.isFound) {
    return "el-warning"; // Ensure this matches your CSS class
  }
  return "";
};

const querySearch = (
  queryString: string,
  cb: (suggestions: { value: string; label: string }[]) => void
) => {
  const results = userOptions.value
    .filter((user) =>
      user.label.toLowerCase().includes(queryString.toLowerCase()) // 입력한 값이 포함된 사용자 찾기
    )
    .map((user) => ({
      value: user.label, // 사용자명
      label: user.label, // 표시할 이름
    }));

  cb(results); // 자동 완성 목록에 전달
};

// const handleSelect = (item: { value: string; label: string }, row: StockInfo) => {
//   row.newUserName = item.label; // 해당 row의 newUserName을 업데이트
// };


</script>

<style lang="scss" scoped>
.custom-table ::v-deep(.el-warning) {
  background-color: hsl(0, 42%, 90%) !important; /* Ensure the background changes */
  color: hsl(0, 68%, 12%) !important;  
}
</style>