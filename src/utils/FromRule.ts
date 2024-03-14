// rules.ts
import { FormRules } from 'element-plus';

export const applicationRules: FormRules = {
  name: [{ required: true, message: "값을 입력해주세요", trigger: "blur" }],
  modelName: [{ required: true, message: "기종명을 입력하세요", trigger: "blur" }],
  condition: [{ required: true, message: "설계차수를 입력하세요", trigger: "blur" }],
  purpose: [{ required: true, message: "의뢰목적을 입력하세요", trigger: "blur" }],
  designer: [{ required: true, message: "개발자 이름을 입력하세요", trigger: "blur" }],
  requester: [{ required: true, message: "의뢰자 이름을 입력하세요", trigger: "blur" }],
  band: [{
    required: true,
    trigger: "blur",
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error("Band 정보를 입력해주세요"));
      } else if (!/^\d+$/.test(value)) {
        callback(new Error("숫자만 입력 가능합니다."));
      } else {
        const integerValue = parseInt(value, 10);
        if (isNaN(integerValue)) {
          callback(new Error("정수로 변환 가능한 값을 입력해주세요"));
        } else {
          callback();
        }
      }
    },
  }],
  temperature: [{
    required: true,
    trigger: "blur",
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error("실험 온도를 입력해주세요"));
      } else if (!/^\d+$/.test(value)) {
        callback(new Error("올바른 숫자 형식이 아닙니다"));
      } else {
        const integerValue = parseInt(value, 10);
        if (isNaN(integerValue)) {
          callback(new Error("정수로 변환 가능한 값을 입력해주세요"));
        } else {
          callback();
        }
      }
    },
  }],
};
