<template>
  <div class="container">
    <!-- Input section to control the number of TestDataItem elements -->
    <el-form label-position="top">
      <el-form-item label="Number of TestDataItem Elements">
        <!-- Control the count of TestData elements -->
        <el-input-number
          v-model="testDataCount"
          :min="0"
          :max="100"
          label="Test Data Count"
        />
      </el-form-item>
    </el-form>

    <!-- TestRfLimitSpec 영역 -->
    <div class="spec-section">
      <h3>Test RF Limit Spec</h3>
      <TestRfLimitSpec :referenceSpec="allReferenceSpec" />
    </div>

    <!-- Table to upload files -->
    <div class="files-section">
      <h3>Select Files</h3>
      <el-table :data="fileRows" style="width: 100%">
        <!-- Selected File Name Column -->
        <el-table-column
          prop="fileName"
          label="Selected File Name"
          :align="'center'"
        >
          <template #default="scope">
            <span>{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>

        <!-- File Extension Column -->
        <el-table-column
          prop="fileExtension"
          label="File Extension"
          :align="'center'"
        >
          <template #default="scope">
            <span>{{ scope.row.fileExtension }}</span>
          </template>
        </el-table-column>

        <!-- File Selection Column -->
        <el-table-column label="File Selection">
          <template #default="scope">
            <el-upload
              action=""
              :before-upload="beforeUpload"
              :on-change="(file) => handleFileChange(file, scope.$index)"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button type="primary">Select File</el-button>
            </el-upload>
          </template>
        </el-table-column>

        <!-- Jig/Solder Dropdown Column -->
        <el-table-column label="Type">
          <template #default="scope">
            <el-select
              v-model="fileRows[scope.$index].fileType"
              placeholder="Select Type"
            >
              <el-option label="JIG" value="JIG"></el-option>
              <el-option label="SOLDER" value="SOLDER"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 서버로 파일과 데이터를 전송하는 버튼 -->
    <el-button type="primary" @click="submitToServer"
      >Submit to Server</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import axios from "axios";
import { TestDataItem } from "./testRfLimitInterface";
import { useTestDataWatcher } from "./TestRfLimit.ts";
import TestRfLimitSpec from "./TestRfLimitSpec.vue";

// Reactive state to store the array of TestDataItem
const testData = ref<TestDataItem[]>([]);
// Reactive state to control the count of TestDataItem
const testDataCount = ref<number>(0);

// Computed property to collect all reference_spec arrays into a single array
const allReferenceSpec = computed(() => {
  return testData.value.flatMap((item) => item.reference_spec);
});

// Use the watcher to manage the testData array based on testDataCount
useTestDataWatcher(testData, testDataCount);

// File upload table data
const fileRows = ref([
  { fileName: "", fileExtension: "", file: null, fileType: "" },
  { fileName: "", fileExtension: "", file: null, fileType: "" },
]);

// Handle file selection change
const handleFileChange = (file: File, index: number) => {
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop(); // Extract file extension
  fileRows.value[index].fileName = fileName;
  fileRows.value[index].fileExtension = fileExtension || "";
  fileRows.value[index].file = file;
};

// Before file upload validation
const beforeUpload = (file: File) => {
  // Perform any file validation here if necessary
  return true;
};

const submitToServer = async () => {
  const formData = new FormData();

  const testDataBlob = new Blob([JSON.stringify({ testData: testData.value })], { type: 'application/json' });
  formData.append("test_data", testDataBlob);

  // Append files
  console.log(fileRows)
  fileRows.value.forEach((row, index) => {
    if (row.file) {
      formData.append(`file${index + 1}`, row.file);
    }
  });

  try {
    const response = await axios.post('/rf-limit/upload-test-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Data uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading data:', error);
  }
};

</script>

<style scoped>
@import "../../../assets/css/TestRfLimit.css";

.files-section {
  margin-top: 20px;
}
</style>
