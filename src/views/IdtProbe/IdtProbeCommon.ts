import axios from 'axios';
import { IdtProbeType } from "../../interface/idt-probe-interfaces";
import {convertPep8ToCamelCase2} from "../../utils/key-converter"

// Function to fetch IdtProbeTypes
export async function fetchIdtProbeTypes(): Promise<IdtProbeType[]> {
  try {
    const response = await axios.get('/idt_probe/get_idt_probe_types');
    const data = response.data;

    // Convert each item in the array to camelCase
    return data.map((item: Record<string, any>) => convertPep8ToCamelCase2(item) as IdtProbeType);
  } catch (error) {
    console.error("Error fetching IdtProbeTypes:", error);
    return [];
  }
}