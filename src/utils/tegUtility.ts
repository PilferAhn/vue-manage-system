import axios from "axios";
// tegUtility.ts
import { ref, nextTick } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { TegApplication, waferInformation, MeasInfo } from "./tegTypes";
import { TegApplication as oldTegApplication } from "./waferMeasurementHelper";
import { TegApplication as newTegApp } from "../interface/Teg/teg";
import { measTypes } from "./waferApplicationHelper";
import cloneDeep from "lodash/cloneDeep";
import { convertPep8ToCamelCase2 } from "./key-converter";
import { sendPostRequest } from "./httpProtocol";
// import TegApplication from "../views/TegPage/Application/TegApplication.vue";

function checkMeasTypes(measInfo: MeasInfo[]): boolean {
  const measTypes = measInfo.map((info) => info.measType);
  let tempBool = false;
  const validTypes: string[] = [
    // "Pre-TEG",
    "TEG",
    "TEG-1",
    "TEG-1.5",
    "TEG-N",
    "TEG-2",
    "TEG-3",
    "TCF",
    "CPW",
    "Delay Line",
  ];

  console.log(measTypes)
  for (let i = 0; i < measTypes.length; i++) {
    for (let j = 0; j < validTypes.length; j++) {
      if (measTypes[i] === validTypes[j]) {
        tempBool = true;
        break;
      }1
    }
  }

  if (!tempBool) {
    ElMessage.error(
      "측정종류에는 TEG, TCF, CPW, Delay Line 중 하나는 선택되어야 합니다"
    );
  }

  return tempBool;
}

export async function getTegApplicationsByFinishDateStatus(
  dateTime: string,
  status: string
) {
  const form = new FormData();
  const tegApp = ref<newTegApp[]>([]);
  const url =
    "http://10.29.11.57:40000/teg_application/get_applications_by_finish_date_status";
  form.append("status", status);
  form.append("date", "2025-02-14 00:00:00");
  const data = await sendPostRequest(url, form);

  tegApp.value = convertPep8ToCamelCase2(data);

  return tegApp.value;
}

async function create_teg_application_excel(application_uuid: string) {
  try {
    const response = await axios.get(
      "/teg_application/create_teg_application_excel" + "/" + application_uuid
    );
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

    console.log(applications);
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
  applicationUuid
) {
  form?.validate(async (valid: boolean) => {
    // validate 콜백을 async 함수로 선언
    activateDownload.value = false;
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
          applicationUuid.value = response.data.applicationUUID;
          console.log(applicationUuid.value);

          const excel_response = await create_teg_application_excel(
            response.data.applicationUUID
          );

          console.log(excel_response);
          ElMessage.success({
            message:
              "의뢰서 작성이 완료되었습니다.<br>버튼이 활성화되면 의뢰서를 다운로드 받을 수 있습니다.",
            dangerouslyUseHTMLString: true,
          });

          setTimeout(() => {
            activateDownload.value = true;
          }, 3000);
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

/**
 * 서버로 복사된 formData 리스트를 개별적으로 전송하는 함수
 * @param {TegApplication[]} formDataCopies - 서버로 보낼 formData 복사본 배열
 * @param {File} file - 업로드할 파일
 * @param {Ref} applicationUuid - 생성된 application UUID를 저장할 변수
 * @param {Ref} activateDownload - 다운로드 버튼 활성화 상태 관리 변수
 */
async function sendRequestForCopies(
  formDataCopies: TegApplication[],
  file: File,
  applicationUuid,
  activateDownload,
  files: File[]
) {
  try {
    for (const copy of formDataCopies) {
      // ✅ 개별 데이터 전송 (의뢰서 생성)
      const response = await axios.post(
        "/teg_application/create-teg-application",
        copy
      );

      // ✅ 파일 업로드
      if (file && response.status === 200) {
        await uploadImage(file, response.data.applicationUUID);
      }

      if (files.length > 0 && response.status == 200) {
        await uploadFiles(files, response.data.applicationUUID);
      }

      // ✅ 서버 응답이 성공일 경우
      if (response.status === 200) {
        applicationUuid.value = response.data.applicationUUID;

        // ✅ 성공 메시지 표시
        ElMessage.success({
          message:
            "의뢰서 작성이 완료되었습니다.<br>버튼이 활성화되면 의뢰서를 다운로드 받을 수 있습니다.",
          dangerouslyUseHTMLString: true,
        });

        // ✅ 다운로드 버튼 활성화 (3초 후)
        setTimeout(() => {
          activateDownload.value = true;
        }, 3000);
      }
    }
  } catch (error) {
    console.error("Error during request for copies:", error);
    ElMessage.error("복사본 요청 중 오류가 발생했습니다.");
  }
}

export async function createTegApplicationsForDvr(
  tegApp: TegApplication,
  file: File,
  applicationUuid,
  activateDownload,
  files: File[] | null
) {
  if (tegApp.waferType === null || tegApp.packageType === null) {
    ElMessage.error("공정조건 혹은 Package 값이 누락되었습니다.");
    return;
  }

  let dvrApplicationList = [];
  if (
    tegApp.waferType === "HS" &&
    ["CSP", "BDMP"].includes(tegApp.packageType)
  ) {
    dvrApplicationList = [
      {
        applicationType: "TEG-1",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
        ],
      },
      {
        applicationType: "TEG-1.5",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
        ],
      },
      {
        applicationType: "TEG-2",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
        ],
      },
    ];
  } else if (tegApp.waferType === "HS" && tegApp.packageType === "WLP") {
    dvrApplicationList = [
      {
        applicationType: "TEG-1",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
        ],
      },
      {
        applicationType: "TEG-1.5",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
        ],
      },
      {
        applicationType: "TEG-N",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
        ],
      },
      {
        applicationType: "TEG-2",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
        ],
      },
    ];
  } else if (
    ["NS", "TC"].includes(tegApp.waferType) &&
    ["CSP", "BDMP"].includes(tegApp.packageType)
  ) {
    console.log(3);
    dvrApplicationList = [
      {
        applicationType: "TEG-1",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
        ],
      },
      {
        applicationType: "TEG-2",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
        ],
      },
    ];
  } else if (
    ["NS", "TC"].includes(tegApp.waferType) &&
    tegApp.packageType === "WLP"
  ) {
    dvrApplicationList = [
      {
        applicationType: "TEG-1",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
        ],
      },
      {
        applicationType: "TEG-N",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-2",
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-3",
          },
        ],
      },
      {
        applicationType: "TEG-2",
        app: [
          {
            modelName: tegApp.modelName,
            lotId: tegApp.lotID,
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-1",
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-2",
          },
          {
            modelName: tegApp.modelName + "@",
            lotId: tegApp.lotID + "-3",
          },
        ],
      },
    ];
  }

  for (let i = 0; i < dvrApplicationList.length; i++) {
    for (let j = 0; j < dvrApplicationList[i].app.length; j++) {
      const tempApp = tegApp;
      tempApp.measInfo[0].measType = dvrApplicationList[i].applicationType;
      tempApp.modelName = dvrApplicationList[i].app[j].modelName;
      tempApp.lotID = dvrApplicationList[i].app[j].lotId;
      await sendSingleRequest(
        tempApp,
        file,
        applicationUuid,
        activateDownload,
        files
      );
    }
  }
}

