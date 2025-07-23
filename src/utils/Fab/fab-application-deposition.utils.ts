import { OptionInterface } from "../../interface/option";
import { ref } from "vue";
import axios from "axios";
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

export function setMachineForEtching (idtId: number, idtTypes: IdtType[]) {
  const options = ref<OptionInterface[]>([]);

  idtTypes.forEach((idtType) => {
    if(idtType.idtId === idtId) {
      idtType.idtProcessMachines?.forEach((machine, index) =>{
        if(machine.idtProcessId === "Etching"){
          options.value.push({
            key: index,
            value: machine.idtProcessMachineName,
            label: machine.idtProcessMachineName
          });
        }
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
  const name = ref<string | undefined>(undefined);

  idtTypes.forEach((idtType) => {
    if (idtType.idtId === idtId) {
      layers.splice(
        0,
        layers.length,
        ...(idtType.layers?.map(layer => ({
          ...layer  // 개별 객체도 새로운 주소값을 가지도록 복사
        })) || [])
      );

      name.value = idtType.name;
    }
  });

  return name.value;
}