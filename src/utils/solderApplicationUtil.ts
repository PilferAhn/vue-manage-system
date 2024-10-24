import { ApplicationData } from "../interface/solderAppInterface";
import { reactive } from "vue";
import axios from "axios";

// Function to initialize and return a reactive ApplicationData object
export const initializeApplicationData = () => {
  return reactive<ApplicationData>({
    uuid: "",
    lotId: "",
    modelName: "",

    designer: "",
    designerId: "",

    requester: "",
    requesterId: "",

    measurer: "",
    measurerId: "",

    evbType: "",
    evbInfo: "",

    filterType: "",
    pattern: "",
    fileName: "",
    shipmentInfo: "",
    detail: "",

    deembedMode : "",
    matchingComponentType : "",
            
    status : "created",
    measurementQuantity: 5,
    measurements: [
      {
        number : "1",
        measurementType: "특성 평가", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 0, // 초기값 '0' 문자열로 설정
        status : "",
        placeHolder : "", 
        detail : "",
      },
      {
        number : "2",
        measurementType: "내전력", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 0, // 초기값 '0' 문자열로 설정
        placeHolder : "메탈 마스크 WHC 보유 여부 확인, 없다면 의뢰 必", 
        
        status : "",      
        detail : "",
      },
      {
        number : "3",
        measurementType: "PS 신뢰성", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 0, // 초기값 '0' 문자열로 설정
        status : "",
        placeHolder : "고객사 기재할 것 (중화, K1)", 
        detail : "",
      },
      {
        number : "4",
        measurementType: "TCF", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 0, // 초기값 '0' 문자열로 설정
        status : "",
        placeHolder : "샘플 제작 : WHC / TCF : 본사  (WHC 이관 이후 Update 예정)", 
        detail : "",
      },
      {
        number : "5",
        measurementType: "비선형", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 0, // 초기값 '0' 문자열로 설정
        status : "",
        placeHolder : "", 
        detail : "",
      }
    ], // Initialize with an empty array
    segmentQuantity: 0,
    segments: [
      // {
      //   number: "1",
      //   start: "",
      //   stop: "",
      //   points: "",
      //   ifwb: "10",        
      // },      
    ],
    matchingQuantity : 0,
    matching : [
      // {
      //   number : "1",
      //   port : "",
      //   ind : {series : "", shunt : ""},
      //   cap : {series : "", shunt : ""}
      // }
    ]
  });
};

// SolderApplicationUtil.ts
export function updateMeasurements(applicationData: any) {
  const selectedQuantity = applicationData.measurementQuantity;
  applicationData.measurements = Array.from(
    { length: selectedQuantity },
    () => ({
      measurementType: "",
      isMeasured: false,
      quantity: 0,
    })
  );
}

export function updateSegments(applicationData: any) {
  const selectedQuantity = applicationData.sagmentQuantity;
  applicationData.segments = Array.from(
    { length: selectedQuantity },
    (_, index) => ({
      number: (index + 1).toString(),
      start: "",
      stop: "",
      points: "",
      ifwb: "10",      
    })
  );
}

export function updateMathching(applicationData: any) {
  const selectedQuantity = applicationData.matchingQuantity;
  applicationData.matching = Array.from(
    { length: selectedQuantity },
    (_, index) => ({
      number: (index + 1).toString(),      
      port: "",
      ind: {series : "", shunt : ""},
      cap: {series : "", shunt : ""},
    })
  );
}

// SolderApplicationUtil.ts
export function convertToPEP8(applicationData: any): any {
  const convertedData: any = {};

  for (const [key, value] of Object.entries(applicationData)) {
    const pep8Key = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
    convertedData[pep8Key] = value;
  }

  return convertedData;
}

export async function handleSubmit(applicationData: any) {
  // applicationData를 PEP8 형식으로 변환
  const pep8Data = convertToPEP8(applicationData);

  try {
    const response = await axios.post(
      "https://your-api-url.com/submit",
      pep8Data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Submission successful", response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}
