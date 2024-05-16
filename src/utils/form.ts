// formFactory.ts
import { reactive, ref  } from 'vue';
import { ApplicationForm, UserForm } from '../utils/types'; // ApplicationForm 인터페이스의 경로를 적절하게 수정하세요.

export const useForm = () => {
  const form = ref<UserForm>({
    id : '',
    name: "JiminAhn"  ,
    email: 'w2200202@wisol.co.kr',
    password: '',
    passwordConfirmation: '',
    department: '',
    employeeId: 'w2200202'
  });

  return form;
};

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
