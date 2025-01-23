<template>
  <div>
    <el-table :data="inductorList" style="width: 100%">
      <el-table-column prop="productType" label="Product Type" width="150" />
      <el-table-column prop="position" label="Position" width="150" />
      <!-- <el-table-column prop="uid" label="U ID" width="250" /> -->
      <el-table-column prop="materialCode" label="Material Code" width="200" />
      <el-table-column prop="lotNo" label="Lot No" width="250" />
      <el-table-column prop="quantity" label="Quantity" width="100" />
      <el-table-column prop="createTime" label="Create Time" width="150" />
      <el-table-column prop="shippingDate" label="Shipping Date" width="150" />
      <el-table-column prop="expiryDate" label="Expiry Date" width="150" />
      <el-table-column
        prop="daysExpiryRemain"
        label="Days Expiry Remain"
        width="150"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

// InductorInfo 인터페이스 정의
interface InductorInfo {
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

// Ref 선언
const inductorList = ref<InductorInfo[]>([]);

// 데이터 Fetch 및 매핑 함수
const fetchAndMapData = async (): Promise<InductorInfo[]> => {
  const url = "/OpeationMns/ScheduleSample/GetInductorStock";
  const headers = {
    "sample-api-key":
      "dc5b5fcf95907d906288117541b94ac8bbec1e1e5131593f28f4b1dcf7d8600c",
  };

  try {
    const response = await axios.get(url, { headers });
    const rawData = response.data.Data; // API 응답 데이터

    if (!Array.isArray(rawData)) {
      throw new Error("응답 데이터가 배열이 아닙니다.");
    }

    // 데이터 매핑
    return rawData.map((item: any) => ({
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("요청 실패:", error.response?.status, error.response?.data);
    } else {
      console.error("알 수 없는 오류:", error);
    }
    return [];
  }
};

// 데이터 로드 함수
const loadInductorData = async () => {
  inductorList.value = await fetchAndMapData();
};

// onMounted에서 데이터 로드
onMounted(() => {
  loadInductorData();
});
</script>
