import { ref } from "vue";
import { FormInstance, FormRules, FormItemRule} from "element-plus";

// 🔹 Model Name 11자리 검증
const validateProductNameLength = (
  _rule: FormItemRule,
  value: string,
  callback: (error?: Error) => void
) => {
  if (!value) {
    return callback();
  }
  // 공백 제외
  const len = value.replace(/\s+/g, "").length;
  if (len !== 11) {
    return callback(new Error("Model Name은 정확히 11자리여야 합니다."));
  }
  return callback();
};

export const moduleAppRules = ref<FormRules>({
  productName: [
    { required: true, message: "Product Name is required", trigger: "blur" },
    {validator: validateProductNameLength, trigger: ["blur", "change"],}
  ],
  requester: [
    { required: true, message: "Requester is required", trigger: "blur" },
  ],
  requesterId: [
    { required: true, message: "Requester ID is required", trigger: "blur" },
  ],
  quantity : [
    { required: true, message: "Quantity is required", trigger: "blur" },
  ],
  dateOfDeliveryDate : [
    { required: true, message: "자체 전달 일자를 입력해주세요", trigger: "blur" },
  ],
  dateOfExpectedFinished : [
    { required: true, message: "완료 요청 일자를 입력해주세요", trigger: "blur" },
  ]

});
