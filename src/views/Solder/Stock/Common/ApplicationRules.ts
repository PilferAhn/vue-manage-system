// rules.ts
import { FormRules } from "element-plus";

export const rules: FormRules = {
  reelId: [{ required: true, message: "Reel ID is required", trigger: "blur" }],
  receiver: [
    { required: true, message: "Receiver is required", trigger: "blur" },
  ],
  location: [
    { required: true, message: "Location is required", trigger: "blur" },
  ],
};