/**
 * 서버로 단일 formData를 전송하는 함수
 * @param {TegApplication} formData - 서버로 전송할 단일 의뢰 데이터
 * @param {File} file - 업로드할 파일 (선택 사항)
 * @param {Ref} applicationUuid - 생성된 application UUID를 저장할 변수
 * @param {Ref} activateDownload - 다운로드 버튼 활성화 상태 관리 변수
 */
async function sendSingleRequest(
  formData: TegApplication,
  file: File,
  applicationUuid,
  activateDownload,
  files: File[]
) {
  try {
    // ✅ 서버로 개별 데이터 전송 (의뢰서 생성)
    const response = await axios.post(
      "/teg_application/create-teg-application",
      formData
    );

    // ✅ 파일 업로드 (서버 응답이 성공했을 경우만)
    if (file && response.status === 200) {
      await uploadImage(file, response.data.applicationUUID);
    }

    if (files.length > 0 && response.status == 200) {
      await uploadFiles(files, response.data.applicationUUID);
    }

    // ✅ 서버 응답이 성공일 경우
    if (response.status === 200) {
      applicationUuid.value = response.data.applicationUUID;

      // ✅ 엑셀 파일 생성
      await create_teg_application_excel(response.data.applicationUUID);

      // ✅ 성공 메시지 표시
      ElMessage.success({
        message:
          "의뢰서 작성이 완료되었습니다.<br>버튼이 활성화되면 의뢰서를 다운로드 받을 수 있습니다.",
        dangerouslyUseHTMLString: true,
      });

      // ✅ 다운로드 버튼 활성화 (3초 후)
      setTimeout(() => {
        activateDownload.value = true;
      }, 3000);
    }
  } catch (copyError) {
    console.error("Error during single request:", copyError);
    ElMessage.error("데이터 전송 중 오류가 발생했습니다.");
  }
}

