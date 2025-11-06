import axios from 'axios';
import { IdtProbeType, IdtProbeWafer, MesLotStatus } from "../../../interface/idt-probe-interfaces";
import {convertKeysToPEP8, convertPep8ToCamelCase2} from "../../../utils/key-converter"

// Function to fetch IdtProbeWafers by lot ID
export async function fetchIdtProbeWafersByLotId(lotsId: string[]): Promise<IdtProbeWafer[]> {
  try {
    if (lotsId.length === 0) {
      return [];
    }
    const form = new FormData();
    form.append("lots_id", lotsId.join(","));

    const response = await axios.post('/idt_probe/get_idt_probe_wafers_by_lots_id', form);
    const data = response.data;

    // Convert each item in the array to camelCase
    return data.map((item: Record<string, any>) => convertPep8ToCamelCase2(item) as IdtProbeWafer);
  } catch (error) {
    console.error("Error fetching IdtProbeWafers:", error);
    return [];
  }
}

// Function to fetch MesLotStatus data
export async function fetchMesLotsStatusByCasseteId(Id: string): Promise<MesLotStatus[]> {
  try {

    const form = new FormData()    
    form.append("cassette_id", Id)
    form.append("first_history", "true")
    form.append("order_by", "slot_no")
       
    const response = await axios.post('/mes/get_lots_by_cassette_id', form);
    const data = response.data;
    
    // Convert each item in the array to camelCase
    const mesLots: MesLotStatus[] = data.map((item: Record<string, any>) => convertPep8ToCamelCase2(item) as MesLotStatus);
    
    // Get lot IDs to fetch corresponding IdtProbeWafers
    const lotIds = mesLots.map(lot => lot.lotId);
    const idtProbeWafers = await fetchIdtProbeWafersByLotId(lotIds);

    // Build a lookup Record for MesLotStatus keyed by lotId
    const mesLotsById: Record<string, MesLotStatus> = {};
    mesLots.forEach(lot => {
        mesLotsById[lot.lotId] = lot;
    });

    // Map IdtProbeWafers to their corresponding MesLotStatus
    idtProbeWafers.forEach(wafer => {
      mesLotsById[wafer.lotId].idtProbeWafer = wafer;
    });

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

// Receive an IDT probe wafer 
export async function receiveIdtProbeWafer(idtProbeWafer: IdtProbeWafer): Promise<IdtProbeWafer | null> {
  try {

    const response = await axios.post('/idt_probe/create_idt_probe_wafer', convertKeysToPEP8(idtProbeWafer));
    const data = response.data;
    return convertPep8ToCamelCase2(data) as IdtProbeWafer;
  } catch (error) {
    console.error('Error receiving IDT probe wafer:', error);
    return null;
  }
}

// Update an IDT probe wafer note
export async function updateIdtProbeWaferNote(lotId: string, note: string | null): Promise<IdtProbeWafer> {
    const form = new FormData();
    form.append('lot_id', lotId);
    if (note) {
      form.append('note', note);
    }
    const response = await axios.post('/idt_probe/update_idt_probe_wafer_note', form);
    const data = response.data;
    return convertPep8ToCamelCase2(data) as IdtProbeWafer;
}

// Complete an IDT probe wafer (assumption: backend endpoint names)
export async function completeIdtProbeWafer(lotId: string): Promise<IdtProbeWafer | null> {
  try {
    const form = new FormData();
    form.append('lot_id', lotId);
    form.append('status', 'completed');
    const response = await axios.post('/idt_probe/update_idt_probe_wafer_status', form);
    const data = response.data;
    return convertPep8ToCamelCase2(data) as IdtProbeWafer;
  } catch (error) {
    console.error('Error completing IDT probe wafer:', error);
    return null;
  }
}
