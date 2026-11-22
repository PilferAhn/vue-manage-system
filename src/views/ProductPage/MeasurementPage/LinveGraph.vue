<template>
  <div class="chart-container">
    <!-- 마우스로 영역을 드래그하면 그 영역으로 확대, 더블클릭하면 처음 범위로 -->
    <canvas ref="chartCanvas" @dblclick="onDblClick"></canvas>
    <div class="zoom-hint">드래그: 영역 확대 · Ctrl+휠: 확대/축소 · Shift+드래그: 이동 · 더블클릭: 원래대로</div>

    <div class="controls">
      <div class="input-group">
        <label class="input-label">Scale 초기화:</label>
        <button class="input-button" @click="resetScale">Reset Scale</button>
      </div>
      <div class="input-group">
        <label class="input-label">Spec 숨기기:</label>
        <button class="input-button" @click="toggleCustomPlugin" disabled>
          비활성화
        </button>
      </div>
    </div>

    <div class="controls">
      <div class="input-group">
        <label class="input-label">X축 최소값:</label>
        <input
          type="number"
          class="input-field"
          v-model.number="minXValue"
          @change="onXInput"
        />
      </div>

      <div class="input-group">
        <label class="input-label">X축 최대값:</label>
        <input
          type="number"
          class="input-field"
          v-model.number="maxXValue"
          @change="onXInput"
        />
      </div>
    </div>

    <div class="controls">
      <div class="input-group">
        <label class="input-label">Y축 최소값:</label>
        <input
          type="number"
          id="minYValue"
          class="input-field"
          v-model.number="minYValue"
          @change="updateChart"
        />
      </div>

      <div class="input-group">
        <label class="input-label">Y축 최대값:</label>
        <input
          type="number"
          id="maxYValue"
          class="input-field"
          v-model.number="maxYValue"
          @change="updateChart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { customPlugin, getSpecPoint, drawLineGraph } from "./LinveGraph";

const props = defineProps({
  chartData: Array,
  chartTitle: String,
  yAxisName: String,
  xAxisName: String,
  reverseY: Boolean, // x축 반전을 위한 새 prop
  systemBandInfo: Array,
  targetFreq: Array,
  uuid: String,
});



const applicationUuid = ref(props.uuid)
const DEFAULT_MIN_Y = -5;
const DEFAULT_MAX_Y = 0;
const minYValue = ref(DEFAULT_MIN_Y); // y축 최소값
const maxYValue = ref(DEFAULT_MAX_Y); // y축 최대값

// x축 기본 범위는 Chart.js 자동 범위(undefined) 사용.
// Chart.js 는 Y축 범위(-5~0) 안에 들어오는 점만으로 X 범위를 잡으므로 통과대역 근처가 보임
// (데이터 전체 범위를 넣으면 ENA 처럼 50~6000MHz 를 다 측정한 데이터는 전 구간이 보여 그래프가 납작해짐).
// 그려진 뒤 실제 X 범위를 입력칸에 표시한다.
const minXValue = ref(undefined);
const maxXValue = ref(undefined);
// X 를 직접 입력하거나 드래그 확대하기 전까지는 자동 (Y 범위를 바꾸면 X 도 원래처럼 따라 바뀜)
let xAuto = true;
const onXInput = () => {
  xAuto = false;
  updateChart();
};
const syncXInputsFromChart = () => {
  if (!myChart) return;
  minXValue.value = round(myChart.scales.x.min, 1);
  maxXValue.value = round(myChart.scales.x.max, 1);
};

// 드래그로 확대한 범위를 입력칸에 반영 (보기 좋게 반올림)
const round = (v, digits) => (Number.isFinite(v) ? Number(v.toFixed(digits)) : v);
const syncInputsFromChart = ({ chart }) => {
  xAuto = false;
  minXValue.value = round(chart.scales.x.min, 1);
  maxXValue.value = round(chart.scales.x.max, 1);
  minYValue.value = round(chart.scales.y.min, 2);
  maxYValue.value = round(chart.scales.y.max, 2);
};
// 입력칸이 비어 있으면(undefined/NaN) 자동 범위
const axisValue = (v) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
// Spec 계산 결과 (데이터가 바뀌면 다시 계산).
// getSpecPoint 는 넘겨받은 배열에 -3dB 지점을 끼워 넣으므로 원본이 아닌 복사본을 넘긴다
// (원본을 넘기면 같은 데이터를 쓰는 다른 그래프/다시 계산할 때 점이 중복으로 들어감).
let specInfoList = [];
let specDataList = [];
const buildSpec = () => {
  specInfoList = [];
  specDataList = [];
  (props.chartData || []).forEach((dataset, index) => {
    const copy = { ...dataset, data: [...(dataset.data || [])] };
    const targetFreq = props.targetFreq?.[index];
    const specInfo = getSpecPoint(copy, targetFreq);
    specInfo["lineColor"] = dataset.backgroundColor;
    specInfo["targetFreq"] = targetFreq;
    specInfoList.push(specInfo);
    specDataList.push(copy.data);
  });
};

