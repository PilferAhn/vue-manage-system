<template>
    <div class="container">
        <schart class="schart" canvasId="line2" :options="chartOptions"></schart>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Schart from 'vue-schart';
  import axios from "../../../utils/request";
  
  interface TestType {
    month_list: string[];
    teg1_list: number[];
    teg2_list: number[];
    tcf_list: number[];
    teg15_list : number[];
  }
  
  const testTypes = ref<TestType>({
    month_list: [],
    teg1_list: [],
    teg2_list: [],
    tcf_list: [],
    teg15_list : []
  });
  
  // 차트 설정
  const chartOptions = ref({});
  
  const fetchData = async () => {
    try {
      const response = await axios.get("wafer/get_wafer_count_by_meas_type");
      testTypes.value = response.data;
      console.log(testTypes.value)
      updateChartOptions();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const updateChartOptions = () => {
    chartOptions.value = {
      type: "line",
      title: {
        text: 'TEG 측정 월간 의뢰 비율 (Wafer 기준)', // 원래의 타이틀을 유지
      },
      bgColor: "#fbfbfb", // 배경색 설정
      labels: testTypes.value.month_list, // 월 데이터를 라벨로 사용
      datasets: [
        {
          label: "TEG1",
          data: testTypes.value.teg1_list,
        },        
        {
          label: "TEG1_5",
          data: testTypes.value.teg15_list,
        },
        {
          label: "TEG2",
          data: testTypes.value.teg2_list,
        },
        {
          label: "TCF",
          data: testTypes.value.tcf_list,
        },
      ],
    };
  };
  
  onMounted(() => {
    fetchData();
  });
  </script>
  
  <style scoped>
  .schart-box {
    display: inline-block;
    margin: 20px;
  }
  .schart {
    width: 550px;
    height: 300px;
  }
  .content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
  }
  </style>