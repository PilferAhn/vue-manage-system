import axios from "axios";

interface axis {
    x : number,
    y : number
}

export interface machine{
    points : axis[]
}

export interface machineList{
    machineList : machine[],
    machineName : string
}

export function initMachineList(){

}

export const getSummaryData = async () => {
    try {
      const response = await axios.get(
        "/machine/get_machine_list"
      );
  

      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  