// utils/dateUtils.ts
import axios from 'axios'
import type { CER0Form } from "./cer0-types";

/**
 * Returns today's date in YYYY-MM-DD format.
 * @returns {string} - Today's date
 */

// Python 스타일로 변수명을 변환하는 함수
function convertToPythonStyle(application: CER0Form): Record<string, any> {
  return {
    id: application.id,
    requester_id: application.requesterId,
    requester_name: application.requesterName,
    date_of_created: application.dateOfCreated,
    date_of_start: application.dateOfStart,
    date_of_wish_to_finish: application.dateOfWishToFinish,  // 수정된 필드 이름
    date_of_completed: application.dateOfCompleted,
    purpose: application.purpose,
    product_name: application.modelName,
    version: application.version,
    m1_thick: application.m1Thick,
    layer_stack: application.layerStack,
    lot_id: application.lotId,
    wafer_id: application.waferId,
    shot: application.shot,
    note: application.note,
    handler_id: application.handler_id,
    handler_name: application.handler_name,
    status: application.status
  };
}

export function getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  export function getCurrentDateTimeString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

// CER0Form 데이터를 받아서 전송하는 함수
export async function sendCer0Application(application: CER0Form): Promise<void> {
  const pythonStyleData = convertToPythonStyle(application);
  
  console.log(pythonStyleData)
  try {
    const response = await axios.post('/api/v1/cer0/send_cer0_application', pythonStyleData);
    console.log('Form submitted successfully:', response.data);
  } catch (error) {
    console.error('Error submitting form:', error);
  }

}