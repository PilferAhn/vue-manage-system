import axios from "axios";
import { IdtProbeStatus, IdtProbeItem } from "../../../interface/idt-probe-interfaces";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";

export interface FilterIdtProbeItemBy {
    probeTypes?: string[];
}

// Get count of IdtProbeItems
export async function fetchCountIdtProbeItems(status: string = undefined, filter: FilterIdtProbeItemBy = {}): Promise<number> {
    try {
        const url = '/idt_probe/get_count_idt_probe_items';
        const form = new FormData();
        if (status) {
            form.append('status', status);
        }
        if (filter.probeTypes && filter.probeTypes.length > 0) {
            form.append('probe_types', filter.probeTypes.join(','));
        }
        const response = await axios.post(url, form);
        return response.data;
    } catch (error) {  
        console.error("Error fetching count of IdtProbeItems:", error);
        throw error;
    }
}

// Get list of IdtProbeItems
type ValidOrderBy = 'lot_id' | 'product_name' | 'probe_type' | 'status' | 'received_date' | 'completed_date' | 'priority';
export type ValidItdtProbeItemOrderParams = {
    orderBy: ValidOrderBy[];
    direction?: 'asc' | 'desc';
};
export async function fetchIdtProbeItems(
    status: IdtProbeStatus | undefined = undefined,
    filter: FilterIdtProbeItemBy = {},
    pageSize: number = 0,
    page: number = 1,
    orderParams: ValidItdtProbeItemOrderParams | undefined = undefined
    ): Promise<IdtProbeItem[]> {
  try {
    const form = new FormData();
    if (status) {
      form.append("status", status);
    }
    if (filter.probeTypes && filter.probeTypes.length > 0) {
            form.append('probe_types', filter.probeTypes.join(','));
   }
    if (pageSize > 0) {
      form.append("offset", ((page - 1) * pageSize).toString());
      form.append("limit", pageSize.toString());     
    }
    if (orderParams) {
        form.append("order_by", orderParams.orderBy.join(","));
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

