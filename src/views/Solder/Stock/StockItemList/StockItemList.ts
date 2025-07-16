import axios from 'axios';
import type { StockItem } from "../../../../interface/stock";
import {convertPep8ToCamelCase2} from "../../../../utils/key-converter"
// Function to fetch StockInfo data
export async function fetchStockItems(operationType : string, user_id: string|null = null): Promise<StockItem[]> {
  try {

    const form = new FormData()
    
    form.append("operation_type", operationType)
    form.append("order_by", "date_of_created")

    // console.log("fetchStockInfo with user_id: ",user_id)
    if (user_id) {
      form.append("designer_id", user_id)
    }
    
    const response = await axios.post('/stock/get_stock_items', form);
    const data = response.data;
    
    // Convert each item in the array to camelCase
    return data.map((item: Record<string, any>) => convertPep8ToCamelCase2(item) as StockItem);
    
  } catch (error) {
    console.error("Error fetching stock info:", error);
    return [];
  }
}
