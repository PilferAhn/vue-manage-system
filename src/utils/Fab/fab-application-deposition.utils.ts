import { OptionInterface } from "../../interface/option";
import { ref } from "vue";
import {
  idtProcess,
  IdtType,
  Layer,
} from "../../interface/fab-application-rev2";
import { Option } from "element-plus/es/components/select-v2/src/select.types";

export function getIdtProcessId(idtTypes: IdtType[], idtId: string) {
  const id = parseInt(idtId);
}

export function getIdtTypeByIdtId(idtTypes: IdtType[], idtId: number) {
  return idtTypes.find((idtType) => idtType.idtId == idtId);
}

export function genIdtProcessOptions(idtTypes: IdtType[], idtId: number) {
  // const idx = idtId.toString();
  const idtProcesses = ref<idtProcess[]>();
  idtProcesses.value = idtTypes[idtId - 1].idtProcesses;
  const options = ref<OptionInterface[]>([]);

  for (let i = 0; i < idtProcesses.value.length; i++) {
    const temp: OptionInterface = {
      key: i,
      label: idtProcesses.value[i].idtProcessId,
      value: idtProcesses.value[i].idtProcessId,
    };
    options.value.push(temp);
  }

  return options.value;
}

export function generateIdtOptions(idtTypes: IdtType[]) {
  const options = ref<OptionInterface[]>([]);

  idtTypes.forEach((idtType, index) => {
    const temp: OptionInterface = {
      key: idtType.idtId,
      label: `${idtType.name}`,
      value: idtType.idtId.toString(),
    };
    options.value.push(temp);
  });

  return options.value;
}

export function generateIdtOptions2(idtTypes: IdtType[], idtProcessId: string) {
  const options = ref<OptionInterface[]>([]);

  idtTypes.forEach((idtType, index) => {
    
    let isValid = false;
    idtType.idtProcesses.forEach((idtProcess, index) => {
      if (idtProcess.idtProcessId === idtProcessId) {
        isValid = true;
      }
    });

    if (isValid) {
      const temp: OptionInterface = {
        key: idtType.idtId,
        label: `${idtType.name}`,
        value: idtType.idtId.toString(),
      };
      options.value.push(temp);
    }
  });

  return options.value;
}

export function generateMachineOptions(idtTypes: IdtType[], idtId: string) {
  const options = ref<OptionInterface[]>([]);

  idtTypes.forEach((idtType, index) => {
    if (idtType.idtId === parseInt(idtId)) {
      idtType.idtMachines.forEach((machine, index) => {
        const temp: OptionInterface = {
          key: index,
          value: machine.machineName,
          label: machine.machineName,
        };

        options.value.push(temp);
      });
    }
  });

  return options.value;
}

export function getLayerNameFromIdtTypes(
  idtTypes: IdtType[],
  idtId: number,
  layers: Layer[]
): string | undefined {
  // idtId가 같은 첫 번째 항목의 name 반환

  const name = ref<string | undefined>(undefined);

  idtTypes.forEach((idtType, index) => {
    if (idtType.idtId == idtId) {
      layers.splice(0, layers.length, ...(idtType.layers || [])); //
      name.value = idtType.name;
    }
  });

  return name.value; // 조건 만족 시 name 반환, 없으면 undefined 반환
}
