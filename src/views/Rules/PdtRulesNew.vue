<template>
  <div class="container">
    <div class="filter-section">
      <el-select v-model="selectedCustomer" placeholder="Select Customer">
        <el-option
          v-for="customer in uniqueCustomers"
          :key="customer"
          :label="customer"
          :value="customer"
        />
      </el-select>

      <el-select
        v-model="selectedContent"
        placeholder="Select Content"
        :disabled="!selectedCustomer"
      >
        <el-option
          v-for="content in uniqueContents"
          :key="content"
          :label="content"
          :value="content"
        />
      </el-select>

      <el-select
        v-model="selectedLteNrWifi"
        placeholder="Select LTE/NR/Wifi"
        :disabled="!selectedCustomer"
      >
        <el-option
          v-for="lte in uniqueLteNrWifi"
          :key="lte"
          :label="lte"
          :value="lte"
        />
      </el-select>

      <!-- <el-button @click="searchData">Search</el-button> -->
    </div>
    <!-- Result Table -->
    <el-table
      :data="filteredData"
      stripe
      border
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <el-table-column prop="customer" label="Customer" align="center" />
      <el-table-column label="내용" align="center" width="200px">
        <template #default="scope">
          <div v-html="formatCategory(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="testType" label="Signal" align="center" />
      <el-table-column prop="signal_type" label="Signal Info" align="center" />
      <el-table-column prop="temperature" label="Temp" align="center" />
      <el-table-column prop="time" label="Time" align="center" />
      <el-table-column prop="vswr" label="VSWR" align="center" />
      <el-table-column label="Input Power" align="center" >
        <template #default="scope">
          <div v-html="formatInputPower(scope.row)" />
        </template>
      </el-table-column>

      <el-table-column prop="pcl" label="PCL" align="center" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { TableData, tableData } from "./PdtRulesDb"; // interface와 tableData를 외부 파일에서 불러옴

// 선택한 필터 값
const selectedCustomer = ref<string | null>(null);
const selectedContent = ref<string | null>(null);
const selectedLteNrWifi = ref<string | null>(null);
const loading = ref(false);

// 고유한 customer, content, lteNrWifi 목록 생성
const uniqueCustomers = computed(() => {
  const customers = [...new Set(tableData.value.map((item) => item.customer))];
  return ["모두 보기", ...customers]; // "모두 보기" 옵션 추가
});
const uniqueContents = computed(() => {
  return [
    ...new Set(
      tableData.value
        .filter(
          (item) =>
            !selectedCustomer.value ||
            selectedCustomer.value === "모두 보기" ||
            item.customer === selectedCustomer.value
        )
        .map((item) => item.category)
    ),
  ];
});
const uniqueLteNrWifi = computed(() => {
  return [
    ...new Set(
      tableData.value
        .filter(
          (item) =>
            !selectedCustomer.value ||
            selectedCustomer.value === "모두 보기" ||
            item.customer === selectedCustomer.value
        )
        .map((item) => item.signal_type)
    ),
  ];
});

// Category에서 "Level 1", "Level 2" 뒤에 줄 바꿈 추가하는 메서드
const formatCategory = (row) => {
  return row.category.replace(/(Level \d+)/, "$1<br>");
};

// Input Power에서 "," 뒤에 줄 바꿈 추가하는 메서드
const formatInputPower = (row) => {
  return row.input_Power.replace(/, /g, ",<br>");
};

// Customer 값이 변경될 때 Content와 LteNrWifi 값을 초기화
watch(selectedCustomer, () => {
  selectedContent.value = null;
  selectedLteNrWifi.value = null;
});

// 필터링된 데이터
const filteredData = computed(() => {
  return tableData.value.filter((item) => {
    return (
      (!selectedCustomer.value ||
        selectedCustomer.value === "모두 보기" ||
        item.customer === selectedCustomer.value) &&
      (!selectedContent.value || item.category === selectedContent.value) &&
      (!selectedLteNrWifi.value || item.signal_type === selectedLteNrWifi.value)
    );
  });
});

// 테이블 헤더 스타일 설정
const headerCellStyle = () => {
  return {
    backgroundColor: "#f5f7fa",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
  };
};

// 테이블 셀 스타일 설정
const cellStyle = () => {
  return {
    textAlign: "center",
    padding: "10px 5px",
  };
};
</script>

<style scoped>
.filter-section {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
  padding: 15px;
  display: flex;
  gap: 15px;
  border-bottom: 2px solid #ddd;
}

.el-select,
.el-button {
  width: 200px;
}

.el-button {
  min-width: 100px;
}
</style>
