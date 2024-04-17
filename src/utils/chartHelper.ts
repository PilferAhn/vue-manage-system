import { Chart, ScatterDataPoint, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export function drawChart(chartCanvas: HTMLCanvasElement, samples: any[], ChartInstance: Chart | null) {
  const colors = [
    "rgba(255, 99, 132, 1)", // 빨간색
    "rgba(54, 162, 235, 1)", // 파란색
    "rgba(255, 206, 86, 1)", // 노란색
    "rgba(75, 192, 192, 1)", // 청록색
    "rgba(153, 102, 255, 1)", // 보라색
    "rgba(255, 159, 64, 1)", // 주황색
    "rgba(255, 99, 132, 0.6)", // 연한 빨간색
    "rgba(255, 159, 64, 0.6)", // 연한 주황색
    "rgba(153, 102, 255, 0.6)", // 연한 보라색
    "rgba(54, 162, 235, 0.6)", // 연한 파란색
    "rgba(75, 192, 192, 0.6)", // 연한 청록색
    "rgba(255, 206, 86, 0.6)", // 연한 노란색
    "rgba(116, 185, 255, 1)", // 하늘색
    "rgba(162, 155, 254, 1)", // 연보라색
    "rgba(0, 184, 148, 1)", // 에메랄드색
    "rgba(253, 121, 168, 1)", // 분홍색
  ];

  if (chartCanvas && samples) {
    if (ChartInstance) {
      ChartInstance.destroy();
    }

    const datasets = samples
      .filter((sample) => sample.p_in !== "")
      .map((sample, index) => {
        const xValues = sample.p_in.split("\t").map(Number);
        const yValues = sample.p_out.split("\t").map(Number);
        return {
          label: sample.sample_number,
          data: xValues.map((x, i) => ({ x, y: yValues[i] })),
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          fill: false,
          showLine: true,
        };
      });

    const allXValues = datasets.flatMap((dataset) => dataset.data.map((d) => d.x));
    const minX = Math.min(...allXValues);
    const maxX = Math.max(...allXValues);
    const xRange = maxX - minX;
    const xPadding = xRange * 0.1;

    const chartConfig = {
      type: "scatter",
      data: { datasets },
      options: {
        scales: {
          x: {
            type: "linear",
            min: minX - xPadding,
            max: maxX + xPadding,
            title: { display: true, text: "P In (dBm)" },
          },
          y: {
            title: { display: true, text: "P Out (dBm)" },
          },
        },
      },
    };

    return new Chart(chartCanvas, chartConfig);
  }
}
