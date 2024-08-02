import { ElMessageBox, ElMessage } from "element-plus";
import axios from "axios";
import { sendGetRequest } from "../../utils/httpProtocol";

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const reservedApplication = async (form: any, uuid: string) => {
  try {
    form.expectedMeasurementDate = formatDate(form.expectedMeasurementDate);
    form.expectedCompletionDate = formatDate(form.expectedCompletionDate);
    form.desiredCompletionDate = formatDate(form.desiredCompletionDate);

    const const_data_dict = {
      request_number: form.requestNumber,
      status: form.status,
      uuid: uuid,

      expected_measurement_date: form.expectedMeasurementDate,
      expected_completion_date: form.expectedCompletionDate,
      desired_completion_date: form.desiredCompletionDate,

      customer_company: form.customerCompany,
      spec_temperature: form.specTemperature,
      spec_power: form.specPower,
      is_spec_edit: form.isSpecEdit,

      model_name: form.modelName,
      condition: form.condition,

      signal_type: form.signalType,
      band: form.band,
      duplex_mode: form.duplexMode,
      bandwidth: form.bandwidth,

      designer: form.designer,
      requester: form.requester,

      purpose: form.purpose,
      date_of_sample_convey: form.dateOfSampleConvey,

      wafer_type: form.waferType,

      package_type: form.packageType,

      detail: form.detail,

      test_type: form.testType,
      target_position: form.targetPosition,
      samples: form.samples,

      temperature: form.temperature,
    };

    const response = await axios.post(
      "/pdt_application/create_booking",
      const_data_dict
    );

    if (response.status != 200) {
      ElMessage.error("의뢰서 업데이트에 실패했습니다. 관리자에게 문의하세요");
    } else {
      ElMessage.success("의뢰서가 성공적으로 업데이트 되었습니다.");
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};

export const deleteApplicationByUuid = async (applicationUuid: string) => {
  ElMessageBox.confirm(
    "삭제된 데이터는 되돌릴 수 없습니다.\n정말로 삭제하시겠습니까?",
    "경고",
    {
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      type: "warning",
    }
  )
    .then(async () => {
      // async 키워드 추가
      try {
        const result = await sendGetRequest(
          "pdt_application/delete_pdt_application",
          applicationUuid
        );
        // 성공적으로 삭제된 후의 로직을 여기에 추가
        location.reload(); // 페이지 새로고침
      } catch (error) {
        // 에러 처리 로직을 여기에 추가
        console.error(error);
      }
    })
    .catch(() => {
      // 사용자가 '아니오'를 누르거나 팝업을 닫을 경우, 여기서 처리할 수 있습니다.
    });
};

export const updateApplicationNumber = async (
  applicationUuid: string,
  requestNumber: string,
  applicationForm : any
) => {
  console.log(requestNumber)
  if (requestNumber === "" || requestNumber === null) {
    ElMessage.error("의뢰 번호를 입력하세요")
  } else {
    try {
      const url = "pdt_application/update_application_number";

      const formData = new FormData();
      formData.append("pdt_application_uuid", applicationUuid);
      formData.append("request_number", requestNumber);

      const response = await axios.post(url, formData);

      if (!response.data.status) {
        ElMessage.error(response.data.message);
      } else if (response.data.status) {
        ElMessage.success("의뢰서 번호가 정상적으로 할당되었습니다.");
        applicationForm.status = "reserved"
      } else {
        ElMessage.error("알수없는 Error 발생, 잠시 후 다시 시도하세요.");
      }
    } catch (error) {
      ElMessage.error("알수없는 Error발생");
    }
  }
};

export const updateApplicationStatus = async (
  applicationUuid: string,
  requestNumber : string,
  status: string
) => {
  try {
    const url = "pdt_application/update_application_status";

    const formData = new FormData();
    formData.append("pdt_application_uuid", applicationUuid);
    formData.append("status", status);
    formData.append("request_number" , requestNumber)

    const response = await axios.post(url, formData);

    if (!response.data.status) {
      ElMessage.error(response.data.message);
    } else if (response.data.status) {
      ElMessage.success("의뢰서를 성공적으로 업데이트!");
    } else {
      ElMessage.error("알수없는 Error 발생, 잠시 후 다시 시도하세요.");
    }
  } catch (error) {
    ElMessage.error("알수없는 Error발생");
  }
};
