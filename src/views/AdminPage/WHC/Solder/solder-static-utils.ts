import type { DailyMeasInfo } from "../../../../interface/solderAppInterface";
import { reactive } from "vue";
import axios from "axios";

export function getYMaxFromDailyData(
  lastWeek: DailyMeasInfo[],
  thisWeek: DailyMeasInfo[]
): number {
  // 최대값을 계산하는 헬퍼 함수
  const findMaxFinishedTask = (data: DailyMeasInfo[]): number => {
    return data.reduce((max, item) => {
      return item.finished_task > max ? item.finished_task : max;
    }, 0); // 초기값 0
  };

  // 두 배열에서 각각 최대값 계산
  const lastWeekMax = findMaxFinishedTask(lastWeek);
  const thisWeekMax = findMaxFinishedTask(thisWeek);

  // 둘 중 큰 값을 반환
  return Math.max(lastWeekMax, thisWeekMax);
}

// 가장 가까운 10의 배수로 올림하는 함수
export const roundUpToNearestTen = (num: number): number => {
  return Math.ceil(num / 10) * 10;
};

export async function getDailyData(date: string): Promise<DailyMeasInfo[]> {
  const url = "/solder/test1/" + date;
  const priorityOrder = [
    "특성 평가",
    "PDT(Manual_수탑)",
    "PDT(SMT)",
    "PS 신뢰성",
    "TCF",
    "비선형",
  ];

  try {
    const response = await axios.get(url);
    let dailyMeasInfo: DailyMeasInfo[] = response.data;

    // PS 신뢰성을 ESD로 변경
    // const updatedServerData = dailyMeasInfo.map((item) => {
    //   if (item.measurement_type === "PS 신뢰성") {
    //     return {
    //       ...item,
    //       measurement_type: "ESD",
    //     };
    //   }
    //   return item;
    // });

    // 우선순위에 따라 정렬
    const sortedServerData = dailyMeasInfo.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.measurement_type);
      const bIndex = priorityOrder.indexOf(b.measurement_type);

      return (
        (aIndex !== -1 ? aIndex : Infinity) -
        (bIndex !== -1 ? bIndex : Infinity)
      );
    });

    return sortedServerData; // 정렬된 데이터를 반환
  } catch (error) {
    console.error("Error fetching server data:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
}
