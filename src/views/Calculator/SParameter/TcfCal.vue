<template>
  <el-form>
    <div class="container">
      <div class="split-layout">
        <div class="form-box">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="'갯수'">
                <el-select
                  v-model="optionCount"
                  placeholder="Select number of options"
                >
                  <el-option
                    v-for="item in availableOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <InputText v-model="roundingPoing" label="소수점 반올림" />
            </el-col>
            <el-col :span="6">
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
                @click="handleDownload"
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

      <div v-if="sparaFiles.length > 0" class="split-layout">
        <transition-group name="list" tag="div">
          <div
            v-for="(option, index) in options"
            :key="index"
            class="list-item"
          >
            <Options
              :index="index + 1"
              :option="option"
              :port="parseInt(port)"
            />
          </div>
        </transition-group>
      </div>
      <div v-if="numberOfSection > 0">
        <TCFDataTable :tcfValues="tempTcfValues" />
      </div>
      <div class="charts-container" v-if="numberOfSection > 0">
        <div class="charts-row" v-for="index in numberOfSection" :key="index">
          <div class="form-box-wide">
            <SParameterGraph
              v-if="graphValues[index - 1]"
              :graph-data="graphValues[index - 1]"
            ></SParameterGraph>
          </div>
          <div class="form-box-wide">
            <TCFTendancy2
              v-if="tempTcfValues[index - 1]"
              :calculated-tcf-values="tempTcfValues[index - 1]"
            />
          </div>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, reactive, watch } from "vue";
import {
  SParameterFile,
  sortingFiles,
  findMostFrequentNumber,
  availableOptions,
  CalculatedTCFValue,
  Graphs,
} from "./sparameter";
import InputText from "./../../TegPage/Application/InputText.vue";
import TCFTendancy2 from "./TCFTendancyChart2.vue";
import SParameterGraph from "./SParameterScatterGraph.vue";
import TCFDataTable from "./TCFDataTable2.vue";
import Options from "./SelectOption.vue";
import {createReport} from "./TcfCalculator"

const port = ref<string>("0");
const roundingPoing = ref<string>("2");
const portNumberList = ref<string[]>([]);
const sparaFiles = reactive<SParameterFile[]>([]);
const files = reactive<File[]>([]);
const optionCount = ref(2); // 초기 값 2개
const graphValues = reactive<Graphs[]>([]);
const numberOfSection = ref<number>(0);
const tempTcfValues = reactive<CalculatedTCFValue[]>([]);

const options = ref<
  Array<{ name: string; output: number; input: number; ilLevel: number }>
>([]);

const updateOptions = () => {
  options.value = Array.from({ length: optionCount.value }, (_, index) => ({
    name: "",
    output: parseInt(port.value),
    input: parseInt(port.value),
    ilLevel: -10,
  }));
};

// 옵션 카운트가 변경될 때마다 옵션 배열을 업데이트
watch(optionCount, updateOptions, { immediate: true });

function handleFileChange(file, fileList) {
  files.push(file);
  const sortedFiles = sortingFiles(fileList);
  port.value = findMostFrequentNumber(sortedFiles).toString();
  sparaFiles.splice(0, sparaFiles.length, ...sortedFiles);
}

async function calculateTCF() {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file.raw));
  formData.append("rounding_point", roundingPoing.value);
  formData.append("values", JSON.stringify(options.value));

  try {
    const response = await axios.post("tcf/calculate-tcf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    tempTcfValues.splice(0, tempTcfValues.length, ...response.data.tcf_data);
    numberOfSection.value = response.data.tcf_data.length;
    graphValues.splice(0, tempTcfValues.length, ...response.data.graph_data);
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}

async function handleDownload() {
  try {
    await createReport(
      files.map((file) => file.raw),
      roundingPoing.value,
      options.value
    );

  } catch (error) {
    console.error("Error during createReport:", error);
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
  flex: 1;
  margin-bottom: 1rem;
  width: 48%; /* 화면을 반으로 나누기 위해 추가 */
}
</style>
