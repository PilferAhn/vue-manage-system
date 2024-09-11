<template>
    <div class="container">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :span-method="spanMethod"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="customer"
          label="거래선"
          min-width="120"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="내용"
          min-width="120"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column
          prop="lteNrWifi"
          label="Signal Type"
          min-width="150"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column label="Spec." align="center">
          <el-table-column
            prop="signal"
            label="Signal"
            min-width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="temp"
            label="Temp.(℃)"
            min-width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="timeHour"
            label="Time(Hour)"
            min-width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="vswr" label="VSWR" min-width="100" align="center"></el-table-column>
          <el-table-column
            prop="inputPower"
            label="Input Power(dBm)"
            min-width="150"
            align="center"
          ></el-table-column>
        </el-table-column>
        <el-table-column
          prop="pcl"
          label="PCL (Power Control Level)"
          min-width="200"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  import { tableData as importedTableData } from "./PdtRules";
  
  // tableData를 반응형으로 관리
  const tableData = ref(importedTableData || []);
  
  // spanMethod 그대로 유지
  const spanMethod = ({ row, column, rowIndex }) => {
    if (column.property === "customer" || column.property === "content") {
      let count = 1;
  
      for (let i = rowIndex + 1; i < tableData.value.length; i++) {
        if (
          tableData.value[i].customer === row.customer &&
          tableData.value[i].content === row.content
        ) {
          count++;
        } else {
          break;
        }
      }
  
      if (
        rowIndex === 0 ||
        tableData.value[rowIndex - 1].customer !== row.customer ||
        tableData.value[rowIndex - 1].content !== row.content
      ) {
        return {
          rowspan: count,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    }
    return {
      rowspan: 1,
      colspan: 1,
    };
  };
  
  let lastCustomer = "";
let colorIndex = 0;

const colors = ["row-color-1", "row-color-2", "row-color-3", "row-color-4"];

const tableRowClassName = ({ row, rowIndex }) => {
  // 반응형 대신 단순한 변수 사용
  if (row.customer !== lastCustomer) {
    colorIndex = (colorIndex + 1) % colors.length;
    lastCustomer = row.customer;
  }
  return colors[colorIndex];
};
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
  }
  
  .el-table {
    width: 100%;
  }
  
  /* Background colors with stronger contrast */
  .row-color-1 {
    background-color: #ffcccc;
  }
  
  .row-color-2 {
    background-color: #ccffcc;
  }
  
  .row-color-3 {
    background-color: #ccccff;
  }
  
  .row-color-4 {
    background-color: #ffffcc;
  }
  
  /* Center text inside the table cells */
  .el-table .cell {
    text-align: center;
  }
  </style>
  