<template>
    <div class="container">
      <!-- 그래프 영역 -->
      <div class="chart-container">
        <h2>Graph Data</h2>
        <div ref="chartDiv" class="chart"></div>
        <!-- Plotly 그래프를 렌더링할 div -->
      </div>
  
      
      <!-- 입력 영역 (그래프 오른쪽) -->
      <div class="input-section">
        <!-- Plotly와 연결된 입력 영역 -->
        <div class="input-area chart-values">
          <h3>Plotly 차트 축 설정</h3>
          <label>
            <span>IL Level (Y-axis min):</span>
            <input type="number" v-model.number="tempIlLevel" />
          </label>
          <label>
            <span>Start (X-axis min):</span>
            <input type="number" v-model.number="tempStart" />
          </label>
          <label>
            <span>Stop (X-axis max):</span>
            <input type="number" v-model.number="tempStop" />
          </label>
          <button @click="applyChangesHandler">적용</button>
        </div>
  
        <!-- 계산에 필요한 값 입력 영역 -->
        <div class="input-area separate-values">
          <h3>계산에 필요한 값 입력</h3>
          <label>
            <span>IL Level:</span>
            <input type="number" v-model.number="separateIlLevel" />
          </label>
          <label>
            <span>Start:</span>
            <input type="number" v-model.number="separateStart" />
          </label>
          <label>
            <span>Stop:</span>
            <input type="number" v-model.number="separateStop" />
          </label>
          <button @click="sendCalculationDataHandler">계산</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, nextTick, PropType } from "vue";
  import { drawChart, applyChanges, sendCalculationData } from "./testGraphPloty"; // 분리된 함수 import
  import { SparaData } from "./test"; // 적절한 import
  
  const separateIlLevel = ref(0);
  const separateStart = ref(0);
  const separateStop = ref(0);
  
  // props 정의
  const props = defineProps({
    sParaData: {
      type: Array as PropType<SparaData[]>, // sParaData는 배열로 전달됨
      required: true,
    },
    ilLevel: {
      type: Number,
      default: -40, // 기본 y축 최소값
    },
    start: {
      type: Number,
      default: 100, // 기본 x축 시작값
    },
    stop: {
      type: Number,
      default: 6000, // 기본 x축 끝값
    },
  });
  
  // 실제로 적용할 값들
  const inputIlLevel = ref(props.ilLevel);
  const inputStart = ref(props.start);
  const inputStop = ref(props.stop);
  
  // 임시 입력 값을 위한 변수
  const tempIlLevel = ref(props.ilLevel);
  const tempStart = ref(props.start);
  const tempStop = ref(props.stop);
  
  const chartDiv = ref<HTMLDivElement | null>(null);
  
  // 적용 버튼 클릭 시 실행하는 핸들러
  function applyChangesHandler() {
    applyChanges(
      tempIlLevel,
      tempStart,
      tempStop,
      inputIlLevel,
      inputStart,
      inputStop,
      () => {
        drawChart(chartDiv.value, props.sParaData, inputIlLevel, inputStart, inputStop);
      }
    );
  }
  
  // 계산 버튼 클릭 시 실행하는 핸들러
  function sendCalculationDataHandler() {
    sendCalculationData(
      props.sParaData,
      separateIlLevel.value,
      separateStart.value,
      separateStop.value,
      tempIlLevel.value,
      tempStart.value,
      tempStop.value
    );
  }
  
  // 컴포넌트가 마운트되었을 때 차트 그리기
  onMounted(async () => {
    await nextTick();
    drawChart(chartDiv.value, props.sParaData, inputIlLevel, inputStart, inputStop);
  });
  </script>
  
  <style src="./testGraph.css" scoped></style>
  