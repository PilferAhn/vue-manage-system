import { reactive } from "vue";
import type { ProcessData } from "../Interface/ApplicationInterface";
import { ElMessageBox, ElMessage } from "element-plus";
import axios from "axios";

// Reactive initialization
export const processData = reactive<ProcessData>({
  uuid: "",
  group: "",
  process: "",
  priority: "",
  packageType: "",
  modelName: "",
  purpose: "",
  isAoi: true,
  destination: "",
  quantity: 0,
  code: "",
  fabInsertDate: "",
  fabFinishDate: "",
  waferCompany: "",
  waferAngle: "",
  waferThickness: "",
  waferType: "",
  machineName: "",
  condition: "",
});

// Confirm Application Function
export const confirmApplication = async (id: string) => {
  try {
    // Show a confirmation dialog before confirming
    await ElMessageBox.confirm(
      '의뢰서 작성을 확정하시겠습니까?', // The confirmation message
      '확정 확인', // The title of the confirmation dialog
      {
        confirmButtonText: 'Yes', // The label of the confirm button
        cancelButtonText: 'No', // The label of the cancel button
        type: 'warning', // The type (which will affect the color and icon)
      }
    );
    
    const formData = new FormData();
    formData.append("id" , id)
    // If the user confirms, send the confirm request
    const response = await axios.post(`/fab_monitoring/set_designer_confirm`, formData);

    ElMessage({
      type: 'success',
      message: '의뢰서가 성공적으로 확정되었습니다.',
    });
    console.log("Confirm response:", response.data);
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error("Failed to confirm application:", error);
    } else {
      ElMessage({
        type: 'info',
        message: '확정이 취소되었습니다.',
      });
    }
  }
};

// Delete Application Function
export const deleteApplication = async (id: string) => {
  try {
    // Show a confirmation dialog before deleting
    await ElMessageBox.confirm(
      '정말로 의뢰서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.', // The confirmation message
      '삭제 확인', // The title of the confirmation dialog
      {
        confirmButtonText: 'Yes', // The label of the confirm button
        cancelButtonText: 'No', // The label of the cancel button
        type: 'warning', // The type (which will affect the color and icon)
      }
    );

    // If the user confirms, send the delete request
    const response = await axios.get(`/fab/delete_application?id=${id}`);
    ElMessage({
      type: 'success',
      message: '의뢰서가 성공적으로 삭제되었습니다.',
    });
    console.log("Delete response:", response.data);
  } catch (error) {
    if (error !== 'cancel') {
      console.error("Failed to delete application:", error);
    } else {
      ElMessage({
        type: 'info',
        message: '삭제가 취소되었습니다.',
      });
    }
  }
};

// Utility function to format date to YYYY-MM-DD
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculate the current week number of the year.
 * Uses ISO week date system (weeks start on Monday).
 */
export function getCurrentWeekNumber(): number {
  const now = new Date();
  // Set the date to the nearest Thursday (ISO standard)
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfWeek = firstDayOfYear.getDay();
  const nearestThursday = firstDayOfYear.getTime() + ((4 - (dayOfWeek === 0 ? 7 : dayOfWeek)) * 86400000);
  const firstThursday = new Date(nearestThursday);

  // Calculate the difference between the current date and the first Thursday
  const millisecondsPerDay = 86400000;
  const differenceInMilliseconds = now.getTime() - firstThursday.getTime();
  const dayDifference = Math.floor(differenceInMilliseconds / millisecondsPerDay);

  // Calculate the week number (ISO week starts from week 1)
  return Math.ceil((dayDifference + 1) / 7) + 1;
}


// Utility function to convert snake_case to camelCase
function toCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// Function to convert an object with snake_case keys to camelCase
export function convertToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => convertToCamelCase(item)); // Convert array elements
  } else if (typeof data === "object" && data !== null) {
    const newObject: { [key: string]: any } = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const newKey = toCamelCase(key);
        newObject[newKey] = data[key]; // Recursively convert values if they are objects/arrays
      }
    }
    return newObject;
  } else {
    return data;
  }
}

export function formatDateForServer(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // You can choose the format as per your requirement:
  // Only Date: YYYY-MM-DD
  // Full Date & Time: YYYY-MM-DDTHH:MM:SS
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Convert camelCase to snake_case
function toSnakeCase(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

// Convert ApplicationData object to snake_case keys
export function convertToPep8(data: ProcessData): any {
  const convertedData: { [key: string]: any } = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // Convert each key to snake_case
      convertedData[toSnakeCase(key)] = data[key];
    }
  }
  return convertedData;
}

