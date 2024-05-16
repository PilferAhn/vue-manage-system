// rules.ts
import { FormRules, FormItemRule  } from "element-plus";
import { TegFormRuleInterface } from './waferApplicationHelper';
import { reactive } from 'vue'



// formRules.ts
export const registrationRules = {
  name: [
    { required: true, message: "Please input your name", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      message: "Please input your email address",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Please input a valid email address",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    { required: true, message: "Please input your password", trigger: "blur" },
  ],
  passwordConfirmation: [
    {
      required: true,
      message: "Please confirm your password",
      trigger: "blur",
    },

  ],
  department: [
    { required: true, message: "Please input your department", trigger: "blur" },
  ],
  employeeId: [
    { required: true, message: "Please input your employee ID", trigger: "blur" },
  ],
};


export const applicationRules: FormRules = {
  name: [{ required: true, message: "값을 입력해주세요", trigger: "blur" }],
  modelName: [
    { required: true, message: "기종명을 입력하세요", trigger: "blur" },
  ],
  condition: [
    { required: true, message: "설계차수를 입력하세요", trigger: "blur" },
  ],
  purpose: [
    { required: true, message: "의뢰목적을 입력하세요", trigger: "blur" },
  ],
  designer: [
    { required: true, message: "개발자 이름을 입력하세요", trigger: "blur" },
  ],
  requester: [
    { required: true, message: "의뢰자 이름을 입력하세요", trigger: "blur" },
  ],
  waferType : [
    { required: true, message: "Wafer 종류를 선택하세요", trigger: "blur" }
  ],
  packageType : [
    { required: true, message: "Package 종류를 선택하세요", trigger: "blur" }
  ],
  // temperature : [
  //   { required: true, message: "Test 온도를 입력하세요", trigger: "blur" }
  // ],
  band: [
    {
      required: true,      
      trigger: "blur",
    },
  ],
  
  // temperature: [
  //   {
  //     required: true,
  //     trigger: "blur",
  //     validator: (rule, value, callback) => {
  //       if (!value) {
  //         callback(new Error("실험 온도를 입력해주세요"));
  //       } else if (!/^\d+$/.test(value)) {
  //         callback(new Error("올바른 숫자 형식이 아닙니다"));
  //       } else {
  //         const integerValue = parseInt(value, 10);
  //         if (isNaN(integerValue)) {
  //           callback(new Error("정수로 변환 가능한 값을 입력해주세요"));
  //         } else {
  //           callback();
  //         }
  //       }
  //     },
  //   },
  // ],
};


export const TegApplicationRules: FormRules = {
  designer: [
    { required: true, message: '개발자 이름을 입력해야 합니다.', trigger: 'blur' }
  ],
  requester: [
    { required: true, message: '의뢰자 이름을 입력해야 합니다.', trigger: 'blur' }
  ],
  purpose: [
    { required: true, message: '의뢰 목적을 입력해야 합니다.', trigger: 'blur' }
  ],
  lotID: [
    { required: true, message: 'Lot ID를 입력해야 합니다.', trigger: 'blur' }
  ],
  shotSize: [
    { required: true, message: 'Shot Size를 입력해야 합니다.', trigger: 'blur' }
  ],
  chipSize: [
    { required: true, message: 'Chip Size를 입력해야 합니다.', trigger: 'blur' }
  ],
  chipQuantity: [
    { required: true, message: 'Chip Quantity를 입력해야 합니다.', trigger: 'blur' }
  ],
  maskName: [
    { required: true, message: 'Mask Name를 입력해야 합니다.', trigger: 'blur' }
  ],
  isMaskChange: [
    { required: true, message: 'Mask Change 여부를 선택해야 합니다.', trigger: 'change' }
  ],
  port: [
    { required: true, message: '사용 Port를 입력해야 합니다.', trigger: 'change' }
  ],

  waferQuantity: [
    { required: true, type: 'number', min: 1, message: 'Wafer 수량은 1개 이상이어야 합니다.', trigger: 'blur' }
  ],
  
  waferSize: [
    { required: true, message: 'Wafer Size를 선택해야 합니다.', trigger: 'change' }
  ],

  note: [
    { required: false, message: '특이사항을 입력할 수 있습니다.', trigger: 'blur' }
  ],
  modelName: [
    { required: true, message: '모델명을 입력해야 합니다.', trigger: 'blur' }
  ],
  applicationType : [
    { required: true, message: '의뢰 구분을 선택해야 합니다.', trigger: 'blur' }
  ]
  // 추가적인 필드 및 조건들에 대한 규칙을 여기에 정의할 수 있습니다.
};