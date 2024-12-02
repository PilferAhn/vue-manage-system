import type { DailyMeasInfo } from "../../../../interface/solderAppInterface";
import { reactive } from "vue";
import axios from "axios";

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
