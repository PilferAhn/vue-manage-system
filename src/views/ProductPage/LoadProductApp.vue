<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="고객사 정보">
          <el-select
            v-model="form.customerCompany"
            placeholder="예) 중화 / K1 / 기타"
            @change="handleSelectChange"
          >
            <el-option key="china" label="중화" value="china" />
            <el-option key="k1" label="K1" value="k1" />
            <el-option key="etc" label="기타" value="etc" />
          </el-select>
        </el-form-item>

        <el-form-item label="제품 스팩" class="form-item-spacing">
          <el-col :span="6">
            <el-form-item>
              <el-input
                v-model="form.specTemperature"
                placeholder="Temperature"
                :disabled="!form.isSpecEdit"
              />
              <!-- <el-button v-if="isEditable" @click="enableEditing"
                >직접 입력</el-button
              > -->
            </el-form-item>
          </el-col>
          <el-col class="line" :span="3">/</el-col>
          <el-col :span="6">
            <el-input
              v-model="form.specPower"
              placeholder="Input Power"
              :disabled="!form.isSpecEdit"
            />
          </el-col>

          <el-col class="line" :span="3">/</el-col>
          <el-col :span="6">
            <el-checkbox v-model="form.isSpecEdit">직접 입력</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="설계정보" prop="band">
          <el-col :span="6">
            <el-form-item>
              <el-input
                placeholder="Band"
                v-model="form.band"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="3">/</el-col>
          <el-col :span="6">
            <el-form-item prop="modelName">
              <el-input
                placeholder="기종명"
                v-model="form.modelName"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="3">/</el-col>
          <el-col :span="6">
            <el-form-item prop="ps">
              <el-input
                placeholder="설계 차수"
                v-model="form.ps"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="작성자">
          <el-col :span="11">
            <el-form-item prop="designer">
              <el-input
                placeholder="개발자"
                v-model="form.designer"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-form-item prop="requester">
              <el-input
                placeholder="의뢰자"
                v-model="form.requester"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="의뢰목적" prop="purpose">
          <el-input v-model="form.purpose"></el-input>
        </el-form-item>

        <!-- <el-form-item label="Test 종류" prop="testType" :span="11">
              <el-input v-model="form.testType"></el-input>
            </el-form-item> -->

        <el-form-item label="일정">
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="샘플 전달일"
                v-model="form.date1"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="제품 정보">
          <el-col :span="11">
            <el-form-item prop="waferType">
              <el-input
                placeholder="ex) HS, NS, TC"
                v-model="form.waferType"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-form-item prop="productType">
              <el-input
                placeholder="ex) CSP / WLP"
                v-model="form.productType"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="Spec">
          <el-col :span="11">
            <el-form-item prop="temperature">
              <el-input
                placeholder="온도"
                v-model="form.temperature"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-form-item prop="inputPower">
              <el-input
                placeholder="Input Power [dBm]"
                v-model="form.inputPower"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="시간 / 신호">
          <el-col :span="11">
            <el-form-item prop="hours">
              <el-input
                placeholder="시간 [Hr]"
                v-model="form.hours"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-form-item prop="signalType">
              <el-select v-model="form.signalType" placeholder="예) LTE / NR">
                <el-option key="CW " label="CW" value="CW" />
                <el-option key="LTE/FDD" label="LTE/FDD" value="LTE/FDD" />
                <el-option key="LTE/TDD" label="LTE/TDD" value="LTE/TDD" />
                <el-option key="NR/FDD" label="NR/FDD" value="NR/FDD" />
                <el-option key="NR/TDD" label="NR/TDD" value="NR/TDD" />
                <el-option key="WRAN" label="WRAN" value="WRAN" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="주파수[Mhz]">
          <el-col :span="11">
            <el-form-item prop="star-freq">
              <el-input
                placeholder="Start Freq"
                v-model="form.startFreq"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-form-item prop="stop-freq">
              <el-input
                placeholder="Stop Freq"
                v-model="form.endFreq"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="Type" prop="testType">
          <el-select v-model="form.testType" placeholder="예) Fuse Max">
            <el-option key="Max Fuse " label="Max Fuse" value="Max Fuse" />
            <el-option key="AMR" label="AMR" value="AMR" />
            <el-option key="Life" label="Life" value="Life" />
            <el-option key="Aging" label="Aging" value="Aging" />
            <el-option
              key="Self Heating"
              label="Self Heating"
              value="Self Heating"
            />
            <el-option key="Drop" label="Drop" value="Drop" />
            <el-option key="Step" label="Step" value="Step" />
          </el-select>
        </el-form-item>

        <el-form-item label="수량" prop="sample_quantity">
          <el-select v-model="selectedNumber" placeholder="Select a number">
            <el-option
              v-for="i in 30"
              :key="i"
              :label="i"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="selectedNumber >= 1"
          label="SPL 정보"
          prop="test-position"
        >
          <el-table :data="dataList" style="width: 100%">
            <el-table-column label="SPL Num" prop="sampleNumber">
              <template #default="{ row }">
                <el-input v-model="row.sampleNumber"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="-3dB" prop="freq3dB">
              <template #default="{ row }">
                <el-input v-model="row.dB3Freq"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Target" prop="targetFreq">
              <template #default="{ row }">
                <el-input v-model="row.targetFreq"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Position" prop="targetFreq">
              <template #default="{ row }">
                <el-input v-model="row.targetPosition"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Self Heating" prop="selfHeating">
              <template #default="{ row }">
                <el-checkbox v-model="row.selfHeating"
                  >Self Heating</el-checkbox
                >
              </template>
            </el-table-column>
            <!-- <el-table-column label="Temp(°C)" prop="selfHeating">
                  <template #default="">
                    <el-input v-model="form.temperature">Self Heating</el-input>
                  </template>
                </el-table-column> -->
          </el-table>
        </el-form-item>

        <el-form-item label="특이사항" prop="detail">
          <el-input type="textarea" rows="5" v-model="form.detail"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)"
            >의뢰서작성
          </el-button>
          <el-button @click="onReset(formRef)">초기화</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElMessageBox,
} from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import "element-plus/dist/index.css";
import axios from "axios";
import { useRoute } from "vue-router";

