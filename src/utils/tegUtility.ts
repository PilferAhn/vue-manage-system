import axios from "axios";
// tegUtility.ts
import { ElMessage, FormInstance } from "element-plus";
import { TegApplication, waferInformation, MeasInfo } from "./tegTypes";

async function create_teg_application_excel(application_uuid: string) {
  try {
    const response = await axios.get(
      "/teg_application/create_teg_application_excel" + "/" + application_uuid
    );

  } catch (error) {
    ElMessage.error("Excel File을 생성하는데 실패했습니다. 관리자에게 문의하세요")
    console.error("Excel File을 생성하는데 실패했습니다. :", error);
  }
}

export async function submitForm(
  form: FormInstance | null,
  formData: TegApplication,
  file: File
) {
  form?.validate(async (valid: boolean) => {
    // validate 콜백을 async 함수로 선언
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
      formData.priority = setPriority(formData.applicationType);

      try {
        const response = await axios.post(
          "/teg_application/create-teg-application",
          formData
        );
        // 처리 결과 또는 후속 작업

        if (file && response.status == 200) {
          console.log("왜 안오지");
          await uploadImage(file, response.data.applicationUUID);
        }

        if (response.status == 200) {
          await create_teg_application_excel(response.data.applicationUUID)
        }

      } catch (error) {
        console.error("Error during server request:", error);
      }
    } else {
      console.error("Validation failed.");
      return false;
    }
  });
}

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

function setPriority(applicationType: string) {
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
