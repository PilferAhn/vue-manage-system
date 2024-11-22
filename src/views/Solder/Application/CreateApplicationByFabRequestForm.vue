<template>
    <SolderApplicationTemplate v-if="isLoad"
      :application-data="solderApplication"
      :application-type="'create'"
    ></SolderApplicationTemplate>
  </template>

<script setup lang="ts">
import { getApplicationByModelName } from '../../../utils/fab-application-utils';
import type { FabApplicationInterface } from '../../../interface/fab';
import type {ApplicationData as SolderApplicationInterface} from '../../../interface/solderAppInterface'
import { initializeApplicationData, initializeApplicationData2 } from '../../../utils/solderApplicationUtil';
import { useRoute } from "vue-router";
import { ref, watch, reactive, toRaw , Ref } from 'vue';
import SolderApplicationTemplate from './SolderApplicationTemplate.vue'

const route = useRoute();
const fabApplication = reactive<FabApplicationInterface>({})
const solderApplication = initializeApplicationData()
const isLoad = ref(false)

// Watch the `uuid` route parameter, fetch data immediately and when it changes
watch(
  () => route.params.modelName, // Watching route parameter change
  async (modelName) => {
    if (modelName) {
        await getApplicationByModelName(fabApplication , modelName as string); // Fetch data when uuid changes
        copyMatchingKeys(fabApplication, solderApplication); // fabApplication의 키값 출력        
        isLoad.value = true
    }
  },
  { immediate: true } // Trigger immediately on component mount
);

function copyMatchingKeys<T, U extends object>(source: T, target: U): U {
  const rawSource = toRaw(source);
  const rawTarget = toRaw(target);

  Object.keys(rawSource).forEach((key) => {
    if (key in rawTarget) {
      (rawTarget as any)[key] = (rawSource as any)[key];
    }
  });

  return target;
}

</script>

<style>

</style>