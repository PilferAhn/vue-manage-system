import axios from "axios";
import { ElMessage } from "element-plus";

export async function downloadZip(applicationUuid: string) {
  try {
    console.log(applicationUuid);
    const response = await fetch(`/deembed/download_zip/${applicationUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/zip",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    // 서버에서 전달된 파일 이름을 사용하여 다운로드
    const contentDisposition = response.headers.get("Content-Disposition");
    let fileName = `${applicationUuid}.zip`; // 기본 파일 이름

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      console.log(fileNameMatch);
      if (fileNameMatch && fileNameMatch.length > 1) {
        fileName = fileNameMatch[1].replace(/"/g, ""); // 파일 이름 추출 및 따옴표 제거
      }
    }

    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    ElMessage({
      message: "zip 파일이 성공적으로 다운로드되었습니다!",
      type: "success",
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    ElMessage({
      message: "zip 파일 다운로드에 실패했습니다.",
      type: "error",
    });
  }
}

export async function downloadPpt(applicationUuid: string) {
    try {
      const response = await fetch(`/deembed/download_ppt/${applicationUuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
  
      // 서버에서 전달된 파일 이름을 사용하여 다운로드
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log(contentDisposition)
      let fileName = `${applicationUuid}.pptx`; // 기본 파일 이름
  
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        console.log(fileNameMatch)
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = fileNameMatch[1];
        }
      }
  
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
  
      ElMessage({
        message: 'PPT 파일이 성공적으로 다운로드되었습니다!',
        type: 'success',
      });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      ElMessage({
        message: 'PPT 파일 다운로드에 실패했습니다.',
        type: 'error',
      });
    }
  }

export async function getPath(applicationUuid: string) {
  try {
    const url = "deembed/getPath/" + applicationUuid;
    const response = await axios.get(url);

    if (response.data.status) {
    }

    const path = response.data.path;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    throw error;
  }
}

export function openPathDialog(applicationID: string) {
  const path =
    "\\\\10.20.10.25\\www_new\\RFRND\\내전력시스템\\00.내전력팀\\00.TEST\\PDT v1.1\\B8\\HDDB08CN3-B11";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(path)
      .then(() => {
        // Show a message to the user that the path has been copied

        ElMessage({
          message: "경로가 클립보드에 복사되었습니다!",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        ElMessage({
          message: "경로 복사에 실패했습니다.",
          type: "error",
        });
      });
  } else {
    // Fallback: Copy to clipboard using a hidden text area
    const textArea = document.createElement("textarea");
    textArea.value = path;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      ElMessage({
        message: "경로가 클립보드에 복사되었습니다!",
        type: "success",
      });
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      ElMessage({
        message: "경로 복사에 실패했습니다.",
        type: "error",
      });
    }
    document.body.removeChild(textArea);
  }
}
