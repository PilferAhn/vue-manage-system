<template>
  <el-dialog v-model="isVisible" title="의뢰서 선택">
    <h2>{{ props.fabApplicationId }}</h2>
    <br />
    <el-table :data="ApplicationTypes">
      <el-table-column prop="name" label="측정 의뢰서 항목"></el-table-column>
      <el-table-column label="Action">
        <template #default="scope"
          ><el-button :disabled="!scope.row.status" @click="createApplication(props.fabApplicationId, scope.row.type)"
            >의뢰서 생성</el-button
          ></template
        >
      </el-table-column>
    </el-table>
    <br />
    <p>의뢰서를 선택하세요</p>
    <template #footer>
      <el-button @click="closeDialog">Close</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Router, useRouter } from "vue-router";
const props = defineProps<{
  visible: boolean;
  fabApplicationId: string;
}>();

const router = useRouter();
function createApplication(modelName: string, type: string) {
  if (type === "whc") {
    router.push({
      name: "CreateApplicationByFabForm",
      params: { modelName: modelName },
    });
  }
}

const emit = defineEmits<{
  (event: "update:visible", value: boolean): void;
}>();

// 로컬 상태를 관리
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

function closeDialog() {
  emit("update:visible", false);
}

function handleCreateApplication(type: string, applicationId: string) {}

const ApplicationTypes = [
  {
    name: "PDT 측정 의뢰서",
    type: "pdt",
    status: false,
  },
  {
    name: "TEG 측정 의뢰서",
    type: "teg",
    status: false,
  },
  {
    name: "WHC 측정 의뢰서",
    type: "whc",
    status: true,
  },
  {
    name: "BOM List",
    type: "bom",
    status: false,
  },
];
</script>
