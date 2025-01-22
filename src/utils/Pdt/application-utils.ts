import { ElMessageBox, ElMessage } from 'element-plus';
import { sendGetRequest } from "../httpProtocol";


export async function deletePdtApplication(uuid : string): Promise<boolean> {
    try {
      await ElMessageBox.confirm(
        '정말로 삭제하시겠습니까? (한번 삭제된 정보는 복구할 수 없습니다)',
        'Warning',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
        }
      );
  
      // "Yes" is clicked: Send HTTP request
      sendGetRequest("/pdt_application/delete_pdt_application", uuid)
      
      ElMessage({
        type: 'success',
        message: '삭제가 완료되었습니다.',
      });
      return true;
    } catch (error) {
      // "No" is clicked or dialog is closed
      ElMessage({
        type: 'info',
        message: '작업이 취소되었습니다.',
      });
      return false;
    }
  }