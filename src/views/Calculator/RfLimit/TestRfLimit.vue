<template>
  <div class="container">
    <!-- 숫자를 선택할 수 있는 버튼 추가 -->
    <section>
      <h3>Spec 갯수 선택</h3>
      <div style="margin-bottom: 20px">
        <el-button v-for="n in 10" :key="n" @click="initializeSpecs(n)">
          {{ n }}
        </el-button>
      </div>
    </section>
    <section>
      <h3>Specs 정보</h3>
      <el-table :data="specs" style="width: 100%">
        <el-table-column prop="type" label="구분">
          <template #default="{ row }">
            <el-select v-model="row.type" placeholder="Select Type">
              <el-option label="IL" value="IL"></el-option>
              <el-option label="ATT" value="ATT"></el-option>
              <el-option label="ATT(상온)" value="ATT(상온)"></el-option>
              <el-option label="Output VSWR" value="Output VSWR"></el-option>
              <el-option label="Input VSWR" value="Input VSWR"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="spec_start" label="Spec Start">
          <template #default="{ row }">
            <el-input
              v-model="row.spec_start"
              placeholder="Spec Start"
            ></el-input>
          </template>
        </el-table-column>

        <!-- Spec Stop column -->
        <el-table-column prop="spec_stop" label="Spec Stop">
          <template #default="{ row }">
            <el-input
              v-model="row.spec_stop"
              placeholder="Spec Stop"
            ></el-input>
          </template>
        </el-table-column>

        <!-- Marker Left column -->
        <el-table-column prop="marker_start" label="Marker Left">
          <template #default="{ row }">
            <el-input
              v-model="row.marker_start"
              placeholder="Marker Left"
            ></el-input>
          </template>
        </el-table-column>

        <!-- Marker Right column -->
        <el-table-column prop="marker_stop" label="Marker Right">
          <template #default="{ row }">
            <el-input
              v-model="row.marker_stop"
              placeholder="Marker Right"
            ></el-input>
          </template>
        </el-table-column>

        <!-- Spec IL column -->
        <el-table-column prop="spec_il" label="Spec IL">
          <template #default="{ row }">
            <el-input v-model="row.spec_il" placeholder="Spec IL"></el-input>
          </template>
        </el-table-column>

        <!-- Port column with inline "S" -->
        <el-table-column prop="output" label="Port" width="200">
          <template #default="{ row }">
            <span style="display: flex; align-items: center">
              S<el-input
                v-model="row.output"
                placeholder="0"
                style="width: 50px; margin-left: 4px"
              ></el-input>
              <el-input
                v-model="row.input"
                placeholder="0"
                style="width: 50px"
              ></el-input>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <el-upload
      ref="uploadRef"
      class="upload-box"
      :limit="5"
      :multiple="true"
      :on-change="handleFileChange"
      :on-exceed="handleExceed"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        파일을 이곳에 드래그하거나 클릭하여 업로드하세요
      </div>
      <div class="el-upload__tip">파일 최대 5개까지 업로드할 수 있습니다.</div>
    </el-upload>

    <el-button type="primary" @click="uploadFiles">파일 전송</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import type { Spec2 } from "./testRfLimitInterface";
import { downloadFile } from "./TestRfLimit";

const uploadRef = ref(null);
const selectedFiles = ref<File[]>([]);

// spec quantity 정의 및 초기화
const specQuantity = ref(10);

// Spec 갯수에 따라 배열 초기화하는 함수
const initializeSpecs = (quantity: number) => {
  specs.length = 0; // 기존 배열 초기화
  for (let i = 0; i < quantity; i++) {
    specs.push({
      spec_start: '',
      spec_stop: '',
      marker_start: '',
      marker_stop: '',
      spec_il: '',
      type: i < 2 ? 'IL' : '', // 첫 2개의 항목은 "IL"로 설정
      line_color: '',
      output: i === 0 ? '0' : '', // 첫 번째 항목만 "0"으로 설정
      input: i === 0 ? '0' : '', // 첫 번째 항목만 "0"으로 설정
    });
  }
};

// // 수동으로 입력한 10개의 spec 데이터
// const specs = reactive<Spec2[]>([
//   {
//     spec_start: "2405.97",
//     spec_stop: "2478.30",
//     marker_start: "2390.30",
//     marker_stop: "2481.20",
//     spec_il: "-2.30",
//     type: "IL",
//     // line_color: "red",
//     output: "2",
//     input: "1",
//     isMax: false,
//   },
//   {
//     spec_start: "2411.06",
//     spec_stop: "2473.39",
//     marker_start: "2391.37",
//     marker_stop: "2479.97",
//     spec_il: "-2.10",
//     type: "ATT",
//     // line_color: "blue",
//     output: "2",
//     input: "1",
//     isMax: false,
//   },
//   {
//     spec_start: "2301.34",
//     spec_stop: "2369.40",
//     marker_start: "0",
//     marker_stop: "2376.60",
//     spec_il: "-27.00",
//     type: "ATT",
//     // line_color: "green",
//     output: "2",
//     input: "1",
//     isMax: true,
//   },
//   {
//     spec_start: "2369.23",
//     spec_stop: "2379.42",
//     marker_start: "0",
//     marker_stop: "2383.00",
//     spec_il: "-6",
//     type: "ATT",
//     // line_color: "yellow",
//     output: "2",
//     input: "1",
//     isMax: true,
//   },
//   {
//     spec_start: "2502.50",
//     spec_stop: "2505.00",
//     marker_start: "2494.80",
//     marker_stop: "0",
//     spec_il: "-28.00",
//     type: "ATT",
//     // line_color: "orange",
//     output: "2",
//     input: "1",
//     isMax: true,
//   },
//   {
//     spec_start: "2498.50",
//     spec_stop: "2501.00",
//     marker_start: "2488.40",
//     marker_stop: "0",
//     spec_il: "-28",
//     type: "ATT",
//     // line_color: "purple",
//     output: "2",
//     input: "1",
//     isMax: true,
//   },
//   {
//     spec_start: "2506.01",
//     spec_stop: "2689.99",
//     marker_start: "2494.40",
//     marker_stop: "0",
//     spec_il: "-26.00",
//     type: "ATT",
//     // line_color: "brown",
//     output: "2",
//     input: "1",
//     isMax: true,
//   },
//   {
//     spec_start: "2496.03",
//     spec_stop: "2509.66",
//     marker_start: "2490.30",
//     marker_stop: "0",
//     spec_il: "-8.00",
//     type: "ATT",
//     line_color: "pink",
//     output: "2",
//     input: "1",
//     isMax: true,
//   },
//   {
//     spec_start: "2399.18",
//     spec_stop: "2485.61",
//     marker_start: "2379.60",
//     marker_stop: "2490.50",
//     spec_il: "2.20",
//     type: "INPUT_VSWR",
//     // line_color: "black",
//     output: "1",
//     input: "1",
//     isMax: false,
//   },
//   {
//     spec_start: "2399.18",
//     spec_stop: "2485.61",
//     marker_start: "2382.40",
//     marker_stop: "2489.30",
//     spec_il: "2.20",
//     type: "OUTPUT_VSWR",
//     // line_color: "gray",
//     output: "2",
//     input: "2",
//     isMax: false,
//   },
// ]);

