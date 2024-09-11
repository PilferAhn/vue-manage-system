import { ref, watch } from "vue";

export interface PDTRequestFormType {
    applicationUuid: string;
  
    customerCompany: string;
    specTemperature: string;
    specPower: string;
    isSpecEdit: boolean;
  
    modelName: string;
    condition: string;
  
    signalType: string;
    band: string;
    duplexMode: string;
    bandwidth: string;
  
    designer: string;
    requester: string;
    purpose: string;
  
    temperature: string;
    duty: string;
    dateOfSampleConvey: string;
    dateOfCreate: string;
  
    waferType: string;
    packageType: string;
  
    testType: string;
    targetPosition: string;
  
    link: string;
  
    sampleQuantity: number;
    
    detail: string;
  
    requestNumber: string;
    status: string;
  }

export function usePDTRequestForm() {
    const form = ref<PDTRequestFormType>({
      applicationUuid: "",
      customerCompany: "",
      specTemperature: "",
      specPower: "",
      isSpecEdit: false,
  
      modelName: "",
      condition: "",
  
      signalType: "",
      band: "",
      duplexMode: "",
      bandwidth: "",
  
      designer: "",
      requester: "",
      purpose: "",
  
      temperature: "0",
      duty: "",
      dateOfSampleConvey: "",
      dateOfCreate: "",
  
      waferType: "",
      packageType: "",
  
      testType: "",
      targetPosition: "",
  
      link: "",
  
      sampleQuantity: 0,
      samples: [],
      detail: "",
  
      requestNumber: "",
      status: "",
    });
  
    return {
      form,
    };
  }