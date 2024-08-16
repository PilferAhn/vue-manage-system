<template>
  <div>
    <span v-if="cer0Files.length === 0">
      <el-empty description="description" />
    </span>
    <span v-else>
      <el-table
        v-if="cer0Files && cer0Files.length"
        :data="cer0Files"
        style="width: 100%"
        class="cer0-table"
      >
        <el-table-column prop="fileName"></el-table-column>
        <el-table-column label="Action">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-download"
              @click="downloadZip(scope.row.fileName)"
              >Download
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </span>
  </div>
  <div>
    <!-- 파일 선택 및 업로드 컨테이너 -->
    <el-upload
      action="/api/v1/cer0/upload_files"
      :data="uploadData" 
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :multiple="true"
      :limit="5"
      :on-exceed="handleExceed"
      :on-change="handleFileChange"
      :auto-upload="false"
      ref="uploadRef"
      drag
      class="upload-box"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drag files here or <em>click to upload</em>
      </div>
    </el-upload>

    <!-- 업로드 버튼 -->
    <el-button
      type="success"
      class="upload-button"
      @click="uploadFiles"
      :disabled="selectedFileNames.length === 0"
    >
      <i class="el-icon-upload2"></i> Upload Selected Files
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import { getCer0Files } from "./cer0Files"; // cer0Files 데이터를 불러오는 함수
import { downloadZip } from "../../TegPage/MeasurementQueue/TegMeasurementFinishedQue";
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
    console.log(cer0Files.value.length);
  },
  { immediate: true }
);

const allowedExtensions = ["pptx", "ppt", "zip", "xls", "xlsx"]; 

// 선택한 파일들의 이름을 저장하는 변수
const selectedFileNames = ref<string[]>([]);
const uploadRef = ref(null); 

// 추가 데이터 (id)를 함께 전송
const uploadData = ref({ id: id }); // 테스트용 ID 설정

// 파일 선택 시 호출되는 함수
function handleFileChange(file: File, fileList: File[]) {
  selectedFileNames.value = fileList.map((f) => f.name);
}

// 파일 업로드 전에 확장자를 확인하는 함수
function beforeUpload(file: File) {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension || "")) {
    this.$message.error(
      `Invalid file type. Only ${allowedExtensions.join(
        ", "
      )} files are allowed.`
    );
    return false; // 업로드를 막음
  }
  return true; // 업로드 진행
}

// 업로드 버튼을 클릭했을 때 파일 업로드를 시작하는 함수
function uploadFiles() {
  if (uploadRef.value) {
    uploadRef.value.submit(); // 선택한 파일들을 서버에 업로드
  }
}


// 파일 업로드 성공 시 호출되는 함수
function handleUploadSuccess(response: any, file: File) {
  console.log("File uploaded successfully:", file.name);
}

// 파일 업로드 실패 시 호출되는 함수
function handleUploadError(err: any, file: File) {
  console.error("Failed to upload file:", file.name);
}

// 파일 업로드 개수 초과 시 호출되는 함수
function handleExceed(files: File[], fileList: File[]) {
  this.$message.warning(
    `The limit is 5 files. You selected ${files.length} files this time, but ${fileList.length} files are already uploaded.`
  );
}
</script>


<style scoped>
.el-upload {
  margin-bottom: 20px;
}

.upload-box {
  border: 2px dashed #d9d9d9;
  background-color: #fafafa;
  border-radius: 6px;
  padding: 40px;
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
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 16px;
}

.file-list {
  margin-top: 20px;
}

.file-item {
  font-size: 14px;
  color: #606266;
  margin: 8px 0;
  display: flex;
  align-items: center;
}

.file-item i {
  margin-right: 8px;
  color: #409eff;
}
</style>
