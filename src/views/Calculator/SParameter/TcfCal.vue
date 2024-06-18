<template>
  <el-form>
    <div class="container">
      <div class="split-layout">
        <div class="form-box">
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText v-model="roundingPoing" label="소수점 반올림" />
            </el-col>
            <el-col :span="12">
              <InputText v-model="port" label="Port" />
            </el-col>
          </el-row>
        </div>
        <div class="form-box">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-upload
                ref="upload"
                :auto-upload="false"
                :on-change="handleFileChange"
                multiple
                :show-file-list="false"
                class="upload-demo"
              >
                <el-button size="default" type="primary">파일 선택</el-button>
              </el-upload>
            </el-col>
            <el-col :span="3">
              <el-button
                size="default"
                type="success"
                @click="calculateTCF"
                :disabled="sparaFiles.length === 0"
                >TCF 계산</el-button
              >
            </el-col>
            <el-col :span="3">
              <el-button
                size="default"
                type="success"
                @click="downloadExcel"
                :disabled="sparaFiles.length === 0"
                >다운로드</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>

      <ul style="margin-bottom: 20px">
        <el-table v-if="sparaFiles.length >= 1" :data="sparaFiles">
          <el-table-column prop="fileName" label="파일명"></el-table-column>
          <el-table-column prop="port" label="Port"></el-table-column>
          <el-table-column prop="temperature" label="온도"></el-table-column>
        </el-table>
      </ul>

      <div v-if="sparaFiles.length >= 0" class="split-layout">
        <div class="form-box">
          <el-row :gutter="20">
            <el-col :span="12">
              <SelectOption
                v-model="rxOutput"
                :options="portNumberList"
                label="RX Output"
                :key="`select-rxOutput-${portNumberList.length}`"
                style="width: 150px"
              ></SelectOption>
            </el-col>
            <el-col :span="12">
              <SelectOption
                v-model="rxInput"
                :options="portNumberList"
                label="RX Input"
                :key="`select-rxInput-${portNumberList.length}`"
                style="width: 150px"
              ></SelectOption>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <SelectOption
                v-model="txOutput"
                :options="portNumberList"
                label="TX Output"
                :key="`select-txOutput-${portNumberList.length}`"
                style="width: 150px"
              ></SelectOption>
            </el-col>
            <el-col :span="12">
              <SelectOption
                v-model="txInput"
                :options="portNumberList"
                label="TX Input"
                :key="`select-txInput-${portNumberList.length}`"
                style="width: 150px"
              ></SelectOption>
            </el-col>
          </el-row>
        </div>
        <div class="form-box">
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="rxIlLevel"
                label="Target RX IL Level"
              ></InputText>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <InputText
                v-model="txIlLevel"
                label="Target TX IL Level"
              ></InputText>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <TCFGraph
          :cal-s-para="calSPara"
          :rx-il-level="tempRxIlLevel"
          :tx-il-level="tempTxIlLevel"
          :rounding-point="parseInt(roundingPoing)"
        />
      </div>
      <div>
        <TCFTendancy
          :cal-s-para="calSPara"
          :rx-il-level="rxIlLevel"
          :tx-il-level="txIlLevel"
        />
      </div>
      <div>
        <TCFDataTable :cal-s-para="calSPara" :tcf-values="tcfValues" />
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted, reactive, watch, computed } from "vue";
import { ElUpload, valueEquals } from "element-plus";
import {
  SParameterFile,
  sortingFiles,
  findMostFrequentNumber,
  CalculatedSParameters,
  createInitialTCFValues,
  TCFValues,
  availableOptions,
  downloadExcel
} from "./sparameter";
import InputText from "./../../TegPage/Application/InputText.vue";
import SelectOption from "../../TegPage/Application/SelectOption.vue";
import TCFGraph from "./TCFGraph.vue";
import TCFTendancy from "./TCFTendancy.vue";
import TCFDataTable from "./TCFDataTable.vue";
import { colorList } from "../../../utils/utility";

const rxIlLevel = ref<string>("-10");
const txIlLevel = ref<string>("-10");

const tempRxIlLevel = ref<string>("-10");
const tempTxIlLevel = ref<string>("-10");

const port = ref<string>("0");
const roundingPoing = ref<string>("2");
const rxInput = ref<string>("0");
const rxOutput = ref<string>("0");
const txInput = ref<string>("0");
const txOutput = ref<string>("0");
const portNumberList = ref<string[]>([]);
const sparaFiles = reactive<SParameterFile[]>([]);
const tcfValues: TCFValues = createInitialTCFValues();
const calSPara = reactive<CalculatedSParameters[]>([]);
const files = reactive<File[]>([]);


function handleFileChange(file, fileList) {
  files.push(file);
  const sortedFiles = sortingFiles(fileList);
  port.value = findMostFrequentNumber(sortedFiles).toString();
  sparaFiles.splice(0, sparaFiles.length, ...sortedFiles);
}

