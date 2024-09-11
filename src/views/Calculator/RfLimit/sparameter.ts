import { ElUploadFile } from "element-plus";
import axios from "axios";
// src/interfaces/SParameter.ts
export interface SParameterFile {
  key: string;
  fileName: string;
  port: string;
  temperature: string;
  rxDbm: number[];
  txDbm: number[];
  freq: number[];
}

export const optionList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// src/interfaces/SParameter.ts
export interface CalculatedSParameters {
  key?: string;
  fileName: string;
  port?: string;
  temperature?: string;
  temperatureStr?: string;
  rxDbm: number[];
  txDbm: number[];
  rxFreq: number[];
  txFreq: number[];
  freq: number[];
  txLeftVal: number;
  txRightVal: number;
  rxLeftVal: number;
  rxRightVal: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Graph {
  graph: Coordinate[];
}

export interface Graphs {
  graphName: string;
  coordinates: Coordinate[][];
  ilLevel: number;
  labels: string[];
}

export interface GraphObj {
  graph_data: Graphs[];
}

export interface GraphObjs {}

export interface CalculatedTCFValue {
  centerTcf: number;
  leftTcf: number;
  rightTcf: number;
  centerArr: number[];
  leftArr: number[];
  rightArr: number[];
  leftCoordinates: Coordinate[];
  rightCoordinates: Coordinate[];
  temperatures: number[];
  graphName: string;
}

export interface CalculatedTCFValues {
  tcfValues: CalculatedTCFValue[];
}

export interface TCFValues {
  txLfTcf: number;
  txRfTcf: number;
  rxLfTcf: number;
  rxRfTcf: number;
  txCenterTcf: number;
  rxCenterTcf: number;
}

export function createInitialTCFValues(): TCFValues {
  return {
    txLfTcf: 0,
    txRfTcf: 0,
    rxLfTcf: 0,
    rxRfTcf: 0,
    txCenterTcf: 0,
    rxCenterTcf: 0,
  };
}

export const validExtension = /^s\d+p$/i;

export function findMostFrequentNumber(SParameterFile: SParameterFile[]) {
  const frequencyMap = {};
  SParameterFile.map((file, index) => {
    frequencyMap[file.port] = (frequencyMap[file.port] || 0) + 1;
  });

  let maxCount = 0;
  let mostFrequentNumber = null;

  for (let num in frequencyMap) {
    if (frequencyMap[num] > maxCount) {
      maxCount = frequencyMap[num];
      mostFrequentNumber = num;
    }
  }

  return mostFrequentNumber;
}

export const availableOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
];

export async function downloadExcel(
  files: File[],
  rxOutput: string,
  rxInput: string,
  txOutput: string,
  txInput: string,
  rxIlLevel: string,
  txIlLevel: string,
  roundingPoint: string
): Promise<void> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file.raw));
  formData.append("rx_output", rxOutput);
  formData.append("rx_input", rxInput);
  formData.append("tx_output", txOutput);
  formData.append("tx_input", txInput);
  formData.append("rx_il_level", rxIlLevel);
  formData.append("tx_il_level", txIlLevel);
  formData.append("rounding_point", roundingPoint);

  try {
    const response = await axios.post("tcf/create_excel_file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    let filename = "default-filename.xlsx";
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameRegex = /filename\*?=['"]?([^;\r\n"]*)['"]?/i;
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
    console.error("Error sending data to server:", error);
  }
}

// // 파일 변경 이벤트 핸들러
// function handleFileChange(file, fileList) {
//   // sortingFiles(file, fileList)
//   // 파일 목록 초기화
//   files.splice(0, files.length); // 기존 파일들을 배열에서 제거

//   fileList.forEach((f) => {
//     // filter 대신 forEach 사용
//     const extension = f.name.split(".").pop();

//     if (extension && validExtension.test(extension)) {
//       const parts = f.name.split("_");
//       let temperature = 25;
//       const tempIndex = parts.findIndex((part) => part.includes("DEGC"));
//       if (tempIndex !== -1) {
//         // DEGC 문자열이 포함된 부분에서 숫자만 추출하여 온도로 설정
//         const tempPart = parts[tempIndex];
//         const matches = tempPart.match(/(-?\d+)DEGC/);
//         if (matches && matches[1]) {
//           temperature = parseInt(matches[1]);

//           const newFile: SParameterFile = {
//             key: f.name,
//             fileName: f.name,
//             port: extension.replace(/[^\d]/g, ""), // port 값 추출 및 변환
//             temperature: temperature.toString(), // 임시 값
//           };
//           files.push(newFile); // 새 파일 객체를 files 배열에 추가
//         }
//       }
//     }
//   });

//   // 파일을 온도에 따라 정렬
//   files.sort((a, b) => a.temperature - b.temperature);
// }

export function sortingFiles(fileList: ElUploadFile[]): SParameterFile[] {
  let files: SParameterFile[] = [];
  const portList = [];

  let tempTemperature = 25
  fileList.forEach((f) => {
    const extension = f.name.split(".").pop();
    const newFile: SParameterFile = {
      key: f.name,
      fileName: f.name,
      port: extension.replace(/[^\d]/g, ""),
      temperature: tempTemperature.toString(),
    };
    tempTemperature += 25
    files.push(newFile);
    portList.push(parseInt(newFile.port));

    // if (extension && validExtension.test(extension)) {
    //   const parts = f.name.split("_");
    //   let temperature = 25; // 기본 온도 설정
    //   const tempIndex = parts.findIndex((part) => part.includes("DEGC"));
    //   if (tempIndex !== -1) {
    //     const tempPart = parts[tempIndex];
    //     const matches = tempPart.match(/(-?\d+)DEGC/);
    //     if (matches && matches[1]) {
    //       temperature = parseInt(matches[1]);

    //       const newFile: SParameterFile = {
    //         key: f.name,
    //         fileName: f.name,
    //         port: extension.replace(/[^\d]/g, ""),
    //         temperature: temperature.toString(),
    //       };

    //       files.push(newFile);
    //       portList.push(parseInt(newFile.port));
    //     }
    //   }
    // }
  });

  // 온도에 따라 파일 목록 정렬
  // files.sort((a, b) => parseInt(a.temperature) - parseInt(b.temperature));
  return files;
}
