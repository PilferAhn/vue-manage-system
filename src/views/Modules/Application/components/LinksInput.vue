<template>
  <el-form-item v-if="fields.length" label="관련 Link">
    <div class="link-list">
      <div v-for="field in fields" :key="field.key" class="link-row">
        <div class="link-label">{{ field.label }}</div>
        <el-input
          v-model="linkValues[field.key]"
          :placeholder="`${field.label} Link 입력`"
          clearable
        />
      </div>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import { computed } from "vue";

type MeasurementKey =
  | "setup"
  | "na"
  | "nf"
  | "mwa"
  | "ca"
  | "tcf"
  | "nonlinear"
  | "probeSpl"
  | "probeDeembedding"
  | "evbAssembly";

interface LinkField {
  key: string;
  label: string;
}

const LINK_FIELDS: Record<MeasurementKey, LinkField[]> = {
  setup: [
    { key: "deembeddingKeysight", label: "De-embedding(Keysight)" },
    { key: "configKeysight", label: "Config(Keysight)" },
    { key: "rffeKeysightRohde", label: "RFFE(Keysight, Rohde)" },
    { key: "mwaRohde", label: "MWA(Rohde)" },
    { key: "portFileRohde", label: "Port file(Rohde)" },
  ],
  na: [
    { key: "deembedding", label: "De-embedding" },
    { key: "rffe", label: "RFFE" },
    { key: "config", label: "Config" },
    { key: "evbRealMatchingTuningRequest", label: "EVB Real Matching Tunning 의뢰서" },
    { key: "sampleEvbRealPhoto", label: "샘플, EVB 실물사진" },
  ],
  nf: [
    { key: "rffe", label: "RFFE" },
    { key: "config", label: "Config" },
  ],
  mwa: [
    { key: "mwaXml", label: "MWA(XML)" },
    { key: "rffe", label: "RFFE" },
    { key: "portFile", label: "Port file" },
  ],
  ca: [
    { key: "portInfo", label: "Port 정보" },
    { key: "manual", label: "Manual" },
  ],
  tcf: [
    { key: "config", label: "Config" },
    { key: "rffe", label: "RFFE" },
    { key: "manual", label: "Manual" },
  ],
  nonlinear: [],
  probeSpl: [
    { key: "fileUpload", label: "File upload" },
  ],
  probeDeembedding: [
    { key: "fileUpload", label: "File upload" },
  ],
  evbAssembly: [],
};

const props = defineProps<{
  form: {
    links?: Record<string, string>;
    fixedLinks?: Record<string, string>; // 기존 데이터 호환용
    fileLink?: string;
    setupLinks?: string[];
    [key: string]: any;
  };
  measurementKey: MeasurementKey;
}>();

const fields = computed(() => LINK_FIELDS[props.measurementKey] ?? []);

function initializeLinks() {
  if (!props.form.links || typeof props.form.links !== "object") {
    props.form.links = {};
  }

  // 기존 fixedLinks 데이터가 있으면 links로 1회 이관
  if (props.form.fixedLinks && typeof props.form.fixedLinks === "object") {
    Object.entries(props.form.fixedLinks).forEach(([key, value]) => {
      if (props.form.links![key] === undefined) {
        props.form.links![key] = value ?? "";
      }
    });
  }

  fields.value.forEach((field, index) => {
    const legacySetupLink = Array.isArray(props.form.setupLinks)
      ? props.form.setupLinks[index]
      : "";
    const legacySingleLink = index === 0 ? props.form.fileLink : "";

    if (props.form.links![field.key] === undefined) {
      props.form.links![field.key] = legacySetupLink || legacySingleLink || "";
    }
  });
}

initializeLinks();

const linkValues = computed(() => {
  initializeLinks();
  return props.form.links!;
});
</script>

<style scoped>
.link-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.link-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.link-label {
  width: 160px;
  flex: 0 0 160px;
  font-size: 13px;
  color: #606266;
  line-height: 1.3;
  word-break: keep-all;
}

.link-row :deep(.el-input) {
  flex: 1;
}
</style>