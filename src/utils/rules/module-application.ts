import { ref } from "vue";
import { FormInstance, FormRules } from "element-plus";

export const moduleAppRules = ref<FormRules>({
  productName: [
    { required: true, message: "Product Name is required", trigger: "blur" },
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