export async function submitForm(
  form: FormInstance | null,
  formData: TegApplication,
  file: File,
  activateDownload,
  applicationUuid,
  tegTypes: any | null
) {
  form?.validate(async (valid: boolean) => {
    activateDownload.value = false;
    if (valid) {
      // Wafer 이름 중복 확인
      if (hasDuplicateWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름 중 중복되는 이름이 존재합니다.");
        return false;
      }

      // Wafer 이름 누락 확인
      if (!hasEmptyWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름을 입력해 주세요");
        return false;
      }

      // Frequency Section 이름 누락 확인
      if (!hasEmptyFreqSectionName(formData.measInfo)) {
        return false;
      }

      // 우선순위 설정
      formData.priority = setPriority(formData.applicationType, formData.isAOI);

      let isTCF = false;
      formData.measInfo.forEach((val, index) => {
        if (val.measType === "TCF") {
          isTCF = true;
        }
      });

      if (!isTCF) {
        if (!Array.isArray(tegTypes?.value)) {
          console.error("tegTypes is not a valid array:", tegTypes);
          return false;
        }

        // 2. needMeas가 true인 항목 필터링
        const needMeasTrueTypes = tegTypes.value.filter(
          (type: any) => type.options.needMeas === true
        );

        let step: string = "";
        needMeasTrueTypes.forEach((type: any, index: number) => {
          step += needMeasTrueTypes[index].name + "->";
        });

        formData.note = formData.note + "\n" + step;
        // 3. needMeasTrueTypes 갯수만큼 formData 복사본 생성
        // 3. needMeasTrueTypes 갯수만큼 formData 깊은 복사본 생성
        const formDataCopies = needMeasTrueTypes.map(() => cloneDeep(formData));

        // 4. 복사본에 measType 할당
        needMeasTrueTypes.forEach((type: any, index: number) => {
          if (!needMeasTrueTypes[index]["options"].needDelay) {
            formDataCopies[index].measInfo.forEach((measInfo, i) => {
              if (measInfo.measType === "Delay Line") {
                formDataCopies[index].measInfo.splice(i, 1); // 해당 요소 제거
              }
            });
          }

          if (!needMeasTrueTypes[index]["options"].needCPW) {
            formDataCopies[index].measInfo.forEach((measInfo, i) => {
              if (measInfo.measType === "CPW") {
                formDataCopies[index].measInfo.splice(i, 1); // 해당 요소 제거
              }
            });
          }

          formDataCopies[index].measInfo[0].measType =
            needMeasTrueTypes[index].name;
        });

        await nextTick();

        if (formData.isDvr) {
          createTegApplicationsForDvr(
            formData,
            file,
            applicationUuid,
            activateDownload,
            []
          );
        } else {
          await sendRequestForCopies(
            formDataCopies,
            file,
            applicationUuid,
            activateDownload,
            []
          );
        }

        // // 복사된 formData를 돌면서 요청을 보내는 함수
        // async function sendRequestForCopies() {
        //   try {
        //     for (const copy of formDataCopies) {
        //       // 서버로 개별 데이터 전송
        //       const response = await axios.post(
        //         "/teg_application/create-teg-application",
        //         copy
        //       );

        //       // 파일 업로드
        //       if (file && response.status === 200) {
        //         await uploadImage(file, response.data.applicationUUID);
        //       }

        //       // 성공 처리
        //       if (response.status === 200) {
        //         applicationUuid.value = response.data.applicationUUID;
        //         // console.log(applicationUuid.value);

        //         // 엑셀 파일 생성
        //         // const excel_response = await create_teg_application_excel(
        //         //   response.data.applicationUUID
        //         // );

        //         // 성공 메시지 표시
        //         ElMessage.success({
        //           message:
        //             "의뢰서 작성이 완료되었습니다.<br>버튼이 활성화되면 의뢰서를 다운로드 받을 수 있습니다.",
        //           dangerouslyUseHTMLString: true,
        //         });

        //         // 다운로드 버튼 활성화
        //         setTimeout(() => {
        //           activateDownload.value = true;
        //         }, 3000);
        //       }
        //     }
        //   } catch (error) {
        //     console.error("Error during request for copies:", error);
        //     ElMessage.error("복사본 요청 중 오류가 발생했습니다.");
        //   }
        // }

        // 요청 실행
      } else {
        await sendSingleRequest(
          formData,
          file,
          applicationUuid,
          activateDownload,
          []
        );

        // try {
        //   // 서버로 개별 데이터 전송
        //   const response = await axios.post(
        //     "/teg_application/create-teg-application",
        //     formData
        //   );

        //   // 파일 업로드
        //   if (file && response.status === 200) {
        //     await uploadImage(file, response.data.applicationUUID);
        //   }

        //   // 성공 처리
        //   if (response.status === 200) {
        //     applicationUuid.value = response.data.applicationUUID;
        //     // console.log(applicationUuid.value);

        //     // 엑셀 파일 생성
        //     const excel_response = await create_teg_application_excel(
        //       response.data.applicationUUID
        //     );

        //     // 성공 메시지 표시
        //     ElMessage.success({
        //       message:
        //         "의뢰서 작성이 완료되었습니다.<br>버튼이 활성화되면 의뢰서를 다운로드 받을 수 있습니다.",
        //       dangerouslyUseHTMLString: true,
        //     });

        //     // 다운로드 버튼 활성화
        //     setTimeout(() => {
        //       activateDownload.value = true;
        //     }, 3000);
        //   }
        // } catch (copyError) {
        //   console.error("Error during copy request:", copyError);
        //   ElMessage.error("데이터 전송 중 오류가 발생했습니다.");
        // }
      }

      // 1. tegTypes가 배열인지 확인
    } else {
      ElMessage.error("입력되지 않은 항목이 남아있습니다.");
      console.error("Validation failed.");
    }
  });
}

