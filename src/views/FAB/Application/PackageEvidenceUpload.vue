<template>
  <el-card shadow="never" class="mt10">
    <h3 class="section-title">Package 재고 캡쳐본</h3>

    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png,.webp"
        :on-change="handleFileChange"
      >
        <el-button type="primary" plain>사진 선택</el-button>
      </el-upload>

      <!-- load 모드에서만 업로드 버튼 노출 -->
      <el-button
        v-if="mode === 'load'"
        type="success"
        :disabled="!selectedFile"
        @click="handleUpload"
      >
        업로드 저장
      </el-button>
    </div>

    <div class="mt10" v-if="previewUrl || fabEvidence?.path">
      <el-image
        :src="previewUrl || fabEvidence?.path"
        fit="contain"
        style="width:100%; max-width:800px; border:1px solid #eee; border-radius:6px;"
        :preview-src-list="imagePreviewList"
        preview-teleported
      />
    </div>

    <div v-if="fabEvidence?.created_time" style="margin-top: 6px; font-size: 12px; color: #999;">
      등록시간: {{ formatDate(fabEvidence.created_time) }}
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, watch } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import type { FabRequestForm } from "./../../../interface/fab-application-rev2";
import { getPackageEvidence } from "../../../utils/Fab/fab-application-utils";
type FabPackageEvidence = {
  product_name: string;
  path: string;
  created_time: string;
};

const props = defineProps<{
  fabApplication: FabRequestForm;
  mode: string;
}>();


const emit = defineEmits<{
  // ✅ create 모드에서는 선택한 파일을 부모로 넘겨서 "제출 버튼"에서 업로드 하게끔
  (e: "selected-file", file: File | null): void;
  (e: "update:fabApplication", value: FabRequestForm): void;
}>();

const productName = computed(() => props.fabApplication.productName ?? "");

const fabEvidence = ref<FabPackageEvidence | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>("");

const imagePreviewList = computed(() => {
  const src = previewUrl.value || fabEvidence.value?.path;
  return src ? [src] : [];
});

async function fetchEvidence() {
  const pn = productName.value?.trim();
  if (!pn) {
    fabEvidence.value = null;
    return;
  }
  fabEvidence.value = await getPackageEvidence(pn);
}

defineExpose({
  resetEvidence,
  refreshEvidence: fetchEvidence, // ✅ 추가!
});

function handleFileChange(uploadFile: any) {
  const file = uploadFile.raw as File;
  if (!file) return;

  const allow = ["image/jpeg", "image/png", "image/webp"];
  if (!allow.includes(file.type)) {
    ElMessage.error("jpg/png/webp만 업로드 가능합니다.");
    return;
  }

  selectedFile.value = file;

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = URL.createObjectURL(file);

  // ✅ create 모드에서는 업로드 안하고 부모에게만 알려줌
  if (props.mode === "create") {
    emit("selected-file", file);
  }
}

async function handleUpload() {
  if (!productName.value) {
    ElMessage.error("productName이 없습니다.");
    return;
  }
  if (!selectedFile.value) {
    ElMessage.warning("업로드할 파일을 먼저 선택하세요.");
    return;
  }

  try {
    const form = new FormData();
    form.append("product_name", productName.value);
    form.append("file", selectedFile.value);

    const res = await axios.post("/fab_package_evidence/upload_package_evidence", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fabEvidence.value = res.data ?? null;

    const updated = {
      ...props.fabApplication,
      fabPackageEvidence: res.data,
    } as any;


    emit("update:fabApplication", updated);

    ElMessage.success("업로드 완료!");

    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = "";
    selectedFile.value = null;
    emit("selected-file", null);
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.detail ?? "업로드 실패");
  }
}

function formatDate(dt: string) {
  return dt?.replace("T", " ").slice(0, 19);
}

watch(
  () => productName.value,
  async () => {
    // productName 바뀌었으면 preview는 지우는게 자연스러움
    if (props.mode !== "load") {
      fabEvidence.value = null;
      return;
    }

    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = "";
    selectedFile.value = null;
    emit("selected-file", null);

    await fetchEvidence();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

function resetEvidence() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = "";
  selectedFile.value = null;
  emit("selected-file", null);
}


</script>


<style scoped>
.mt10 {
  margin-top: 10px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
}
</style>
