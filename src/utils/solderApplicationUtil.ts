import { ApplicationData } from "../interface/solderAppInterface";
import { reactive } from "vue";

// Function to initialize and return a reactive ApplicationData object
export const initializeApplicationData = () => {
  return reactive<ApplicationData>({
    applicationUuid: "",
    measurerName: "",
    measurerId: "",
    measurementCompletionDate: "",
    modelName: "",
    lotId: "",
    designer: "",
    designerId: "",
    requester: "",
    requesterId: "",
    evbType: "",
    shipmentInfo: "",
    evbInfo: "",
    fileName: "",
    chipPattern: "",
    pkgType: "",
    measurementQuantity: 1,
    measurements: [
      {
        measurementType: "", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 0 , // 초기값 '0' 문자열로 설정
      },
    ], // Initialize with an empty array
  });
};
