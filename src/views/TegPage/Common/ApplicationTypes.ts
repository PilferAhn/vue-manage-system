import { reactive } from "vue";

// Exporting the wafer size list for use in other files
export const waferSizeList: string[] = [
  "4 Inch (0.5CM) ",
  "4 Inch (1CM)",
  "6 Inch",
];

export const newMeasTypes: string[] = ["TEG", "TCF", "Delay Line", "CPW"];

export interface TestTypeOptions {
  needCPW: boolean;
  needDelay: boolean;
  needMeas: boolean;
  needSkip: boolean;
}

export interface TegType {
  tegtype: TestTypeOptions;
}

export const measTypes: string[] = [
  "TCF",
  "TEP-P",
  "CPW",
  "TEG-1",
  "TEG-1.5",  
  "TEG-2",
  "TEG-3",
  "PDT",
  "Delay Line",
  "Harmonic",
];

interface shotInformation {
  shots: string[];
  disableShots: string[];
  size: number;
  status: string[];
}

export interface waferInformation {
  waferName: string;
  waferStatus: string;
  dateOfStart: Date | null;
  dateOfEnd: Date | null;
}

export interface w {
  waferInfoList: waferInformation[];
}

export interface FreqSectionInfo {
  start: string;
  stop: string;
  point: string;
  ifwb: string;
}

export interface MeasInfo {
  measType: string;
  freqSectionInfo: FreqSectionInfo[];
}

export interface TegApplication {
  uuid: string;
  status: string;

  designer: string;
  requester: string;
  designerId?: string;
  requesterId?: string;
  purpose: string;
  lotID: string;

  shotSize: string;
  chipSize: string;
  chipQuantity: string;
  maskName: string;
  isMaskChange: string;
  isAOI: string;
  isDvr: string;
  port: string;
  waferType?:string;
  packageType? : string

  detail: string;

  shortPatternNo: string;
  thruPatternNo: string;
  openPatternNo: string;
  rawPatternNo: string;
  preTegPatternMeasShot: string;

  waferQuantity: number;
  waferIDList: string[];
  waferSize: string;
  activeShots: string[];

  measInfo: MeasInfo[];

  dateOfCreated: string | Date;
  dateOfReserve: string | Date;
  dateOfFinish: string | Date;
  dateOfMeasStart: string | Date | null;

  temperatures: string[];

  note: string;

  modelName: string;
  // measType: string[];

  shotInformation: shotInformation;
  waferInformation: waferInformation[];

  priority: string;
  applicationType: string;
}
