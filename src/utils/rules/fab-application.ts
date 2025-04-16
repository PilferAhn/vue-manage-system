import type { FormRules } from "element-plus";

// 필드 이름과 사용자 친화적 라벨 매핑
const fieldLabels: Record<string, string> = {
  productName: "제품명",
  requesterId: "요청자 ID",
  designerId: "설계자 ID",
  "designer.userName": "설계자 이름",
  "requester.userName": "요청자 이름",
  waferType: "웨이퍼 타입",
  isAoi: "AOI 유무",
  wantedFabStartDate: "FAB 시작일",
  wantedFabFinishDate: "FAB 종료일",
  note: "비고",
  waferId: "웨이퍼 ID",
  waferAngle: "웨이퍼 각도",
  waferThickness: "웨이퍼 두께",
  idtId: "IDT ID",
  pstId: "PST ID",
  tcId: "TC ID",
  depositionCondi : "IDT Layer"
};

// 공통 유효성 검사 함수 (빈 값 체크)
export const requiredRule = (field: string) => ({
  required: true,
  message: `${fieldLabels[field] || field}은(는) 필수 입력 사항입니다.`,
  trigger: "blur",
  validator: (_rule: any, value: any, callback: any) => {
    if (value === "" || value === null || value === undefined) {
      callback(new Error(`${fieldLabels[field] || field}은(는) 필수 입력 사항입니다.`));
    } else {
      callback();
    }
  },
});

// 숫자 값인지 검사하는 함수
export const numberRule = (field: string) => ({
  required: true,
  message: `${fieldLabels[field] || field}은(는) 숫자 값이어야 합니다.`,
  trigger: "blur",
  validator: (_rule: any, value: any, callback: any) => {
    if (value === "" || value === null || value === undefined) {
      callback(new Error(`${fieldLabels[field] || field}은(는) 필수 입력 사항입니다.`));
    } else if (isNaN(Number(value))) {
      callback(new Error(`${fieldLabels[field] || field}은(는) 숫자 값이어야 합니다.`));
    } else {
      callback();
    }
  },
});

// 필수 항목 (문자열 필드)
const requiredFields = [
  "productName",
  "requesterId",
  "designerId",
  "waferType",
  "isAoi",
  "wantedFabStartDate",
  "wantedFabFinishDate",
  "note",
  "idtMaskArrivalDate",
  "pstMaskArrivalDate"
];

// 숫자 항목
const numberFields = [
  "waferId",
  "waferAngle",
  "waferThickness",
  "idtId",
  "pstId",
  "tcId",
];

// FabRequestForm의 유효성 검사 규칙을 동적으로 생성
export const fabRequestFormRules: FormRules = {
  ...requiredFields.reduce((rules, field) => {
    rules[field] = [requiredRule(field)];
    return rules;
  }, {} as FormRules),

  ...numberFields.reduce((rules, field) => {
    rules[field] = [numberRule(field)];
    return rules;
  }, {} as FormRules),
};