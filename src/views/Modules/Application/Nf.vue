<template>
  <div class="container">
    <el-divider content-position="center">측정 정보 (NF)</el-divider>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="De-embedding 방식">
          <el-select v-model="props.application.nfApp.deMethod">
            <el-option :value="'Offset Value'" label="Offset Value"></el-option>
            <el-option :value="'Offset Table'" label="Offset Table"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <input-text
          label="ATS Config File"
          prop="quantity"
          :disable="false"
          placeholder=""
          :need-bold="false"
      /></el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Capture">
          <el-select v-model="props.application.nfApp.capture">
            <el-option :value="'true'" label="O"></el-option>
            <el-option :value="'false'" label="X"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <input-text
          label="RFFE FILE"
          prop="quantity"
          :disable="false"
          placeholder=""
          :need-bold="false"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Matching(Real)">
          <el-select v-model="props.application.nfApp.isRealMatching">
            <el-option :value="'true'" label="O"></el-option>
            <el-option :value="'false'" label="X"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <input-text
          label="Matching 정보"
          prop="quantity"
          :disable="false"
          placeholder=""
          :need-bold="false"
        />
      </el-col>
    </el-row>
    <long-input-text-2
      v-model="props.application.nfApp.note"
      label="특이사항"
      prop="note"
      placeholder=""
      row-cnt="3"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Application } from "../../../interface/Modules/Application/application";
import InputText from "../../Common/InputText.vue";
import LongInputText2 from "../../Common/LongInputText2.vue";
const props = defineProps<{
  application: Application;
  applicationType: string;
}>();
</script>

<style></style>
