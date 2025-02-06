import { ref } from "vue";
import type { SawType, FabWafer } from "../../interface/fab-application-rev2";

export function createSawTypes() {
  const sawTypes = ref<SawType[]>([]);

  const sawType1 = ref<SawType>();
  sawType1.value.sawTypeId = "NS";

  const sawType1Wafers = ref<FabWafer>();
}

const demoDb = {
  HS: {
    "42": [150, 200, 250],
    "46.3": [150, 200],
  },
};

function getThickness(sawType: string, angle: number) {
  return demoDb[sawType][angle];
}

export function getOptionNumbers(start : number , end : number){

    let numbers = []

    for(let i = start ; i <= end; i++){
        numbers.push(i)
    }

    return numbers
}