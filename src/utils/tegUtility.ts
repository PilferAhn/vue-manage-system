import axios from "axios";
// tegUtility.ts
import { ElMessage, FormInstance } from "element-plus";
import { TegApplication, waferInformation, MeasInfo } from "./tegTypes";
import { TegApplication as oldTegApplication } from "./waferMeasurementHelper";
import { measTypes } from "./waferApplicationHelper";


function checkMeasTypes(measInfo: MeasInfo[]): boolean {
  const measTypes = measInfo.map((info) => info.measType);
  let tempBool = false;
  const validTypes: string[] = [
    "TCF",
    "TEG-P",
    "TEG-1",
    "TEG-1.5",
    "TEG-2",
    "TEG-3",
    "PDT",
  ];

  for (let i = 0; i < measTypes.length; i++) {
    for (let j = 0; j < validTypes.length; j++) {
      if (measTypes[i] === validTypes[j]) {
        tempBool = true;
        break;
      }
    }
  }

  if (!tempBool) {
    ElMessage.error(      
      "측정종류에는 TCF , TEG-P, TEG-1, TEG-1.5, TEG-2, TEG-3, PDT 중 하나는 선택되어야 합니다"

    );
  }

  return tempBool;
}

async function create_teg_application_excel(application_uuid: string) {
  try {
    const response = await axios.get(
      "/teg_application/create_teg_application_excel" + "/" + application_uuid
    );

    console.log(response.data);
    
  } catch (error) {
    ElMessage.error(
      "Excel File을 생성하는데 실패했습니다. 관리자에게 문의하세요"
    );
    console.error("Excel File을 생성하는데 실패했습니다. :", error);
  }
}

export async function getNewTegApplicationDetail(
  uuid: string
): Promise<TegApplication | null> {
  const url = `teg_application/get_teg_application_by_uuid/${uuid}`;
  try {
    const response = await axios.get<TegApplication>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching application details:", error);
    return null;
  }
}

export const getNewTegApplication = async (
  status: string
): Promise<oldTegApplication[]> => {
  try {
    const url = "teg_application/get-teg-applications-by-status";
    const response = await axios.get(url + "/" + status);
    let wafers = [];

    const applications: oldTegApplication[] = response.data.map((app: any) => ({
      applicationID: app.uuid,
      productName: app.model_name,
      lotId: app.lot_id,
      // waferId: app.wafer_id,
      // isTcf: app.is_tcf,
      // temperatures: app.temperatures,
      measType: app.measType,
      status: app.status,
      priority: app.priority,
      designer: app.designer + " / " + app.requester,
      progress: app.progress,
      dateOfCreated: app.date_of_created,
      dateOfFinished: app.date_of_finish,
      applicationType: app.application_type,
    }));

    return applications;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    throw error;
  }
};

export async function updateForm(
  form: FormInstance | null,
  formData: TegApplication,
  file: File,
  activateDownload,
  applicationUuid,
) {
  form?.validate(async (valid: boolean) => {
    // validate 콜백을 async 함수로 선언
    activateDownload.value = false
    if (valid) {
      // wafer 이름이 배열중에 중복되었는지 확인한다.
      if (hasDuplicateWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름중에 죽복되는 Wafer 이름이 존재합니다.");
        return false;
      }

      // wafer 이름이 누락되어 있는지 체크
      if (!hasEmptyWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름을 입력해 주세요");
        return false;
      }

      if (!hasEmptyFreqSectionName(formData.measInfo)) {
        return false;
      }

      // console.log("Form data:", formData);
      // 여기서 서버로 데이터를 전송할 수 있습니다.

      // priority 정하기
      formData.priority = setPriority(formData.applicationType, formData.isAOI);

      try {
        const response = await axios.post(
          "/teg_application/create-teg-application",
          formData
        );
        // 처리 결과 또는 후속 작업
        
        if (file && response.status == 200) {          
          await uploadImage(file, response.data.applicationUUID);
        }

        if (response.status == 200) {

          applicationUuid.value = response.data.applicationUUID
          console.log(applicationUuid.value)

          const excel_response = await create_teg_application_excel(
            response.data.applicationUUID
          );
          
          console.log(excel_response)
          ElMessage.success({
            message: '의뢰서 작성이 완료되었습니다.<br>버튼이 활성화되면 의뢰서를 다운로드 받을 수 있습니다.',
            dangerouslyUseHTMLString: true
          });

          setTimeout(() => {activateDownload.value = true}, 3000);                  
        }
      } catch (error) {
        console.error("Error during server request:", error);
      }
    } else {
      ElMessage.error("입력되지 않은 항목이 남아있습니다.");
      console.error("Validation failed.");
    }
  });
}

