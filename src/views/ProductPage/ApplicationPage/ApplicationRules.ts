import type { FormRules } from "element-plus";
import { PDTRequestFormType, PDTRequestFormBooleanType } from "./Application";
import PDTRequestForm from "./PDTRequestForm.vue";

// 유효성 검사 함수 예제
function validateTemperature(rule: any, value: any, callback: any) {
  if (parseFloat(value) > 200) {
    callback(new Error("200 이하의 숫자만 입력 가능합니다."));
  } else {
    callback();
  }
}

const validateSampleNumberUnique = (
  rule: any,
  value: string,
  callback: any
) => {
  const sampleNumbers = PDTRequestForm.samples.map(
    (sample) => sample.sampleNumber
  );
  const occurrences = sampleNumbers.filter(
    (sampleNumber) => sampleNumber === value
  ).length;
  if (occurrences > 1) {
    callback(new Error("House Name must be unique"));
  } else {
    console.log("??");
    callback();
  }
};



export const applicationRules: FormRules = {
  designer: [
    { required: true, message: "개발자를 입력해주세요.", trigger: "blur" },
  ],
  customerCompany: [
    { required: true, message: "고객 회사명을 입력해주세요.", trigger: "blur" },
  ],
  modelName: [
    { required: true, message: "모델명을 입력해주세요.", trigger: "blur" },
     {
      pattern: /^[^\\/:*?"<>|]{1,12}$/,
      message: "12자 이하로 입력하고 특수문자 \\ / : * ? \" < > | 는 사용할 수 없습니다.",
      trigger: "blur",
    },
  ],
  condition: [{ required: true, message: '조건을 입력해주세요.', trigger: 'blur' }],
  signalType: [
    { required: true, message: "신호 유형을 입력해주세요.", trigger: "blur" },
  ],
  bandwidth: [
    { required: true, message: "대역폭을 입력해주세요.", trigger: "blur" },
  ],
  temperature: [
    { required: false, validator: validateTemperature, trigger: "blur" },
  ],
  waferType: [
    { required: true, message: "웨이퍼 유형을 입력해주세요.", trigger: "blur" },
  ],
  packageType: [
    { required: true, message: "패키지 유형을 입력해주세요.", trigger: "blur" },
  ],
  testType: [
    {
      required: true,
      message: "테스트 유형을 입력해주세요.",
      trigger: "change",
    },
  ],
  targetPosition: [
    { required: true, message: "Target Position 선택.", trigger: "blur" },
  ],
  link: [
    { required: true, message: "Down / Up Link 선택.", trigger: "blur" },
  ],
  sampleQuantity: [
    {
      required: true,
      type: "number",
      message: "샘플 수량을 입력해주세요.",
      trigger: "blur",
    },
  ],
};


export function createApplicationRules(
    applicationFormBoolean: PDTRequestFormBooleanType
  ): FormRules {
    return {
      designer: [
        { required: true, message: "개발자를 입력해주세요.", trigger: "blur" },
      ],
      customerCompany: [
        {
          required: true,
          message: "고객 회사명을 입력해주세요.",
          trigger: "blur",
        },
      ],
      modelName: [
        { required: true, message: "모델명을 입력해주세요.", trigger: "blur" },
      ],
      signalType: [
        { required: true, message: "신호 유형을 입력해주세요.", trigger: "blur" },
      ],
      bandwidth: [
        { required: true, message: "대역폭을 입력해주세요.", trigger: "blur" },
      ],
      temperature: [
        {
          required: !applicationFormBoolean.temperature,
          validator: validateTemperature,
          trigger: "blur",
        },
      ],
      testType: [
        {
          required: true,
          message: "테스트 유형을 입력해주세요.",
          trigger: "change",
        },
      ],
    };
  }