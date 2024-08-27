<template>
  <el-form
    :model="application"
    :rules="cer0FormRules"
    ref="cerApplicationForm"
    label-width="150px"
  >
    <div class="container">
      <div class="inline-fields">
        <inputText
          v-model="application.modelName"
          label="Model"
          prop="modelName"
          placeholder="Model Name"
          class="wide-select"
        ></inputText>
        <inputText
          v-model="application.version"
          label="Version"
          prop="version"
          placeholder="Version"
          class="wide-select"
        ></inputText>
      </div>
      <div class="inline-fields">
        <inputText
          v-model="application.requesterName"
          label="Requester"
          prop="requester"
          placeholder="Requester"
          class="wide-select"
        ></inputText>
        <inputText
          v-model="application.handlerName"
          label="Operator"
          prop="assignTo"
          placeholder="Operator"
          class="wide-select"
          :disable="true"
        ></inputText>
      </div>
      <div class="inline-fields">
        <inputText
          v-model="application.purpose"
          label="Purpose"
          prop="purpose"
          placeholder="Purpose"
          class="wide-select"
        ></inputText>
        <inputText
          v-model="application.version"
          label="Version"
          prop="version"
          placeholder="Version"
          class="wide-select"
        ></inputText>
      </div>
      <inputText
        v-model="application.m1Thick"
        label="M1 Thickness"
        prop="m1Thick"
        placeholder="M1 Thickness"
        class="wide-select"
      ></inputText>
      <inputText
        v-model="application.layerStack"
        label="Layer Stack"
        prop="layerStack"
        placeholder="Layer Stack"
        class="wide-select"
      ></inputText>
      <el-form-item label="Request Date">
        <el-col :span="11">
          <el-form-item prop="dateOfCreated">
            <el-date-picker
              type="date"
              placeholder="요청일"
              v-model="application.dateOfCreated"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="Wish to Finish">
        <el-col :span="11">
          <el-form-item prop="dateOfWishToFinish">
            <el-date-picker
              type="date"
              placeholder="완료 희망일"
              v-model="application.dateOfWishToFinish"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <div class="inline-fields">
        <inputText
          v-model="application.lotId"
          label="LOT ID"
          prop="lotId"
          placeholder="LOT ID"
          class="wide-select"
        ></inputText>
        <inputText
          v-model="application.waferId"
          label="Wafer ID"
          prop="waferId"
          placeholder="Wafer ID"
          class="wide-select"
        ></inputText>
      </div>
      <inputText
        v-model="application.shot"
        label="Shot"
        prop="shot"
        placeholder="Shot"
        class="wide-select"
      ></inputText>

      <selectOptionNew
        v-model="application.status"
        label="Status"
        prop="status"
        :options="statusOptions"
        key-field="key"
        label-field="label"
        value-field="value"
      />

      <longInputText
        v-model="application.note"
        label="Note"
        prop="note"
        placeholder="Note"
      ></longInputText>
      <el-form-item>
        <div class="button-container">
          <el-button type="primary" @click="handleSubmit">Accept</el-button>
          <el-button type="success" @click="handleStatus">Complete</el-button>
          <!-- <el-button type="danger" @click="">Delete</el-button> -->
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
// 1. 외부 라이브러리 임포트
import { ref, watch, onUnmounted, onMounted } from "vue";

// 2. 타입 임포트
import type { FormInstance } from "element-plus";

// 3. 내부 모듈 임포트
import inputText from "../../Common/InputText.vue";

import longInputText from "../../Common/LongInputText.vue";
import selectOptionNew from "../../Common/SelectOptionNew.vue";
import { initCER0Application, cer0FormRules } from "../cer0-types";
import { sendCer0Application } from "../cer-utility";
import { getApplicationById, assignTask, updateStatus } from "./loadCer0Form";
import type { CER0Form } from "../cer0-types";

const selectedStatus = ref("");

console.log(localStorage);

// status 옵션을 설정
const statusOptions = [
  { key: 1, label: "Created", value: "created" },
  { key: 2, label: "In Progress", value: "in progress" },
  { key: 3, label: "Finished", value: "finished" },
  { key: 4, label: "Error", value: "error" },
];

const props = defineProps({
  id: String,
});

const application = ref<CER0Form>({
  id: "",

  requesterId: "",
  requesterName: "",

  dateOfCreated: "",
  dateOfStart: "",
  dateOfWishToFinish: "",
  dateOfCompleted: "",

  purpose: "",

  modelName: "XM71ATH",
  version: "PS1",

  m1Thick: "Ti/Cu/AlCu/Ti = 40/10/420/10",
  layerStack: "LT 1050/ SiO2 800 / a-Si 800",
  lotId: "NCIF40A60",
  waferId: "'ZEI041, ZEI042, ZEI043",
  shot: "3_7,7_3",
  note: "XM12ATMはScan Speed(50mm/s,125mm/s)ありますが、125mm/sでFittingしてください",

  handlerId: null,
  handlerName: null,
  status: null,
});

let id = props.id;

// 컴포넌트 마운트 상태 확인용 플래그
let isMounted = true;

// 컴포넌트가 마운트될 때 실행
onMounted(() => {
  isMounted = true;
  fetchData(props.id);
});

// 컴포넌트가 언마운트될 때 실행
onUnmounted(() => {
  isMounted = false; // 언마운트 시 플래그를 false로 설정
});

// 데이터를 가져오는 함수
async function fetchData(id: string) {
  if (id !== undefined) {
    try {
      const q = await getApplicationById(id);
      if (isMounted) {
        application.value = q;
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }
}

// Watcher: ID가 변경될 때마다 데이터 로드
watch(
  () => props.id,
  async (newUuid) => {
    fetchData(newUuid);
  },
  { immediate: true }
);

// FormInstance 타입을 사용하여 ref 선언
const cerApplicationForm = ref<FormInstance | null>(null);

const handleSubmit = () => {
  if (cerApplicationForm.value) {
    cerApplicationForm.value.validate((valid) => {
      if (valid) {
        assignTask(
          application.value.id,
          localStorage.getItem("id"),
          localStorage.getItem("ms_username")
        );
        application.value.handlerId = localStorage.getItem("id");
        application.value.handlerName = localStorage.getItem("ms_username");
      } else {
        console.log("Form is invalid!");
        return false;
      }
    });
  }
};

const handleStatus = () => {
  if (cerApplicationForm.value) {
    cerApplicationForm.value.validate((valid) => {
      if (valid) {
        updateStatus(application.value.id, "finished");
        application.value.status = "finished"
      } else {
        console.log("Form is invalid!");
        return false;
      }
    });
  }
};
</script>

<style>
@import "../../../assets/css/PDTRequestForm.css";
.inline-fields {
  display: flex;
  gap: 10px; /* Adjust the gap as needed */
}

.flex-item {
  flex: 1;
}

.el-form-item__label {
  white-space: nowrap; /* Prevent label text from breaking into multiple lines */
  overflow: hidden;
  text-overflow: ellipsis;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px; /* 버튼 사이의 간격 설정 */
  margin-bottom: 20px; /* 아래쪽 여백 설정 */
}
</style>
