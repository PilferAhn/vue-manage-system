// SolderApplicationRules.ts

import { FormItemRule } from 'element-plus';

// Define rules for the form validation
export const solderApplicationRules = {
  modelName: [
    { required: true, message: '기종명은 필수 입력입니다.', trigger: 'blur' },
  ],
  lotId: [
    { required: true, message: 'LOT ID는 필수 입력입니다.', trigger: 'blur' },
  ],
  designer: [
    { required: true, message: '개발자는 필수 입력입니다.', trigger: 'blur' },
  ],
  requester: [
    { required: true, message: '의뢰자는 필수 입력입니다.', trigger: 'blur' },
  ],
  evbType: [
    { required: true, message: 'EVB Type은 필수 입력입니다.', trigger: 'blur' },
  ],
  deembedMode: [
    { required: true, message: 'Deembed Mode 출하정보는 필수 입력입니다.', trigger: 'blur' },
  ],
  band: [
    { required: true, message: 'Band 선택은 필수 입력입니다.', trigger: 'blur' },
  ],
};
