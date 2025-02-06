import { ref } from "vue";
import { convertKeysToCamelCase } from "../key-converter";
import { sendGetRequest, sendPostRequestWithHeader } from "../httpProtocol";
import { Bom } from "../../interface/fab-application-rev2";
import { OptionInterface } from "../../interface/option";

export function initBom() {
  const bom = ref<Bom>({
    finishedProductSize: undefined,
    size: undefined,
    bump: {
      size: "",
      quantity: 0,
    },
    epoxy: {
      modelName: null,
      size: undefined,
      code: undefined,
      purpose: undefined,
    },
    package: undefined,
  });

  return bom.value;
}

export async function getPackageList(): Promise<object[]> {
  const packageList = ref<object[]>([]); // Vue의 ref를 사용하여 반응형 변수 선언

  try {
    const temp = await sendGetRequest("/api/sapinfo", "0"); // API 호출
    // console.log(temp);
    // console.log(typeof temp); // type -> typeof로 변경

    if (Array.isArray(temp)) {
      // temp가 배열인지 확인
      for (let i = 0; i < temp.length; i++) {
        const converted = convertKeysToCamelCase(temp[i]); // 키 변환 함수 호출
        
        // packageList.value.push(converted["MATNR"]); // 변환된 객체를 배열에 추가
        packageList.value.push(converted)
      }
    } else {
      console.error("응답 데이터가 배열이 아닙니다:", temp);
    }
  } catch (error) {
    console.error("패키지 목록 가져오기 실패:", error);
  }
  return packageList.value;
}

export function createPackageOptions(packageList: object[]) {
  const packageOptions = ref<OptionInterface[]>([]);

  for (let i = 0; i < packageList.length; i++) {
    const temp: OptionInterface = {
      key: i,
      value: packageList[i]["MATNR"],
      label: packageList[i]["MATNR"] + " - " + packageList[i]["MAKTX"],
    };
    packageOptions.value.push(temp)
  }
  return packageOptions.value
}

export async function getEpoInfoList(): Promise<object[]> {
  const url = "/api/specepoxy";
  const formData = new FormData();
  formData.append("fid", "0");
  const epoList = ref<object[]>([]);

  const temp = await sendPostRequestWithHeader(url, formData);
  const tempArr = JSON.parse(temp);

  if (Array.isArray(tempArr)) {
    // temp가 배열인지 확인
    for (let i = 0; i < tempArr.length; i++) {
      const converted = convertKeysToCamelCase(tempArr[i]); // 키 변환 함수 호출
      epoList.value.push(converted); // 변환된 객체를 배열에 추가
    }
  } else {
    console.error("응답 데이터가 배열이 아닙니다:", temp);
  }

  return epoList.value;
}
