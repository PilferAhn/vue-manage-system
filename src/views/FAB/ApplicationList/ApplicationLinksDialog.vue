<template>
  <el-dialog v-model="isVisible" title="의뢰서 선택">
    <h2>{{ props.fabApplication.productName }}</h2>
    <br />
    <el-table :data="ApplicationTypes">
      <el-table-column prop="name" label="측정 의뢰서 항목"></el-table-column>
      <el-table-column label="Action">
        <template #default="scope"
          ><el-button
            :disabled="!scope.row.status"
            @click="createApplication(props.fabApplication, scope.row.type)"
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
import type { FabRequestForm } from "../../../interface/fab-application-rev2";

const props = defineProps<{
  visible: boolean;
  fabApplication: FabRequestForm;
}>();

const router = useRouter();
function createApplication(fabApplication: FabRequestForm, type: string) {
  if (type === "whc") {
    router.push({
      name: "CreateWhcAppByFabRequestForm",
      params: { productName: fabApplication.productName },
    });
  } else if (type === "pdt") {
    router.push({
      name: "CreatePdtApplicationByFabForm",
      params: { productName: fabApplication.productName },
    });
  } else if (type === "teg") {
    router.push({
      name: "CreateTegApplicationByFabForm",
      params: { productName: fabApplication.productName },
    });
  }
  else if(type === "fabcard"){

    const productName = fabApplication.productName
    const url = "fabcard://10.29.11.57:40000/fab_monitoring_rev2/get_fab_request_for_fab_card/" + productName;
  // const url = "fab.exe http://10.29.11.124:40000/fab_monitoring_rev2/get_fab_request_for_fab_card/HSTESTMODEL1"

    window.location.href = url;
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
    name: "Fab Card 작성",
    type: "fabcard",
    status: true,
  },
  {
    name: "TEG 측정 의뢰서",
    type: "teg",
    status: true,
  },
  {
    name: "WHC 측정 의뢰서",
    type: "whc",
    status: true,
  },
  {
    name: "PDT 측정 의뢰서",
    type: "pdt",
    status: true,
  },

  // {
  //   name: "BOM List",
  //   type: "bom",
  //   status: false,
  // },
];
</script>

<script lang="ts">
export default {};
</script>