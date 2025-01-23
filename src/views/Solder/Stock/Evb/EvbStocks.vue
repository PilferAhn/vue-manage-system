<template>
  <div >
    <el-card shadow="always">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="EVB Sheet" name="evbSheet">
          <EvbSheetTable :evbSheetList="evbSheetList" />
        </el-tab-pane>
        <el-tab-pane label="EVB for solder measure" name="evb">
          <EvbTable :evbList="evbList" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { sendGetRequestWithHeader } from "../../../../utils/httpProtocol";
import EvbTable from "./EvbTable.vue";
import EvbSheetTable from "./EvbSheetTable.vue";

// EvbSheetInfo 인터페이스
export interface EvbSheetInfo {
  productType?: string;
  position?: string;
  uid?: string;
  materialCode?: string;
  lotNo?: string;
  quantity?: number;
  createTime?: string;
  shippingDate?: string;
  expiryDate?: string;
  daysExpiryRemain?: number;
}

export interface EvbInfo {
  productType?: string;
  position?: string;
  uid?: string;
  materialCode?: string;
  lotNo?: string;
  quantity?: number;
  unit?: string;
  size?: string;
  materialType?: string;
  description?: string;
  inputTime?: string;
  actualDate?: string;
  expiryDate?: string;
  daysExpiryRemain?: number;
  useStatus?: string;
}

// Ref 선언
const evbList = ref<EvbInfo[]>([]);
const evbSheetList = ref<EvbSheetInfo[]>([]);
const activeTab = ref("evbSheet"); // 현재 활성화된 탭

// API URL과 헤더
const evbUrl = "/OpeationMns/ScheduleSample/GetEVBStock";
const evbSheetUrl = "/OpeationMns/ScheduleSample/GetEVBSheetStock";
const headers = {
  "sample-api-key":
    "dc5b5fcf95907d906288117541b94ac8bbec1e1e5131593f28f4b1dcf7d8600c",
};

// onMounted에서 데이터 로드
onMounted(async () => {
  // EVB 데이터 로드
  const evbResponse = await sendGetRequestWithHeader(evbUrl, headers);
  if (Array.isArray(evbResponse["Data"])) {
    evbList.value = evbResponse["Data"].map((item: any) => ({
      productType: item["Product Type"],
      position: item["Position"],
      uid: item["U ID"],
      materialCode: item["Material Code"],
      lotNo: item["LotNo"],
      quantity: item["Quantity"],
      unit: item["Unit"],
      size: item["SIZE"],
      materialType: item["Material type"],
      description: item["DESCRIPTION"],
      inputTime: item["INPUT_TIME"],
      actualDate: item["Actual Date"],
      expiryDate: item["Expiry Date"],
      daysExpiryRemain: item["Days Expiry Remain"],
      useStatus: item["USE_STATUS"],
    }));
  }

  // EVB Sheet 데이터 로드
  const sheetResponse = await sendGetRequestWithHeader(evbSheetUrl, headers);
  if (Array.isArray(sheetResponse["Data"])) {
    evbSheetList.value = sheetResponse["Data"].map((item: any) => ({
      productType: item["Product Type"],
      position: item["Position"],
      uid: item["U ID"],
      materialCode: item["Material Code"],
      lotNo: item["LotNo"],
      quantity: item["Quantity"],
      createTime: item["CREATE_TIME"],
      shippingDate: item["Shipping Date"],
      expiryDate: item["Expiry Date"],
      daysExpiryRemain: item["Days Expiry Remain"],
    }));
  }
});
</script>

<style></style>
