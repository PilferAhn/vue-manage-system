import { reactive } from "vue";

// Exporting the wafer size list for use in other files
export const waferSizeList: string[] = [
  "4 Inch (0.5CM) ",
  "4 Inch (1CM)",
  "6 Inch",
];

export const measTypes: string[] = [
  "TCF",
  "TEP-P",
  "Pre-TEG",
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

export interface TegApplication{

  status : string;

  designer: string;
  requester: string;
  purpose: string;
  lotID: string;

  shotSize: string;
  chipSize: string;
  chipQuantity: string;
  maskName: string;
  isMaskChange: string;
  port: string;

  detail: string;

  shortPatternNo: string;
  thruPatternNo: string;
  openPatternNo: string;
  rawPatternNo: string;
  preTegPatternMeasShot : string;

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

export const TempTegApplicationForm = reactive<TegApplication>({
  designer: "",
  requester: "",
  purpose: "",
  lotID: "",
  status : "",

  shotSize: "",
  chipSize: "",
  chipQuantity: "",
  maskName: "",
  isMaskChange: "",
  port: "",

  detail: "",

  shortPatternNo: "",
  thruPatternNo: "",
  openPatternNo: "",
  rawPatternNo: "",
  preTegPatternMeasShot : "",

  waferQuantity: 0,
  waferIDList: [],
  waferSize: "",
  activeShots: [],

  measInfo: [], // 배열을 초기화할 때는 빈 배열을 할당

  dateOfCreated: "",
  dateOfReserve: "",
  dateOfFinish: "",
  dateOfMeasStart: null,

  temperatures: [],

  note: "",

  modelName: "",
  // measType: [],

  shotInformation: {
    shots: [],
    disableShots: [],
    size: 0,
    status: [],
  },

  waferInformation: [], // 배열 형식으로 초기화

  priority: "",
  applicationType: "",
});

export const TegApplicationForm = reactive<TegApplication>({
  designer: "Tester_De",
  requester: "Tester_Req",
  purpose: "Test Form",
  lotID: "TESTING LOT",
  status : "",

  shotSize: "10.23 * 10.17",
  chipSize: "0.93*1.13",
  chipQuantity: "600",
  maskName: "KF 128-240430",
  isMaskChange: "",
  port: "1Port(SG)",

  detail: "",

  shortPatternNo: "1",
  thruPatternNo: "2",
  openPatternNo: "3",
  rawPatternNo: "4",
  preTegPatternMeasShot : "3-5",

  waferQuantity: 0,
  waferIDList: [],
  waferSize: "",
  activeShots: [],

  measInfo: [], // 배열을 초기화할 때는 빈 배열을 할당

  dateOfCreated: "",
  dateOfReserve: "",
  dateOfFinish: "",
  dateOfMeasStart: null,

  temperatures: [],

  note: "",

  modelName: "WSG24",


  shotInformation: {
    shots: [],
    disableShots: [],
    size: 0,
    status: [],
  },

  waferInformation: [], // 배열 형식으로 초기화

  priority: "",
  applicationType: "",
});


interface tegApplicationRow {

  modelName : string,
  lotID : string,
  designer : string,
  reqeuster : string,
  dateOfCreated : string,
  dateOfReserved : string,
  status : string

}

// 전체 객체의 타입을 정의하는 인터페이스
export const applicationPriority = [
  "요소기술그룹",
  "차세대공법그룹",
  "차세대SAW그룹 - TEG",
  "상품화개발 - TEG",
  "차세대SAW그룹 - CHIP",
  "상품화개발 - CHIP",
];

export const maskChanges = ["O", "X"];

export const portOptions = ["1Port(SG)", "2Port(GSG)"];

// // 객체 정의
// export const applicationPriority: ApplicationPriority = {
//   "요소기술그룹": {
//     priority: "1",
//   },
//   "차세대공법그룹": {
//     priority: "1",
//   },
//   "차세대SAW그룹 - TEG": {
//     priority: "2",
//   },
//   "상품화개발 - TEG": {
//     priority: "2",
//   },
//   "차세대SAW그룹 - CHIP": {
//     priority: "3",
//   },
//   "상품화개발 - CHIP": {
//     priority: "3",
//   },
// };


