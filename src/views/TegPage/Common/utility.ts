import { reactive, ref } from "vue";
import type {
  TegApplication as TegApplicationInterface,
  TestTypeOptions as TestTypeOptionsInterface,
} from "./ApplicationTypes";

const defaultTestTypeOptions: TestTypeOptionsInterface = {
  needMeas: false,
  needSkip: false,
  needCPW: false,
  needDelay: false,
};

// 각 tegType의 이름을 키값으로 명시
export const tegTypes = ref([
  // { index: 1, name: "TEG-0", options: defaultTestTypeOptions },
  // {
  //   index: 2,
  //   name: "TEG-P",
  //   options: { ...defaultTestTypeOptions },
  // },
  {
    index: 3,
    name: "TEG-1",
    options: { ...defaultTestTypeOptions },
  },
  {
    index: 4,
    name: "TEG-1.5",
    options: { ...defaultTestTypeOptions },
  },
  {
    index: 5,
    name: "TEG-N",
    options: { ...defaultTestTypeOptions },
  },
  {
    index: 6,
    name: "TEG-2",
    options: { ...defaultTestTypeOptions },
  },
  {
    index: 7,
    name: "TEG-3",
    options: { ...defaultTestTypeOptions },
  },
]);

export const initTegApplication2 = (): TegApplicationInterface =>
  reactive({
    uuid: "",
    designer: "",
    requester: "",
    purpose: "신규 의뢰서 양식 테스트",
    lotID: "NCHDE04703",
    status: "",
    shotSize: "1",
    chipSize: "2",
    chipQuantity: "3",
    maskName: "4",
    isMaskChange: "5",
    isAOI: "O",
    port: "1",
    detail: "2",
    shortPatternNo: "3",
    thruPatternNo: "4",
    openPatternNo: "5",
    rawPatternNo: "6",
    preTegPatternMeasShot: "",
    waferQuantity: 0,
    waferIDList: [],
    waferSize: "",
    activeShots: [],
    measInfo: [],
    dateOfCreated: "",
    dateOfReserve: "",
    dateOfFinish: "",
    dateOfMeasStart: null,
    temperatures: [],
    note: "",
    modelName: "NEW FOEM TEST",
    shotInformation: {
      shots: [],
      disableShots: [],
      size: 0,
      status: [],
    },
    waferInformation: [],
    priority: "",
    applicationType: "요소기술그룹",
  });

export const initTegApplication = (): TegApplicationInterface =>
  reactive({
    uuid: "",
    designer: "",
    requester: "",
    purpose: "",
    lotID: "",
    status: "",
    shotSize: "",
    chipSize: "",
    chipQuantity: "",
    maskName: "",
    isMaskChange: "",
    isAOI: "",
    
    port: "",
    detail: "",
    shortPatternNo: "",
    thruPatternNo: "",
    openPatternNo: "",
    rawPatternNo: "",
    preTegPatternMeasShot: "",
    waferQuantity: 0,
    waferIDList: [],
    waferSize: "",
    activeShots: [],
    measInfo: [],
    dateOfCreated: "",
    dateOfReserve: "",
    dateOfFinish: "",
    dateOfMeasStart: null,
    temperatures: [],
    note: "",
    modelName: "",
    shotInformation: {
      shots: [],
      disableShots: [],
      size: 0,
      status: [],
    },
    waferInformation: [],
    priority: "",
    applicationType: "",
  });
