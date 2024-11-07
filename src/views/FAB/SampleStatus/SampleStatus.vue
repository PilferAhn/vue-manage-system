<template>
  <div>
    <!-- 시작 날짜와 끝 날짜 입력 필드 -->
    <el-form :inline="true">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="Select start date"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="End Date">
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="Select end date"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" @click="filterFabData" style="width: 77px"
            >Filter</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button
            :type="isCN69Filter ? 'warning' : 'success'"
            @click="toggleCN69Filter"
          >
            {{ isCN69Filter ? "Disable CN69 Filter" : "Enable CN69 Filter" }}
          </el-button>
        </el-col>
        <div class="legend">
          <div class="legend-item">
            <el-button class="el-button--success" disabled>중요도 ★</el-button>
            <!-- <span>진행 중</span> -->
          </div>
          <div class="legend-item">
            <el-button class="el-button--warning" disabled>Holding</el-button>
            <!-- <span>완료</span> -->
          </div>
          <div class="legend-item">
            <el-button class="el-button--danger" disabled>납기 초과</el-button>
            <!-- <span>대기 중</span> -->
          </div>
        </div>
      </el-row>
    </el-form>
    <el-form :inline="true" class="search-form">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="Product Name">
            <el-input
              v-model="searchModelName"
              placeholder="Enter model name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Designer">
            <el-input
              v-model="searchPL"
              placeholder="Enter Designer"
              style="width: 195px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="filterBySearchTerms"
            >Search</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <!-- 필터링된 데이터가 표시되는 테이블 -->
    <el-table
      :data="paginatedData"
      style="width: 100%"
      height="750"
      @sort-change="handleSortChange"
      :row-class-name="tableRowClassName"
      :lazy="true"
    >
      <!-- Index 열 추가 -->
      <el-table-column type="index" label="#" width="50" :align="'center'" />

      <el-table-column
        prop="idx"
        label="Index"
        width="100"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="week"
        label="Week"
        width="100"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="separation"
        label="구분"
        width="150"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="band"
        label="BAND"
        width="170"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="fabGroup"
        label="그룹"
        width="100"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="productName"
        label="Product Name"
        width="200"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="stepNumber"
        label="차수"
        width="80"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="pl"
        label="PL"
        width="100"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column
        prop="spl"
        label="SPL"
        width="100"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column label="일정계획" width="200" :align="'center'">
        <el-table-column
          prop="fabIn"
          label="IN"
          width="100"
          :align="'center'"
        ></el-table-column>
        <el-table-column
          prop="fabOut"
          label="OUT"
          width="100"
          :align="'center'"
        ></el-table-column>
      </el-table-column>
      <el-table-column
        prop="lotId"
        label="Lot ID"
        width="150"
        sortable="custom"
        :align="'center'"
      />
      <el-table-column label="공정" :align="'center'">
        <el-table-column
          prop="nowProcessPosition"
          label="Process Position"
          width="200"
          sortable="custom"
          :align="'center'"
        />
        <el-table-column label="소요시간" width="200" :align="'center'">
        </el-table-column>
      </el-table-column>
    </el-table>

    <!-- 페이지네이션 컴포넌트 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="filteredFabData.length"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import type { FabData } from "./SampleStatusInterface";
import { getTodayAsString, getPrevious30DaysAsString } from "./SampleStatus";
import axios from "axios";
import { cn69ModelNames } from "./Cn69List";

const fabData = ref<FabData[]>([]); // 전체 데이터를 저장
const filteredFabData = ref<FabData[]>([]); // 필터링된 데이터를 저장
const NonefilteredByDate = ref<FabData[]>([]); // 필터링된 데이터를 저장
const startDate = ref<Date | null>(null); // 시작 날짜
const endDate = ref<Date | null>(null); // 끝 날짜

// 페이지네이션 관련 변수
const currentPage = ref(1);
const pageSize = ref(100); // 한 페이지에 표시할 항목 수

// 검색어 입력 필드
const searchModelName = ref("");
const searchPL = ref("");

// 검색 기능을 구현한 함수
const filterBySearchTerms = () => {
  // modelName과 PL 필드를 기준으로 필터링
  filteredFabData.value = fabData.value.filter((item) => {
    const matchesModelName = searchModelName.value
      ? item.productName
          .toLowerCase()
          .includes(searchModelName.value.toLowerCase())
      : true;
    const matchesPL = searchPL.value
      ? item.pl.toLowerCase().includes(searchPL.value.toLowerCase())
      : true;
    return matchesModelName && matchesPL;
  });

  // 필터링된 데이터를 페이지네이션에 맞게 반영
  currentPage.value = 1; // 검색 시 첫 페이지로 이동
};

// 정렬 처리 함수
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  if (order === "ascending") {
    paginatedData.value.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
  } else if (order === "descending") {
    paginatedData.value.sort((a, b) => (a[prop] < b[prop] ? 1 : -1));
  }
};

const isCN69Filter = ref(false); // CN69 필터 활성화 여부
// CN69 버튼 클릭 시 필터 활성화/비활성화
const toggleCN69Filter = () => {
  isCN69Filter.value = !isCN69Filter.value;
  filterFabData();
};