// specs 배열을 reactive로 선언
const specs = reactive<Spec2[]>([]);

// // spec을 동적으로 초기화하는 함수
// const initializeSpecs = () => {
//   specs.length = 0; // 기존 배열 초기화
//   for (let i = 0; i < specQuantity.value; i++) {
//     specs.push({
//       spec_start: "",
//       spec_stop: "",
//       marker_start: "",
//       marker_stop: "",
//       spec_il: "",
//       typ: i < 2 ? "IL" : "", // 첫 2개의 항목은 "IL"로 설정
//       line_color: "",
//       output: i === 0 ? "0" : "", // 첫 번째 항목만 "0"으로 설정
//       input: i === 0 ? "0" : ""   // 첫 번째 항목만 "0"으로 설정
//     });
//   }
// };

// // 처음 컴포넌트가 로드될 때 초기화
// initializeSpecs();

// 파일 선택 시 선택된 파일 배열을 저장
const handleFileChange = (file: File, fileList: File[]) => {
  selectedFiles.value = fileList;
  console.log("선택된 파일들:", fileList);
};

// 파일 제한 초과 시 경고 메시지 처리
const handleExceed = (files: File[], fileList: File[]) => {
  ElMessage.warning(
    `업로드 파일 제한을 초과했습니다. 최대 5개 파일만 업로드 가능합니다.`
  );
};

// 선택된 파일들을 서버로 전송
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.error("선택된 파일이 없습니다.");
    return;
  }

  try {
    const formData = new FormData();

    // FormData에 파일 배열을 추가할 때 'files[]'로 이름 설정
    // selectedFiles.value.forEach(file => {
    //   formData.append('files[]', file);  // 'files[]'로 여러 파일을 전송
    // });
    selectedFiles.value.forEach((file) => formData.append("files", file.raw));
    // axios로 서버에 파일 전송

    // specs 데이터를 FormData에 추가 (JSON 형태로 전송)
    formData.append("specs", JSON.stringify(specs));

    const response = await axios.post("/rf-limit/upload-files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });

    ElMessage.success(
      `${selectedFiles.value.length}개의 파일이 성공적으로 업로드되었습니다.`
    );

    // Blob 데이터로부터 다운로드 URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Content-Disposition 헤더에서 파일 이름 추출
    let filename = "default-filename.xlsx"; // 기본 파일 이름 설정
    const contentDisposition = response.headers["content-disposition"];
    console.log(contentDisposition);
    if (contentDisposition) {
      const filenameRegex = /filename\*?=['"]?([^;\r\n"]*)['"]?/i;
      // const filenameRegex = /filename\*?=['"]?UTF-8''([^;'\"]*)['"]?;?/i;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches && matches[1]) {
        // UTF-8 인코딩 해제 및 디코딩
        filename = decodeURIComponent(matches[1]);
      }
    }

    link.setAttribute("download", filename); // 다운로드할 파일 이름 설정
    document.body.appendChild(link);
    link.click(); // 프로그래매틱하게 링크 클릭 이벤트 발생

    // 정리 작업
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // // Automatically download the file
    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement("a");
    // const contentDisposition = response.headers["content-disposition"];
    // let fileName = "downloaded_file.xlsx"; // Default name

    // // Extract and clean the file name from the content-disposition header
    // if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
    //   const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    //   if (fileNameMatch && fileNameMatch.length === 2) {
    //     fileName = fileNameMatch[1].replace(/"/g, ""); // Remove any extra quotes
    //   }
    // }

    // link.href = url;
    // link.setAttribute("download", fileName); // Set the file name for download
    // document.body.appendChild(link);
    // link.click();

    // // Clean up
    // link.remove();
    // window.URL.revokeObjectURL(url);
  } catch (error) {
    ElMessage.error("파일 업로드 실패");
    console.error("업로드 실패:", error);
  }
};
</script>

<style scoped>
.upload-box {
  width: 100%;
  border: 2px dashed #d9d9d9;
  padding: 20px;
  text-align: center;
}

section {
  margin-bottom: 20px;
}
</style>
