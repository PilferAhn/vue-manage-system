<template>
  <div class="frequency-settings">
    <el-form-item label="Section Count">
      <el-input-number
        v-model="numberSelected"
        :min="0"
        :max="6"
      ></el-input-number>
    </el-form-item>
    <div v-if="generatedFreqSections.length == -1">
      <el-empty description="주파수 영역의 갯수를 선택하세요."></el-empty>
    </div>
    <div v-else>
      <el-table :data="generatedFreqSections" style="width: 100%">
        <el-table-column prop="start" label="Start" width="150">
          <template #default="{ row }">
            <el-input v-model="row.start" placeholder="Start" />
          </template>
        </el-table-column>
        <el-table-column prop="stop" label="stop" width="150">
          <template #default="{ row }">
            <el-input v-model="row.stop" placeholder="Stop" />
          </template>
        </el-table-column>
        <el-table-column prop="point" label="Point" width="150">
          <template #default="{ row }">
            <el-input v-model="row.point" placeholder="Point" />
          </template>
        </el-table-column>
        <el-table-column prop="ifbw" label="IFBW" width="150">
          <template #default="{ row }">
            <el-input v-model="row.ifbw" placeholder="IFBW" disabled />
          </template>
        </el-table-column>
        <!-- Other columns similarly... -->
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, watch, defineEmits, nextTick, onMounted } from "vue";

const emit = defineEmits(["updateFreqInfo"]);
const props = defineProps({
  info: Object,
  index: Number,
});

const numberSelected = ref(props.info.freqSectionInfo.length); // Default section count

const generatedFreqSections = reactive([...props.info.freqSectionInfo]);

watch(
  numberSelected,

  (newValue) => {
    for (let i = 0; i < newValue; i++) {
      if (!generatedFreqSections[i]) {
        generatedFreqSections[i] = {
          start: "",
          stop: "",
          point: "",
          ifbw: "10",
        };
      }
    }
    generatedFreqSections.length = newValue; // Adjust the length of the array
    emit("updateFreqInfo", generatedFreqSections, props.index);
  },
  { immediate: true }
);

watch(
  () => props.info,
  (newVal) => {
    if (newVal && newVal.freqSectionInfo) {
      // 조건을 검사하여 필요한 경우에만 업데이트
      if (!deepEqual(generatedFreqSections, newVal.freqSectionInfo)) {
        nextTick(() => {
          generatedFreqSections.splice(
            0,
            generatedFreqSections.length,
            ...newVal.freqSectionInfo.map((section) => ({ ...section }))
          );
        });
      }
    }
  },
  { deep: true }
);

// deepEqual 함수는 두 객체가 동일한지 여부를 체크
function deepEqual(x, y) {
  return JSON.stringify(x) === JSON.stringify(y);
}

// Watch the generatedFreqSections array for deep changes
watch(
  () => generatedFreqSections.map((section) => ({ ...section })),
  (newSections) => {
    props.info.freqSectionInfo = newSections;
    emit("updateFreqInfo", newSections, props.index);
  },
  { deep: true }
);
</script>

<style scoped>
/* CSS 생략 */
</style>