const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "요소기술그룹" : "요소기술그룹";

// useRoute 훅을 사용하여 현재 라우트 객체를 가져옵니다.
const route = useRoute();

// route.params에서 uuid 값을 추출합니다.
const uuid = route.params.uuid;

interface Application {
  band: string;
  modelName: string;
  ps: string;
  designer: string;
  requester: string;
  purpose: string;
  waferType: string;
  productType: string;
  temperature: string;
  inputPower: string;
  hours: string;
  signalType: string;
  testType: string;
  startFreq: string;
  endFreq: string;
  date1: string;
  detail: string;
}

const formRef = ref(null);
// 폼 데이터 모델 초기화
const form = ref<Application>({
  band: "",
  modelName: "",
  ps: "",
  designer: "",
  requester: name,
  purpose: "",
  waferType: "",
  productType: "",
  temperature: "",
  inputPower: "",
  hours: "",
  signalType: "",
  testType: "",
  startFreq: "",
  endFreq: "",
  date1: "",
  detail: "",
});
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

const rules: FormRules = {
  name: [{ required: true, message: "값을 입력해주세요", trigger: "blur" }],
  band: [
    { required: true, message: "Band 값을 입력해주세요", trigger: "blur" },
  ],
  modelName: [
    { required: true, message: "기종명을 입력하세요", trigger: "blur" },
  ],
  ps: [{ required: true, message: "설계차수를 입력하세요", trigger: "blur" }],
  purpose: [
    { required: true, message: "의뢰목적을 입력하세요", trigger: "blur" },
  ],
  designer: [
    { required: true, message: "개발자 이름을 입력하세요", trigger: "blur" },
  ],
  requester: [
    { required: true, message: "의뢰자 이름을 입력하세요", trigger: "blur" },
  ],
  signalType: [
    { required: true, message: "신호를 선택하세요", trigger: "blur" },
  ],

  temperature: [
    {
      required: true,
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error("실험 온도를 입력해주세요"));
        } else if (!/^\d+$/.test(value)) {
          callback(new Error("올바른 숫자 형식이 아닙니다"));
        } else {
          const integerValue = parseInt(value, 10);
          if (isNaN(integerValue)) {
            callback(new Error("정수로 변환 가능한 값을 입력해주세요"));
          } else {
            callback();
          }
        }
      },
    },
  ],
};

