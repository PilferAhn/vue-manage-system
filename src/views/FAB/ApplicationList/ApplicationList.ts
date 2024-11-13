import axios from "axios";
import { ref } from "vue";
import { convertToCamelCase } from "../Common/Application";
import type { ProcessData } from "../Interface/ApplicationInterface";

// Define the processData ref in case you want to use it directly
export const processData = ref<ProcessData[]>([]);

export const downloadExcel = async (processData: ProcessData[]) => {
  try {
    // processData 배열에서 id 값만 추출하여 idList에 저장
    const idList = processData.map((data) => data.id);
    const form = new FormData();

    // 각 id를 FormData에 추가
    idList.forEach((id) => {
      form.append("id_list", id.toString());
    });

    const template_url = "/fab_monitoring/download_fab_inset_list";

    const response = await axios({
      url: template_url,
      method: "POST",
      data: form,
      responseType: "blob", // Important for handling binary data (xlsx)
    });

    // Extract the file name from the 'Content-Disposition' header
    const disposition = response.headers["content-disposition"];
    let fileName = "FAB 투입 리스트.xlsx"; // Default file name

    if (disposition) {
      const fileNameUTF8Match = disposition.match(
        /filename\*=UTF-8''([^;\n]*)/
      );
      if (fileNameUTF8Match && fileNameUTF8Match[1]) {
        fileName = decodeURIComponent(fileNameUTF8Match[1]);
      } else {
        const fileNameMatch = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ""));
        }
      }
    }

    // Create a link element to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Use the extracted file name
    document.body.appendChild(link);
    link.click();

    // Clean up the link element after the download
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchProcessData = async () => {
  try {
    let startTime = performance.now();
    const formData = new FormData();

    formData.append("lot_status", "true")

    formData.append("order_by", "created_date");

    formData.append("order_dir", "asc");

    formData.append("designer_confirm", "false");

    const url = "/fab_monitoring/get_fab_request_list";

    const response = await axios.post(url, formData);

    processData.value = convertToCamelCase(response.data); // Convert data to camelCase

    return processData.value;
  } catch (error) {
    console.error("Failed to fetch process data:", error);
    return [];
  }
};
