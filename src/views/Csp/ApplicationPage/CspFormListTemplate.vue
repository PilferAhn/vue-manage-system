<template>

      <CspSearch @updateSearchQuery="handleSearchQuery" />
      <CspListTable :customList="customList" />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";


// import { dv2Data } from "../../../utils/Dv2/demo-data";
import CspSearch from "./CspSearch.vue";
import CspListTable from "./CspListTable.vue";
import {

  getModelNameList,
  updateDv2TableDataRev,
} from "../../../utils/Dv2/dv2-list-utils";
import { handleGetFormList, dataValidation, handleSubmitForm } from '../../../utils/cspRequestFormUtill'
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";
import { getUserId, getUserName } from "../../../utils/account-utils";
import { getApplicationListByDict } from "../../../utils/Fab/fab-application-utils";
import { ApplicationData } from "../../../interface/cspRequestFormInterface";

const cspTableData = ref<ApplicationData[]>([]); 
const customList = ref<any[]>([]);
 

// 📌 기존 데이터 저장 (ref 사용)

// 📌 onMounted에서 데이터 로드 및 업데이트
const searchQuery = ref({
  searchType: "productName",
  searchQuery: "",
});

const username = localStorage.getItem('ms_username') || 'Guest';
const handleSearchQuery = async (query: any) => {
  searchQuery.value = query;

  const result = await handleGetFormList(query.searchQuery, username);

  // cspTableData.value = result;

  customList.value = result.map(item => {
    // const rawBox = item.box_id ?? '';
    // const [datePart, boxId] = rawBox.split('/');
    return {
      ...item,                         // 기존 데이터 유지
      tx_date: "-",  // 출하일자 (yyyyMMdd)
      // box_id: boxId ?? '-'              // 슬래시 뒤쪽
    };
  });
};

const boxIdFormat = (str?: string) => {
  if (!str) return '-';

  const datePart = str.split('/')[0] ?? '';
  return datePart.slice(0, 8);
};



</script>
