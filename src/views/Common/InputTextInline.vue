<template>
  <el-row :gutter="20" class="demo-form-inline">
    <el-col :span="12">
      <el-form-item :label="props.val1Label">
        <el-input v-model="local1" class="wide-select"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="props.val2Label">
        <el-input v-model="local2" class="wide-select"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FabApplicationInterface } from "../../interface/fab";
import { watch } from "fs";
import InputText from "./InputText.vue";

const props = defineProps<{
  modevlValue1: String;
  val1Label: String;
  modevlValue2: String;
  val2Label: String;
}>();

const local1 = ref(props.modevlValue1);
const local2 = ref(props.modevlValue2);

const emit = defineEmits<{
  (e: "update:value1", value: string): void;
  (e: "update:value2", value: string): void;
}>();
</script>

<style scoped>
.demo-form-inline {
  width: 100%;
}

.wide-select {
  width: 100%;
}
</style>

<script lang="ts">
export default {};
</script>
