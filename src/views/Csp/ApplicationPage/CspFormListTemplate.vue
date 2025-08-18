<template>

      <CspSearch @updateSearchQuery="handleSearchQuery" />
      <CspListTable :cspTableData="cspTableData" />
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

 

// 📌 기존 데이터 저장 (ref 사용)

// 📌 onMounted에서 데이터 로드 및 업데이트
const searchQuery = ref({
  searchType: "productName",
  searchQuery: "",
});

const username = localStorage.getItem('ms_username') || 'Guest';

const handleSearchQuery = async (query) => {
  searchQuery.value = query;
  cspTableData.value = await handleGetFormList(query.searchQuery,username)
};



</script>
