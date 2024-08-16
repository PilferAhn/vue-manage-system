import { ref, watch } from "vue";
import type { FormRules } from "element-plus";
import { getCurrentDateTimeString } from "./cer-utility";

export interface CER0Form {
  id: string;

  //
  requesterId: string;
  requesterName: string;

  dateOfCreated: string;
  dateOfStart: string;
  dateOfWishToFinish?: string | null;
  dateOfCompleted?: string | null;

  purpose: string;

  modelName: string;
  version: string;

  m1Thick: string;
  layerStack: string;
  lotId: string;
  waferId: string;
  shot: string;
  note: string;

  handler_id: string | null;
  handler_name : string | null
  status: string | null;
}

export function initCER0Application(
  requesterName: string,
  requesterId: string
) {
  
  const today = getCurrentDateTimeString()

  const form = ref<CER0Form>({
    id: "",

    requesterId: requesterId,
    requesterName: "Onose",
    
    dateOfCreated: today,
    dateOfStart: null,
    dateOfWishToFinish: null,
    dateOfCompleted: null,

    purpose: "Grade2 B71 DPX",

    modelName: "XM71ATH",
    version: "PS1",

    m1Thick: "Ti/Cu/AlCu/Ti = 40/10/420/10",
    layerStack: "LT 1050/ SiO2 800 / a-Si 800",
    lotId: "NCIF40A60",
    waferId: "'ZEI041, ZEI042, ZEI043",
    shot: "3_7,7_3",
    note: "XM12ATMはScan Speed(50mm/s,125mm/s)ありますが、125mm/sでFittingしてください",

    handler_id: null,
    handler_name : null,
    status: null,
  });

  return {
    form,
  };
}

export const cer0FormRules: FormRules = {  
  requesterId: [
    { required: true, message: "Requester ID is required", trigger: "blur" }
  ],
  requesterName: [
    { required: true, message: "Requester Name is required", trigger: "blur" }
  ],
  dateOfCreated: [
    { required: true, message: "Date of Created is required", trigger: "blur" }
  ],
  dateOfStart: [
    { message: "Date of Start is required", trigger: "blur" }
  ],
  dateOfWishToFinish: [
    { required: true, type: "date", message: "Invalid date format", trigger: "blur" }
  ],
  dateOfCompleted: [
    { type: "date", message: "Invalid date format", trigger: "blur" }
  ],
  purpose: [
    { required: true, message: "Purpose is required", trigger: "blur" }
  ],
  modelName: [
    { required: true, message: "Model Name is required", trigger: "blur" }
  ],
  version: [
    { required: true, message: "Version is required", trigger: "blur" }
  ],
  m1Thick: [
    { required: true, message: "M1 Thickness is required", trigger: "blur" }
  ],
  layerStack: [
    { required: true, message: "Layer Stack is required", trigger: "blur" }
  ],
  lotId: [
    { required: true, message: "Lot ID is required", trigger: "blur" }
  ],
  waferId: [
    { required: true, message: "Wafer ID is required", trigger: "blur" }
  ],
  shot: [
    { required: true, message: "Shot is required", trigger: "blur" }
  ],


};