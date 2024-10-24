// src/utils/test.ts
import { testData } from "./test_data";

export interface Coordinates {
  x: number;
  y: number;
}

export interface SparaData {
  name: string;
  line_color: string;
  coordinates: Coordinates[];
}

// sParaData 배열을 만들어서 testData를 저장하는 함수
export const sParaData: SparaData[] = [];

// testData 배열 데이터를 sParaData에 복사하는 함수
export function loadTestData() {
  sParaData.push(...testData); // 배열 데이터를 sParaData에 추가
}
