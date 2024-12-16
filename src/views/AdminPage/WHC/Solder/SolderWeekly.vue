<template>
  <div>
    <el-card>
      <!-- <h2>Total Task Summary</h2> -->
      <canvas ref="chartCanvas"></canvas>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import { rawData } from "../../../../utils/Solder/demo-data";
import type { TotalResult } from "./temp";
import { sumTotalData, sortTotalMeasurementTypes } from "./temp";
import type { MeasurementData } from "./temp";

const props = defineProps<{
  chartTitle: string;
  rawData : MeasurementData[]
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  renderChart();
});

// 동적 색상 생성 함수
const generateColors = (count: number) => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count; // 고유한 색상 생성
    colors.push(`hsl(${hue}, 70%, 60%)`); // HSL 형식 색상
  }
  return colors;
};

function renderChart() {
  let totalData: TotalResult[] = sumTotalData(props.rawData);
  totalData = sortTotalMeasurementTypes(totalData);

  const labels = totalData.map((item) => item.measurement_type);
  const data = totalData.map((item) => item.finished_task);
  
  // 동적 색상 생성
  const colors = generateColors(totalData.length);

  if (chartCanvas.value) {
    new Chart(chartCanvas.value, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {            
            data: data,
            backgroundColor: colors, // 동적 색상 적용
            borderColor: colors.map((color) => color.replace("70%", "50%")), // 약간 어두운 색으로 경계선
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: props.chartTitle + "월 합산",
            font: {
              size: 25,
              weight: "bold",
            },
            color: "#333",
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            position: "top",
            display: false, // 범례를 숨기고 색상만 막대에 적용
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "측정 항목",
              font: {
                size: 18,
                weight: "bold",
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "EA(측정 횟수)",
              font: {
                size: 18,
                weight: "bold",
              },
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}
</script>
