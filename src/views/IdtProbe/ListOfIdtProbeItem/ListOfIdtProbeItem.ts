import axios from "axios";
import { IdtProbeStatus, IdtProbeItem } from "../../../interface/idt-probe-interfaces";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";

// Get count of IdtProbeItems
export async function fetchCountIdtProbeItems(status: string = undefined): Promise<number> {
    try {
    const url = '/idt_probe/get_count_idt_probe_items';
    if (status) {
        const form = new FormData();
        form.append('status', status);
        const response = await axios.post(url, form);
        return response.data;
    } else {
        const response = await axios.get(url);
        return response.data;
    }
    } catch (error) {  
        console.error("Error fetching count of IdtProbeItems:", error);
        throw error;
    }
}

// Get list of IdtProbeItems
export type ValidItdtProbeItemOrderParams = {
    orderBy: 'lot_id' | 'product_name' | 'probe_type' | 'status' | 'received_date' | 'completed_date';
    direction?: 'asc' | 'desc';
};
export async function fetchIdtProbeItems(
    status: IdtProbeStatus | undefined = undefined,
    pageSize: number = 0,
    page: number = 1,
    orderParams: ValidItdtProbeItemOrderParams | undefined = undefined
    ): Promise<IdtProbeItem[]> {
  try {
    const form = new FormData();
    if (status) {
      form.append("status", status);
    }
    if (pageSize > 0) {
      form.append("offset", ((page - 1) * pageSize).toString());
      form.append("limit", pageSize.toString());     
    }
    if (orderParams) {
        form.append("order_by", orderParams.orderBy);
        form.append("direction", orderParams.direction);
    }

    const response = await axios.post('/idt_probe/get_idt_probe_items', form);
    const data = response.data;
    return data.map((item: Record<string, any>) => convertPep8ToCamelCase2(item) as IdtProbeItem);
    } catch (error) {
        console.error("Error fetching IdtProbeItems:", error);
        return [];
    }
}

