<template>
  <el-dialog v-model="isVisible" :title="tt('의뢰서 선택')">
    <h2>{{ props.fabApplication.productName }}</h2>
    <br />
    <el-table :data="ApplicationTypes">
      <el-table-column prop="name" :label="tt('측정 의뢰서 항목')">
        <template #default="scope">{{ tt(scope.row.name) }}</template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default="scope"><el-button :disabled="!scope.row.status"
            @click="createApplication(props.fabApplication, scope.row.type)">{{ tt("의뢰서 생성") }}</el-button></template>
      </el-table-column>
    </el-table>
    <br />
    <p>{{ tt("의뢰서를 선택하세요") }}</p>
    <template #footer>
      <el-button @click="closeDialog">{{ tt("Close") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, reactive } from "vue";
import { Router, useRouter } from "vue-router";
import type { FabRequestForm } from "../../../interface/fab-application-rev2";
import { FabRequest } from "../../../interface/fab-application-rev2";
import { sendPostRequest } from "../../../utils/httpProtocol";
import { formatDate } from "../../../utils/date-utils";
import { getMesFabFormInfo } from "./rev2/ApplicationTable";
import { buttonTypes } from "element-plus";
import { getCheckSap } from "../../../utils/cspRequestFormUtill"
import { useT } from "../../../utils/i18n";

const props = defineProps<{
  visible: boolean;
  fabApplication: FabRequestForm;
  /** 메인 화면에서만 true: WJC 사용자에게 화면 문구를 일본어로 */
  translate?: boolean;
}>();
const tt = useT(() => props.translate);

const router = useRouter();
function createApplication(fabApplication: FabRequestForm, type: string) {
  // 다른 화면으로 이동하기 전에 팝업을 닫는다.
  // (닫지 않으면 숨겨진 이전 화면의 팝업 덮개가 남아 홈 버튼 등 클릭이 막힘)
  emit("update:visible", false);
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
  } else if (type === "csp") {
    router.push({
      name: "CSPForm",
      params: { productName: fabApplication.productName },
    });
  } else if (type === "fabcard") {
    //x2230116

    const productName = fabApplication.productName;
    const fabInsertData = fabApplication.wantedFabStartDate;
    const quantity = fabApplication.quantity.toString();
    const url =
      "fabcard://10.29.11.57:40000/fab_monitoring_rev2/get_fab_request_for_fab_card/" +
      productName +
      "_" +
      formatDate(fabInsertData) +
      "_" +
      quantity;
    // const url = "fab.exe http://10.29.11.124:40000/fab_monitoring_rev2/get_fab_request_for_fab_card/HSTESTMODEL1"
    console.log(url);
    const url2 =
      "http://10.29.11.57:40000/fab_monitoring_rev2/set_is_fab_card_created";
    const form = new FormData();
    form.append("product_name", productName);
    form.append("new_value", String(true));
    sendPostRequest(url2, form);

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

function handleCreateApplication(type: string, applicationId: string) { }

const ApplicationTypes = ref<any[]>([]);

watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      const tempFabRequest = ref(new FabRequest(props.fabApplication));
      await getMesFabFormInfo([tempFabRequest.value]);
      const list = [
        {
          name: "Fab Card 작성",
          type: "fabcard",
          status: !tempFabRequest.value.isFabCardCreated,
          // status: tempFabRequest.value?.isFabCardCreated === false,
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
      ];

      if (props.fabApplication.packageId === "CSP") {

        const statusp = await getCheckSap(props.fabApplication.productName);
        const isStatusTrue = statusp === 'true';
        // console.log("statusp:", statusp, "->", isStatusTrue);
        list.splice(2, 0, {
          name: "CSP 조립 의뢰서",
          type: "csp",
          status: isStatusTrue,
        });
      }

      ApplicationTypes.value = list;
    }
  }
);

</script>

<script lang="ts">
export default {};
</script>
