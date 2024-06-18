<template>
  <div>
    <el-form-item label="Wafer 수량">
      <el-select
        v-model="localWaferQuantity"
        @change="initializeWaferInformation"
      >
        <el-option v-for="num in 30" :key="num" :value="num">{{
          num
        }}</el-option>
      </el-select>
    </el-form-item>
    <!-- <div v-for="(wafer, index) in localWaferInformation" :key="index">
      <el-col :span="6">
        <el-form-item>
          <el-input
            v-model="wafer.waferName"
            placeholder="Enter wafer name"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="3">/</el-col>
      <el-col :span="6">
        <el-input v-model="wafer.waferStatus"></el-input>
      </el-col>
    </div> -->
    <el-table :data="localWaferInformation" style="width: 100%">
      <el-table-column prop="waferName" label="Wafer Name" width="180">
      </el-table-column>

      <el-table-column label="Wafer Status" width="180">
        <template #default="{ row }">
          <span>{{ getStatusText(row.waferStatus) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="360">
        <template #default="{ row }">
          <el-button
            size="small"
            type="info"
            @click="updateStatus(row, 'waiting')"
            :disabled="role !== 'admin'"
            >Waiting</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="updateStatus(row, 'start')"
            :disabled="role !== 'admin'"
            >Start</el-button
          >
          <el-button
            size="small"
            type="success"
            @click="updateStatus(row, 'finished')"
            :disabled="role !== 'admin'"
            >Finished</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="updateStatus(row, 'cancel')"
            :disabled="role !== 'admin'"
            >Cancel</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import type { waferInformation } from "./../../../utils/tegTypes";
import {getStatusText, updateStatus} from "./WaferInformation"

const role = localStorage.getItem("ms_username");
const props = defineProps<{
  label?: string;
  placeHolder?: string;
  rules?: Array<any>;
  prop?: string;
  waferQuantity: number;
  waferInformation: waferInformation[];
}>();



const emit = defineEmits(["update-wafer"]);
const localWaferQuantity = ref(props.waferQuantity);
const localWaferInformation = ref<waferInformation[]>([
  ...props.waferInformation,
]);



const initializeWaferInformation = () => {
  localWaferInformation.value = Array.from(
    { length: localWaferQuantity.value },
    (_, index) =>
      props.waferInformation[index] || {
        waferName: "",
        waferStatus: "",
        dateOfStart: null,
        dateOfEnd: null,
      }
  );
  emit("update-wafer", localWaferQuantity.value, localWaferInformation.value);
};

watch(localWaferQuantity, () => {
  initializeWaferInformation();
});

watch(
  () => props.waferInformation,
  (newVal) => {
    props.waferInformation;
    localWaferInformation.value = [...newVal];
  },
  { deep: true }
);

watch(
  () => props.waferQuantity,
  (newVal) => {
    localWaferQuantity.value = newVal;
  }
);
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>
