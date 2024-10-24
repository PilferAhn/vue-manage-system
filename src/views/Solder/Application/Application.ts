import { ref, watch } from "vue";

export interface PDTRequestFormType {
  applicationUuid: string;

  customerCompany: string;
  specTemperature: string;
  specPower: string;
  isSpecEdit: boolean;

  modelName: string;
  condition: string;

  signalType: string;
  band: string;
  duplexMode: string;
  bandwidth: string;

  designer: string;
  requester: string;
  purpose: string;

  temperature: string;
  duty: string;
  dateOfSampleConvey: string;
  dateOfCreate: string;

  waferType: string;
  packageType: string;

  testType: string;
  targetPosition: string;

  link: string;

  sampleQuantity: number;

  detail: string;

  requestNumber: string;
  status: string;
}

export function usePDTRequestForm() {
  const form = ref<PDTRequestFormType>({
    applicationUuid: "",
    customerCompany: "",
    specTemperature: "",
    specPower: "",
    isSpecEdit: false,

    modelName: "",
    condition: "",

    signalType: "",
    band: "",
    duplexMode: "",
    bandwidth: "",

    designer: "",
    requester: "",
    purpose: "",

    temperature: "0",
    duty: "",
    dateOfSampleConvey: "",
    dateOfCreate: "",

    waferType: "",
    packageType: "",

    testType: "",
    targetPosition: "",

    link: "",

    sampleQuantity: 0,
    samples: [],
    detail: "",

    requestNumber: "",
    status: "",
  });

  return {
    form,
  };
}

interface EvbType {
  key: number;
  label: string;
  value: string;
}

