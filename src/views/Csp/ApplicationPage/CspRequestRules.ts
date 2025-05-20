// SolderApplicationRules.ts

import { FormItemRule } from "element-plus";

// Define rules for the form validation
export const cspRequestRules = {
  modelName: [
    { required: true, message: "기종명은 필수 입력입니다.", trigger: "blur" },
  ],
  designer: [
    { required: true, message: "개발자는 필수 입력입니다.", trigger: "blur" },
  ],
  requester: [
    { required: true, message: "의뢰자는 필수 입력입니다.", trigger: "blur" },
  ],
  evbType: [
    { required: true, message: "EVB Type은 필수 입력입니다.", trigger: "blur" },
  ],
  filterType: [
    { required: true, message: "Filter Type은 필수 입력입니다.", trigger: "blur" },
  ],
  band: [
    { required: true, message: "Band 정보는 필수 입력입니다.", trigger: "blur" },
  ],
  matchingComponentType: [
    { required: true, message: "Matching Component Type 정보는 필수 입력입니다.", trigger: "blur" },
  ],
  pkgType : [
    { required: true, message: "Package Type 정보는 필수 입력입니다.", trigger: "blur" },
  ],
  deembedMode: [
    {
      required: true,
      message: "Deembed Mode 출하정보는 필수 입력입니다.",
      trigger: "blur",
    },
  ], 
  // client : [
  //   {
  //     required: true,
  //     message: "고객사 정보를 입력하세요",
  //     trigger: "blur",
  //   },
  // ]
};
