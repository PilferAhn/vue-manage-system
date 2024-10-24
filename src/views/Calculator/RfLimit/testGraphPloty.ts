import Plotly from "plotly.js-dist";
import axios from "axios";
import { Ref } from "vue";
import { SparaData } from "./test"; // 적절한 import

// 차트 그리기 함수
export function drawChart(
  chartDiv: HTMLDivElement | null,
  sParaData: SparaData[],
  inputIlLevel: Ref<number>,
  inputStart: Ref<number>,
  inputStop: Ref<number>
) {
  if (!chartDiv || sParaData.length === 0) return;

  // Plotly에서 사용할 데이터를 변환
  const traces = sParaData.map((data) => ({
    x: data.coordinates.map((coord) => coord.x), // x값 (Frequency)
    y: data.coordinates.map((coord) => coord.y), // y값 (IL Level)
    mode: "lines",
    name: data.name,
    line: { color: data.line_color || "blue", width: 1 },
  }));

  const layout = {
    title: "Frequency vs IL Level",
    xaxis: {
      title: "Frequency (X Axis)",
      range: [inputStart.value, inputStop.value], // x축 범위 설정
    },
    yaxis: {
      title: "IL Level (Y Axis in dB)",
      range: [inputIlLevel.value, null], // y축 최소값 설정
    },
    margin: { t: 50, b: 50, l: 50, r: 50 },
  };

  // Plotly를 사용해 차트를 그리기
  Plotly.react(chartDiv, traces, layout);
}

// 적용 버튼 클릭 시 그래프 업데이트
export function applyChanges(
  tempIlLevel: Ref<number>,
  tempStart: Ref<number>,
  tempStop: Ref<number>,
  inputIlLevel: Ref<number>,
  inputStart: Ref<number>,
  inputStop: Ref<number>,
  drawChart: () => void
) {
  inputIlLevel.value = tempIlLevel.value;
  inputStart.value = tempStart.value;
  inputStop.value = tempStop.value;
  drawChart(); // 변경된 값을 기반으로 차트를 다시 그리기
}

// 계산 버튼 클릭 시 데이터 전송
export async function sendCalculationData(
  sParaData: SparaData[],
  separateIlLevel: number,
  separateStart: number,
  separateStop: number,
  tempIlLevel: number,
  tempStart: number,
  tempStop: number
) {
  try {
    const dataToSend = {
      coordinates: sParaData.map((data) => data.coordinates), // 좌표 정보
      separateIlLevel,
      separateStart,
      separateStop,
      tempIlLevel,
      tempStart,
      tempStop,
    };

    // const response = await axios.post("/api/calculate", dataToSend); // 서버 API에 전송
    // console.log("계산 결과:", response.data);

    console.log(dataToSend.va)

  } catch (error) {
    console.error("계산 요청 중 오류 발생:", error);
  }
}
