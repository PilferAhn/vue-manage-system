<template>
  <SolderApplicationTemplate
    :application-data="initData"
    :application-type="'load'"
  ></SolderApplicationTemplate>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import {
  useApplicationData,
  initializeApplicationData2,
  fetchApplicationData,
} from "./LoadSolderApplication";
import type { ApplicationData } from "../../../interface/solderAppInterface";
import { useRoute } from "vue-router";
import SolderApplicationTemplate from "./SolderApplicationTemplate.vue";

const route = useRoute();

// uuid를 반응형으로 설정
// const uuid = ref(route.params.applicationUuid);
const initData = reactive(initializeApplicationData2());

const callApplication = async (uuid: string) => {
  const fetchedData = await fetchApplicationData(initData, uuid); // 객체 속성만 갱신
  console.log(fetchedData)
  if (fetchedData) {
    sortApplicationDataByNumber(fetchedData);
    Object.assign(initData, fetchedData); // 정렬된 데이터를 할당
  }

  // 데이터를 number로 정렬하는 함수
  function sortApplicationDataByNumber(data: ApplicationData) {
    if (data.measurements) {
      data.measurements.sort((a, b) => Number(a.number) - Number(b.number));      
    }
    if (data.segments) {
      data.segments.sort((a, b) => Number(a.number) - Number(b.number));
    }
    if (data.matching) {
      data.matching.sort((a, b) => Number(a.number) - Number(b.number));
    }
  }
};

// Watch the `uuid` route parameter, fetch data immediately and when it changes
watch(
  () => route.params.applicationUuid, // Watching route parameter change
  (uuid) => {
    if (uuid) {
      callApplication(uuid as string); // Fetch data when uuid changes
    }
  },
  { immediate: true } // Trigger immediately on component mount
);
</script>

<style></style>
