import axios from 'axios';
import { IdtProbeType, IdtProbeItem} from "../../../interface/idt-probe-interfaces";
import {convertKeysToPEP8, convertPep8ToCamelCase2} from "../../../utils/key-converter"
import {LotStatus as MesLot} from "../../../interface/mes-interface"
import { ElMessage } from 'element-plus';

// Function to fetch IdtProbeItems by lot ID
export async function fetchIdtProbeItemsByLotId(lotsId: string[]): Promise<IdtProbeItem[]> {
  try {
    if (lotsId.length === 0) {
      return [];
    }
    const form = new FormData();
    form.append("lots_id", lotsId.join(","));

    const response = await axios.post('/idt_probe/get_idt_probe_items_by_lots_id', form);
    const data = response.data;

    // Convert each item in the array to camelCase
    return data.map((item: Record<string, any>) => convertPep8ToCamelCase2(item) as IdtProbeItem);
  } catch (error) {
    console.error("Error fetching IdtProbeItems:", error);
    return [];
  }
}

// Function to fetch MesLots data
export async function fetchMesLotsByCassetteId(Id: string): Promise<MesLot[]> {
  try {

    const form = new FormData()    
    form.append("cassette_id", Id)
    form.append("first_history", "true")
    form.append("order_by", "slot_no")
       
    const response = await axios.post('/mes/get_lots_by_cassette_id', form);
    const data = response.data;
    
    // Convert each item in the array to camelCase
    const mesLots: MesLot[] = data.map((item: Record<string, any>) => convertPep8ToCamelCase2(item) as MesLot);
    
    return mesLots;
  } catch (error) {
    console.error("Error fetching MesLots:", error);
    return [];
  }
}

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

// Receive an IDT probe item
export async function receiveIdtProbeItem(idtProbeItem: IdtProbeItem, isNewIteration: boolean): Promise<IdtProbeItem | null> {
  try {
    const response = await axios.post(`/idt_probe/create_idt_probe_item?is_new_iteration=${isNewIteration}`,  convertKeysToPEP8(idtProbeItem));
    const data = response.data;
    ElMessage.success(`IDT probe item (lotId: ${idtProbeItem.lotId} , probeType: ${idtProbeItem.probeType}) received successfully.`);
    return convertPep8ToCamelCase2(data) as IdtProbeItem;
  } catch (error) {
    ElMessage.error(`Error receiving IDT probe item (lotId: ${idtProbeItem.lotId} , probeType: ${idtProbeItem.probeType})`);
    console.error('Error receiving IDT probe item:', error);
    return null;
  }
}

// Update an IDT probe item note
export async function updateIdtProbeItemNote(lotId: string, probeType: string, iteration: number, note: string | null): Promise<IdtProbeItem> {
    const form = new FormData();
    form.append('lot_id', lotId);
    form.append('probe_type', probeType);
    form.append('iteration', iteration.toString());
    if (note) {
      form.append('note', note);
    }
    const response = await axios.post('/idt_probe/update_idt_probe_item_note', form);
    const data = response.data;
    return convertPep8ToCamelCase2(data) as IdtProbeItem;
}

// Complete an IDT probe item
export async function completeIdtProbeItem(lotId: string, probeType: string, iteration: number): Promise<IdtProbeItem | null> {
    const form = new FormData();
    form.append('lot_id', lotId);
    form.append('probe_type', probeType);
    form.append('iteration', iteration.toString());
    form.append('status', 'completed');
    const response = await axios.post('/idt_probe/update_idt_probe_item_status', form);
    const data = response.data;
    return convertPep8ToCamelCase2(data) as IdtProbeItem;
}
