<script lang="ts">
export default {};
</script>
<template>
  <el-table :data="props.appFile">
    <el-table-column label="이름" :align="'center'">
      <template #default="scope">
        {{ scope.row.fileName }}.{{ scope.row.ext }}
      </template>
    </el-table-column>
    <el-table-column
      label="확장자"
      prop="ext"
      :align="'center'"
    ></el-table-column>
    <el-table-column label="Action" :align="'center'">
      <template #default="scope">
        <el-button
          type="success"
          @click="handleButtons('download', scope.row, props.file_type)"
          >다운로드</el-button
        >

        <el-button
          type="danger"
          @click="handleButtons('delete', scope.row, props.file_type)"
          >삭제</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import type { ApplicationFile } from "../../../interface/module_group/application/application";
import { sendPostRequest } from "../../../utils/httpProtocol";
import axios from "axios";
const props = defineProps<{
  appFile: ApplicationFile[];
  file_type: string;
}>();

const removeFileById = (targetId: string) => {
  const index = props.appFile.findIndex((file) => file.uId === targetId);
  if (index !== -1) {
    props.appFile.splice(index, 1); // 해당 위치에서 1개 제거
  }
};

const handleButtons = async (
  buttonType: string,
  app: ApplicationFile,
  fileType: string
) => {
  const formData = new FormData();
  formData.append("u_id", app.uId);
  formData.append("file_type", fileType);

  if (buttonType === "download") {
    const url = "http://10.29.11.59:8002/module/get_file";
    downloadSolderApplication(url , formData);
  } else if (buttonType === "delete") {
    const url = "http://10.29.11.59:8002/module/delete_file";
    const response = await sendPostRequest(url, formData);
    removeFileById(app.uId);
  }
};

async function downloadSolderApplication(
  target_url: string,
  formData: FormData
) {
  try {
    const response = await axios({
      url: target_url,
      method: "POST",
      data: formData,
      responseType: "blob",
    });

    // ✅ 서버가 준 파일명 추출
    const disposition = response.headers["content-disposition"];
    let fileName = "downloaded_file.xlsx";
    
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1].replace(/['"]/g, ""));
      }
    }

    // ✅ 그대로 저장
    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/octet-stream",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // 서버가 준 이름 그대로 씀
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ 다운로드 실패:", error);
  }
}


</script>

<style></style>
