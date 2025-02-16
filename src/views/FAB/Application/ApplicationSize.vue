<template>
  <div>
    <el-row :gutter="12" class="form-row">
      <el-col :span="12" class="flex-row">
        <!-- Chip Size Inputs -->
        <el-form-item label="Chip Size [mm]" class="inline-item">
          <el-input v-model="props.fabApplication.chipX" placeholder="Width" />
        </el-form-item>
        <span>＊</span>
        <el-form-item label="　" class="inline-item">
          <el-input v-model="props.fabApplication.chipY" placeholder="Hori" />
        </el-form-item>
      </el-col>
      
      <el-col :span="12" class="flex-row">
        <!-- Shot Size Inputs -->
        <el-form-item label="Shot Size [mm]" class="inline-item">
          <el-input v-model="props.fabApplication.shotX" placeholder="Width" />
        </el-form-item>
        <span>＊</span>
        <el-form-item label="　" class="inline-item">
          <el-input v-model="props.fabApplication.shotY" placeholder="Hori" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { FabRequestForm } from "../../../interface/fab-application-rev2";
import { reactive, watch } from "vue";

const props = defineProps<{
  fabApplication: FabRequestForm;
}>();

const emit = defineEmits(["update:fabApplication"]);

// Create a local reactive copy of fabApplication.chip
const localChip = reactive({
  hori: props.fabApplication.chip?.hori || 0,
  verti: props.fabApplication.chip?.verti || 0,
});

// Watch for changes in localChip and emit updates
watch(
  () => localChip,
  (newChip) => {
    emit("update:fabApplication", {
      ...props.fabApplication,
      chip: newChip,
    });
  },
  { deep: true }
);
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inline-item {
  margin-right: 8px;
}

label {
  font-weight: bold;
  margin-right: 8px;
}
</style>