export function getSampleQuantityOptions() {
  const quantityOptions = [];

  for (let i = 0; i <= 30; i++) {
    quantityOptions.push(i);
  }

  return quantityOptions;
}

// Function to show the form data in a message
export const showFormData = (processData: ProcessData) => {
  ElMessage({
    message: `
      그룹: ${processData.group}
      공정: ${processData.process}
      긴급도: ${processData.priority}
      패키지: ${processData.packageType}
      용도 / 목적: ${processData.purpose}
      출하: ${processData.destination}
      AOI 유무: ${processData.isAoi}
      수량: ${processData.quantity}
      투입 코드: ${processData.code}
      Wafer 제조사: ${processData.waferCompany}
      Wafer 각도: ${processData.waferAngle}
      Wafer 두께: ${processData.waferThickness}
      Wafer 종류: ${processData.waferType}
      HS W/F 조건: ${processData.condition}
      성막 설비: ${processData.machineName}
      FAB 투입일: ${processData.fabInsertDate}
      FAB 종료일: ${processData.fabFinishDate}
    `,
    type: "info",
    duration: 5000, // Display for 5 seconds
  });
};

// Function to send a POST request to a server with the form data
export const sendFormData = async (url : string, processData: ProcessData) => {
  try {
    
    // Format the dates before sending them
    const formattedData = {
      ...processData,
      fabInsertDate: processData.fabInsertDate
        ? formatDateForServer(processData.fabInsertDate)
        : null,
      fabFinishDate: processData.fabFinishDate
        ? formatDateForServer(processData.fabFinishDate)
        : null,
    };
    const convertedData = convertToPep8(formattedData);
    const response = await axios.post(url, convertedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    ElMessage({
      message: "Data successfully sent to the server!",
      type: "success",
      duration: 3000,
    });

    return response.data; // If you need to use the response data
  } catch (error) {
    console.error("Error sending data to the server:", error);
    ElMessage({
      message: "Failed to send data to the server.",
      type: "error",
      duration: 3000,
    });
  }
};

export const groupList = [
  { key: "양산 개발", label: "양산 개발", value: "양산 개발" },
  { key: "선행 SAW", label: "선행 SAW", value: "선행 SAW" },
  { key: "선행 공법", label: "선행 공법", value: "선행 공법" },
];

export const processList = [
  { key: "normal", label: "Normal", value: "normal" },
  { key: "tc", label: "TC", value: "tc" },
  { key: "hs", label: "HS", value: "hs" },
];

export const priorityList = [
  { key: "A", label: "A", value: "A" },
  { key: "B", label: "B", value: "B" },
  { key: "C", label: "C", value: "C" },
];

export const packageList = [
  { key: "CSP", label: "CSP", value: "CSP" },
  { key: "WLP", label: "WLP", value: "WLP" },
  { key: "BDMP", label: "BDMP", value: "BDMP" },
];

export const destinationList = [
  { key: "HQ_CSP", label: "HQ_CSP", value: "HQ_CSP" },
  { key: "WHC-CSP", label: "WHC-CSP", value: "WHC-CSP" },
  { key: "WHC_WLP", label: "WHC_WLP", value: "WHC_WLP" },
  { key: "WTC", label: "WTC", value: "WTC" },
  { key: "WTC_CSP", label: "WTC_CSP", value: "WTC_CSP" },
  { key: "X", label: "X (해당없음)", value: "X" },
];

export const codeList = [
  { key: "C", label: "C", value: "C" },
  { key: "H", label: "H", value: "H" },
];

export const waferComList = [
  { key: "S", label: "S", value: "S" },
  { key: "NGK", label: "NGK", value: "NGK" },
];

export const waferTypes = [
  { key: "BLT", label: "BLT", value: "BLT" },
  { key: "HS", label: "HS", value: "HS" },
  { key: "BLN", label: "BLN", value: "BLN" },
];

export const machineList = [
  { key: "IDT#5", label: "IDT#5", value: "IDT#5" },
  { key: "IDT#6", label: "IDT#6", value: "IDT#6" },
  { key: "아넬바#1", label: "아넬바#1", value: "아넬바#1" },
  { key: "아넬바#2", label: "아넬바#2", value: "아넬바#2" },
  { key: "신크론", label: "신크론", value: "신크론" },
];