const finalDateDate = getTodayAsString();
const startingDate = getPrevious30DaysAsString(finalDateDate);

const url =
  "/bfsm2/splPlanOfCommitment?hideCheck=false&searchStartTime=" +
  startingDate +
  "&searchEndTime=" +
  finalDateDate;

// 현재 날짜와 한 달 전 날짜를 설정하는 함수
const setInitialDates = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  startDate.value = lastMonth;
  endDate.value = today;
};

const fetchFabData = async () => {
  try {
    const response = await axios.get<FabData[]>(url);
    fabData.value = response.data;
    filteredFabData.value = fabData.value; // 초기에는 모든 데이터를 표시
    filterFabData(); // 데이터를 가져온 후 필터링 한 번 실행
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// fabIn 날짜 기준으로 데이터를 필터링하고 정렬하는 함수
const filterFabData = () => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value).getTime();
    const end = new Date(endDate.value).getTime();

    // 먼저 realFabIn이 null인 항목을 찾고 separation이 '연구소'가 아닌 항목을 필터링하여 idx로 내림차순 정렬
    const nullRealFabIn = fabData.value
      .filter((item) => item.realFabIn === null && item.separation !== "연구소")
      .sort((a, b) => b.idx - a.idx);

    // realFabIn이 null이 아닌 항목을 startDate와 endDate로 필터링 후 separation이 '연구소'가 아닌 항목을 idx로 내림차순 정렬
    const filteredByDate = fabData.value.filter(
      (item) =>
        item.realFabIn !== null &&
        new Date(item.realFabIn).getTime() >= start &&
        new Date(item.realFabIn).getTime() <= end &&
        item.separation !== "연구소"
    );

    if (isCN69Filter.value) {
      // filteredByDate.forEach((item) => {
      //   const splitValue = item.productName.split("@")[0].toLowerCase();
      // });

      filteredFabData.value = filteredByDate.filter((item) =>
        cn69ModelNames.includes(item.productName.split("@")[0].toLowerCase())
      );

      
      NonefilteredByDate.value = nullRealFabIn.filter((item) =>
        cn69ModelNames.includes(item.productName.split("@")[0].toLowerCase())
      );

      filteredFabData.value = [
        ...NonefilteredByDate.value,
        ...filteredFabData.value,
      ].sort((a, b) => b.idx - a.idx);

      // let nameListTemp = ""
      // filteredFabData.value.filter((item) => {
      //   nameListTemp += item.productName + ","
      // })
      // console.log(filteredFabData.value.length)

    } else {
      filteredFabData.value = [...nullRealFabIn, ...filteredByDate].sort(
        (a, b) => b.idx - a.idx
      );
    }
    // 두 배열을 합쳐서 필터링된 데이터를 생성
  } else {
    // 날짜가 선택되지 않으면 separation이 '연구소'가 아닌 모든 데이터를 표시하고 정렬
    filteredFabData.value = fabData.value
      .filter((item) => item.separation !== "연구소")
      .sort((a, b) => b.idx - a.idx);
  }
};

// 페이지네이션에 맞춰 데이터를 자르는 계산 속성
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFabData.value.slice(start, end);
});

// 페이지 변경 시 호출되는 함수
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 컴포넌트가 마운트될 때 데이터 가져오기 및 날짜 설정
onMounted(() => {
  setInitialDates(); // 시작 날짜와 끝 날짜를 설정
  fetchFabData(); // 데이터를 가져온 후 필터링을 자동으로 실행
});

const today = new Date();
today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 초기화

const hoveredRow = ref<number | null>(null); // 현재 호버된 행의 인덱스

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: FabData;
  rowIndex: number;
}) => {
  const targetDate = new Date(row.fabOut);
  targetDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
  // if (rowIndex == hoveredRow.value){
  //   return "custom-hover-row";
  // }
  if (row.currentHoldingFlag >= 1) {
    return "warning-row";
  } else if (targetDate.getTime() <= today.getTime()) {
    return "danger-row";
  } else if (row.importance === "★") {
    return "important-row";
  }
  // else if (row.importance === "C" || row.importance === "H") {
  //   return "success-row";
  // }

  return "";
};
</script>

<style>
/* Hover 효과 제거 */
.container {
  padding: 20px;
}
/* scoped 제거 후 전역 스타일로 지정 */

.el-table__row.important-row {
  background-color: rgb(0, 255, 0);
}

.el-table__row.warning-row {
  background-color: rgb(255, 165, 0);
}

.el-table__row.danger-row {
  background-color: rgb(250, 88, 88);
}

/* custom-hover-row 클래스를 사용하여 hover 효과 정의 */
.el-table__row.custom-hover-row {
  background-color: rgb(250, 88, 88);
  border: 2px solid #000000 !important;
  border-radius: 10px;
}

/* styled 상태에 따른 효과 */
.el-button--danger {
  background-color: #ff4d4f !important;
  
}

.el-button--success {
  background-color: #52c41a !important;
  
}

.el-button--warning {
  background-color: rgb(255, 165, 0) !important;
}

.legend {
  display: flex;
  margin-left: auto; /* Pushes the legend to the right side */
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}


</style>
