import { FabRequestForm } from "../../interface/fab-application-rev2";
import { PDTRequestFormType } from "../../views/ProductPage/ApplicationPage/Application";
import { ElMessageBox, ElMessage } from "element-plus";
import { sendGetRequest } from "../httpProtocol";

export function allocFabFormToPdtForm(
  fabApp: FabRequestForm,
  pdtApp: PDTRequestFormType
) {
  for (const key in fabApp) {
    if (
      fabApp.hasOwnProperty(key) && // fabApp에 해당 키가 존재하는지 확인
      pdtApp.hasOwnProperty(key) && // tegApp에 해당 키가 존재하는지 확인
      typeof (fabApp as any)[key] === typeof (pdtApp as any)[key] // 타입 비교
    ) {
      pdtApp[key] = fabApp[key];
      // (pdtApp as any)[key] = (fabApp as any)[key]; // 값을 복사
    }
  }

  pdtApp.modelName = fabApp.productName;
  pdtApp.requester = fabApp.requester.userName;
  pdtApp.designer = fabApp.designer.userName;
  pdtApp.purpose  = fabApp.note
  if (fabApp.packageId !== "CSP") {
    pdtApp.packageType = "";
  } else {
    pdtApp.packageType = fabApp.packageId;
  }

  
  pdtApp.waferType = fabApp.wafer.sawTypeId;
  // console.log(fabApp)
}

export async function deletePdtApplication(uuid: string): Promise<boolean> {
  try {
    await ElMessageBox.confirm(
      "정말로 삭제하시겠습니까? (한번 삭제된 정보는 복구할 수 없습니다)",
      "Warning",
      {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      }
    );

    // "Yes" is clicked: Send HTTP request
    sendGetRequest("/pdt_application/delete_pdt_application", uuid);

    ElMessage({
      type: "success",
      message: "삭제가 완료되었습니다.",
    });
    return true;
  } catch (error) {
    // "No" is clicked or dialog is closed
    ElMessage({
      type: "info",
      message: "작업이 취소되었습니다.",
    });
    return false;
  }
}