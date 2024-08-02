<template>
  <div class="container">
    <el-form-item>
      <el-tabs v-model="activeTabName">
        <el-tab-pane
          v-for="(sample, index) in props.samples"
          :key="index"
          :label="'Sample ' + (index + 1)"
          :name="'tab-' + (index + 1)"
        >
          <div class="split-screen">
            <div class="left-panel">
              <div class="sample-info">
                <el-form-item
                  label="SPN Num"
                  class="form-item"
                  label-width="150px"
                >
                  <el-input
                    v-model="sample.sampleNumber"
                    @input="
                      updateSample(index, 'sampleNumber', sample.sampleNumber)
                    "
                    class="fixed-width"
                  />
                </el-form-item>

                <div v-if="sample.isManualInput" class="sample-info">
                  <el-form-item
                    label="Target Frequacy"
                    class="form-item"
                    label-width="150px"
                  >
                    <el-input
                      @input="
                        updateSample(index, 'defaultFreq', sample.defaultFreq)
                      "
                      class="fixed-width"
                    />
                  </el-form-item>
                </div>
                <div v-else class="sample-info">
                  <el-form-item
                    label="System"
                    class="form-item"
                    label-width="150px"
                  >
                    <el-input
                      v-model="sample.defaultFreq"
                      @input="
                        updateSample(index, 'defaultFreq', sample.defaultFreq)
                      "
                      :disabled="sample.useDefaultFreq"
                      class="fixed-width"
                    />
                  </el-form-item>

                  <el-form-item
                    label="Offset"
                    class="form-item"
                    label-width="150px"
                  >
                    <el-input
                      v-model="sample.offset"
                      @input="updateSample(index, 'offset', sample.offset)"
                      :disabled="sample.useDefaultFreq"
                      class="fixed-width"
                    />
                  </el-form-item>

                  <el-form-item
                    label="Input Freq (A + B)"
                    class="form-item"
                    label-width="150px"
                  >
                    <el-input
                      :value="getInputFreq(sample)"
                      prop=""
                      placeholder=""
                      disabled
                      class="fixed-width"
                    />
                  </el-form-item>

                  <el-form-item
                    label="기본 주파수 사용"
                    class="form-item"
                    label-width="150px"
                  >
                    <el-switch
                      v-model="sample.useDefaultFreq"
                      class="input-field"
                    ></el-switch>
                  </el-form-item>
                </div>
                <el-form-item
                  label="직접 입력"
                  class="form-item"
                  label-width="150px"
                >
                  <el-switch
                    v-model="sample.isManualInput"
                    class="input-field"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="S" label-width="150px">
                  <el-input
                    v-model="sample.sOutput"
                    @input="updateSample(index, 'sOutput', sample.sOutput)"
                    class="half-width-input"
                  />
                  <el-input
                    v-model="sample.sInput"
                    @input="updateSample(index, 'sInput', sample.sInput)"
                    class="half-width-input"
                  />
                </el-form-item>
                <el-form-item
                  label="IL Level"
                  class="form-item"
                  label-width="150px"
                >
                  <el-input
                    v-model="sample.dB3Freq"
                    @input="updateSample(index, 'dB3Freq', sample.dB3Freq)"
                    class="fixed-width"
                  />
                </el-form-item>
                <el-form-item
                  label="Reference FC"
                  class="form-item"
                  label-width="150px"
                >
                  <el-input
                    v-model="sample.fc"
                    @input="updateSample(index, 'fc', sample.fc)"
                    class="fixed-width"
                  />
                </el-form-item>
                <el-form-item label="SPL SnP 파일" label-width="150px">
                  <el-button
                    size="default"
                    type="primary"
                    @click="handdleTarget(sample, index)"
                    >파일 선택</el-button
                  >
                </el-form-item>

                <el-form-item
                  label="SnP 파일명"
                  class="form-item"
                  label-width="150px"
                >
                  <el-input
                    v-model="sample.sParaFileName"
                    @input="
                      updateSample(index, 'sParaFileName', sample.sParaFileName)
                    "
                    class="fixed-width"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="right-panel">
              <sampleGraph :points="sample.points" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { SampleInformation } from "./Application";
import sampleGraph from "./SampleGraph.vue";
import { calculateOffset, handleFileSelect } from "./PDTSampleTab";
import { Chart } from "chart.js"; // Chart.js를 가져옵니다.

const props = defineProps<{
  samples: SampleInformation[];
  label: string;
  position: string;
  link: string;
}>();

const emits = defineEmits(["update:samples"]);

function updateSample(index: number, key: keyof SampleInformation, value: any) {
  const updatedSamples = [...props.samples];
  updatedSamples[index][key] = value;
  emits("update:samples", updatedSamples);
}

const activeTabName = ref("tab-1"); // Track the active tab

const getInputFreq = (sample: SampleInformation) => {
  return Number(sample.defaultFreq) + Number(sample.offset);
};

function handdleTarget(sample: SampleInformation, index: number) {
    handleFileSelect(sample, index, props.position, props.link);
}

// Watch activeTabName and force update of the chart on tab change
watch(activeTabName, async (newTabName) => {
  await nextTick();
  const chartElements = document.querySelectorAll('.chart-container canvas');
  chartElements.forEach((canvas) => {
    const chartInstance = Chart.getChart(canvas); // Get existing chart instance
    if (chartInstance) {
      chartInstance.resize();
    }
  });
});

</script>

<style scoped>
.container {
  width: 1130px;
  margin: 0 auto; /* Center the container */
  margin-bottom: 10px;
}

.split-screen {
  display: flex;
  width: 100%; /* 부모 컨테이너의 너비에 맞추기 위해 변경 */
  gap: 20px;
}

.left-panel,
.right-panel {
  flex: 1;
  padding: 10px;
}

.fixed-width {
  width: 200px; /* Fix the width of el-input to 200px */
}

.sample-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-item .el-form-item__content {
  flex: 1;
}

.half-width-input {
  width: 37.3%;
}
</style>
./Application1