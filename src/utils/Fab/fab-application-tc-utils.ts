import type {
    IdtMachine,
    TcType,
    Layer,
  } from "../../interface/fab-application-rev2";
  import { ref } from "vue";
  import { OptionInterface } from "../../interface/option";
  export function getLayerOptions(
    tcId: number,
    tcTypes: TcType[]
  ): Layer[] | undefined {
    return tcTypes.find((tcType) => tcType.tcId === tcId)?.layers;
  }
  
  export function createMachineList(machine: IdtMachine[]) {
    const options = ref<OptionInterface[]>([]);
  
    for (let i = 0; i < machine.length; i++) {
      const temp = {
        key: i,
        label: machine[i].machineName,
        value: machine[i].machineName,
      };
  
      options.value.push(temp);
    }
    
    return options.value;
  }