export async function submitForm(
  form: FormInstance | null,
  formData: TegApplication,
  file: File,
  activateDownload,
  applicationUuid,
) {
  form?.validate(async (valid: boolean) => {
    // validate 콜백을 async 함수로 선언
    activateDownload.value = false
    if (valid) {
      // wafer 이름이 배열중에 중복되었는지 확인한다.
      if (hasDuplicateWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름중에 죽복되는 Wafer 이름이 존재합니다.");
        return false;
      }

      // wafer 이름이 누락되어 있는지 체크
      if (!hasEmptyWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름을 입력해 주세요");
        return false;
      }

      if (!hasEmptyFreqSectionName(formData.measInfo)) {
        return false;
      }

      // console.log("Form data:", formData);
      // 여기서 서버로 데이터를 전송할 수 있습니다.

      // priority 정하기
      formData.priority = setPriority(formData.applicationType, formData.isAOI);

      try {
        const response = await axios.post(
          "/teg_application/create-teg-application",
          formData
        );
        // 처리 결과 또는 후속 작업
        
        if (file && response.status == 200) {          
          await uploadImage(file, response.data.applicationUUID);
        }

        if (response.status == 200) {

          applicationUuid.value = response.data.applicationUUID
          console.log(applicationUuid.value)

          const excel_response = await create_teg_application_excel(
            response.data.applicationUUID
          );
          
          console.log(excel_response)
          ElMessage.success({
            message: '의뢰서 작성이 완료되었습니다.<br>버튼이 활성화되면 의뢰서를 다운로드 받을 수 있습니다.',
            dangerouslyUseHTMLString: true
          });

          setTimeout(() => {activateDownload.value = true}, 3000);                  
        }
      } catch (error) {
        console.error("Error during server request:", error);
      }
    } else {
      ElMessage.error("입력되지 않은 항목이 남아있습니다.");
      console.error("Validation failed.");
    }
  });
}


export const downloadExcel = async (application_uuid) => {
  try {
    const response = await axios.get(
      `/teg_application/download_application_excel/${application_uuid}`,
      { responseType: "blob" } // 서버로부터 blob 형태로 데이터를 받기 위해 설정
    );

    // Blob 데이터로부터 다운로드 URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Content-Disposition 헤더에서 파일 이름 추출
    let filename = "default-filename.xlsx"; // 기본 파일 이름 설정
    const contentDisposition = response.headers["content-disposition"];
    console.log(contentDisposition)
    if (contentDisposition) {
      // const filenameRegex = /filename\*?=['"]?UTF-8''([^;'\"]*)['"]?;?/i;
      const filenameRegex = /filename="([^"]*)"/i;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches && matches[1]) {
        // UTF-8 인코딩 해제 및 디코딩
        filename = decodeURIComponent(matches[1]);
      }
    }

    // 현재 날짜를 년월일 형식으로 포맷
    const currentDate = new Date();
    const formattedDate = currentDate.getFullYear() +
                          ("0" + (currentDate.getMonth() + 1)).slice(-2) + // 월은 0부터 시작하므로 1을 추가
                          ("0" + currentDate.getDate()).slice(-2);

    // filename = "측정의뢰서_" + formattedDate + "_" + filename

    link.setAttribute("download", filename); // 다운로드할 파일 이름 설정
    document.body.appendChild(link);
    link.click(); // 프로그래매틱하게 링크 클릭 이벤트 발생

    // 정리 작업
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("Error:", error);
    console.error("Error downloading the report:", error);
    alert("다운로드 중 문제가 발생했습니다.");
  }
};


