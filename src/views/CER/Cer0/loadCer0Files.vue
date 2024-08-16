<template>
  <div>
    <!-- 파일 목록이 없을 때 -->
    <div v-if="cer0Files.length === 0" class="empty-container">
      <el-empty description="No File in Database" />
    </div>

    <!-- 파일 목록이 있을 때 -->
    <div v-else class="table-container">
      <el-table :data="cer0Files" style="width: 100%" class="cer0-table">
        <el-table-column
          prop="displayName"
          label="File Name"
          width="1000"
        ></el-table-column>
        <el-table-column label="Action">
          <template #default="scope">
            <el-button type="primary" class="download-button">
              Download
            </el-button>
            <el-button
              type="danger"
              class="download-button"
              @click="handleRemove(scope.row.id, id)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 파일 업로드 섹션 -->
    <div class="upload-container">
      <el-upload
        :limit="5"
        :multiple="true"
        :on-change="handleFileChange"
        :on-exceed="handleExceed"
        :auto-upload="false"
        drag
        ref="uploadRef"
        class="upload-box"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drag files here or <em>click to upload</em>
        </div>
      </el-upload>
      <el-button
        type="success"
        class="upload-button"
        @click="uploadFiles"
        :disabled="selectedFileNames.length === 0"
      >
        <i class="el-icon-upload2"></i> Upload Selected Files
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { uploadCer0Files, deleteFileByFileId } from "./loadCer0Files"; // API 호출 함수 가져오기
import { getCer0Files } from "./cer0Files"; // cer0Files 데이터를 불러오는 함수
import type { cer0File } from "./cer0FilesTypes";

const props = defineProps({
  id: String,
});

// string 타입 변수로 id 사용
let id = props.id;

const cer0Files = ref<cer0File[]>([]);

watch(
  () => props.id,
  async (newUuid) => {
    id = newUuid; // id 값을 직접 업데이트
    cer0Files.value = await getCer0Files(id);
  },
  { immediate: true }
);

// 선택한 파일들의 이름을 저장하는 변수
const selectedFileNames = ref<string[]>([]);
const uploadRef = ref(null); // el-upload 컴포넌트에 접근하기 위한 ref
const selectedFiles = ref<File[]>([]); // 선택된 파일들을 저장하는 변수

// 파일 선택 시 호출되는 함수
function handleFileChange(file: File, fileList: File[]) {
  selectedFileNames.value = fileList.map((f) => f.name);
  selectedFiles.value = fileList; // 선택된 파일들을 저장
}

// 파일 업로드 개수 초과 시 호출되는 함수
function handleExceed(files: File[], fileList: File[]) {
  this.$message.warning(
    `The limit is 5 files. You selected ${files.length} files this time, but ${fileList.length} files are already selected.`
  );
}

async function handleRemove(id: string, cer0Id) {
  const isValid = deleteFileByFileId(id);
  if (isValid) {
    cer0Files.value = await getCer0Files(cer0Id);
  }
}

// 업로드 버튼을 클릭했을 때 파일 업로드를 시작하는 함수
async function uploadFiles() {
  try {
    const response = await uploadCer0Files(id, selectedFiles.value);
    cer0Files.value = await getCer0Files(id);
    selectedFiles.value = [];
    selectedFileNames.value = [];

    // el-upload 컴포넌트에서 파일 목록 초기화
    if (uploadRef.value) {
      uploadRef.value.clearFiles();
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.empty-container {
  text-align: center;
  margin-top: 50px;
}

.table-container {
  margin-bottom: 30px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}

.upload-box {
  border: 2px dashed #d9d9d9;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 50px;
  text-align: center;
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: #409eff;
}

.el-upload__text {
  font-size: 16px;
  color: #606266;
}

.upload-button {
  padding: 12px 24px;
  font-size: 16px;
}

.download-button {
  margin-left: 10px;
}
</style>
