// src/plugins/customPlugin.ts
import { Chart, Plugin } from "chart.js";

export function findClosestIndex(target: number, array: number[]): number {
  const validNumbers = array.filter((num) => !isNaN(num));
  let closestIndex = -1;
  let smallestDifference = Infinity;

  validNumbers.forEach((num, index) => {
    const difference = Math.abs(num - target);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestIndex = index;
    }
  });

  return array.indexOf(validNumbers[closestIndex]);
}

export function getSpecPoint(spl: any, targetPoint: number) {
  const temp_data = spl.data;

  let maxValue = -Infinity;
  let maxYVal = 0;
  let maxIndex = 0;
  let xRange: number[] = [];
  let yRange: number[] = [];

  temp_data.forEach((point: any, index: number) => {
    if (point.y > maxValue) {
      maxValue = point.y;
      maxYVal = point.y;
      maxIndex = index;
    }
  });

  const ilLevel = -3;
  let leftIndex = 0;
  let rightIndex = 0;
  let breakPoint = 0;
  if (maxIndex != 0) {
    for (let tempIndex = 0; tempIndex < maxIndex; tempIndex++) {
      if (
        (temp_data[tempIndex]["y"] - ilLevel) *
          (temp_data[tempIndex + 1]["y"] - ilLevel) <=
        0
      ) {
        leftIndex = tempIndex;
        breakPoint = tempIndex;
        break;
      }
    }
  }
  let interplatedPoints: any = {};
  if (breakPoint != 0) {
    const x1 = temp_data[breakPoint]["x"];
    const y1 = temp_data[breakPoint]["y"];
    const x2 = temp_data[breakPoint - 1]["x"];
    const y2 = temp_data[breakPoint - 1]["y"];

    var a = (y2 - y1) / (x2 - x1);
    var b = y1 - a * x1;

    var tempIL = -3;
    var x = (tempIL - b) / a;
    // console.log(x)

    const interpolatedX = (x1 + x2) / 2;
    const interpolatedY = y1 + ((interpolatedX - x1) * (y2 - y1)) / (x2 - x1);

    interplatedPoints["leftX"] = interpolatedX;
    interplatedPoints["leftY"] = interpolatedY;

    var slicedArrray1 = temp_data.slice(leftIndex - 2, leftIndex + 2);
    // console.log(slicedArrray1)
    temp_data.splice(leftIndex, 0, { x: x, y: -3 });
    slicedArrray1 = temp_data.slice(leftIndex - 2, leftIndex + 2);
    // console.log(slicedArrray1)
  }

  breakPoint = 0;
  if (maxIndex != 0 && maxIndex < temp_data.length) {
    for (let tempIndex = temp_data.length - 1; tempIndex >= 1; tempIndex--) {
      if (
        (temp_data[tempIndex]["y"] - ilLevel) *
          (temp_data[tempIndex - 1]["y"] - ilLevel) <=
        0
      ) {
        rightIndex = tempIndex;
        breakPoint = tempIndex;
        break;
      }
    }
  }

  if (breakPoint != 0) {
    const x1 = temp_data[breakPoint]["x"];
    const y1 = temp_data[breakPoint]["y"];
    const x2 = temp_data[breakPoint - 1]["x"];
    const y2 = temp_data[breakPoint - 1]["y"];

    const interpolatedX = (x1 + x2) / 2;
    const interpolatedY = y1 + ((interpolatedX - x1) * (y2 - y1)) / (x2 - x1);
    interplatedPoints["splNumber"] = spl.label;
    interplatedPoints["rightX"] = interpolatedX;
    interplatedPoints["rightY"] = interpolatedY;

    var a = (y2 - y1) / (x2 - x1);
    var b = y1 - a * x1;

    var tempIL = -3;
    var x = (tempIL - b) / a;

    var slicedArrray1 = temp_data.slice(rightIndex - 2, rightIndex + 2);

    temp_data.splice(rightIndex, 0, { x: x, y: -3 });
    slicedArrray1 = temp_data.slice(rightIndex - 2, rightIndex + 2);

    interplatedPoints["fc"] =
      (interplatedPoints["leftX"] + interplatedPoints["rightX"]) / 2;
  }

  interplatedPoints["maxIndex"] = maxIndex;
  interplatedPoints["rightIndex"] = rightIndex;
  interplatedPoints["leftIndex"] = leftIndex;

  for (let i = 0; i < temp_data.length; i += 1) {
    xRange.push(temp_data[i]["x"]);
    yRange.push(temp_data[i]["y"]);
  }

  interplatedPoints["fc_index"] = findClosestIndex(
    interplatedPoints["fc"],
    xRange
  );

  interplatedPoints["targetPoint"] = targetPoint//findClosestIndex(targetPoint, xRange);

  return interplatedPoints;
}

