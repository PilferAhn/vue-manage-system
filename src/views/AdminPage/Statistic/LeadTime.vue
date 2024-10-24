<template>
    <div>
      <h2>Measurement Data</h2>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>주간 의뢰 건 수(웨이퍼 매수)</th>
            <th>Leadtime</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>제품(3,4순위)</td>
            <td>52(91)</td>
            <td>0.29일</td>
          </tr>
          <tr>
            <td>일반(1,2순위)</td>
            <td>11(19)</td>
            <td>2.0일</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  // No special logic needed for this simple table.
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table, th, td {
    border: 1px solid black;
  }
  
  th, td {
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>
  