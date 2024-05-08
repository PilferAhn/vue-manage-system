<template>
    
  <el-form-item label="기종명" prop="modelName">
    <el-input
      placeholder="ex) WGS24"
      v-model="modelName"
      @input = "updateModelName"
      style="width: 100%"
    ></el-input>
  </el-form-item>
</template>

<script lang = 'ts' setup>
import { ref, defineEmits, watch } from "vue";

const props = defineProps({
  modelName: String
});

const emit = defineEmits(["updateModelName"])

const modelName = ref(props.modelName)

watch(() => props.modelName, (newval) =>
{
    modelName.value = newval;
})


function updateModelName() {
    emit('updateModelName', modelName.value)
}

</script>

<style>

.meas-types-container {
  max-width: 100%;
  margin: 10px 0;
  background-color: #fff; /* Light background for better visibility */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

</style>
