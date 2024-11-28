<template>
  <div class="container">
    <el-form
      :model="localStockInfo"
      :rules="rules"
      label-width="120px"
      ref="formRef"
    >
      <el-form-item prop="reelId" label="Assay ID">
        <el-input v-model="localStockInfo.reelId" placeholder="Scan LOT ID" />
      </el-form-item>

      <el-form-item prop="location" label="Location">
        <el-input
          v-model="localStockInfo.location"
          placeholder="The Place where LOT will store"
        />
      </el-form-item>

      <el-form-item label="Total Quantity">
        <el-input
          v-model="localStockInfo.quantity"
          :min="0"
          placeholder="Entire Chip Quantity"
        />
      </el-form-item>

      <el-form-item prop="receiver" label="Receiver">
        <el-input
          v-model="localStockInfo.receiver"
          placeholder="Enter the Receiver Name"
        />
      </el-form-item>

      <el-form-item prop="modelName" label="Model Name">
        <el-input
          v-model="localStockInfo.modelName"
          placeholder="Enter the Model Name"
        />
      </el-form-item>

      <el-form-item prop="designer" label="Designer">
        <el-input
          v-model="localStockInfo.designer"
          placeholder="Enter the Desginer Name"
        />
      </el-form-item>

      <div v-if="props.formType === 'create'">
        <el-button type="primary" @click="handleSubmit('create')"
          >Submit</el-button
        >
      </div>
      <div v-if="props.formType === 'load'">
        <el-button type="primary" @click="handleSubmit('load')"
          >Update</el-button
        >
        <el-button type="danger" @click="handleSubmit('delete')"
          >Remove</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, ref } from "vue";
import type { StockInfo } from "../../../../interface/stock";
import { rules } from "../Common/ApplicationRules";
import { submitForm } from "./Application";
import type { FormInstance } from "element-plus";
import { useRouter } from "vue-router";

const props = defineProps<{ stockInfo: StockInfo; formType: string }>();
const formRef = ref<FormInstance>();
const localStockInfo = ref({ ...props.stockInfo });

const router = useRouter(); // Make sure this is within setup
const handleSubmit = async (action_type: string) => {
  submitForm(localStockInfo.value, formRef.value, action_type, router);
};

// Watch for changes in props to keep localStockInfo in sync
watch(
  () => props.stockInfo,
  (newVal) => {
    localStockInfo.value = { ...newVal };
  },
  { deep: true, immediate: true }
);
</script>
