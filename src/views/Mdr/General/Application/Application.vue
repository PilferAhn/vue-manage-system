<template>
  <div>
    <el-form :model="applicationData" label-width="120">
      <inputText
        v-model="applicationData.productName"
        label="Product Name"
        prop="productName"
        placeholder="ex) NCIFE0A30"
      />
      <div class="inline-fields">
        <SelectOptions
          v-model="applicationData.designerId"
          label="PL"
          prop="designerId"
          placeholder="Select Project Leader"
          :options="userOptions"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
        <SelectOptions
          v-model="applicationData.requesterId"
          label="SPL"
          prop="requesterId"
          placeholder="Select Supporter"
          :options="userOptions"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>
      <div class="inline-fields">
        <inputText
          v-model="applicationData.moduleName"
          label="Module Name"
          prop="moduleName"
          placeholder="EX) L7F0 or WLP-BIz"
          class="wide-select"
        />
        <SelectOptions
          v-model="applicationData.category"
          label="구분"
          prop="process"
          placeholder="Discrete or 내재SAW"
          :options="categoryList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>

      <div class="inline-fields">
        <SelectOptions
          v-model="applicationData.waferType"
          label="Tech"
          prop="process"
          placeholder="HS or NS or HS"
          :options="OptionList.processList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>

        <input-text
          v-model="applicationData.band"
          label="밴드명"
          prop="process"
          placeholder="WiFi Halow or B21"
          :disable="false"
          class="wide-select"
        ></input-text>
      </div>
      <div class="inline-fields">
        <input-text
          v-model="applicationData.productName"
          label="기종명"
          prop="productName"
          placeholder="EX) XM11BHT or X733DHS"
          :disable="false"
          class="wide-select"
        ></input-text>
        <input-text
          v-model="applicationData.psNumber"
          label="PS 단계"
          prop="psNumber"
          placeholder="EX) PS1 or PS2"
          :disable="false"
          class="wide-select"
        ></input-text>
      </div>
      <div class="inline-fields">
        <input-text
          v-model="applicationData.size"
          label="Size"
          prop="size"
          placeholder="EX) 1.5 * 1.1 or 1.6 * 1.2"
          :disable="false"
          class="wide-select"
        ></input-text>
        <SelectOptions
          v-model="applicationData.group"
          label="소속그룹"
          prop="process"
          placeholder=""
          :options="OptionList.groupList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>

      <div class="inline-fields">
        <el-form-item label="Gant 계획" class="wide-select">
          <el-date-picker
            v-model="applicationData.gantPlanDate"
            type="date"
            placeholder="Gant 계획"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="실제 계획" class="wide-select">
          <!-- 실제 일정에 대한 날짜 선택 -->
          <el-date-picker
            v-model="applicationData.executionDate"
            type="date"
            placeholder="실제 일정"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div>
        <LongInputText
          v-model="applicationData.note"
          label="비고"
          prop="실행계획(실제)"
          placeholder=""
          :disable="false"
        ></LongInputText>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { MdrApplication, groupList } from "../../Common/Interface";
import InputText from "../../../Common/InputText.vue";
import * as OptionList from "../../../Common/OptionList";
import { categoryList } from "../../Common/OptionList";
import SelectOptions from "../../../Common/SelectOptions.vue";
import LongInputText from "../../../Common/LongInputText.vue";
import { useUserOptions } from "../../../Common/utility";

const props = defineProps<{
  mdrApplicationData: MdrApplication;
  workType : string;
}>();

const { userOptions } = useUserOptions();
const applicationData = props.mdrApplicationData; // 부모로부터 전달된 데이터를 사용
</script>

<style scoped>
@import "../../../../assets/css/PDTRequestForm.css";
</style>
