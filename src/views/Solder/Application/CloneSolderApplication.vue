<template>  
  <div>
    <SolderApplicationTemplate
      :application-data="initData"
      :application-type="'clone'"
    ></SolderApplicationTemplate>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, onActivated } from "vue";
import {
  useApplicationData,
  initializeApplicationData,
  fetchApplicationData,
  initMeasurements,
} from "./LoadSolderApplication";
import type { ApplicationData } from "../../../interface/solderAppInterface";
import { useRoute } from "vue-router";
import SolderApplicationTemplate from "./SolderApplicationTemplate.vue";
import { onBeforeRouteUpdate } from "vue-router";

const route = useRoute();
// uuid를 반응형으로 설정
// const uuid = ref(route.params.applicationUuid);
const initData = reactive(initializeApplicationData());

const callApplication = async (uuid: string) => {
  const fetchedData = await fetchApplicationData(initData, uuid); // 객체 속성만 갱신

  if (fetchedData) {
    sortApplicationDataByNumber(fetchedData);
    Object.assign(initData, fetchedData); // 정렬된 데이터를 할당
  }

  initData.uuid = "";
  initMeasurements(initData);
  initData.files = []  
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

watch(
  () => route.params.applicationUuid,
  async (uuid) => {
    if (uuid) {
      try {
        await callApplication(uuid as string);
      } catch (err) {
        console.error("❌ callApplication 실패:", err);
      }
    }
  },
  { immediate: true }
);
</script>

<style></style>
