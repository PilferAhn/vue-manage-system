<template>
  <div class="module-file-section">
    <el-divider content-position="left" class="section-title">Module Files</el-divider>

    <div class="file-grid">
      <!-- ✅ RFFE -->
      <el-card shadow="never">

        <!-- ✅ 기존 업로드 파일 리스트 -->
        <el-table
          v-if="rffeFileList.length > 0"
          :data="rffeFileList"
          border
          size="small"
          class="mt10"
        >
          <el-table-column prop="fileName" label="파일명" />
          <el-table-column label="다운로드" width="110" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                type="success"
                plain
                @click="handleDownloadFile(row)"
              >
                Download
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="삭제" width="90" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleDeleteFile(row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- ✅ 선택 업로드 -->
        <el-upload
          drag
          multiple
          :auto-upload="false"
          :file-list="rffeUploadList"
          :on-change="onRffeChange"
          :on-remove="onRffeRemove"
          :show-file-list="true"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            <em>RFFE 파일 선택</em>
          </div>
        </el-upload>
      </el-card>

      <!-- ✅ Config -->
      <el-card shadow="never">
        <!-- ✅ 기존 업로드 파일 리스트 -->
        <el-table
          v-if="configFileList.length > 0"
          :data="configFileList"
          border
          size="small"
          class="mt10"
        >
          <el-table-column prop="fileName" label="파일명" />

          <el-table-column label="다운로드" width="110" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                type="success"
                plain
                @click="handleDownloadFile(row)"
              >
                Download
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="삭제" width="90" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleDeleteFile(row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- ✅ 선택 업로드 -->
        <el-upload
          drag
          multiple
          :auto-upload="false"
          :file-list="configUploadList"
          :on-change="onConfigChange"
          :on-remove="onConfigRemove"
          :show-file-list="true"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            <em>Config 파일 선택</em>
          </div>
        </el-upload>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

type SavedFile = {
  uuid: string;
  fileType: string;
  fileName: string;
  url: string;
};

const props = defineProps<{
  applicationUuid: string;
}>();

const rffeUploadList = ref<UploadUserFile[]>([]);
const configUploadList = ref<UploadUserFile[]>([]);

const rffeFileList = ref<SavedFile[]>([]);
const configFileList = ref<SavedFile[]>([]);

/** ✅ UUID 바뀌면: 선택 목록 초기화 + 서버 목록 재조회 */
watch(
  () => props.applicationUuid,
  async (newVal) => {
    if (!newVal) return;
    rffeUploadList.value = [];
    configUploadList.value = [];
    await fetchModuleFiles();
  },
  { immediate: true }
);

/** ✅ 기존 업로드 파일 조회 */
async function fetchModuleFiles() {
  try {
    const res = await axios.post(
      "pdt_application/get_pdt_module_files",
      new URLSearchParams({ uuid: props.applicationUuid })
    );

    rffeFileList.value = res.data?.rffeFileList || [];
    configFileList.value = res.data?.configFileList || [];
  } catch (e) {
    console.error(e);
    ElNotification({
      title: "실패",
      message: "Module 파일 조회 실패",
      type: "error",
      duration: 2500,
      position: "top-right",
    });
  }
}

/** ✅ Upload Change / Remove */
const onRffeChange: UploadProps["onChange"] = (_file, fileList) => {
  rffeUploadList.value = fileList;
};
const onRffeRemove: UploadProps["onRemove"] = (_file, fileList) => {
  rffeUploadList.value = fileList;
};

const onConfigChange: UploadProps["onChange"] = (_file, fileList) => {
  configUploadList.value = fileList;
};
const onConfigRemove: UploadProps["onRemove"] = (_file, fileList) => {
  configUploadList.value = fileList;
};

async function handleDownloadFile(file: SavedFile) {
  try {
    const formData = new FormData();
    formData.append("file_uuid", file.uuid); // ✅ DB에서 row 찾는 키
    // formData.append("file_type", file.fileType); // 필요하면 추가(선택)

    const res = await axios.post("pdt_application/download_pdt_module_file", formData, {
      responseType: "blob",
    });

    const blob = new Blob([res.data]);
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;

    // ✅ 서버가 Content-Disposition 내려주면 그걸 쓰고, 없으면 기존 fileName
    const cd = res.headers["content-disposition"];
    a.download = getFilenameFromContentDisposition(cd) || file.fileName;

    a.click();
    window.URL.revokeObjectURL(blobUrl);
  } catch (e) {
    console.error(e);
    ElNotification({
      title: "실패",
      message: "다운로드 실패",
      type: "error",
      duration: 2500,
      position: "top-right",
    });
  }
}

/** ✅ Content-Disposition에서 파일명 파싱 (한글 포함 대응) */
function getFilenameFromContentDisposition(cd?: string) {
  if (!cd) return null;

  // filename*=UTF-8''xxx
  const utf8Match = cd.match(/filename\*\=UTF-8''(.+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);

  // filename="xxx"
  const normalMatch = cd.match(/filename="?([^"]+)"?/i);
  if (normalMatch?.[1]) return normalMatch[1];

  return null;
}

/** ✅ 다운로드 */
// async function handleDownloadFile(file: SavedFile) {
//   try {
//     console.log("file.url",file.url);
//     const res = await axios.get(file.url, { responseType: "blob" });
    
//     const blobUrl = window.URL.createObjectURL(res.data);
//     const a = document.createElement("a");
//     a.href = blobUrl;
//     a.download = file.fileName;
//     a.click();
//     window.URL.revokeObjectURL(blobUrl);
//   } catch (e) {
//     console.error(e);
//     ElNotification({
//       title: "실패",
//       message: "다운로드 실패",
//       type: "error",
//       duration: 2500,
//       position: "top-right",
//     });
//   }
// }

/** ✅ 삭제 */
async function handleDeleteFile(file: SavedFile) {
  try {
    await ElMessageBox.confirm(
      `정말 삭제할까요?\n\n${file.fileName}`,
      "파일 삭제",
      {
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        type: "warning",
      }
    );

    await axios.delete(`pdt_application/delete_pdt_module_file/${file.uuid}`);
    ElNotification({
      title: "성공",
      message: "파일 삭제 완료",
      type: "success",
      duration: 2000,
      position: "top-right",
    });

    await fetchModuleFiles();
  } catch (e: any) {
    // 취소한 경우는 조용히 무시
    if (e === "cancel" || e === "close") return;

    console.error(e);
    ElNotification({
      title: "실패",
      message: "파일 삭제 실패",
      type: "error",
      duration: 3000,
      position: "top-right",
    });
  }
}

/** ✅ 부모가 “의뢰서 업데이트” 눌렀을 때 호출할 업로드 함수 */
async function uploadPendingFiles() {
  try {
    const hasRffe = rffeUploadList.value.length > 0;
    const hasConfig = configUploadList.value.length > 0;

    if (!hasRffe && !hasConfig) return;

    const formData = new FormData();

    for (const f of rffeUploadList.value) {
      if (f.raw) formData.append("rffe_files", f.raw);
    }
    for (const f of configUploadList.value) {
      if (f.raw) formData.append("config_files", f.raw);
    }

    await axios.post(
      `pdt_application/upload_pdt_module_files/${props.applicationUuid}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    rffeUploadList.value = [];
    configUploadList.value = [];
    await fetchModuleFiles();

    ElNotification({
      title: "성공",
      message: "Module 파일 업로드 완료",
      type: "success",
      duration: 2500,
      position: "top-right",
    });
  } catch (e) {
    console.error(e);
    ElNotification({
      title: "실패",
      message: "Module 파일 업로드 실패",
      type: "error",
      duration: 3000,
      position: "top-right",
    });
    throw e;
  }
}

defineExpose({
  uploadPendingFiles,
  fetchModuleFiles,
});
</script>

<style scoped>
.file-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.mt10 {
  margin-top: 10px;
}
.module-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-upload__text {
  border: 1px dashed #409eff;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
}

.section-title :deep(.el-divider__text) {
  font-size: 14px;
  font-weight: 700;
  color: #303133;
  padding: 0 10px;
  background: white;
}

.section-title :deep(.el-divider--horizontal) {
  border-top: 1px solid #dcdfe6;
}

.section-title {
  margin: 12px 0 16px;
}
</style>