interface CustomPluginOptions {
  startX: number;
  endX: number;
  targets: {
    leftX: number;
    leftY: number;
    splNumber: string;
    rightX: number;
    rightY: number;
    fc: number;
    maxIndex: number;
    rightIndex: number;
    leftIndex: number;
    fc_index: number;
    targetPoint: number;
    lineColor: string;
  }[];
}

export const customPlugin = (startX, endX, targets): Plugin => ({
  id: "myCustomPlugin",
  afterDraw: (chart, args, options) => {
    const ctx = chart.ctx;
    const yAxis = chart.scales.y;
    const xAxis = chart.scales.x;
    const yValue = -3; // y축의 목표 값
    const yPixel = yAxis.getPixelForValue(yValue);

    const systemFC = (startX + endX) / 2;

    // x축의 그려질 범위를 정의합니다.
    const xStart = xAxis.getPixelForValue(startX); // 예를 들어, x축 데이터 값이 2에서 시작
    const xEnd = xAxis.getPixelForValue(endX); // x축 데이터 값이 8에서 끝남

    // x축에 그릴 목표 값과 픽셀 위치를 정의합니다.
    const xValue = systemFC;
    const xPixel = xAxis.getPixelForValue(xValue);

    // y축의 그려질 범위를 정의합니다.
    const yStart = yAxis.getPixelForValue(-2.5);
    const yEnd = yAxis.getPixelForValue(-0.7);

    const xTargetPixel = xAxis.getPixelForValue(endX);
    const xLeftTargetPixel = xAxis.getPixelForValue(startX);

    targets.map((dict, index) => {
      const centerFC = dict["fc"];
      const splXPixcel = xAxis.getPixelForValue(centerFC);

      const targetF = dict["targetPoint"];
      const splXTargetPixcel = xAxis.getPixelForValue(targetF);

      // Sample FC
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(splXPixcel, yStart + 10 + (index * 3));
      ctx.lineTo(splXPixcel, yEnd + 10 + (index * 3));
      ctx.lineWidth = 2;
      ctx.strokeStyle = dict["lineColor"];
      ctx.stroke();
      ctx.restore();

      // Target F
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(splXTargetPixcel, yStart + 10 + (index * 3));
      ctx.lineTo(splXTargetPixcel, yEnd + 10  + (index * 3));
      ctx.lineWidth = 2;
      ctx.strokeStyle = dict["lineColor"];
      ctx.stroke();
      ctx.restore();

      
    });

    // specInfoList.map((dict, index) => {
    //   const centerFC = dict["fc"];
    //   const splXPixcel = xAxis.getPixelForValue(centerFC);

    //   // System Target F Right Side
    //   ctx.save();
    //   ctx.beginPath();
    //   ctx.moveTo(splXPixcel, yStart);
    //   ctx.lineTo(splXPixcel, yEnd + 10);
    //   ctx.lineWidth = 2;
    //   ctx.strokeStyle = "black";
    //   ctx.stroke();
    //   ctx.restore();

    //   ctx.save();
    //   ctx.font = "12px Arial";
    //   ctx.fillStyle = "black";
    //   ctx.fillText(`Target f`, splXPixcel - 23, yEnd - 2); // x 값의 위치에 텍스트 추가
    //   ctx.restore();
    // });

    // System Target F Right Side
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xTargetPixel, yStart);
    ctx.lineTo(xTargetPixel, yEnd + 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Target f`, xTargetPixel - 23, yEnd - 2); // x 값의 위치에 텍스트 추가
    ctx.restore();

    // System Target F Left Side
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xLeftTargetPixel, yStart);
    ctx.lineTo(xLeftTargetPixel, yEnd + 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Target f`, xLeftTargetPixel - 23, yEnd - 2); // x 값의 위치에 텍스트 추가
    ctx.restore();

    // system FC
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xStart, yPixel); // xStart에서 시작
    ctx.lineTo(xEnd, yPixel); // xEnd에서 끝남
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black"; // 선의 색상 지정
    ctx.stroke();
    ctx.restore();

    // y축에 문자열을 추가합니다.
    ctx.save();
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`system band`, (xStart + xEnd - 70) / 2, yPixel + 10); // y 값의 위치에 텍스트 추가
    ctx.restore();

    // x축에 선을 그립니다.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xPixel, yStart);
    ctx.lineTo(xPixel, yEnd - 15);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.restore();

    // x축에 문자열을 추가합니다.
    ctx.save();
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`System fc`, xPixel - 23, yEnd - 23); // x 값의 위치에 텍스트 추가
    ctx.restore();
  },
});

export default customPlugin;