export const evbTypeList: EvbType[] = [
  {
    key: 1,
    label: "1 - 1007 WLP - 1IN2OUT_7 PIN _REVO3 W300 - 21 ea",
    value: "1 - 1007 WLP - 1IN2OUT_7 PIN _REVO3 W300 - 21 ea",
  },
  {
    key: 2,
    label: "2 - 1511 WLP - MIRROR _REVO1 - 3 ea",
    value: "2 - 1511 WLP - MIRROR _REVO1 - 3 ea",
  },
  {
    key: 3,
    label: "3 - 1410 DPX - REVO1 W220 - 9 ea",
    value: "3 - 1410 DPX - REVO1 W220 - 9 ea",
  },
  {
    key: 4,
    label: "4 - 1210 DPX - REVO1 W180 - 5 ea",
    value: "4 - 1210 DPX - REVO1 W180 - 5 ea",
  },
  {
    key: 5,
    label: "5 - 1007 WLP - 2IN2OUT_8 PIN _REVOO W260 - 2 ea",
    value: "5 - 1007 WLP - 2IN2OUT_8 PIN _REVOO W260 - 2 ea",
  },
  {
    key: 6,
    label: "6 - 1007 WLP - 2IN2OUT_8 PIN REV 00 W280 - 2 ea",
    value: "6 - 1007 WLP - 2IN2OUT_8 PIN REV 00 W280 - 2 ea",
  },
  {
    key: 7,
    label: "7 - 10060 WLP - TINZOUT_8PIN_REVOT W320 - 3 ea",
    value: "7 - 10060 WLP - TINZOUT_8PIN_REVOT W320 - 3 ea",
  },
  {
    key: 8,
    label: "8 - 060070 WLP - 6PIN UNBAL REVO102 - 3 ea",
    value: "8 - 060070 WLP - 6PIN UNBAL REVO102 - 3 ea",
  },
  {
    key: 9,
    label: "9 - 1511 BU - TINZOUT TYPEO_REVO2 W200 - 2 ea",
    value: "9 - 1511 BU - TINZOUT TYPEO_REVO2 W200 - 2 ea",
  },
  {
    key: 10,
    label: "10 - 1511 BU - TINZOUT TYPEO_REVO2 W180 - 2 ea",
    value: "10 - 1511 BU - TINZOUT TYPEO_REVO2 W180 - 2 ea",
  },
  {
    key: 11,
    label: "11 - 1511 BU - TINZOUT TYPEO_REVO2 W220 - 2 ea",
    value: "11 - 1511 BU - TINZOUT TYPEO_REVO2 W220 - 2 ea",
  },
  {
    key: 12,
    label: "12 - 1310 BU - DPX TYPE2_REV 01 W180 - 6 ea",
    value: "12 - 1310 BU - DPX TYPE2_REV 01 W180 - 6 ea",
  },
  {
    key: 13,
    label: "13 - 14511 DPX - REVO W220 - 7 ea",
    value: "13 - 14511 DPX - REVO W220 - 7 ea",
  },
  {
    key: 14,
    label: "14 - 1109 UNBAL - 063079 069094 WLP - 24 ea",
    value: "14 - 1109 UNBAL - 063079 069094 WLP - 24 ea",
  },
  {
    key: 15,
    label: "15 - UNBAL_REVOS W300 - 108062 WLP - 3 ea",
    value: "15 - UNBAL_REVOS W300 - 108062 WLP - 3 ea",
  },
  {
    key: 16,
    label: "16 - 2IN2OUT_SPIN ZZ_ REV1 W260 - 1008 UNBAL - 5 ea",
    value: "16 - 2IN2OUT_SPIN ZZ_ REV1 W260 - 1008 UNBAL - 5 ea",
  },
  {
    key: 17,
    label: "17 - REV 01 211202 660 OFF CES - 108062 WLP - 7 ea",
    value: "17 - REV 01 211202 660 OFF CES - 108062 WLP - 7 ea",
  },
  {
    key: 18,
    label: "18 - 2IN2OUT_SPIN ZZ_REV1 W260 - 1511 WLP - 3 ea",
    value: "18 - 2IN2OUT_SPIN ZZ_REV1 W260 - 1511 WLP - 3 ea",
  },
  {
    key: 19,
    label: "19 - MIRROR _REVO1 - 1007 WLP - 9 ea",
    value: "19 - MIRROR _REVO1 - 1007 WLP - 9 ea",
  },
  {
    key: 20,
    label: "20 - TIN2OUT_7PIN_REVO3 W300 - 1612 DPX - 1 ea",
    value: "20 - TIN2OUT_7PIN_REVO3 W300 - 1612 DPX - 1 ea",
  },
  {
    key: 21,
    label: "21 - REVO5 W200 - 1612 BU - 8 ea",
    value: "21 - REVO5 W200 - 1612 BU - 8 ea",
  },
  {
    key: 22,
    label: "22 - DPX TYPE 3,REV 05 W200 - 1109 FILTER - 9 ea",
    value: "22 - DPX TYPE 3,REV 05 W200 - 1109 FILTER - 9 ea",
  },
  {
    key: 23,
    label: "23 - REVO3 W200 - 1210 FILTER - 2 ea",
    value: "23 - REVO3 W200 - 1210 FILTER - 2 ea",
  },
  {
    key: 24,
    label: "24 - REVO2-3 W220 - 1511 DPX - 5 ea",
    value: "24 - REVO2-3 W220 - 1511 DPX - 5 ea",
  },
  {
    key: 25,
    label: "25 - REVO1-2 W220 - 2014 QPX - 7 ea",
    value: "25 - REVO1-2 W220 - 2014 QPX - 7 ea",
  },
  {
    key: 26,
    label: "26 - REVO5 A-W230_0-W220 - 2016 QPX - 3 ea",
    value: "26 - REVO5 A-W230_0-W220 - 2016 QPX - 3 ea",
  },
  {
    key: 27,
    label: "27 - REV 04 W220 - 1310 WLP - 3 ea",
    value: "27 - REV 04 W220 - 1310 WLP - 3 ea",
  },
  {
    key: 28,
    label: "28 - DPX 10 PIN_REVO1 MIRROR W100 - 1109 UNBAL - 3 ea",
    value: "28 - DPX 10 PIN_REVO1 MIRROR W100 - 1109 UNBAL - 3 ea",
  },
  {
    key: 29,
    label: "29 - REVO1 211203 660 OFF LSH - 1612 DPX - 5 ea",
    value: "29 - REVO1 211203 660 OFF LSH - 1612 DPX - 5 ea",
  },
  {
    key: 30,
    label: "30 - UNBAL REVERSE REVO1 - 0907 FILTER - 3 ea",
    value: "30 - UNBAL REVERSE REVO1 - 0907 FILTER - 3 ea",
  },
  {
    key: 31,
    label: "31 - REVI W180 - 150095 DPX - 4 ea",
    value: "31 - REVI W180 - 150095 DPX - 4 ea",
  },
  {
    key: 32,
    label: "32 - REV 01 W200 - 1511 WLP - 2 ea",
    value: "32 - REV 01 W200 - 1511 WLP - 2 ea",
  },
  {
    key: 33,
    label: "33 - DPX MIRROR PCB 3 SPLIT W317 - a210csP - 10 ea",
    value: "33 - DPX MIRROR PCB 3 SPLIT W317 - a210csP - 10 ea",
  },
  {
    key: 34,
    label: "34 - DPX STANDARD REVO1 W220 - 5 ea",
    value: "34 - DPX STANDARD REVO1 W220 - 5 ea",
  },

];
