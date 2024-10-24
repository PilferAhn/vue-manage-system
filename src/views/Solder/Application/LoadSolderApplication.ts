import { ApplicationData } from "../../../interface/solderAppInterface";
import axios from "axios";
import { ref, watch, onMounted, reactive } from "vue";
import {
  convertKeysToCamelCase,
  sortMeasurementByNumber,
} from "../ApplicationList/SolderApplicationList";

// applicationData를 초기화
// const applicationData = reactive<ApplicationData>(initializeApplicationData2());

// 특정 URL로 파일 다운로드 요청을 보내는 함수
export async function downloadFileByUrl(fileUuid: string, fileName: string) {
  try {
    const url = `/solder/download_solder_application_file/${fileUuid}`;
    const response = await axios.get(url, {
      responseType: "blob", // 파일을 blob 형태로 다운로드
    });

    // 파일을 다운로드하는 로직
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    link.setAttribute("download", fileName); // 다운로드할 파일 이름 설정
    document.body.appendChild(link);
    link.click();
    link.remove(); // 링크 제거
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

// 함수: uuid에 따라 데이터를 가져오는 함수
async function fetchApplicationData(
  applicationData: ApplicationData,
  uuid: string
) {
  try {
    const url = `/solder/get_solder_application_by_uuid/${uuid}`;
    const response = await axios.get(url);

    const s = convertKeysToCamelCase(response.data);

    // 응답 데이터를 반응형 객체에 할당 (객체 전체를 대입하지 않고 속성만 덮어쓰기)
    Object.assign(applicationData, s); // 기존 객체의 속성을 덮어씀
    // applicationData = s
    return s as ApplicationData;
  } catch (error) {
    console.error("Error fetching application data:", error);
  }
}

export function useApplicationData(
  applicationData: ApplicationData,
  uuid: string
) {
  // uuid가 변경될 때마다 데이터를 요청
  watch(
    () => uuid,
    async (newUuid) => {
      if (newUuid) {
        console.log("New UUID");
        const fetchedData = await fetchApplicationData(
          applicationData,
          newUuid
        ); // 객체 속성만 갱신

        if (fetchedData) {
          sortApplicationDataByNumber(fetchedData);
          Object.assign(applicationData, fetchedData); // 정렬된 데이터를 할당
        }
      }
    }
  );

  // 페이지가 처음 로딩될 때 데이터를 가져오는 로직
  onMounted(async () => {
    if (uuid) {
      console.log("Mounted");
      const fetchedData = await fetchApplicationData(applicationData, uuid); // 객체 속성만 갱신
      console.log(fetchedData)
      if (fetchedData) {
        sortApplicationDataByNumber(fetchedData);
        Object.assign(applicationData, fetchedData); // 정렬된 데이터를 할당
      }
    }
  });

  // 데이터를 number로 정렬하는 함수
  function sortApplicationDataByNumber(data: ApplicationData) {
    if (data.measurements) {
      data.measurements.sort((a, b) => Number(a.number) - Number(b.number));
    }
    if (data.segments) {
      data.segments.sort((a, b) => Number(a.number) - Number(b.number));
    }
    if (data.matching) {
      data.matching.sort((a, b) => Number(a.number) - Number(b.number));
    }
  }

  return {
    applicationData, // 반응형 객체 반환
  };
}

// Function to initialize an empty ApplicationData object
export function initializeApplicationData(): ApplicationData {
  return {
    uuid: "",
    measurer: "",
    measurerId: "",
    completionDate: "",
    modelName: "Demo XG718BBW",
    lotId: "Demo Lot ID",
    designer: "WISOL",
    designerId: "",
    requester: "WISOL",
    requesterId: "",
    evbType: "WLP",
    shipmentInfo: "2024-10-08",
    band: "20",
    evbInfo: "",
    fileName: "",
    pattern: "",
    pkgType: "",
    detail: "",
    measurementQuantity: 5,
    measurements: [
      {
        number: "1",
        measurementType: "특성 평가", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 20, // 초기값 '0' 문자열로 설정
        status: "created",
        detail: "임의양식 특성 평가",
      },
      {
        number: "2",
        measurementType: "내전력", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 5, // 초기값 '0' 문자열로 설정
        status: "created",
        detail: "임의양식 내전력 평가",
      },
      {
        number: "3",
        measurementType: "PS 신뢰성", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 99, // 초기값 '0' 문자열로 설정
        status: "created",
        detail: "임의양식 PS 신뢰성",
      },
      {
        number: "4",
        measurementType: "TCF", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 120, // 초기값 '0' 문자열로 설정
        status: "created",
        detail: "",
      },
      {
        number: "5",
        measurementType: "비선형", // 빈 문자열
        isMeasured: false, // 초기값 false
        quantity: 11, // 초기값 '0' 문자열로 설정
        status: "created",
        detail: "",
      },
    ], // Initialize with an empty array
    status: "",
    segmentQuantity: 2,
    segments: [
      {
        number: "1",
        start: "50",
        stop: "250",
        points: "10",
        ifwb: "20",
      },
      {
        number: "2",
        start: "250",
        stop: "1250",
        points: "1000",
        ifwb: "20",
      },
    ], // Initialize as an empty array
    matchingQuantity: 2,
    matching: [
      {
        number: "1",
        port: "Port 1",
        ind: { series: "", shunt: "" },
        cap: { series: "", shunt: "" },
      },
      {
        number: "2",
        port: "Port 3",
        ind: { series: "", shunt: "" },
        cap: { series: "", shunt: "" },
      },
    ], // Initialize as an empty array
  };
}

export function initializeApplicationData2() {
  const initialData: ApplicationData = {
    uuid: "", // Unique identifier for the application
    measurer: "", // 측정인
    measurerId: "",
    completionDate: "", // 측정 완료일
    modelName: "", // 기종명
    lotId: "", // Lot ID
    band: "",
    designer: "", // 개발자
    designerId: "",
    requester: "", // 의뢰인
    requesterId: "",
    filterType: "",
    evbType: "", // EVB Type
    shipmentInfo: "", // 출하정보
    evbInfo: "", // EVB 정보
    fileName: "", // 파일명
    pattern: "", // 측정 CHIP 패턴
    pkgType: "", // 측정 PKG
    detail: "",
    measurementQuantity: 0,
    measurements: [
      {
        number: "1",
        measurementType: "",
        isMeasured: false,
        quantity: 0,
        detail: "",
        status: "",
        placeHolder: "",
      },
    ],
    status: "",
    segmentQuantity: 0,
    segments: [
      {
        number: "1",
        start: "",
        stop: "",
        points: "",
        ifwb: "",
      },
    ],
    matchingQuantity: 0,
    matching: [
      {
        number: "1",
        port: "",
        ind: {
          series: "",
          shunt: "",
        },
        cap: {
          series: "",
          shunt: "",
        },
      },
    ],
  };

  return reactive(initialData);
}