export const download = async (applicationUuid) => {
  if (!applicationUuid) {
    console.error("Application UUID is not provided!");
    return;
  }
  try {
    await downloadExcel(applicationUuid);
  } catch (error) {
    console.error("Failed to download the excel file:", error);
  }
};

export const uploadImage = async (file: File, uuid: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("teg_application_uuid", uuid); // UUID 추가

  try {
    const url = "teg_application/upload_teg_application_image";
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("서버 응답:", response.data);
    return response.data; // 함수가 서버 응답을 반환하도록 설정
  } catch (error) {
    console.error("업로드 에러:", error);
    throw error; // 오류를 호출자에게 전달
  }
};

function hasDuplicateWaferName(wafers: waferInformation[]): boolean {
  const namesSet = new Set<string>();
  for (const wafer of wafers) {
    if (namesSet.has(wafer.waferName)) {
      // If the name is already in the set, we have found a duplicate
      return true;
    }
    namesSet.add(wafer.waferName);
  }
  return false; // No duplicates were found
}

function hasEmptyWaferName(wafers: waferInformation[]): boolean {
  for (const wafer of wafers) {
    if (wafer.waferName === "") {
      return false;
    }
  }
  return true;
}

// 문자열을 부동 소수점으로 변환하고, 유효한 숫자인지 확인하는 함수
export function canConvertToFloat(str: string): boolean {
  // parseFloat를 사용하여 문자열을 숫자로 변환
  const num = parseFloat(str);
  // 변환된 숫자가 유효한지 확인하고 원본 문자열과 parseFloat로 변환된 문자열이 동일한지 확인
  return !isNaN(num) && str.trim() === num.toString();
}

function hasEmptyFreqSectionName(measInfo: MeasInfo[]): boolean {
  if (measInfo.length == 0) {
    ElMessage.error("측정 종류는 최소 1개 이상 선택되어야 합니다");
    return false;
  }

  if (!checkMeasTypes((measInfo = measInfo))) {
    return false;
  }

  for (const meas of measInfo) {
    if (meas.freqSectionInfo.length == 0) {
      ElMessage.error("측정을 진행할 주파수 영역의 값을 정확하게 입력하세요");
      return false;
    }

    for (const freqsection of meas.freqSectionInfo) {
      if (freqsection.start === "") {
        ElMessage.error("측정 주파수 Start 영역을 입력하세요");
        return false;
      }

      if (freqsection.stop === "") {
        ElMessage.error("측정 주파수 Stop 영역을 입력하세요");
        return false;
      }
      if (freqsection.point === "") {
        ElMessage.error("측정 Point수를 입력하세요");
        return false;
      }

      if (
        !canConvertToFloat(freqsection.start) ||
        !canConvertToFloat(freqsection.stop) ||
        !canConvertToFloat(freqsection.point)
      ) {
        ElMessage.error(
          "문자열은 입력할 수 없습니다. 주파수 값만 입력해주세요"
        );
      }
    }
  }
  return true;
}

function setPriority(applicationType: string, isAOI: string) {
  if (isAOI === "O") {
    return "4";
  }

  if (applicationType === "요소기술그룹") {
    return "1";
  } else if (applicationType === "차세대공법그룹") {
    return "1";
  } else if (applicationType === "차세대SAW그룹 - TEG") {
    return "2";
  } else if (applicationType === "상품화개발 - TEG") {
    return "2";
  } else if (applicationType === "차세대SAW그룹 - CHIP") {
    return "3";
  } else {
    // 상품화개발 - CHIP
    return "3";
  }
}

function validateWaferTypes() {}
