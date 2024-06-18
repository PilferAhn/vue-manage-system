<template>
  <div>
    <el-form-item label="Wafer 수량">
      <el-select
        v-model="localWaferQuantity"
        @change="initializeWaferInformation"
      >
        <el-option v-for="num in 30" :key="num" :value="num">{{ num }}</el-option>
      </el-select>
    </el-form-item>
    <div v-for="(wafer, index) in localWaferInformation" :key="index">
      <el-form-item>
        <el-input
          v-model="wafer.waferName"
          placeholder="Enter wafer name"
        ></el-input>
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import type { waferInformation } from "./../../../utils/tegTypes";

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
const localWaferInformation = ref<waferInformation[]>([...props.waferInformation]);




const initializeWaferInformation = () => {
  localWaferInformation.value = Array.from({ length: localWaferQuantity.value }, (_, index) => props.waferInformation[index] || {
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

watch(() => props.waferInformation, (newVal) => {
  props.waferInformation
  localWaferInformation.value = [...newVal];
}, { deep: true });

watch(() => props.waferQuantity, (newVal) => {
  localWaferQuantity.value = newVal;
});


</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>
