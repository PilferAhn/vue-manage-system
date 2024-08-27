import axios from "axios";
import type {CER0Form} from "../cer0-types"

export async function fetchCER0FormData(): Promise<CER0Form[] | null> {

    const url = "/api/v1/cer0/get_cer0_list"

    try {
      const response = await axios.get<CER0Form[]>(url);
      
      return response.data
      
    } catch (error) {
      console.error('Failed to fetch CER0 form data:', error);
      return null;
    }
  }