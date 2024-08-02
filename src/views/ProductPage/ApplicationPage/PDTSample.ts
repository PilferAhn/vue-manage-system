import axios from "axios";

import { ElMessageBox, ElMessage, genFileId } from "element-plus";

import type { SampleInformation } from "./Application";

export function calculateOffset(sample : SampleInformation, position : string, link : string){

  if(position === "" || position === "ETC"){
    return "0"
  }

  if(link === "" || link === "ETC"){
    return "0"
  }

  if(sample.ilLevel === ""){
    return "0"
  }

  if(sample.sInput === ""){
    return "0"
  }

  if(sample.sOutput === ""){
    return "0"
  }


}

export const checkFileExtension = (fileName) => {
  // 파일 확장자 가져오기
  const extension = fileName.split(".").pop().toLowerCase();
  // 확장자가 's'로 시작하고 'p'로 끝나는지 확인
  return extension.startsWith("s") && extension.endsWith("p");
};

const checkSnPNumber = (fileName) => {
  // 파일 확장자 가져오기
  const extension = fileName.split(".").pop().toLowerCase();
  // 일단은 s 2 p 만 가능.
  return extension.toLowerCase() === "s2p";
};



export const handleFileSelect = (sample: SampleInformation) => {
  // File selection logic
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  // fileInput.accept = '.txt'; // Example: Allow only .txt extension
  fileInput.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files[0];

    // 확장자 체크
    if (!checkFileExtension(selectedFile.name)) {
      ElMessage.error("S parameter 파일만 선택할 수 있습니다.");
      return;
    }

    // if (!checkSnPNumber(selectedFile.name)) {
    //   ElMessage.error(
    //     "현재 버전에서는 S2P 형식만 지원됩니다. S parameter 파일을 S2P형식으로 변환 후 사용해주세요."
    //   );
    //   return;
    // }

    if (selectedFile) {
      // Use FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result as string; // 결과를 문자열로 캐스팅

        sample.sParaFileName = selectedFile.name;
        sample.fileContent = fileContent;

        // 여기서 Logic 하나를 더 추가. 
        // 만약 필요한 값들이 다 입력되어 있다면 OFFSET 값 자동으로 계산되도록. 


      };
      reader.readAsText(selectedFile);
    }
  });
  fileInput.click();
};

export async function updateSampleStatus(sampleNumber : string , sampleUuid: string, status: string) {
  try {

    const formData = new FormData();
    formData.append("pdt_application_sample_uuid", sampleUuid)
    formData.append("status", status)
    formData.append("sample_number", sampleNumber)

    const response = await axios.post(
      "/pdt_application/update_pdt_appliction_sample_status",
      formData
    );

    if (response.status === 200) {
      if (response.data.status) {
        ElMessage.success(`${sampleNumber}가 정상적으로 업데이트 되었습니다.`);
      } else {
        ElMessage.error("의뢰서 작성에 실패했습니다. 잠시 후에 시도하세요");
      }
    }
  } catch (error) {
    ElMessage.error("알수없는 오류가 발생했습니다. 잠시 후에 시도하세요");
  }
}