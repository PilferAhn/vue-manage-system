<template>
  <div class="container">
    <div v-if="calculatedSummaries.length == 0">
      <el-empty description="진행중인 측정 의뢰가 없습니다."></el-empty>
    </div>
    <div v-else>
      <el-button v-if="application_status === 'finished'" @click="downloadReport" style="margin-bottom: 20px"
        >리포트 다운로드</el-button
      >

      <div>
        <el-table :data="calculatedSummaries" border style="width: 100%">
          <el-table-column
            prop="sampleNumber"
            label="Sample Number"
            width="180"
          ></el-table-column>

          <el-table-column prop="dbm3" :label="db3Label"></el-table-column>
          <el-table-column
            prop="targetFreq"
            label="Target Freq"
          ></el-table-column>
          <el-table-column label="Δf [MHz]">
            <template #default="scope">
              {{ (scope.row.dbm3 - scope.row.targetFreq).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="p1Input" label="P1 Input"></el-table-column>
          <el-table-column prop="p2Input" label="P2 Input"></el-table-column>
          <el-table-column prop="p1Output" label="P1 Output"></el-table-column>

          <el-table-column prop="rf1" label="RF1 (MHz)"></el-table-column>
          <el-table-column prop="lf1" label="LF1 (MHz)"></el-table-column>
          <el-table-column prop="rf2" label="RF2 (MHz)"></el-table-column>
          <el-table-column prop="lf2" label="LF2 (MHz)"></el-table-column>
        </el-table>
      </div>

      <!-- 두 번째 컬럼의 내용 -->
      <!-- <div class="form-box"></div> -->
      <div class="charts-container">
        <div class="charts-row">
          <div class="form-box">
            <LinveGraph
              :chartData="chartS21"
              chartTitle="PDT"
              :reverseY="false"
              xAxisName = "Frequancy"
              yAxisName="dBm"                        
            />
          </div>
          <div class="form-box">          
            <LinveGraph
              :chartData="chartSPara"
              chartTitle="SPara"
              :reverseY="false"
              xAxisName = "Frequancy"
              yAxisName="dBm"                        
            />
          </div>
        </div>
        <div class="charts-row">
          <div class="form-box">
            <ScatterChart
              :chartData="chartDataRfLfDifference"
              chartTitle="Input vs Bandwidth"
              :reverseY="true"
              xAxisName = "Input Power(dBm)"
              yAxisName="BandWidth"
            />
          </div>
          <div class="form-box">
            <ScatterChart
              :chartData="chartDataPout"
              chartTitle="Input vs Output"
              :reverseY="false"
              xAxisName = "Input Power(dBm)"
              yAxisName="Power(dBm)"
            />
          </div>
        </div>
        <div class="charts-row">
          <div class="form-box-wide">
            <ScatterChart
              :chartData="chartDataLf1Mhz"
              chartTitle="Input vs LF [MHz] @ -10dB"
              :reverseY="false"
              xAxisName = "Input Power(dBm)"
              yAxisName="LF [Mhz] @-10dB"
            />
          </div>
          <div class="form-box-wide">
            <ScatterChart
              :chartData="chartDataRf1Mhz"
              chartTitle="Input vs RF [MHz] @ -10dB"
              :reverseY="true"
              xAxisName = "Input Power(dBm)"
              yAxisName="RF [MHz] @-10dB"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch} from "vue";
import { CalcuatedSummary } from "../../../utils/types";
import {colorList} from "../../../utils/utility"
import ScatterChart from "./ScatterChart.vue";
import LinveGraph from "./LinveGraph.vue";
import axios from "axios";

const props = defineProps({
  uuid: String,
  temperature: String,
});

const application_status = ref("")

const db3Label = "𝒇 -3dB @" + props.temperature;

const calculatedSummaries = ref<CalcuatedSummary[]>([]);

const getSummaryData = async (uuid: string) => {
  try {
    const response = await axios.get(
      "/pdt_measurement/get_summary_data/" + uuid
    );


    application_status.value = response.data.status

    calculatedSummaries.value = response.data.samples.map((item: any) => ({
      sampleNumber: item.sample_number,
      dbm3: item.dbm_3,
      p1Input: item.p1_input,
      p2Input: item.p2_input,
      p1Output: item.p1_output,
      targetFreq: item.target_frequancy,

      p1_index : item.p1_index,
      p2_index : item.p2_index,

      lf1: item.lf1,
      lf2: item.lf2,
      rf1: item.rf1,
      rf2: item.rf2,

      pIn: item.p_in.split("\t").map(Number),
      pOut: item.p_out.split("\t").map(Number),
      rf1Mhz: item.rf1_mhz.split("\t").map(Number),
      lf1Mhz: item.lf1_mhz.split("\t").map(Number),

      
      s21Freq : item.s21_freq.split("\t").map(Number),
      s21dBm : item.s21_dbm.split("\t").map(Number),

      sParaDbm : item.s_para_dbm.split(",").map(Number),
      sParaFreq : item.s_para_freq.split(",").map(Number),

    }));

    calculateStatistics();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// 컴포넌트가 마운트될 때 데이터를 불러옵니다.
// UUID 변경 감시 설정
watch(() => props.uuid, (newUuid, oldUuid) => {
  getSummaryData(newUuid);
}, { immediate: true });

function createSParaChartData(xValueKey, yValueKey, step = 3) {
  console.log(xValueKey, yValueKey)
  const colors = colorList;
  return computed(() => {
    return calculatedSummaries.value.map((summary, index) => {
      const data = summary.sParaDbm.reduce((acc, _, idx) => {
        // 현재 인덱스가 step 배수인 경우에만 데이터 포인트를 생성
        if (idx % step === 0) {
          acc.push({
            x: summary[xValueKey][idx],
            y: summary[yValueKey][idx]
          });
        }
        return acc;
      }, []);

      return {
        label: summary.sampleNumber,
        data,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
      };
    });
  });
}

function createS21ChartData(xValueKey, yValueKey, step = 10) {
  const colors = colorList;
  return computed(() => {
    return calculatedSummaries.value.map((summary, index) => {
      const data = summary.s21Freq.reduce((acc, _, idx) => {
        // 현재 인덱스가 step 배수인 경우에만 데이터 포인트를 생성
        if (idx % step === 0) {
          acc.push({
            x: summary[xValueKey][idx],
            y: summary[yValueKey][idx]
          });
        }
        return acc;
      }, []);

      return {
        label: summary.sampleNumber,
        data,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
      };
    });
  });
}





// `chartData` 생성을 위한 함수를 반환하는 함수
function createChartDataFunction(yValueKey, maxIndexKey) {
  const colors = colorList
  return computed(() => {
    return calculatedSummaries.value.map((summary, index) => {
      // maxIndex를 현재 summary 객체에서 maxIndexKey에 해당하는 값으로 설정
      const maxIndex = summary[maxIndexKey];
      
      // 데이터 배열을 생성하기 전에, 현재 인덱스가 maxIndex 이하인지 확인
      if (index <= maxIndex) {
        return {
          label: summary.sampleNumber,
          data: summary.pIn.map((pIn, idx) => {
            // 여기서도 데이터 포인트의 인덱스가 maxIndex 이하인지 확인할 수 있음
            if (idx <= maxIndex) {
              return {
                x: pIn,
                y: summary[yValueKey][idx],
              };
            }
            // maxIndex를 초과하는 인덱스에 대해서는 데이터를 반환하지 않음
            return null;
          }).filter(p => p !== null), // null 값 제거
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
        };
      }
      // maxIndex를 초과하는 summary에 대해서는 빈 데이터 객체를 반환할 수 있음
      return null;
    }).filter(summary => summary !== null); // null 값 제거
  });
}

// rf1Mhz와 lf1Mhz의 차이에 대한 차트 데이터를 생성하는 함수
function createChartDataForRfLfDifference(maxIndexKey) {
  const colors = colorList
  return computed(() => {
    return calculatedSummaries.value.map((summary, index) => {
      // maxIndex를 현재 summary 객체에서 maxIndexKey에 해당하는 값으로 설정
      const maxIndex = summary[maxIndexKey];
      
      // 데이터 배열을 생성하기 전에, 현재 인덱스가 maxIndex 이하인지 확인
      if (index <= maxIndex) {
        return {
          label: summary.sampleNumber,
          data: summary.pIn.map((pIn, idx) => {
            // 여기서도 데이터 포인트의 인덱스가 maxIndex 이하인지 확인할 수 있음
            if (idx <= maxIndex) {
              return {
                x: pIn,
                y: summary.rf1Mhz[idx] - summary.lf1Mhz[idx], // rf1Mhz와 lf1Mhz의 차이 계산
              };
            }
            // maxIndex를 초과하는 인덱스에 대해서는 데이터를 반환하지 않음
            return null;
          }).filter(p => p !== null), // null 값 제거
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
        };
      }
      // maxIndex를 초과하는 summary에 대해서는 빈 데이터 객체를 반환할 수 있음
      return null;
    }).filter(summary => summary !== null); // null 값 제거
  });
}




// 각 데이터 타입별로 차트 데이터 생성
const chartSPara = createSParaChartData("sParaFreq", "sParaDbm");
const chartS21 = createS21ChartData("s21Freq", "s21dBm");
const chartDataPout = createChartDataFunction("pOut", "p2_index");
const chartDataRf1Mhz = createChartDataFunction("rf1Mhz", "p1_index");
const chartDataLf1Mhz = createChartDataFunction("lf1Mhz", "p1_index");
// 이 함수를 사용하여 차트 데이터를 생성
const chartDataRfLfDifference = createChartDataForRfLfDifference("p1_index");

// 계산 로직을 별도의 함수로 정의
const calculateStatistics = () => {
  if (calculatedSummaries.value.length > 0) {
    const p1Inputs = calculatedSummaries.value.map((item) =>
      parseFloat(item.p1Input)
    );
    const p1InputMean =
      p1Inputs.reduce((acc, val) => acc + val, 0) / p1Inputs.length;
    const p1InputVariance =
      p1Inputs.reduce((acc, val) => acc + (val - p1InputMean) ** 2, 0) /
      p1Inputs.length;
    const p1InputStdDev = Math.sqrt(p1InputVariance);
    const p2Inpu1threeSigma = p1InputMean - p1InputStdDev * 3;

    const p2Inputs = calculatedSummaries.value.map((item) =>
      parseFloat(item.p2Input)
    );
    const p2InputMean =
      p2Inputs.reduce((acc, val) => acc + val, 0) / p2Inputs.length;
    const p2InputVariance =
      p2Inputs.reduce((acc, val) => acc + (val - p2InputMean) ** 2, 0) /
      p2Inputs.length;
    const p2InputStdDev = Math.sqrt(p2InputVariance);
    const p2InputthreeSigma = p2InputMean - p2InputStdDev * 3;

    const p1Outputs = calculatedSummaries.value.map((item) =>
      parseFloat(item.p1Output)
    );
    const p1OutputMean =
      p1Outputs.reduce((acc, val) => acc + val, 0) / p1Outputs.length;
    const p1OutputVariance =
      p1Outputs.reduce((acc, val) => acc + (val - p1OutputMean) ** 2, 0) /
      p1Outputs.length;
    const p1OutputStdDev = Math.sqrt(p1OutputVariance);
    const p1OutthreeSigma = p1OutputMean - p1OutputStdDev * 3;
  }
};

const downloadReport = async () => {
  if (confirm("결과파일을 다운로드 하시겠습니까?")) {
    try {
      const response = await axios.get(
        `pdt_application/send_pdt_report/${props.uuid}`,
        {
          responseType: "blob", // Blob 형태로 응답 받기
        }
      );

      // Blob 데이터로부터 다운로드 URL 생성
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Content-Disposition 헤더에서 파일 이름 추출
      let filename = "default-filename.xlsx"; // 기본 파일 이름 설정
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameRegex = /filename\*?=['"]?UTF-8''([^;'\"]*)['"]?;?/i;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches && matches[1]) {
          // UTF-8 인코딩 해제 및 디코딩
          filename = decodeURIComponent(matches[1]);
        }
      }

      link.setAttribute("download", filename); // 다운로드할 파일 이름 설정
      document.body.appendChild(link);
      link.click(); // 프로그래매틱하게 링크 클릭 이벤트 발생

      // 정리 작업
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      console.error("Error downloading the report:", error);
      alert("다운로드 중 문제가 발생했습니다.");
    }
  }
};
</script>

<style>
.container {
  max-width: 90%;
  margin: auto;
}

.table-container {
  margin-bottom: 3cm; /* el-table과 차트 사이의 간격을 3cm로 설정 */
}

.charts-container {
  display: flex;
  flex-direction: column;
  margin-top: 1.5cm;
}

.charts-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.form-box,
.form-box-wide {
  flex: 1;
}

.form-box {
  margin-right: 20px;
}

.form-box:last-child,
.form-box-wide:last-child {
  margin-right: 0;
}

.form-box-wide {
  margin-bottom: 1rem;
}
</style>
