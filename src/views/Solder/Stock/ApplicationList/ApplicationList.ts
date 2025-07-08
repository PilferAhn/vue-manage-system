import axios from 'axios';
import type { StockInfo } from "../../../../interface/stock";
import {convertKeysToCamelCase} from "../../../../utils/key-converter"
// Function to fetch StockInfo data
export async function fetchStockInfo(operationType : string, user_id: string|null = null): Promise<StockInfo[]> {
  try {

    const form = new FormData()
    
    form.append("operation_type", operationType)
    form.append("order_by", "date_of_created")

    // console.log("fetchStockInfo with user_id: ",user_id)
    if (user_id) {
      form.append("designer_id", user_id)
    }
    
    const response = await axios.post('/reel/get_reel_request_list', form);
    const data = response.data;
    
    // Convert each item in the array to camelCase
    return data.map((item: Record<string, any>) => convertKeysToCamelCase(item) as StockInfo);
    
  } catch (error) {
    console.error("Error fetching stock info:", error);
    return [];
  }
}
