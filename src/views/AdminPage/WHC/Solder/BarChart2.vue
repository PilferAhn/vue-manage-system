<template>
    <div>
      <canvas :id="canvasId" style="width: 400px; height: 400px;"></canvas>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, watch, ref, defineProps } from "vue";
  import ChartDataLabels from "chartjs-plugin-datalabels";
  import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";
  
  // Chart.js 모듈 등록
  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);
  Chart.register(ChartDataLabels);
  
  // Props로 데이터를 받음
  const props = defineProps<{
    data: Record<string, number[]>; // { measurement_type: [total_quantity, finished_quantity] }
    title: string;
    y_max : number
  }>();
  
  // Chart 인스턴스
  let chartInstance: Chart<"bar", number[], string> | null = null;
  
  // 고유한 canvas ID 생성
  const canvasId = ref(`barChart-${Math.random().toString(36).substr(2, 9)}`);
  
  // Chart 생성 및 업데이트
  const renderChart = () => {
    const ctx = document.getElementById(canvasId.value) as HTMLCanvasElement;
  
    // canvas가 존재하지 않을 경우 에러 방지
    if (!ctx) {
      console.error("Canvas element not found");
      return;
    }
  
    // 기존 Chart 제거
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  
    // Chart 생성
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(props.data), // X축 레이블
        datasets: [
        //   {
        //     label: "의뢰",
        //     backgroundColor: "rgba(75, 192, 192, 0.6)",
        //     data: Object.values(props.data).map((item) => item[0]), // 총량 데이터
        //   },
          {
            label: "완료",
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            data: Object.values(props.data).map((item) => item[1] || 0), // 완료량 데이터 (기본값 0)
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            anchor: "end",
            align: "top",
            formatter: (value) => value,
            font: {
              size: 12,
            },
          },
          title: {
            display: true,
            text: "WHC 측정 완료 현황 - " + props.title,
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
            max: props.y_max, // Y축의 최대값 고정
          },
        },
      },
    });
  };
  
  // 컴포넌트가 언마운트될 때 Chart 제거
  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });
  
  // 데이터 변경 감지 및 업데이트
  watch(
    () => props.data,
    () => {
      renderChart();
    },
    { deep: true, immediate: true }
  );
  
  // 초기 렌더링
  onMounted(() => {
    renderChart();
  });
  </script>
  