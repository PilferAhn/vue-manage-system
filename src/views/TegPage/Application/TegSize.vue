<!-- TegSize.vue -->
<template>
  <div class="teg-size-container">
    <el-form label-position="top" class="teg-size-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="SHOT SIZE (Flat zone 하단)" prop="shotSize">
            <el-input
              v-model="shotSize"
              placeholder="ex) 10.23*10.17"
              @input="updateSizes"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CHIP SIZE (Flat zone 하단)" prop="chipSize">
            <el-input
              v-model="chipSize"
              placeholder="ex) 0.93*1.13"
              @input="updateSizes"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="샷당 측정 CHIP 수량" prop="chipQuantity">
            <el-input
              v-model="chipQuantity"
              placeholder="ex) 200"
              @input="updateSizes"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="1차 Mask 명" prop="maskName">
            <el-input
              v-model="maskName"
              placeholder="ex) KF128-210616-TEST"
              @input="updateSizes"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="MASK 변경 여부" prop="isMaskChange">
            <el-select
              v-model="isMaskChange"
              :placeholder="'ex) O'"
              @input="updateSizes"
            >
              <el-option :label="'O'" :value="true"></el-option>
              <el-option :label="'X'" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PORT (선택)" prop="port">
            <el-input
              v-model="port"
              placeholder="ex) 2Port(GSG)"
              @input="updateSizes"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";

const props = defineProps({
  shotSize: String,
  maskName: String,
  isMaskChange: String,
  chipSize: String,
  port: String,
  chipQuantity: String,
});

const emit = defineEmits(["updateSizes"]);

const shotSize = ref(props.shotSize);
const maskName = ref(props.maskName);
const isMaskChange = ref(props.isMaskChange);
const chipSize = ref(props.chipSize);
const port = ref(props.port);
const chipQuantity = ref(props.chipQuantity);

watch(
  [
    () => props.shotSize,
    () => props.maskName,
    () => props.isMaskChange,
    () => props.chipSize,
    () => props.port,
    () => props.chipQuantity,
  ],
  ([
    newShotSize,
    newMaskName,
    newIsMaskChange,
    newChipSize,
    newPort,
    newChipQuantity,
  ]) => {
    shotSize.value = newShotSize;
    maskName.value = newMaskName;
    isMaskChange.value = newIsMaskChange;
    chipSize.value = newChipSize;
    port.value = newPort;
    chipQuantity.value = newChipQuantity;
  },
  { immediate: true }
);

function updateSizes() {
  emit("updateSizes", {
    shotSize: shotSize.value,
    maskName: maskName.value,
    isMaskChange: isMaskChange.value,
    chipSize: chipSize.value,
    port: port.value,
    chipQuantity: chipQuantity.value,
  });
}
</script>

<style scoped>
.teg-size-container {
  margin: 20px;
}
.teg-size-form {
  max-width: 1000px; /* Adjust as needed for proper spacing */
}
.el-form-item {
  margin-bottom: 16px; /* Space between form items */
}
</style>
