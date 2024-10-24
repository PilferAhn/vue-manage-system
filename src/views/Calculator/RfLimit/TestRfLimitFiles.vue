<template>
    <div>
      <el-table :data="files">
        <el-table-column prop="fileName" label="File Name" />
        <el-table-column prop="fileType" label="File Type" />
        <el-table-column prop="port" label="Port" />
        <!-- 새로운 열 추가: 파일 선택 버튼 -->
        <el-table-column label="Actions">
          <template #default="scope">
            <!-- 파일 선택 버튼 및 파일 입력 요소 -->
            <el-button @click="triggerFileInput(scope.$index)">Select File</el-button>
            <input
              type="file"
              :ref="el => fileInputs[scope.$index] = el"
              @change="handleFileChange(scope.row, $event)"
              style="display: none"
            />
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 파일 전송 버튼 -->
      <el-button type="primary" @click="uploadFiles">Upload Selected Files</el-button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, PropType } from "vue";
  import { SParameterFile } from "./testRfLimitInterface";
  import axios from "axios";
  
  // Define props to receive data from the parent component
  const props = defineProps({
    files: {
      type: Array as PropType<SParameterFile[]>,
      required: true,
    },
  });
  
  // 파일 입력 요소들을 참조하는 배열
  const fileInputs = ref<HTMLInputElement[]>([]);
  
  // 선택된 파일들을 추적하기 위한 배열
  const selectedFiles = ref<File[]>([]);
  
  // 각 행에 있는 파일 입력 요소를 클릭하여 파일 선택을 유도
  const triggerFileInput = (index: number) => {
    const inputElement = fileInputs.value[index];
    if (inputElement) {
      inputElement.click();  // 해당 인덱스의 input 요소를 클릭
    }
  };
  
  // 파일 선택 후 이름과 확장자를 할당하고 파일을 저장하는 함수
  const handleFileChange = (fileData: SParameterFile, event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      const fileName = selectedFile.name;
  
      // 파일 이름과 확장자를 분리하여 각각 저장
      const [name, extension] = fileName.split(".");
      fileData.fileName = name;
      fileData.port = extension;
  
      // 선택된 파일을 배열에 저장
      selectedFiles.value.push(selectedFile);
  
      // 디버그 로그 출력
      console.log(`Selected file: ${fileName}, Extension: ${extension}`);
    }
  };
  
  // 선택된 파일을 서버로 전송하는 함수
  const uploadFiles = async () => {
    const formData = new FormData();
  
    // 선택된 파일을 FormData에 추가
    selectedFiles.value.forEach((file) => {
      formData.append("files", file);
    });
  
    try {
      // 서버로 파일 전송 (서버 URL을 적절히 변경)
      const response = await axios.post("https://your-server-url/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  </script>
  