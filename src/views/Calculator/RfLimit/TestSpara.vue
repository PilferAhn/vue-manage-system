<template>
  <div class="container">
    <el-card>
      <el-row>
        <el-col :span="24">
          <scatter-chart />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ElCard, ElRow, ElCol } from "element-plus";
import { Scatter } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
);

// Function to generate specific pattern data
function generateSpecificData(numPoints) {
  const baseX = 50;
  const stepX = 7.36;
  const baseY = -109.1;
  const incrementY = 2.41;
  const data = [];

  for (let i = 0; i < numPoints; i++) {
    const x = baseX + i * stepX;
    const y = baseY + i * incrementY;
    data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
  }

  return data;
}

const data1 = generateSpecificData(50);
const data2 = generateSpecificData(100);



const chartData = {
  datasets: [
    {
      label: "Dataset 1",
      data: data1,
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      showLine: true, // Scatter Chart에서 선을 표시하도록 설정
      fill: false,
      tension: 0.4,
    },
    {
      label: "Dataset 2",
      data: data2,
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.5)",
      showLine: true, // Scatter Chart에서 선을 표시하도록 설정
      fill: false,
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Scatter Chart with Connected Points",
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Index",
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "S Parameter Value",
      },
    },
  },
};

const ScatterChart = defineComponent({
  name: "ScatterChart",
  components: {
    Scatter,
  },
  setup() {
    return {
      chartData,
      options,
    };
  },
  template: `
      <scatter :data="chartData" :options="options"></scatter>
    `,
});
</script>
