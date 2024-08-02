import { ElMessageBox, ElMessage, genFileId } from "element-plus";
import { checkFileExtension } from "./PDTSample";
import type {
  SampleInformation,
  point,

} from "./Application";
import axios from "axios";

export async function calculateOffset(
  sample: SampleInformation,
  index: number,
  position: string,
  link: string
) {
  let isValid = true;

  if (position === "" || position === "ETC") {
    ElMessage.error(`Target Position값을 확인해주세요. EX(High, Low)`);
    isValid = false;
    return "0";
  }

  if (link === "" || link === "ETC") {
    ElMessage.error(`Link 값을 확인해주세요. EX(Uplink, Downlink)`);
    isValid = false;
    return "0";
  }

  if (sample.ilLevel === "") {
    ElMessage.error(`Sample ${index + 1} Il Level값이 누락되었습니다. `);
    isValid = false;
  }

  if (sample.sInput === "" || sample.sOutput === "") {
    ElMessage.error(`Sample ${index + 1} Tab Port값이 누락되었습니다.`);
    isValid = false;
    return "0";
  }

  if (sample.fc === "") {
    ElMessage.error(`Sample ${index + 1} Center Frequacy값이 누락되었습니다.`);
    isValid = false;
    return "0";
  }

  // Check if ilLevel is a valid number
  if (isNaN(Number(sample.ilLevel))) {
    ElMessage.error(`Sample ${index + 1} Il Level 에 숫자만 입력해주세요. `);
    isValid = false;
    return "0";
  }

  try {
    const formData = new FormData();
    formData.append("s_para", sample.fileContent);
    formData.append("position", position);
    formData.append("link", link);
    formData.append("fc", sample.fc);
    formData.append("il_level", sample.ilLevel);
    formData.append("port_output", sample.sOutput);
    formData.append("port_input", sample.sInput);

    console.log(formData);
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}

export const handleFileSelect = async (
  sample: SampleInformation,
  index: number,
  position: string,
  link: string
) => {
  let isValid = true;
  if (position === "" || position === "ETC") {
    ElMessage.error(`Target Position값을 확인해주세요. EX(High, Low)`);
    isValid = false;
    return "0";
  }

  if (link === "" || link === "ETC") {
    ElMessage.error(`Link 값을 확인해주세요. EX(Uplink, Downlink)`);
    isValid = false;
    return "0";
  }

  if (sample.dB3Freq === "") {
    console.log("1");
    ElMessage.error(`Sample ${index + 1} Il Level값이 누락되었습니다. `);
    isValid = false;
    return "0";
  }

  if (sample.sInput === "" || sample.sOutput === "") {
    ElMessage.error(`Sample ${index + 1} Tab Port값이 누락되었습니다.`);
    return "0";
  }

  if (sample.fc === "" || sample.fc === "0") {
    ElMessage.error(`Sample ${index + 1} Center Frequacy값이 누락되었습니다.`);
    return "0";
  }

  // Check if ilLevel is a valid number
  if (isNaN(Number(sample.ilLevel))) {
    ElMessage.error(`Sample ${index + 1} Il Level 에 숫자만 입력해주세요. `);
    return "0";
  }

  // File selection logic
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  // fileInput.accept = '.txt'; // Example: Allow only .txt extension
  fileInput.addEventListener("change", async (event) => {
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
      reader.onload = async (event) => {
        const fileContent = event.target.result as string; // 결과를 문자열로 캐스팅

        sample.sParaFileName = selectedFile.name;
        sample.fileContent = fileContent;

        try {
          const vals = await test(
            selectedFile.name,
            fileContent,
            sample.dB3Freq,
            sample.sOutput,
            sample.sInput
          );
          console.log(sample.fc)
          // 여기서 Logic 하나를 더 추가.
          // 만약 필요한 값들이 다 입력되어 있다면 OFFSET 값 자동으로 계산되도록.
          sample.points = vals.points;
          console.log(vals.fc)
          sample.offset = parseFloat((vals.fc - Number(sample.fc)).toFixed(3));
        } catch (error) {
          console.error("Error fetching points:", error);
        }
      };
      reader.readAsText(selectedFile);
    }
  });
  fileInput.click();
};
async function test(
  fileName: string,
  fileContent: string,
  ilLevel: string,
  sOutput: string,
  sInput: string
) {
  try {
    const formData = new FormData();
    formData.append("file_name", fileName);
    formData.append("s_para", fileContent);
    formData.append("il_level", ilLevel);
    formData.append("port_output", sOutput);
    formData.append("port_input", sInput);
    const response = await axios.post(
      "/s-parameter/get-s-para-points",
      formData
    );

    return { points: response.data.points, fc: response.data.fc };
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}
