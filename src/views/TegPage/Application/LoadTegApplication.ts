// Application.ts
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import {TegApplication} from "./../../../utils/tegTypes"
import axios from "axios";

export const priorityList = [1, 2, 3, 4, 5];

export async function getApplicationDetail(uuid, tegApplication) {
  if (uuid) {
    try {
      const response = await axios.get(
        "teg_application/get_teg_application_by_uuid/" + uuid
      );

      // 모든 필드를 한 번에 업데이트
      Object.keys(tegApplication).forEach((key) => {
        tegApplication[key] = response.data[key];
      });
      
    } catch (error) {
      console.error("Error fetching application details:", error);
    }
  }
}

export async function cloneApplicationDetail(uuid, tegApplication) {
  if (uuid) {
    try {
      const response = await axios.get(
        "teg_application/get_teg_application_by_uuid/" + uuid
      );

      tegApplication["designer"] = response.data["designer"]
      tegApplication["purpose"] = response.data["purpose"]
      tegApplication["lotID"] = response.data["lotID"]

      tegApplication["applicationType"] = response.data["applicationType"]
      tegApplication["modelName"] = response.data["modelName"]
      tegApplication["note"] = response.data["note"]

      tegApplication["shotSize"] = response.data["shotSize"]
      tegApplication["chipSize"] = response.data["chipSize"]
      tegApplication["chipQuantity"] = response.data["chipQuantity"]
      tegApplication["maskName"] = response.data["maskName"]      
      tegApplication["isMaskChange"] = response.data["isMaskChange"]      
      tegApplication["port"] = response.data["port"]

      tegApplication["shortPatternNo"] = response.data["shortPatternNo"]
      tegApplication["thruPatternNo"] = response.data["thruPatternNo"]
      tegApplication["openPatternNo"] = response.data["openPatternNo"]
      tegApplication["rawPatternNo"] = response.data["rawPatternNo"]
      tegApplication["preTegPatternMeasShot"] = response.data["preTegPatternMeasShot"]

      // 모든 필드를 한 번에 업데이트
      // Object.keys(tegApplication).forEach((key) => {
      //   tegApplication[key] = response.data[key];
      // });

      // tegApplication[""]

      // tegApplication["shotInformation"] = {
      //   shots: [],
      //   disableShots: [],
      //   size: 0,
      //   status: [],
      // }

      // tegApplication["waferInformation"] = []
      // tegApplication["measInfo"] = []
      // tegApplication["waferQuantity"] = 0
      // tegApplication["waferIDList"] = []
      // tegApplication["waferSize"] = ""      

    } catch (error) {
      console.error("Error fetching application details:", error);
    }
  }
}

export async function moveToAnotherRoute(RouteName , uuid, router){
  
  // router.push({ name: RouteName, params :  someData});
  await router.push({ name: RouteName, params: { uuid: uuid } });
}

export const sendRemoveRequest = async (uuid: string, router) => {
  try {
    // 사용자에게 삭제 확인 요청
    await ElMessageBox.confirm(
      "정말로 의뢰서를 삭제하시겠습니까?",
      "확인 요청",
      {
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        type: "warning",
      }
    );

    // 사용자가 '예'를 클릭했을 때 실행
    const url = `teg_application/remove_application_by_uuid/${uuid}`;
    const response = await axios.get(url);
    // console.log('삭제 성공:', response);

    if (response.data.status === "success") {
      // 삭제 성공시 추가 로직 처리 (예: 알림 표시)
      ElMessageBox.alert("의뢰서가 성공적으로 삭제되었습니다.", "삭제 완료", {
        confirmButtonText: "확인",
      });

      setTimeout(() => {
        router.push({ name: "TegApplicationList" });
      }, 1000);
      
    } else {
      // 실패 메시지 표시
      throw new Error("서버에서 삭제를 처리할 수 없습니다.");
    }
  } catch (error) {
    // 사용자가 '아니오'를 클릭했을 때 또는 요청 실패시
    if (error instanceof Error) {
      console.error("삭제 요청 실패:", error.message);
      await ElMessageBox.alert(error.message, "삭제 실패", {
        confirmButtonText: "확인",
        type: "error",
      });
    } else {
      // ElMessageBox 취소 클릭
      console.log("삭제 요청이 취소되었습니다.");
    }
  }
};
