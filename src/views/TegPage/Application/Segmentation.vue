<template>
  <div>
    <div v-if="measInfo.length === 0">
      <el-empty description="No measurements selected."></el-empty>
    </div>
    <div v-else>
      <el-tabs type="card">
        <el-tab-pane
          v-for="(info, index) in props.measInfo"
          :key="index"
          :label="info.measType"
        >
          <FrequancySection
            :info="info"
            :index="index"
            @updateFreqInfo="handleUpdate"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import FrequancySection from "./FrequancySection.vue";
import { MeasInfo } from "../../../utils/tegTypes";

const props = defineProps<{ measInfo: MeasInfo[] }>();

const emit = defineEmits(["updateMeasInfo"]);

const handleUpdate = (updatedFreqSections, index) => {
  emit("updateMeasInfo", updatedFreqSections, index);
};
</script>
