<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

// Chart.js에 zoom 플러그인을 등록합니다.
Chart.register(zoomPlugin);

const props = defineProps({
  chartData: Array,
  chartTitle: String,
  yAxisName: String,
  xAxisName : String,
  reverseY: Boolean, // x축 반전을 위한 새 prop  
});


console.log(props.chartData)

const chartCanvas = ref(null);
let myChart = null;

const drawChart = () => {
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      datasets: props.chartData.map((dataset) => {
        const lastIndex = dataset.data.length - 1; // 마지막 인덱스 계산
        return {
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.backgroundColor,
          borderColor: dataset.backgroundColor,
          borderWidth: 2, // 선의 두께를 줄임
          fill: false,
          tension: 0,
          pointRadius: dataset.data.map((_, index) => index === lastIndex ? 1 : 0.5), // 마지막 포인트의 크기를 더 크게 설정
          pointBackgroundColor: dataset.data.map((_, index) => index === lastIndex ? dataset.backgroundColor : dataset.backgroundColor), // 마지막 포인트의 배경 색상 변경
          pointBorderColor: dataset.data.map((_, index) => index === lastIndex ? dataset.backgroundColor : dataset.backgroundColor),
          pointBorderWidth: dataset.data.map((_, index) => index === lastIndex ? 3 : 2), // 마지막 포인트의 테두리 두께를 더 크게 설정
        };
      }),
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          
          title: {
            display: true,
            text: props.xAxisName,
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#000",
          },
        },
        y: {
          reverse: props.reverseY,
          min: -10,
          title: {
            display: true,
            text: props.yAxisName,
            font: {
              size: 16,
              weight: 'bold',
            },
            color: '#000',
          }
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true, // 마우스 휠을 통한 zoom 활성화
            },
            pinch: {
              enabled: true, // 핀치 제스처를 통한 zoom 활성화 (모바일 기기에서 유용)
            },
            mode: 'xy', // x축과 y축 모두에서 zoom을 활성화
          },
          pan: {
            enabled: true, // 드래그를 통한 pan 활성화
            mode: 'xy', // x축과 y축 모두에서 pan을 활성화
          },
        },
        title: {
          display: true,
          text: props.chartTitle,
          font: {
            size: 20,
            weight: "bold",
          },
          color: "#000",
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};


onMounted(drawChart);
watch(() => props.chartData, drawChart, { deep: true });
</script>

<style scoped>
div {
  height: 400px;
}
</style>
