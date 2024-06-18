import axios from "axios";
import { Ref, ref } from "vue";
import { canConvertToFloat } from "./tegUtility";
import { createApplicationForm } from "./form"
import { ApplicationForm } from "./types";
import { ElMessage } from "element-plus";
import { bandInformationDict, BandInformationDict } from "./types";
// signalOptions.ts

export async function checkApplication(applicationUuid: string) {
  try {
    const response = await axios.get(
      `pdt_application/check-application-existence/${applicationUuid}`
    );
    return response.data.excel_uuid;
  } catch (error) {
    console.error("Failed to fetch excel UUID:", error);
    return "Error fetching data"; // 오류 발생 시 처리 방법에 따라 적절히 조정
  }
}

export function computeChannelBandwidth(testType: string, duplexMode: string) {
  if (testType === "Aging") {
    if (duplexMode === "TDD") return ["5Mhz"];
    else {
      // FDD 일 경우
      return ["1.4Mhz"];
    }
  } else if (testType === "AMR") {
    return ["5Mhz"];
  } else if (["Life", "Max Fuse", "Step Stress"].includes(testType)) {
    return ["1.4Mhz", "5Mhz", "10Mhz"];
  } else {
    return [];
  }
}

export function computeSignalOptions(testType: string) {
  if (testType === "Self Heating") {
    return [{ label: "CW", value: "CW" }];
  } else if (["Life", "Max Fuse", "Step"].includes(testType)) {
    return [
      { label: "CW", value: "CW" },
      { label: "CW Duty 50%", value: "CW Duty 50%" },
      { label: "WIFI", value: "WIFI" },
      { label: "GSM", value: "GSM" },
      { label: "NR", value: "NR" },
      { label: "LTE", value: "LTE" },
      { label: "기타", value: "etc" },
    ];
  } else {
    return [
      { label: "LTE", value: "LTE" },
      { label: "WIFI", value: "WIFI" },
    ];
  }
}

export function computeRB(testType: string) {
  if (testType === "Aging") {
    return ["1RB"];
  } else if (testType === "AMR") {
    return ["12RB"];
  } else if (["Lifetime", "Max Fuse", "Step Stress"].includes(testType)) {
    return ["1RB"];
  } else {
    return [];
  }
}

export const createRequestNumber = async () => {
  try {
    const url = "pdt_application/generate-reqeust-number";
    const response = await axios.get(url);
    const requestNumber = response.data.value.reqeust_number;
    return requestNumber;
  } catch (error) {
    console.error("Error:", error);
  }
};


export function getSystemBand(signalType: string, band: string) {
  const bandInfo: BandInformationDict = bandInformationDict;

  

  if (["LTE", "NR", "CW"].includes(signalType)) {

    const bandList = Object.keys(bandInfo[signalType]);
    
    const tempBand = band.toLowerCase()

    if (bandList.includes(tempBand)) {
      return bandInfo[signalType][tempBand]["uplinkMhz"]
      
    }
  }

  return ["1" , "2"]
}


export const downloadExcel = async (application_excel_uuid: string) => {
  try {
    const response = await axios.get(
      `/pdt_application/download_application_excel/${application_excel_uuid}`,
      { responseType: "blob" } // 서버로부터 blob 형태로 데이터를 받기 위해 설정
    );

    // Blob 데이터로부터 다운로드 URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Content-Disposition 헤더에서 파일 이름 추출
    let filename = "default-filename.xlsx"; // 기본 파일 이름 설정
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameRegex = /filename\*?=['"]?UTF-8''([^;'\"]*)['"]?;?/i;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches && matches[1]) {
        // UTF-8 인코딩 해제 및 디코딩
        filename = decodeURIComponent(matches[1]);
      }
    }

    link.setAttribute("download", filename); // 다운로드할 파일 이름 설정
    document.body.appendChild(link);
    link.click(); // 프로그래매틱하게 링크 클릭 이벤트 발생

    // 정리 작업
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error:", error);
    // 적절한 오류 처리
  }
};

// fetchData 함수 정의
export async function requestApplicationDetailbyUUID(uuid: string, applicationForm : ApplicationForm ): Promise<ApplicationForm> {
  try {
    const response = await axios.post("pdt_application/get_application_detail", { uuid });
    

    applicationForm.requestNumber = response.data.request_number;

    applicationForm.status = response.data.status;

    applicationForm.customerCompany = response.data.customer_company.toUpperCase();
    applicationForm.specTemperature = response.data.spec_temperature;
    applicationForm.specPower = response.data.spec_power;
    applicationForm.isSpecEdit = response.data.is_spec_edit;

    applicationForm.modelName = response.data.model_name;
    applicationForm.condition = response.data.condition;

    applicationForm.signalType = response.data.signal_type;
    applicationForm.band = response.data.band.toUpperCase();
    applicationForm.duplexMode = response.data.duplex_mode;
    applicationForm.bandwidth = response.data.bandwidth;

    applicationForm.designer = response.data.designer;
    applicationForm.requester = response.data.requester;

    applicationForm.dateOfCreated = response.data.date_of_created;

    applicationForm.dateOfSampleConvey = response.data.date_of_comformed;
    applicationForm.purpose = response.data.purpose;

    applicationForm.waferType = response.data.wafer_type;

    applicationForm.packageType = response.data.package_type;

    applicationForm.detail = response.data.detail;

    applicationForm.testType = response.data.test_type;
    applicationForm.targetPosition = response.data.target_position.toUpperCase();
    applicationForm.temperature = response.data.temperature + "℃";
    applicationForm.samples = response.data.samples;

    applicationForm.sampleQuantity = response.data.samples.length;
    applicationForm.dateOfCreated = response.data.date_of_created;

    return applicationForm
    

  } catch (error) {
    console.error("Failed to fetch measurement data:", error);
    throw error; // 에러를 다시 던져 호출 측에서 처리하도록 함
  }
}

export function validateSampleData(dataList: Ref<any[]>): boolean {
  dataList.value.forEach((data) => {

    // 사용자가 Input 주파수를 변경하고 싶을때
    if (!data.useDefaultFreq) {


      // 만약 offset 값에 아무것도 없다면 
      if (data.offset === "") {
        data.offset = "0";
      }

       
      if (!canConvertToFloat(data.offset)) {
        ElMessage.error("ΔFreq 값은 양수나 음수로 이루어진 숫자여야합니다.");
        return false;
      }

      if (!canConvertToFloat(data.offset)) {
        ElMessage.error("ΔFreq 값은 양수나 음수로 이루어진 숫자여야합니다.");
        return false;
      }

      data.targetFreq = (
        Number(data.defaultFreq) + Number(data.offset)
      ).toString();

    } else {
      // 사용자가 System Band값을 그대로 사용하고 싶은 경우
      data.targetFreq = data.defaultFreq;
    }
  });

  return true;
}

export const dutyList = ["40", "50"];
