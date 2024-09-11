<template>
    <el-card>
      <el-row>
        <el-col :span="24">
          <div ref="chart" style="height: 400px;"></div>
        </el-col>
      </el-row>
    </el-card>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  import testData from './test.ts'; // test.ts에서 데이터를 가져온다고 가정
  
  const chart = ref(null);
  
  onMounted(() => {
    const chartInstance = echarts.init(chart.value);
  
    const options = {
      title: {
        text: 'XY Data Plot',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        name: 'X',
      },
      yAxis: {
        type: 'value',
        name: 'Y',
      },
      series: [
        {
          name: 'Data',
          type: 'line',
          data: testData.map(item => [item.x, item.y]), // 데이터 형식: [x, y]
        },
      ],
    };
  
    chartInstance.setOption(options);
  });
  </script>
  
  <style scoped>
  /* 차트 크기를 정의합니다. */
  .chart {
    width: 100%;
    height: 400px;
  }
  </style>
  