const fetchApplicationData = async () => {
  try {
    const response = await axios.post(
      "pdt_application/get_application_detail",
      { uuid: uuid }
    );
    form.value.modelName = response.data.model_name;
    form.value.band = response.data.band;
    form.value.ps = response.data.condition;
    (form.value.productType = response.data.product_type),
      (form.value.waferType = response.data.wafer_type);
    form.value.designer = response.data.designer;
    form.value.startFreq = response.data.start_freq;
    form.value.endFreq = response.data.end_freq;
  } catch (error) {
    console.error("Error fetching data: ", error);
    errorMessage.value = "An error occurred while fetching the data.";
  } finally {
    isLoading.value = false;
  }
};


const onSubmit = (formEl: FormInstance | undefined) => {
  // 수량 검증
  if (selectedNumber.value < 1) {
    ElMessage.error("수량은 1개 이상이어야 합니다");
    return;
  }

  // 폼 검증
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(form);
      //ElMessage.success("정상적으로 작성되었습니다");
      submitData();
    } else {
      return false;
    }
  });
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const selectedNumber = ref(0);
const dataList = ref([]);

const generateRows = () => {
  dataList.value = Array.from({ length: selectedNumber.value }, () => ({
    sampleNumber: "",
    dB3Freq: "",
    targetFreq: "",
    testPosition: "",
    selfHeating: false,
  }));
};

// Watcher to generate rows when selectedNumber changes
watch(selectedNumber, () => {
  generateRows();
});

// selectedNumber의 변화를 감시하고 폼의 검증 상태를 업데이트하는 로직
watch(selectedNumber, (newValue) => {
  if (formRef.value) {
    // form 객체에 가상의 'sample_quantity' 필드를 추가하고, selectedNumber 값을 할당합니다.
    // 이는 실제 폼 데이터 모델에는 영향을 주지 않으며, 단지 검증을 위한 용도로만 사용됩니다.
    formRef.value.validateField("sample_quantity", () => {
      // 'sample_quantity' 필드에 대한 커스텀 검증 로직
      if (newValue < 1) {
        ElMessage.error("수량은 1개 이상이어야 합니다");
      }
    });
  }
});

const forceSubmitData = async () => {
  try {
    const response = await axios.post(
      "/pdt_application/create_pdt_application",
      {
        band: form.value.band,
        modelName: form.value.modelName,
        ps: form.value.ps,
        designer: form.value.designer,
        requester: form.value.requester,
        purpose: form.value.purpose,
        dateOfAppCreated: form.value.date1,
        waferType: form.value.waferType,
        productType: form.value.productType,
        temperature: form.value.temperature,
        inputPower: form.value.inputPower,
        hours: form.value.hours,
        signalType: form.value.signalType,
        testType: form.value.testType,
        startFreq: form.value.startFreq,
        stopFreq: form.value.endFreq,
        detail: form.value.detail,
        data: dataList.value,
        force: true,
      }
    );

    let message = response.data.message;
    ElMessage({
      type: "success",
      message: message,
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};

const submitData = async () => {
  try {
    const response = await axios.post(
      "/pdt_application/create_pdt_application",
      {
        band: form.value.band,
        modelName: form.value.modelName,
        ps: form.value.ps,
        designer: form.value.designer,
        requester: form.value.requester,
        purpose: form.value.purpose,
        dateOfAppCreated: form.value.date1,
        waferType: form.value.waferType,
        productType: form.value.productType,
        temperature: form.value.temperature,
        inputPower: form.value.inputPower,
        hours: form.value.hours,
        signalType: form.value.signalType,
        testType: form.value.testType,
        startFreq: form.value.startFreq,
        stopFreq: form.value.endFreq,
        detail: form.value.detail,
        data: dataList.value,
        force: false,
      }
    );

    console.log(response.data);

    if (response.data.status == false) {
      if (response.data.error_type === "duplicated application") {
        ElMessageBox.confirm(
          "이미 동일한 의뢰가 존재합니다.\n기존의 의뢰서를 삭제하고 새로운 의뢰서를 생성하시겠습니까?",
          "중복된 의뢰",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: "warning",
          }
        )
          .then(() => {
            forceSubmitData();
            // 여기에 'Yes'를 선택했을 때 수행할 작업을 추가합니다.
          })
          .catch(() => {
            // 'No'를 선택했거나 팝업을 닫았을 때 수행할 작업을 여기에 추가합니다.
            ElMessage({
              type: "info",
              message: "작업이 취소되었습니다.",
            });
          });
      } else {
        ElMessage.error(response.data.message);
      }
    } else {
      ElMessage.success("의뢰서가 정삭적으로 작성되었습니다");
    }
    // Handle the response as needed
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};

onMounted(fetchApplicationData);
</script>
