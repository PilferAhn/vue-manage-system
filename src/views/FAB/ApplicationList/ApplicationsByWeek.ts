import { processData } from "../Common/Application";
import type { ProcessData } from "../Interface/ApplicationInterface";
import type { FabRequestForm } from "../../../interface/fab-application-rev2";
import { ElMessageBox } from "element-plus";
import { sendPostRequest } from "../../../utils/httpProtocol";

export const handleDateChange = (processData: ProcessData) => {
  updateFinishedData(processData);
};

const updateFinishedData = (processData: ProcessData) => {
  let leadTime = 0;

  if (processData.packageType === "BDMP") {
    leadTime += 2;
  }

  if (processData.process === "HS") {
    leadTime += 12;
  } else if (processData.process === "TC") {
    leadTime += 8;
  } else {
    leadTime += 5;
  }

  const date = new Date(processData.wantedFabStartDate);

  date.setDate(date.getDate() + leadTime);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  processData.wantedFabFinishDate = `${year}-${month}-${day}`;
};

export const updateWeekNumber = async (
  app: FabRequestForm,
  weekNumber: number
) => {
  const form = new FormData();
  form.append("product_name", app.productName);
  form.append("new_value", weekNumber.toString());
  const url = await sendPostRequest(
    "http://10.29.11.124:40000/fab_monitoring_rev2/set_week_number",
    form
  );
};

export const updatePendingStatus = async (
  app: FabRequestForm,
  isPending: boolean
) => {
  const form = new FormData();
  form.append("product_name", app.productName);
  form.append("new_value", String(isPending));
  const url = await sendPostRequest(
    "http://10.29.11.124:40000/fab_monitoring_rev2/set_is_pending",
    form
  );
};

export const updateStatus = async (
  processData: ProcessData,
  status: string
) => {
  processData.status = status;

  if (status === "cancel" || status === "delay") {
    try {
      // 모달 창을 띄우고 사용자의 입력을 기다림
      const note = await ElMessageBox.prompt(
        "취소,지연 사유를 입력하세요:",
        "취소,사유",
        {
          confirmButtonText: "확인",
          cancelButtonText: "취소",
        }
      );

      // 사용자가 입력한 내용을 processData.note에 업데이트
      processData.note = note.value;
    } catch (error) {
      console.log("취소 사유 입력이 취소되었습니다.");
    }
  } else {
    processData.note = "";
  }
};
