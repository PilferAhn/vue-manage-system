<template>
  <el-card shadow="never" class="grid-card selector-card">
    <template #header>
      <div class="card-title">측정 항목 선택</div>
    </template>

    <div class="selector-scroll">
      <div class="measurement-checkbox-group">
        <el-card
          v-for="item in measurementOptions"
          :key="item.key"
          shadow="hover"
          class="measurement-option-card"
        >
          <el-checkbox
            :model-value="selectedMeasurements.includes(item.key)"
            @change="(checked) => $emit('toggle', item.key, checked)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-card>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
interface MeasurementOption {
  key: string;
  label: string;
}

defineProps<{
  measurementOptions: MeasurementOption[];
  selectedMeasurements: string[];
}>();

defineEmits<{
  (e: "toggle", key: string, checked: boolean | string | number): void;
}>();
</script>

<style scoped>
.grid-card {
  border-radius: 12px;
  overflow: hidden;
}

.selector-card {
  display: flex;
  flex-direction: column;
}

.selector-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
}

.selector-scroll {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

.measurement-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.measurement-option-card {
  cursor: pointer;
  border-radius: 10px;
}

.measurement-option-card:hover {
  transform: translateY(-1px);
}
</style>
