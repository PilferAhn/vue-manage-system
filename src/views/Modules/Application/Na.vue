<template>
  <div class="container">
    <el-divider content-position="center">측정 정보 (NA)</el-divider>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="NA 선택">
          <el-select v-model="props.application.naApp.na">
            <el-option :value="'keysight'" label="Keysight"></el-option>
            <el-option :value="'rohde'" label="Rohde"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="De-embedding 방식">
          <el-select v-model="props.application.naApp.deMethod">
            <el-option :value="'Port Extension'" label="Port Extension"></el-option>
            <el-option :value="'De-Embedding'" label="De-Embedding"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <inputText          
          label="State File 선택"
          prop="productName"
          placeholder="ex) XMN5CTV@1A"
        />
      </el-col>
      <el-col :span="12">
        <el-form-item label="LOSS OFF">
          <el-select v-model="props.application.naApp.loss">
            <el-option :value="'true'" label="ON"></el-option>
            <el-option :value="'false'" label="OFF"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="측정 방식">
          <el-select v-model="props.application.naApp.measMthod">
            <el-option :value="'JIG'" label="JIG"></el-option>
            <el-option :value="'SOLDER'" label="SOLDER"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="SPARA 형식">
          <el-select v-model="props.application.naApp.sParaType">
            <el-option
              :value="'false'"
              label="Ideal Matching 미포함"
            ></el-option>
            <el-option :value="'true'" label="Ideal Matching 포함"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <long-input-text-2
      v-model="props.application.naApp.note"
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
