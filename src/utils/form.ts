// formFactory.ts
import { reactive } from 'vue';
import { ApplicationForm } from '../utils/types'; // ApplicationForm 인터페이스의 경로를 적절하게 수정하세요.

export function createApplicationForm(): ApplicationForm {
  return reactive<ApplicationForm>({
    customerCompany: "",
    specTemperature: "",
    specPower: "",
    isSpecEdit: false,
    uuid: "",
    requestNumber: null,
    modelName: "",
    band: "",
    condition: "",
    designer: "",
    requester: "",
    purpose: "",
    testType : "",
    waferType: "",
    productType: "",
    temperature: "",
    inputPower: "",
    detail: "",
    startFreq: "",
    endFreq: "",
    status: "",
    dateOfSampleConvey: "",
    dateOfCreated: "",
    dateOfConfirm: null,
    dateOfFinish: null,
    expectedMeasurementDate: null,
    expectedCompletionDate: null,
    desiredCompletionDate: null,
    signalType: "",
    duplexMode: null,
    bandwidth: "",
    packageType: "",
    targetPosition: "",
    sampleQuantity: 0,
    samples: []
  });
}
