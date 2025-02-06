import type { NaMeasurementInfo } from "./na";

export interface ApplicationInfo {
  productName: string; // 기종명
  quantity: number; // 수량
  requester: string; // 의뢰인
  testPurpose: string; // 의뢰 목적
  smtVersion: string; // SMT 이력
  materialDeliveryDate: string; // 자재 전달 일자
  completionRequestDate: string; // 완료 요청 일자
  goldenSample: string; // Golden Sample 측정
  atsModel: string; // ATS Model
  rffeFileSelection: string; // RFFE File 선택
  tcfTest: boolean; // TCF 측정 여부
  tcfTemperatureRange: number[]; // TCF 시험 온도
  measurementItems: string[]; // 측정 항목
  measurementManager: string; // 측정 담당자
  completionDate?: string; // 완료 예정일 (옵션)
  naMeasurement: NaMeasurementInfo; // 측정 정보 포함
}