let customPluginEnabled = ref(true);
const buttonLabel = ref("비활성화"); // 버튼 레이블을 위한 ref

// Spec 선 플러그인은 전역 등록하지 않고 그래프마다 따로 붙인다.
// (Chart.register 는 같은 id 를 두 번째부터 무시하므로, 전역 등록하면 모든 그래프가
//  브라우저를 연 뒤 처음 그린 그래프의 Spec 값으로 선을 그리는 문제가 있었음)
Chart.register(...registerables, zoomPlugin);

const chartCanvas = ref(null);
let myChart = null;

const drawChart = () => {
  if (myChart) {
    myChart.destroy();
  }
  buildSpec();
  const startX = Number(props.systemBandInfo?.[0]);
  const endX = Number(props.systemBandInfo?.[1]);
  const specPlugin = customPlugin(startX, endX, specInfoList);

  const datasets = props.chartData.map((dataset, index) => {
    // -3dB 지점이 끼워진 복사본 (rightIndex/leftIndex 가 이 배열 기준)
    const data = specDataList[index];
    const lastIndex = data.length - 1;

    const specInfo = specInfoList[index];

    const indexList = [specInfo["rightIndex"], specInfo["leftIndex"]];

    return {
      label: dataset.label,
      data: data,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.backgroundColor,
      borderWidth: 2,
      fill: false,
      tension: 0,
      pointRadius: data.map((_, index) =>
        indexList.includes(index) ? 7 : 0.5
      ),
      pointBackgroundColor: data.map((_, index) =>
        index === lastIndex ? "black" : dataset.backgroundColor
      ),
      pointBorderColor: data.map((_, index) =>
        indexList.includes(index) ? "black" : dataset.backgroundColor
      ),
      pointBorderWidth: data.map((_, index) =>
        indexList.includes(index) ? 3 : 0.5
      ),
      pointStyle: data.map((_, index) =>
        indexList.includes(index) ? "crossRot" : "circle"
      ),
    };
  });

  myChart = new Chart(chartCanvas.value, {
    type: "line",
    plugins: customPluginEnabled.value ? [specPlugin] : [],
    data: {
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          min: xAuto ? undefined : axisValue(minXValue.value),
          max: xAuto ? undefined : axisValue(maxXValue.value),
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
          min: minYValue.value, // Use minYValue ref
          max: maxYValue.value, // Use maxYValue ref
          title: {
            display: true,
            text: props.yAxisName,
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#000",
          },
        },
      },

      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        // 마우스 드래그: 영역 확대 / Ctrl+휠: 확대·축소 / Shift+드래그: 이동
        // (휠만 쓰면 페이지 스크롤과 겹치므로 Ctrl 을 누를 때만)
        zoom: {
          pan: {
            enabled: true,
            mode: "xy",
            modifierKey: "shift",
            onPanComplete: syncInputsFromChart,
          },
          zoom: {
            wheel: {
              enabled: true,
              modifierKey: "ctrl",
              speed: 0.1,
            },
            drag: {
              enabled: true,
              backgroundColor: "rgba(64, 158, 255, 0.15)",
              borderColor: "#409eff",
              borderWidth: 1,
              threshold: 5, // 5px 미만으로 끌면 확대하지 않음 (단순 클릭 무시)
            },
            mode: "xy",
            onZoomComplete: syncInputsFromChart,
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
          labels: {
                    // PDT-*, ENA-* 라벨이 있으면 범례를 2개(PDT, ENA)로 묶어서 생성
                    generateLabels: (chart) => {
                      const ds = chart.data?.datasets || [];
                      const isGrouped = ds.some(d =>
                                                  typeof d.label === "string" &&
                                                  (d.label.startsWith("PDT-") || d.label.startsWith("ENA-"))
                                                );
                      if (!isGrouped) {
                      // 일반 차트는 기존 동작 유지
                      return Chart.defaults.plugins.legend.labels.generateLabels(chart);
                      }

                      const pdtIdx = ds.findIndex(d => (d.label || "").startsWith("PDT-"));
                      const enaIdx = ds.findIndex(d => (d.label || "").startsWith("ENA-"));
                      const items = [];

                      if (pdtIdx !== -1) {
                        const meta = chart.getDatasetMeta(pdtIdx);
                        items.push({
                          text: "PDT",
                          fillStyle: ds[pdtIdx].borderColor,
                          strokeStyle: ds[pdtIdx].borderColor,
                          lineWidth: 2,
                          hidden: meta.hidden === true,
                          datasetIndex: pdtIdx, // onClick에서 기준이 될 대표 인덱스
                        });
                      }

                      if (enaIdx !== -1) {
                        const meta = chart.getDatasetMeta(enaIdx);
                        items.push({
                          text: "ENA",
                          fillStyle: ds[enaIdx].borderColor,
                          strokeStyle: ds[enaIdx].borderColor,
                          lineWidth: 2,
                          hidden: meta.hidden === true,
                          datasetIndex: enaIdx,
                        });
                      }
                      return items;
                    },
                  },
          // 범례 클릭 시 해당 그룹(PDT-*, ENA-*) 전체 show/hide
          onClick: (evt, legendItem, legend) => {
            const chart = legend.chart;
            const ds = chart.data?.datasets || [];
            const repIdx = legendItem.datasetIndex;
            const repLabel = (ds[repIdx]?.label || "");

            // 일반 그래프(SPL1, SPL2 …): 누른 SPL 하나만 켜고 끄기
            // (예전에는 PDT/ENA 묶음 처리만 있어서 SPL 을 눌러도 아무 반응이 없었음)
            if (!repLabel.startsWith("PDT-") && !repLabel.startsWith("ENA-")) {
              chart.setDatasetVisibility(repIdx, !chart.isDatasetVisible(repIdx));
              chart.update();
              return;
            }

            const prefix = repLabel.startsWith("PDT-") ? "PDT-" : "ENA-";
          
            // 같은 prefix 가진 모든 dataset 메타 수집
            const metas = ds
              .map((d, i) => ({ i, label: d.label || "" }))
              .filter(x => x.label.startsWith(prefix))
              .map(x => chart.getDatasetMeta(x.i));
          
            // 하나라도 보이면 -> 전부 숨기기, 전부 숨겨져 있으면 -> 전부 보이기
            const anyVisible = metas.some(m => m.hidden !== true);
            metas.forEach(m => { m.hidden = anyVisible ? true : false; });
          
            chart.update();
          },
              },
      },
    },
  });
};

