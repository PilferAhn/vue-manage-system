<template>
  <el-card shadow="never" class="grid-card sample-info-card">
    <template #header>
      <div class="card-title">샘플 정보</div>
    </template>

    <el-form label-position="top">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="전달자">
            <el-input v-model="sampleInfo.sender" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="전달일">
            <el-date-picker
              v-model="sampleInfo.deliveredDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="custom-date-picker"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="특이사항">
        <el-input v-model="sampleInfo.note" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item label="샘플 정보 Link(이미지 파일 등)">
        <el-input v-model="sampleInfo.sampleLink" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  sampleInfo: any;
}>();
</script>

<style scoped>
.grid-card {
  border-radius: 12px;
  overflow: hidden;
}

.sample-info-card {
  display: flex;
  flex-direction: column;
}

.sample-info-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
}

.custom-date-picker {
  width: 100%;
}
</style>