async function downloadExcel() {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file.raw));
  formData.append("rx_output", rxOutput.value);
  formData.append("rx_input", rxInput.value);
  formData.append("tx_output", txOutput.value);
  formData.append("tx_input", txInput.value);
  formData.append("rx_il_level", rxIlLevel.value);
  formData.append("tx_il_level", txIlLevel.value);
  formData.append("rounding_point", roundingPoing.value);

  try {
    const response = await axios.post("tcf/create_excel_file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });

    // Blob 데이터로부터 다운로드 URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Content-Disposition 헤더에서 파일 이름 추출
    let filename = "default-filename.xlsx"; // 기본 파일 이름 설정
    const contentDisposition = response.headers["content-disposition"];
    
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
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}

async function calculateTCF() {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file.raw));
  formData.append("rx_output", rxOutput.value);
  formData.append("rx_input", rxInput.value);
  formData.append("tx_output", txOutput.value);
  formData.append("tx_input", txInput.value);
  formData.append("rx_il_level", rxIlLevel.value);
  formData.append("tx_il_level", txIlLevel.value);
  formData.append("rounding_point", roundingPoing.value);

  try {
    const response = await axios.post("tcf/calculate-tcf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Server response:", response.data);

    const responseData = response.data.values;
    const colors = colorList;
    calSPara.length = 0;

    tempRxIlLevel.value = rxIlLevel.value;
    tempTxIlLevel.value = txIlLevel.value;

    const responsedDataTCF = response.data.tcf_values;
    console.log(responsedDataTCF);
    tcfValues.txLfTcf = responsedDataTCF.tx_lf_tcf;
    tcfValues.txRfTcf = responsedDataTCF.tx_rf_tcf;
    tcfValues.rxLfTcf = responsedDataTCF.rx_lf_tcf;
    tcfValues.rxRfTcf = responsedDataTCF.rx_rf_tcf;
    tcfValues.txCenterTcf = responsedDataTCF.tx_center_tcf;
    tcfValues.rxCenterTcf = responsedDataTCF.rx_center_tcf;

    responseData.forEach((data, index) => {
      const tempSpara: CalculatedSParameters = {
        fileName: data.file_name,
        temperature: data.temperature,
        temperatureStr: data.temperatureStr,
        rxDbm: data.rx_dbm,
        rxFreq: data.rx_freq,
        txDbm: data.tx_dbm,
        txFreq: data.tx_freq,
        freq: data.freq,
        txLeftVal: data.tx_left_val,
        txRightVal: data.tx_right_val,
        rxLeftVal: data.rx_left_val,
        rxRightVal: data.rx_right_val,
      };

      calSPara.push(tempSpara);
    });
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}

watch(
  () => port.value,
  (newSize) => {
    const tempNum = parseInt(newSize);
    portNumberList.value = [];
    for (let i = tempNum; i > 0; i--) {
      portNumberList.value.push(i.toString());
    }
  }
);
</script>

<style scoped>
.split-layout {
  display: flex;
  flex-wrap: nowrap;
}

.form-box {
  flex: 1;
  margin-right: 20px;
}

.form-box:last-child {
  margin-right: 0;
}

.el-form-item {
  margin-bottom: 20px;
}

.charts-container {
  display: flex;
  flex-direction: column;
  margin-top: 1.5cm;
}

.charts-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.form-box {
  margin-right: 20px;
}

.form-box:last-child,
.form-box-wide:last-child {
  margin-right: 0;
}

.form-box-wide {
  margin-bottom: 1rem;
}
</style>


<!-- <template>
  <div>
    <el-select v-model="optionCount" placeholder="Select number of options">
      <el-option
        v-for="item in availableOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <transition-group name="list" tag="div">
      <div v-for="(option, index) in options" :key="index" class="list-item">
        <SelectOption :index="index + 1" :option="option" />
      </div>
    </transition-group>

    <el-button type="primary" @click="calculate">Calculate</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElSelect, ElOption, ElButton } from 'element-plus';
import 'element-plus/dist/index.css';
import SelectOption from './SelectOption.vue';

const optionCount = ref(2); // 초기 값 2개
const availableOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' }
];

const options = ref<Array<{ name: string; tx: string; rx: string; ilLevel: number }>>([]);

const updateOptions = () => {
  options.value = Array.from({ length: optionCount.value }, (_, index) => ({
    name: '',
    tx: '',
    rx: '',
    ilLevel: -10
  }));
};

// 옵션 카운트가 변경될 때마다 옵션 배열을 업데이트
watch(optionCount, updateOptions, { immediate: true });

const calculate = () => {
  console.log(options.value);
};

</script>

<style>
/* Transition 효과를 위한 스타일 설정 */
.list-item {
  transition: all 1s;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style> -->
