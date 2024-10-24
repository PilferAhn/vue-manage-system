import axios from "axios";
import type { ApplicationData } from "../../../interface/solderAppInterface";

// 서버에서 받아온 데이터를 저장할 타입 지정
export async function get_application_list_by_status(
  status: string
): Promise<ApplicationData[]> {
  try {
    // 서버의 API 엔드포인트 호출

    
    const url = `/solder/get_solder_application_list_by_status/${status},model_name`;

    // const formData = new FormData();
    // formData.append('order_by', "id");
    // formData.append('order_dir', "asc");
    // formData.append('limit', "0");
    // formData.append('page', "1");

    // const url =
    //   "/fab_monitoring/get_fab_request_list";
    // const response = await axios.post(url, formData);
    const response = await axios.get(url);
    // 응답 데이터를 CamelCase 형식으로 변환
    const convertedData = convertKeysToCamelCase(response.data);

    // measurements 배열을 숫자 순으로 정렬
    const sortedData = sortMeasurementsByNumber(convertedData);

    // 변환된 데이터를 반환
    return sortedData as ApplicationData[];
  } catch (error) {
    console.error("Error fetching application list by status:", error);
    throw error; // 에러 발생 시 상위 컴포넌트에서 처리
  }
}

export function sortMeasurementByNumber(
  application: ApplicationData
): ApplicationData {
  if (application.measurements) {
    // measurements 배열을 number 필드를 기준으로 정렬
    application.measurements = application.measurements.sort((a, b) => {
      const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
      const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
      return numA - numB; // 오름차순 정렬
    });
  }

  
  if (application.segments) {
    // segments 배열을 number 필드를 기준으로 정렬
    application.segments = application.segments.sort((a, b) => {
      const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
      const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
      return numA - numB; // 오름차순 정렬
    });
    
  }

  if (application.matching) {
    // matching 배열을 number 필드를 기준으로 정렬
    application.matching = application.matching.sort((a, b) => {
      const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
      const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
      return numA - numB; // 오름차순 정렬
    });
  }

  return application;
}

export function sortMeasurementsByNumber(
  applicationData: ApplicationData[]
): ApplicationData[] {
  return applicationData.map((application) => {
    if (application.measurements) {
      // measurements 배열을 number 필드를 기준으로 정렬
      application.measurements = application.measurements.sort((a, b) => {
        const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
        const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
        return numA - numB; // 오름차순 정렬
      });
    }

    if (application.segments) {
      // measurements 배열을 number 필드를 기준으로 정렬
      application.segments = application.segments.sort((a, b) => {
        const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
        const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
        return numA - numB; // 오름차순 정렬
      });
    }

    if (application.matching) {
      // measurements 배열을 number 필드를 기준으로 정렬
      application.matching = application.matching.sort((a, b) => {
        const numA = parseInt(a.number, 10); // `number`를 숫자로 변환
        const numB = parseInt(b.number, 10); // `number`를 숫자로 변환
        return numA - numB; // 오름차순 정렬
      });
    }

    return application;
  });
}

// snake_case를 camelCase로 변환하는 함수
function toCamelCase(snakeStr: string): string {
  return snakeStr.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// 재귀적으로 객체의 모든 키를 CamelCase로 변환하는 함수
export function convertKeysToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    // 배열일 경우 배열 내의 각 요소에 대해 재귀적으로 변환
    return data.map((item) => convertKeysToCamelCase(item));
  } else if (typeof data === "object" && data !== null) {
    // 객체일 경우 모든 키를 변환
    return Object.keys(data).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key);
      acc[camelCaseKey] = convertKeysToCamelCase(data[key]);
      return acc;
    }, {} as any);
  }
  return data; // 기본값(primitive)은 그대로 반환
}
