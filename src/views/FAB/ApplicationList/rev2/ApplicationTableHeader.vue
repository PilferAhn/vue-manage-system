<script lang="ts">
export default {};
</script>
<template>
  <!-- Form Review 상단 통계 + 범례 (w2150108, admin 만 표시) -->
  <div class="group-count-wrapper" v-if="['w2150108', 'admin'].includes(getUserId())">
    <div class="group-count">
      <div class="group-box">총 의뢰: {{ props.processData.length }} (DV2 : {{ dv2Count }})</div>
      <div v-for="(count, group) in groupCounts" :key="group" class="group-box">{{ group }}: {{ count }}</div>
      <div v-for="(count, priority) in priorityCounts" :key="priority" class="group-box">{{ priority }} 등급: {{ count }}</div>
    </div>

    <!-- 범례: 행 색과 같은 색 -->
    <div class="legend">
      <span class="legend-chip chip-warning">Fab Card 작성 必</span>
      <span class="legend-chip chip-drop">Drop</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { FabRequest } from "../../../../interface/fab-application-rev2";
import { getUserId } from "../../../../utils/account-utils";

const props = defineProps<{
  processData: FabRequest[];
  weekNumber: number;
}>();

const dv2Count = computed(() => props.processData.filter((item) => item.isDv2).length);

/** 부서별 건수 */
const groupCounts = computed(() =>
  props.processData.reduce<Record<string, number>>((acc, item) => {
    const department = item.designer?.department ?? "-";
    acc[department] = (acc[department] ?? 0) + 1;
    return acc;
  }, {})
);

/** 우선순위별 건수 */
const priorityCounts = computed(() =>
  props.processData.reduce<Record<string, number>>((acc, item) => {
    const priority = item.priorityId || "UNKNOWN";
    acc[priority] = (acc[priority] ?? 0) + 1;
    return acc;
  }, {})
);
</script>

<style lang="scss" scoped>
.group-count-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.group-count {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.group-box {
  background-color: #f0f9ff;
  border: 1px solid #dbeafe;
  padding: 4px 8px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 13px;
  color: #1e40af;
  white-space: nowrap;
}

.legend {
  display: flex;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
}

.legend-chip {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
/* ApplicationTable.vue 의 행 색과 같은 색 */
.chip-warning {
  background-color: #f5d8b3;
  color: #8a5300;
}
.chip-drop {
  background-color: rgb(250, 217, 217);
  color: #b00020;
}
</style>
