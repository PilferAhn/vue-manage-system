import axios from "axios";
import type {cer0File} from "./cer0FilesTypes"

// // 데이터를 불러오는 함수 (예: API 요청)
// export async function fetchCer0Files(): Promise<cer0Files> {
//     // 실제로는 API 호출 등을 통해 데이터를 받아올 수 있습니다.
//     // 여기서는 예시 데이터를 반환합니다.
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           cer0Files: [
//             { fileName: 'Document_1.pdf' },
//             { fileName: 'Document_2.pdf' },
//             { fileName: 'Document_3.pdf' },
//           ],
//         });
//       }, 1000);
//     });
//   }

//   // cer0File 배열 초기화
// const cer0FileList: cer0File[] = [
//   { fileName: 'example_file_1.zip' },
//   { fileName: 'example_file_2.zip' },
// ];

// 배열을 불러오는 함수
export async function getCer0Files(id : string): Promise<cer0File[]> {

  const url = "/api/v1/cer0/get_cer0_files_by_id/" + id

  try {

    const response = await axios.get(url);
    return response.data
    
  } catch (error) {
    console.error('Failed to fetch CER0 form data:', error);
    return null;
  }

  
}