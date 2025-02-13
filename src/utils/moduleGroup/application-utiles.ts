import { ref } from "vue";
import type { Application } from "../../interface/Modules/Application/application";
import { OptionInterface } from "../../interface/option";
import { Option } from "element-plus/es/components/select-v2/src/select.types";

export function initApplication() {
  const application = ref<Application>({
    productName: "",
    quantity: "0",
    requester: "",
    requesterId: "",
    smtHistory: "",
    mold: "",
    wantedFinishedDate: "",
    needGoldenSampleMeasure: false,
    referenceChar: "",
    needTcf: false,
    tcf: "",
    naApp: null,
    nfApp: null,
    measurer: "",
    estFinishedDate: "",
  });

  return {
    application,
  };
}

export function createQuantityOptions(num: number) {
  const options = ref<OptionInterface[]>([]);
  for (let i = 1; i < num + 1; i++) {
    const temp: OptionInterface = {
      key: i - 1,
      label: i.toString(),
      value: i.toString(),
    };
  }

  return options.value;
}