export async function submitForm2(
  form: FormInstance | null,
  formData: TegApplication,
  file: File,
  files: File[] | null,
  activateDownload,
  applicationUuid,
  tegTypes: any | null
) {
  form?.validate(async (valid: boolean) => {
    activateDownload.value = false;
    if (valid) {
      // Wafer 이름 중복 확인
      if (hasDuplicateWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름 중 중복되는 이름이 존재합니다.");
        return false;
      }

      // Wafer 이름 누락 확인
      if (!hasEmptyWaferName(formData.waferInformation)) {
        ElMessage.error("Wafer 이름을 입력해 주세요");
        return false;
      }

      // Frequency Section 이름 누락 확인
      if (!hasEmptyFreqSectionName(formData.measInfo)) {
        return false;
      }

      // 우선순위 설정
      formData.priority = setPriority(formData.applicationType, formData.isAOI);

      let isTCF = false;
      formData.measInfo.forEach((val, index) => {
        if (val.measType === "TCF") {
          isTCF = true;
        }
      });

      if (!isTCF) {
        if (!Array.isArray(tegTypes?.value)) {
          console.error("tegTypes is not a valid array:", tegTypes);
          return false;
        }
        formData.temperatures = []
        // 2. needMeas가 true인 항목 필터링
        const needMeasTrueTypes = tegTypes.value.filter(
          (type: any) => type.options.needMeas === true
        );

        let step: string = "";
        needMeasTrueTypes.forEach((type: any, index: number) => {
          step += needMeasTrueTypes[index].name + "->";
        });

        formData.note = formData.note + "\n" + step;
        // 3. needMeasTrueTypes 갯수만큼 formData 복사본 생성
        // 3. needMeasTrueTypes 갯수만큼 formData 깊은 복사본 생성
        const formDataCopies = needMeasTrueTypes.map(() => cloneDeep(formData));

        // 4. 복사본에 measType 할당
        needMeasTrueTypes.forEach((type: any, index: number) => {
          if (!needMeasTrueTypes[index]["options"].needDelay) {
            formDataCopies[index].measInfo.forEach((measInfo, i) => {
              if (measInfo.measType === "Delay Line") {
                formDataCopies[index].measInfo.splice(i, 1); // 해당 요소 제거
              }
            });
          }

          if (!needMeasTrueTypes[index]["options"].needCPW) {
            formDataCopies[index].measInfo.forEach((measInfo, i) => {
              if (measInfo.measType === "CPW") {
                formDataCopies[index].measInfo.splice(i, 1); // 해당 요소 제거
              }
            });
          }

          formDataCopies[index].measInfo[0].measType =
            needMeasTrueTypes[index].name;
        });

        await nextTick();

        if (formData.isDvr) {
          createTegApplicationsForDvr(
            formData,
            file,
            applicationUuid,
            activateDownload,
            files
          );
        } else {
          await sendRequestForCopies(
            formDataCopies,
            file,
            applicationUuid,
            activateDownload,
            files
          );
        }

        // 요청 실행
      } else {
        await sendSingleRequest(
          formData,
          file,
          applicationUuid,
          activateDownload,
          files
        );
      }

      // 1. tegTypes가 배열인지 확인
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
    console.log(contentDisposition);
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
    const formattedDate =
      currentDate.getFullYear() +
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
    // TEG 의뢰서 작성 중 메시지 표시
    ElMessage({
      message: "TEG 의뢰서를 작성 중입니다. 잠시만 기다려주세요.",
      type: "info",
      duration: 2000, // 메시지가 2초 동안 표시됨
    });

    await create_teg_application_excel(applicationUuid);

    // 2초 후 다운로드 실행
    setTimeout(async () => {
      await downloadExcel(applicationUuid);
    }, 2000);
  } catch (error) {
    console.error("Failed to download the excel file:", error);
    ElMessage.error("엑셀 파일 다운로드에 실패했습니다.");
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

export const uploadFiles = async (files: File[], uuid: string) => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]); // key 이름은 백엔드에서 기대하는 이름과 같아야 함
  }
  formData.append("teg_application_uuid", uuid); // UUID 추가

  try {
    const url = "teg_application/upload_teg_application_files";
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
