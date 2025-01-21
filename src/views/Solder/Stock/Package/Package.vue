<template>
  <div class="container">
    <el-tabs
      v-if="isLoad"
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="Epoxy" name="epo"
        ><Stock :stock="epoList"></Stock
      ></el-tab-pane>
      <el-tab-pane label="Package" name="package">
        <Stock :stock="packList"></Stock>
      </el-tab-pane>
      <el-tab-pane label="Wire" name="wire"
        ><Stock :stock="wireList"></Stock
      ></el-tab-pane>
      <el-tab-pane label="Capacitor" name="capacitor"
        ><Stock :stock="capacitorList"></Stock
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { testData as t } from "./testingData";
import axios from "axios";
import Stock from "./StockList.vue";
import type { TabsPaneContext } from "element-plus";
import { getTodayDate, adjustDate, formatDate } from "../../../../utils/date-utils";

export interface MaterialStock {
  MaterialId: string; // 재료 ID
  Description: string; // 재료 설명
  StockSap: number; // 재고 SAP
  QtyInput: number; // 입력된 수량
  Stock: number; // 재고 수량
  OnHandDate: string; // 보유 날짜
  DateCheck: string; // 확인 날짜
  Unit: string; // 단위 (예: K, EA, SH)
  DEFAULT_QTY: number; // 기본 수량
  StockSH: number; // 재고 SH
}

const isLoad = ref<boolean>(false);
const activeName = ref("epo");
const wholeData = ref<MaterialStock[]>([]);
const epoList = ref<MaterialStock[]>([]);
const packList = ref<MaterialStock[]>([]);
const wireList = ref<MaterialStock[]>([]);
const capacitorList = ref<MaterialStock[]>([]);
// onMounted(() => {
//   wholeData.value = t.Data;

//   for (let i = 0; i < wholeData.value.length; i++) {
//     const material = wholeData.value[i];
//     if (material.MaterialId.startsWith("010")) {
//       epoList.value.push(material); // MaterialId가 "010"으로 시작하면 epoList에 추가
//     } else {
//       packList.value.push(material); // 그렇지 않으면 packList에 추가
//     }
//   }

//   isLoad.value = true;
// });

const handleClick = (tab: TabsPaneContext, event: Event) => {};

async function fetchData(date : string) {
  // API URL

  const url =
    "/OpeationMns/ScheduleSample/CSPMaterialStock?date=" + date;

  // 헤더 설정
  const headers = {
    "sample-api-key":
      "dc5b5fcf95907d906288117541b94ac8bbec1e1e5131593f28f4b1dcf7d8600c",
  };

  try {
    // GET 요청
    const response = await axios.get(url, { headers });
    return response.data.Data;
  } catch (error) {
    // 요청 실패
    if (axios.isAxiosError(error)) {
      console.error("요청 실패:", error.response?.status, error.response?.data);
    } else {
      console.error("알 수 없는 오류:", error);
    }
  }
}

function allocaVals(data : MaterialStock[]) {
  for (let i = 0; i < data.length; i++) {
    const material = data[i];
    if (material.Description === "EPOXY") {
      epoList.value.push(material);
    } else if (material.Description === "Wire-MKE-UB") {
      wireList.value.push(material);
    } else if (material.MaterialId.startsWith("010")) {
      if (material.MaterialId.startsWith("0102")) {
        wireList.value.push(material);
      } else {
        epoList.value.push(material); // MaterialId가 "010"으로 시작하면 epoList에 추가
      }
    } else if (material.MaterialId.startsWith("2203")) {
      capacitorList.value.push(material); // 그렇지 않으면 packList에 추가
    } else {
      packList.value.push(material); // 그렇지 않으면 packList에 추가
    }
  }
}

onMounted(async () => {
  wholeData.value = await fetchData(getTodayDate());
  if (wholeData.value.length >= 1) {
    allocaVals(wholeData.value)
  } else {
    wholeData.value = await fetchData(formatDate(adjustDate(getTodayDate() , -1)))
    allocaVals(wholeData.value)
  }
  isLoad.value = true;
});
</script>

<script lang="ts">
export default { components: {} };
</script>

<style></style>
