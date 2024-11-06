import axios from "axios";
import { ref } from "vue";
import { convertToCamelCase } from "../Common/Application";
import type { ProcessData } from "../Interface/ApplicationInterface";

// Define the processData ref in case you want to use it directly
export const processData = ref<ProcessData[]>([]);

// Function to fetch process data with time logging
export const fetchProcessData = async () => {
    try {
      let startTime = performance.now();
      const formData = new FormData();
      console.log("Time after FormData creation:", performance.now() - startTime, "ms");
  
      formData.append("order_by", "id");
      console.log("Time after appending 'order_by':", performance.now() - startTime, "ms");
  
      formData.append("order_dir", "asc");
      console.log("Time after appending 'order_dir':", performance.now() - startTime, "ms");
  
      formData.append("designer_confirm", "false");
      console.log("Time after appending 'designer_confirm':", performance.now() - startTime, "ms");
  
      const url = "/fab_monitoring/get_fab_request_list";
      startTime = performance.now(); // Reset time before request
      const response = await axios.post(url, formData);
      console.log("Time after axios POST request:", performance.now() - startTime, "ms");
  
      startTime = performance.now(); // Reset time before processing response
      processData.value = convertToCamelCase(response.data); // Convert data to camelCase
      console.log("Time after data conversion:", performance.now() - startTime, "ms");
  
      return processData.value;
    } catch (error) {
      console.error("Failed to fetch process data:", error);
      return [];
    }
  };
  
