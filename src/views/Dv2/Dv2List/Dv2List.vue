<template>
  <div>    
    <Dv2Search :dv2TableData="filteredData" :fab-app="fabApp" :dv2-data="dv2Data" @updateSearchQuery="handleSearchQuery" />
    <Dv2ListTable :dv2TableData="filteredData" :fab-app="fabApp"></Dv2ListTable>            
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";
import {
  fetchProcessData,
  getFabRequestFormByModelNames,
} from "../../FAB/ApplicationList/ApplicationList";
import type { FabApplicationForm } from "../../FAB/Interface/mes-interface";
// import { dv2Data } from "../../../utils/Dv2/demo-data";
import Dv2Search from "./Dv2Search.vue";

import Dv2ListTable from "./Dv2ListTable.vue";
import {
  sendDv2,
  updateDv2TableData,
  getModelNameList,
} from "../../../utils/Dv2/dv2-list-utils";
import { Dv2 } from "../../../interface/Dv2/dv2-list-interface";
import { sendGetRequest, sendPostRequest } from "../../../utils/httpProtocol";
import { RefSymbol } from "@vue/reactivity";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";
import { getUserId, getUserName } from "../../../utils/account-utils";

// 📌 기존 데이터 저장 (ref 사용)
const fabApp = ref<FabApplicationForm[]>([]);
const dv2TableData = ref<Dv2[]>([]); // 원본 데이터를 저장할 ref
const dv2Data = ref<Dv2[]>([]);
const adminList = ["w2220604", "w2171210", "w2171209", "admin", "w2170211"];
const adminNameList = [""]
// 📌 onMounted에서 데이터 로드 및 업데이트
onMounted(async () => {
  const formData = new FormData();
  formData.append("order_by", "date_of_estimated_cer");
  formData.append("order_dir", "asc");
  const data = await sendPostRequest("/dv2/get_dv2_list", formData);
  dv2Data.value = convertPep8ToCamelCase2(data);
  
  // for(let i = 0 ; i < dv2Data.length; i++){

  //   await sendDv2(dv2Data[i], "create")

  // }

  nextTick(async () => {
    dv2TableData.value = dv2Data.value.flatMap((row) => {
      const firstRow = {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: true,
        dateOfFabIn: row.dateOfEstimatedFabIn, // 두 번째 줄: 예상 FAB IN 값
        dateOfFabOut: row.dateOfEstimatedFabOut, // 두 번째 줄: 예상 FAB OUT 값
        dateOfMdr: row.dateOfEstimatedMdr,
        isEditable: true,
        dateOfHqOut: row.dateOfEstimatedHqOut,
        dateOfWhcIn: row.dateOfEstimatedWhcIn,
        dateOfAssyIn: row.dateOfEstimatedAssyIn,
        dateOfDCOut: row.dateOfEstimatedDCOut,
        dateOfMeasIn: row.dateOfEstimatedMeasIn,
        dateOfCer: row.dateOfEstimatedCer,
        // supporter: row.supporter,

      };

      const secondRow = {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: false,
        dateOfFabIn: null,
        dateOfFabOut: null,
        dateOfMdr: row.dateOfMdr,
        isEditable: false,
        dateOfHqOut: null,
        dateOfWhcIn: null,
        dateOfAssyIn: null,
        dateOfDCOut: null,
        dateOfMeasIn: null,
        dateOfCer: row.dateOfCer,
        // supporter: row.designer,
      };
      
      // 특정 조건이 만족하면 secondRow 추가
      if (adminList.includes(getUserId().toLocaleLowerCase())) {
        return [firstRow, secondRow];
      } 
      else if(getUserName() === row.supporter){
        return [firstRow, secondRow];
      }
      else {
        return []; // 조건을 만족하지 않으면 첫 번째 행만 추가
      }
    });
    // fabApp.value = await fetchProcessData(fabApp.value);
    fabApp.value = await getFabRequestFormByModelNames(
      getModelNameList(dv2TableData.value),
      fabApp.value
    );
    updateDv2TableData(dv2TableData.value, fabApp.value);
  });
});


const searchQuery = ref({
  searchType: "productName",
  searchQuery: "",
});

// 검색어를 업데이트하는 함수
const handleSearchQuery = (query) => {
  searchQuery.value = query;
};

const filteredData = computed(() => {
  return dv2TableData.value.filter((item) => {
    const key = searchQuery.value.searchType; // 검색 기준 (productName 또는 supporter)
    const searchValue = searchQuery.value.searchQuery.toLowerCase();

    // null 또는 undefined 방지 (빈 문자열로 변환)
    const itemValue = item[key] ? item[key].toString().toLowerCase() : "";

    return !searchQuery.value.searchQuery || itemValue.includes(searchValue);
  });
});


</script>
