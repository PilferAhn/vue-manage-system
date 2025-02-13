import type { OptionInterface } from "../../interface/option";
import type {
  SawType,
  FabWafer,
  Layer,
  HsType,
} from "../../interface/fab-application-rev2";
import { isVNode, ref } from "vue";
import { promises } from "dns";
import { match } from "assert";
// OptionInterface를 배열로 반환하는 함수
export function getWaferList(): OptionInterface[] {
  // OptionInterface[] 타입의 데이터를 반환
  const waferList: OptionInterface[] = [
    {
      key: 1,
      label: "HS",
      value: "HS",
    },
    {
      key: 2,
      label: "TC",
      value: "TC",
    },
    {
      key: 3,
      label: "NS",
      value: "NS",
    },
  ];

  return waferList;
}

export function defineSawTypeByWaferType(
  waferType: string,
  sawTypes: SawType[]
): SawType | undefined {
  for (let i = 0; i < sawTypes.length; i++) {
    if (sawTypes[i].sawTypeId === waferType) {
      return sawTypes[i];
    }
  }
  return undefined;
}

export function getSawTypeFromWaferTypeSync(
  waferType: string,
  sawTypes: SawType[]
): SawType | undefined {
  for (let i = 0; i < sawTypes.length; i++) {
    if (sawTypes[i].sawTypeId === waferType) {
      return sawTypes[i];
    }
  }
  return undefined;
}

export function createWaferOptions(sawType: SawType) {
  const tempOptions = ref<OptionInterface[]>([]);

  sawType.wafers.forEach((wafer, index) => {
    const tempOpt: OptionInterface = {
      key: wafer.waferId,
      label: `Size : ${wafer.size} - Type : ${wafer.waferType} - Company : ${wafer.waferCompany}`,
      value: wafer.waferId.toString(),
    };
    tempOptions.value.push(tempOpt);
  });

  return tempOptions.value;
}

// export function createAngleAndThickOptions(
//   sawType: SawType,
//   waferSize: number,
//   waferCompany: string,
//   waferType: string,
//   procressType: string
// ) {
//   const tempOptions = ref<OptionInterface[]>([]);

//   sawType.wafers.forEach((wafer, index) => {
//     if (
//       wafer.size == waferSize &&
//       wafer.waferCompany === waferCompany &&
//       wafer.waferType === waferType
//     ) {
//       if (procressType !== "HS") {
//         wafer.recommendations.forEach((recommendation, index) => {
//           const tempOpt: OptionInterface = {
//             key: index,
//             label: `Angle : ${recommendation.waferAngle} - Thickness : ${recommendation.waferThickness}`,
//             value: `${recommendation.waferAngle},${recommendation.waferThickness}`,
//           };
//           tempOptions.value.push(tempOpt);
//         });
//       } else {
//         wafer.recommendations.forEach((recommendation, index) => {
//           const tempOpt: OptionInterface = {
//             key: index,
//             label: `Angle : ${recommendation.waferAngle}`,
//             value: `${recommendation.waferAngle},${recommendation.waferThickness}`,
//           };
//           tempOptions.value.push(tempOpt);
//         });
//       }
//     }
//   });

//   return tempOptions.value;
// }

export function createThicknessOptions(sawType: SawType, waferId: number){
  const options = ref<OptionInterface[]>([]);
  for (let i = 0; i < sawType.wafers.length; i++) {
    if (sawType.wafers[i].waferId == waferId) {
      for (let j = 0; j < sawType.wafers[i].recommendedThicknesses.length; j++) {
       
        const temp: OptionInterface = {
          key: j,
          label: sawType.wafers[i].recommendedThicknesses[j].waferThickness.toString(),
          value: sawType.wafers[i].recommendedThicknesses[j].waferThickness.toString(),
        };

        const tempLabel =sawType.wafers[i].recommendedThicknesses[j].waferThickness.toString();
        let isValid = true;
        for (let k = 0; k < options.value.length; k++) {
          if (options.value[k].value === tempLabel) {
            isValid = false;
          }
        }
        if (isValid) {
          options.value.push(temp);
        }

      }
    }
  }

  return options.value;
}

export function createAngleOptions(sawType: SawType, waferId: number) {
  const options = ref<OptionInterface[]>([]);
  for (let i = 0; i < sawType.wafers.length; i++) {
    if (sawType.wafers[i].waferId == waferId) {
      for (let j = 0; j < sawType.wafers[i].recommendedAngles.length; j++) {
       
        const temp: OptionInterface = {
          key: j,
          label: sawType.wafers[i].recommendedAngles[j].waferAngle.toString(),
          value: sawType.wafers[i].recommendedAngles[j].waferAngle.toString(),
        };

        const tempLabel =sawType.wafers[i].recommendedAngles[j].waferAngle.toString();
        let isValid = true;
        for (let k = 0; k < options.value.length; k++) {
          if (options.value[k].value === tempLabel) {
            isValid = false;
          }
        }
        if (isValid) {
          options.value.push(temp);
        }

      }
    }
  }

  return options.value;
}
export function getFabWaferFromWaferId(
  waferId: string,
  wafers: FabWafer[]
): FabWafer | undefined {
  return wafers.find((waferType) => waferType.waferId === parseInt(waferId));
}

export function getLtThickness(layers: Layer[]) {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].material === "LT") {
      return layers[i].thickness;
    }
  }

  return undefined;
}

export function getHsWaferAngle(id: string, wafer: FabWafer) {
  // hsTypes 존재 여부 확인
  if (wafer.hsTypes) {
    // hsTypes에서 조건에 맞는 객체 찾기
    const matchedHsType = wafer.hsTypes.find((hsType) => {
      return hsType.hsId.toString() === id;
    });

    if (matchedHsType) {
      // console.log("Matched hsType:", matchedHsType);
      return matchedHsType.peAngle;
    }
  }
  // 조건에 맞는 hsType이 없거나 hsTypes가 없을 경우
  return 0;
}

export function createHsWaferLayerOption(id: string, wafer: FabWafer) {
  // hsTypes 존재 여부 확인
  if (wafer.hsTypes) {
    // hsTypes에서 조건에 맞는 객체 찾기
    const matchedHsType = wafer.hsTypes.find((hsType) => {
      return hsType.hsId.toString() === id;
    });

    if (matchedHsType) {
      // console.log("Matched hsType:", matchedHsType);
      return matchedHsType.layers;
    }
  }
  // 조건에 맞는 hsType이 없거나 hsTypes가 없을 경우
  return [];
}

export function createHsWaferCondition(wafer: FabWafer): OptionInterface[] {
  const tempOptions = ref<OptionInterface[]>([]);

  // hsTypes 존재 여부 확인
  if (wafer.hsTypes) {
    wafer.hsTypes.forEach((hsType) => {
      tempOptions.value.push({
        key: hsType.hsId,
        label:
          "LT CUT " +
          hsType.peAngle +
          " - " +
          hsType.name +
          " - " +
          hsType.siliconRotation,
        value: hsType.hsId?.toString(),
      });
    });
  }

  return tempOptions.value;
}

export function getHsLayerOptions(
  waferId: string,
  wafers: FabWafer[]
): HsType[] | undefined {
  console.log(waferId);
  console.log(wafers);

  wafers.forEach((wafer) => {
    if (wafer.waferId === parseInt(waferId)) {
      return wafer.hsTypes;
    }
  });

  return undefined;
}
