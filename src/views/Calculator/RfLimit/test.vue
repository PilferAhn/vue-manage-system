<template>
    <el-card>
      <el-row>
        <el-col :span="24">
          <div>
            <el-form :model="axisLimits">
              <el-form-item label="X-axis Min">
                <el-input v-model.number="axisLimits.xMin" placeholder="Enter X Min"></el-input>
              </el-form-item>
              <el-form-item label="X-axis Max">
                <el-input v-model.number="axisLimits.xMax" placeholder="Enter X Max"></el-input>
              </el-form-item>
              <el-form-item label="Y-axis Min">
                <el-input v-model.number="axisLimits.yMin" placeholder="Enter Y Min"></el-input>
              </el-form-item>
              <el-form-item label="Y-axis Max">
                <el-input v-model.number="axisLimits.yMax" placeholder="Enter Y Max"></el-input>
              </el-form-item>
              <el-button type="primary" @click="updateGraph">Update Graph</el-button>
            </el-form>
          </div>
          <div ref="chart" style="height: 600px;"></div> <!-- 그래프 높이를 600px로 늘림 -->
        </el-col>
      </el-row>
    </el-card>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, reactive } from 'vue';
  import Plotly from 'plotly.js-dist';
  import testData from './test.ts'; // test.ts에서 데이터를 가져온다고 가정
  
  const chart = ref(null);
  
  // 축의 최대 및 최소 값을 사용자가 입력할 수 있도록 하는 reactive 객체
  const axisLimits = reactive({
    xMin: 2300,
    xMax: 2550,
    yMin: -20,
    yMax: 0,
  });
  
  // 그래프 생성 함수
  const createGraph = () => {
    const traces = testData.map((dataSet, index) => {
      const xData = dataSet.map(item => item.x);
      const yData = dataSet.map(item => item.y);
  
      return {
        x: xData,
        y: yData,
        mode: 'lines+markers',
        marker: {
          color: `hsl(${index * 60}, 100%, 50%)`,
          size: 1, // 마커 크기를 1로 수정
        },
        line: {
          shape: 'spline',
        },
        name: `Graph ${index + 1}`,
      };
    });
  
    // 각 그래프의 Y축에서 최대값 찾기
    const annotations = testData.map((dataSet, index) => {
      const maxY = Math.max(...dataSet.map(item => item.y)); // 해당 그래프의 y 값 중에서 최대값
      const maxYDataPoint = dataSet.find(item => item.y === maxY); // 최대 y 값을 가진 데이터 포인트
  
      return {
        x: maxYDataPoint.x,
        y: maxY,
        xref: 'x',
        yref: 'y',
        text: `Graph ${index + 1} Max Y: ${maxY}`,
        showarrow: true,
        arrowhead: 6,
        ax: 0,
        ay: -40,
      };
    });
  
    const layout = {
      title: 'Frequency Graph',
      xaxis: {
        title: 'Frequency (Hz)',
        range: axisLimits.xMin !== null && axisLimits.xMax !== null ? [axisLimits.xMin, axisLimits.xMax] : null,
      },
      yaxis: {
        title: 'Amplitude',
        range: axisLimits.yMin !== null && axisLimits.yMax !== null ? [axisLimits.yMin, axisLimits.yMax] : null,
      },
      showlegend: true,
      annotations: annotations, // 각각의 그래프에서 최대값 마커 추가
      shapes: [
        {
          type: 'line',
          x0: 2400,
          x1: 2475,
          y0: -5,
          y1: -5,
          line: {
            color: 'red',
            width: 2,
            dash: 'dashdot', // 선의 스타일 (실선, 점선 등 선택 가능)
          },
        },
      ], // y = -5에서 x축 2400 ~ 2475까지 수평선 추가
    };
  
    const config = {
      responsive: true,
    };
  
    Plotly.newPlot(chart.value, traces, layout, config);
  };
  
  // 사용자가 입력한 축 범위를 반영하여 그래프 업데이트
  const updateGraph = () => {
    createGraph();
  };
  
  onMounted(() => {
    createGraph();
  });
  </script>
  
  <style scoped>
  .chart {
    width: 100%;
    height: 600px; /* 그래프 높이를 600px로 수정 */
  }
  </style>
  