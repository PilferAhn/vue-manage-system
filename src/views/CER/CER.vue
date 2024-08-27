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
      <longInputText
        v-model="application.note"
        label="Note"
        prop="note"
        placeholder="Note"
      ></longInputText>
      <el-form-item>
        <div class="button-container">
          <el-button type="primary" @click="handleSubmit">Submit</el-button>
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
// 1. 외부 라이브러리 임포트
import { ref } from "vue";

// 2. 타입 임포트
import type { FormInstance } from "element-plus";

// 3. 내부 모듈 임포트
import inputText from "../Common/InputText.vue";
import longInputText from "../Common/LongInputText.vue";
import { initCER0Application, cer0FormRules } from "./cer0-types";
import {sendCer0Application} from "./cer-utility"

// Vue 컴포지션 API를 사용하여 변수 및 함수 선언
const { form: application } = initCER0Application(
  localStorage.getItem("ms_username"),
  localStorage.getItem("email")
);

// FormInstance 타입을 사용하여 ref 선언
const cerApplicationForm = ref<FormInstance | null>(null);

const handleSubmit = () => {
  if (cerApplicationForm.value) {
    cerApplicationForm.value.validate((valid) => {
      if (valid) {
        // console.log("Form is valid!");
        sendCer0Application(application.value)
      } else {
        console.log("Form is invalid!");
        return false;
      }
    });
  }
};
</script>

<style>
@import "../../assets/css/PDTRequestForm.css";
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
