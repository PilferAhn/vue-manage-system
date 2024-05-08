import type { FormRules } from "element-plus";
export const tegApplicationRules: FormRules = {
  designer: [
    {
      required: true,
      message: "Please input the designer name",
      trigger: "blur",
    },
  ],
  requester: [
    {
      required: true,
      message: "Please input the requester name",
      trigger: "blur",
    },
  ],
  lotID: [
    { required: true, message: "Please input the Lot ID", trigger: "blur" },
  ],
  applicationType: [
    { required: true, message: "의뢰 구분을 선택하세요", trigger: "blur" },
  ],
  modelName: [
    { required: true, message: "모델명을 입력하세요", trigger: "blur" },
  ],
  shotSize: [
    { required: true, message: "Shot Size를 입력하세요", trigger: "blur" },
  ],
  chipSize: [
    { required: true, message: "Chip Size를 입력하세요", trigger: "blur" },
  ],
  chipQuantity: [
    { required: true, message: "Chip 수량을 입력하세요", trigger: "blur" },
  ],
  isMaskChange: [
    { required: true, message: "마스크 변경 여부를 선택하세요", trigger: "blur" },
  ],
  maskName: [
    { required: true, message: "마스크 명을 입력하세요", trigger: "blur" },
  ],
  port: [
    { required: true, message: "Port를 선택해주세요", trigger: "blur" },
  ],
  thruPatternNo: [
    { required: true, message: "THRU Pattern 을 입력하세요", trigger: "blur" },
  ],
  shortPatternNo: [
    { required: true, message: "SHORT Pattern 을 입력하세요", trigger: "blur" },
  ],
  openPatternNo: [
    { required: true, message: "OPEN Pattern 을 입력하세요", trigger: "blur" },
  ],
  rawPatternNo: [
    { required: true, message: "RAW Pattern 을 입력하세요", trigger: "blur" },
  ],

};
