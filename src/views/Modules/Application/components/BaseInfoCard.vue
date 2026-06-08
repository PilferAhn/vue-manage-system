<template>
  <el-card shadow="never" class="grid-card base-card">
    <template #header>
      <div class="card-header">
        <div class="card-header-left">
          <span class="card-title">
            {{
              reuseMode
                ? "Module 의뢰서 재사용"
                : mode === "create"
                ? "Module 의뢰서 생성"
                : "Module 의뢰서 상세"
            }}
          </span>

          <span v-if="reuseMode" class="reuse-inline-text">
            재사용 모드입니다. 수정하세요.
          </span>
        </div>
      </div>
    </template>

    <el-form label-position="top">
      <el-form-item label="P/N">
        <el-input v-model="baseForm.pn" placeholder="P/N 입력" clearable />
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="의뢰자">
            <el-input v-model="baseForm.requester" placeholder="의뢰자 입력" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="개발자">
            <el-input v-model="baseForm.developer" placeholder="개발자 입력" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="측정 목적">
        <el-input v-model="baseForm.purpose" placeholder="측정 목적 입력" clearable />
      </el-form-item>

      <el-form-item class="inline-site-type-item">
        <div class="inline-site-type-row">
          <span class="inline-site-type-label">구분</span>

          <el-radio-group v-model="baseForm.siteType" class="inline-site-type-group">
            <el-radio label="HQ">본사</el-radio>
            <el-radio label="WHC">WHC</el-radio>
          </el-radio-group>

          <span class="inline-site-type-label">샘플정보</span>
          <el-checkbox v-model="baseForm.useSampleInfo">O</el-checkbox>
        </div>
      </el-form-item>
    </el-form>

    <div class="left-bottom-button-area">
      <el-button @click="$emit('list')">목록</el-button>

      <el-button v-if="mode === 'edit' && !reuseMode" type="success" @click="$emit('excel')">
        엑셀
      </el-button>

      <el-button v-if="mode === 'edit' && !reuseMode" type="warning" @click="$emit('reuse')">
        재사용
      </el-button>

      <el-button type="primary" @click="$emit('save')">
        {{ effectiveMode === "create" ? "생성" : "저장" }}
      </el-button>

      <el-button v-if="mode === 'edit' && !reuseMode" type="danger" @click="$emit('delete')">
        삭제
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  baseForm: any;
  mode: "create" | "edit";
  effectiveMode: "create" | "edit";
  reuseMode: boolean;
}>();

defineEmits<{
  (e: "list"): void;
  (e: "excel"): void;
  (e: "reuse"): void;
  (e: "save"): void;
  (e: "delete"): void;
}>();
</script>

<style scoped>
.grid-card {
  border-radius: 12px;
  overflow: hidden;
}

.base-card {
  display: flex;
  flex-direction: column;
}

.base-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: 18px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
}

.reuse-inline-text {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 500;
}

.left-bottom-button-area {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 20px;
  padding: 0 4px 10px 0;
  flex-wrap: wrap;
}

.left-bottom-button-area :deep(.el-button) {
  margin-left: 0 !important;
  padding: 8px 16px;
}

.inline-site-type-item {
  margin-bottom: 18px;
}

.inline-site-type-row {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 32px;
}

.inline-site-type-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  min-width: 32px;
}

.inline-site-type-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.inline-site-type-group :deep(.el-radio) {
  margin-right: 0;
}
</style>
