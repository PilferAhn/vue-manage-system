import { ref, computed } from "vue";
import { CalcuatedSummary } from "../../../utils/types";
import axios from "axios";
import { colorList } from "../../../utils/utility";

export const application_status = ref("");
export const calculatedSummaries = ref<CalcuatedSummary[]>([]);

export const getTargetFreqArray = () => {
  return calculatedSummaries.value.map(summary => summary.targetFreq);
};

export const getSummaryData = async (uuid: string) => {
  try {
    const response = await axios.get(
      "/pdt_measurement/get_summary_data/" + uuid
    );

    application_status.value = response.data.status;

    calculatedSummaries.value = response.data.samples.map((item: any) => ({
      sampleNumber: item.sample_number,
      dbm3: item.dbm_3,
      p1Input: item.p1_input,
      p2Input: item.p2_input,
      p1Output: item.p1_output,
      targetFreq: item.target_frequancy,

      p1_index: item.p1_index,
      p2_index: item.p2_index,

      lf1: item.lf1,
      lf2: item.lf2,
      rf1: item.rf1,
      rf2: item.rf2,

      pIn: item.p_in.split("\t").map(Number),
      pOut: item.p_out.split("\t").map(Number),
      rf1Mhz: item.rf1_mhz.split("\t").map(Number),
      lf1Mhz: item.lf1_mhz.split("\t").map(Number),

      s21Freq: item.s21_freq.split("\t").map(Number),
      s21dBm: item.s21_dbm.split("\t").map(Number),

      sParaDbm: item.s_para_dbm.split(",").map(Number),
      sParaFreq: item.s_para_freq.split(",").map(Number),
    }));

    calculateStatistics();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

function createSParaChartData(xValueKey: string, yValueKey: string, step = 3) {
  const colors = colorList;

  return computed(() => {
    return calculatedSummaries.value.map((summary, index) => {
      const data = summary.sParaDbm.reduce((acc, _, idx) => {
        if (idx % step === 0) {
          acc.push({
            x: summary[xValueKey][idx],
            y: summary[yValueKey][idx],
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

function createS21ChartData(xValueKey: string, yValueKey: string, step = 1) {
  const colors = colorList;
  return computed(() => {
    return calculatedSummaries.value.map((summary, index) => {
      const data = summary.s21Freq.reduce((acc, _, idx) => {
        if (idx % step === 0) {
          acc.push({
            x: summary[xValueKey][idx],
            y: summary[yValueKey][idx],
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

function createChartDataFunction(yValueKey: string, maxIndexKey: string) {
  const colors = colorList;
  return computed(() => {
    return calculatedSummaries.value
      .map((summary, index) => {
        const maxIndex = summary[maxIndexKey];

        if (index <= maxIndex) {
          return {
            label: summary.sampleNumber,
            data: summary.pIn
              .map((pIn, idx) => {
                if (idx <= maxIndex) {
                  return {
                    x: pIn,
                    y: summary[yValueKey][idx],
                  };
                }
                return null;
              })
              .filter((p) => p !== null),
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
          };
        }
        return null;
      })
      .filter((summary) => summary !== null);
  });
}

function createChartDataForRfLfDifference(maxIndexKey: string) {
  const colors = colorList;
  return computed(() => {
    return calculatedSummaries.value
      .map((summary, index) => {
        const maxIndex = summary[maxIndexKey];

        if (index <= maxIndex) {
          return {
            label: summary.sampleNumber,
            data: summary.pIn
              .map((pIn, idx) => {
                if (idx <= maxIndex) {
                  return {
                    x: pIn,
                    y: summary.rf1Mhz[idx] - summary.lf1Mhz[idx],
                  };
                }
                return null;
              })
              .filter((p) => p !== null),
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
          };
        }
        return null;
      })
      .filter((summary) => summary !== null);
  });
}

export const chartSPara = createSParaChartData("sParaFreq", "sParaDbm");
export const chartS21 = createS21ChartData("s21Freq", "s21dBm");
export const chartDataPout = createChartDataFunction("pOut", "p2_index");
export const chartDataRf1Mhz = createChartDataFunction("rf1Mhz", "p1_index");
export const chartDataLf1Mhz = createChartDataFunction("lf1Mhz", "p1_index");
export const chartDataRfLfDifference = createChartDataForRfLfDifference(
  "p1_index"
);

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
    const p1InputThreeSigma = p1InputMean - p1InputStdDev * 3;

    const p2Inputs = calculatedSummaries.value.map((item) =>
      parseFloat(item.p2Input)
    );
    const p2InputMean =
      p2Inputs.reduce((acc, val) => acc + val, 0) / p2Inputs.length;
    const p2InputVariance =
      p2Inputs.reduce((acc, val) => acc + (val - p2InputMean) ** 2, 0) /
      p2Inputs.length;
    const p2InputStdDev = Math.sqrt(p2InputVariance);
    const p2InputThreeSigma = p2InputMean - p2InputStdDev * 3;

    const p1Outputs = calculatedSummaries.value.map((item) =>
      parseFloat(item.p1Output)
    );
    const p1OutputMean =
      p1Outputs.reduce((acc, val) => acc + val, 0) / p1Outputs.length;
    const p1OutputVariance =
      p1Outputs.reduce((acc, val) => acc + (val - p1OutputMean) ** 2, 0) /
      p1Outputs.length;
    const p1OutputStdDev = Math.sqrt(p1OutputVariance);
    const p1OutputThreeSigma = p1OutputMean - p1OutputStdDev * 3;
  }
};

export const downloadReport = async (uuid: string) => {
  if (confirm("결과파일을 다운로드 하시겠습니까?")) {
    try {
      const response = await axios.get(
        `pdt_application/send_pdt_report/${uuid}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      let filename = "default-filename.xlsx";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameRegex = /filename\*?=['"]?UTF-8''([^;'\"]*)['"]?;?/i;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the report:", error);
      alert("다운로드 중 문제가 발생했습니다.");
    }
  }
};