const updateChart = () => {
  if (myChart) {
    myChart.options.scales.x.min = xAuto ? undefined : axisValue(minXValue.value);
    myChart.options.scales.x.max = xAuto ? undefined : axisValue(maxXValue.value);
    myChart.options.scales.y.min = axisValue(minYValue.value);
    myChart.options.scales.y.max = axisValue(maxYValue.value);
    myChart.update();
    if (xAuto) syncXInputsFromChart();
  }
};

// 처음 열었을 때 범위로 (X: 자동, Y: -5 ~ 0)
// 더블클릭 초기화는 그래프 영역 안에서만 (범례 SPL 을 빠르게 두 번 눌러 켜고 끌 때 확대가 풀리지 않도록)
const onDblClick = (e) => {
  const area = myChart?.chartArea;
  if (!area) return;
  const x = e.offsetX;
  const y = e.offsetY;
  if (x >= area.left && x <= area.right && y >= area.top && y <= area.bottom) resetScale();
};
const resetScale = () => {
  xAuto = true;
  minYValue.value = DEFAULT_MIN_Y;
  maxYValue.value = DEFAULT_MAX_Y;
  updateChart();
};

const toggleCustomPlugin = () => {
  customPluginEnabled.value = !customPluginEnabled.value;
  drawChart(); // Redraw chart to apply the plugin change
};

onMounted(() => {
  drawChart();
  syncXInputsFromChart();
});

// 다른 의뢰서로 바뀌는 등 데이터/Spec 정보가 바뀌면 다시 계산해서 그림 (범위는 자동으로 초기화)
// (targetFreq/systemBandInfo 는 화면을 다시 그릴 때마다 새 배열로 넘어올 수 있어 값(문자열)으로 비교)
watch(
  [
    () => props.chartData,
    () => (props.systemBandInfo || []).join(","),
    () => (props.targetFreq || []).join(","),
  ],
  () => {
    if (!chartCanvas.value) return;
    xAuto = true;
    minYValue.value = DEFAULT_MIN_Y;
    maxYValue.value = DEFAULT_MAX_Y;
    drawChart();
    syncXInputsFromChart();
  }
);
</script>

<style scoped>
@import "../../../assets/css/LinveGraph.css";
.zoom-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
</style>
