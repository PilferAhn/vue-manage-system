<template>
  <!-- single root wrapper to avoid Transition warning -->
  <div class="container" autofocus>
    <el-input
      v-model="inputId"
      style="width: 240px"
      placeholder="Scan or enter cassette ID"
      autofocus
      clearable
      @change="changeInputId"
    />
    <br />
    <el-switch v-model="isReceiveItems" active-text="Receive" inactive-text="Complete" />

    <!-- show current cassette id below the input when available -->
    <div v-if="currentCassetteId" style="margin-top: 6px; color: var(--el-text-color-secondary); font-size: 15px;">
      Current cassette: <strong>{{ currentCassetteId }}</strong>
    </div>

    <!-- Receive or Complete Items -->
    <template v-if="isReceiveItems && mesLots.length > 0">
      <ReceiveItems :mesLots="mesLots" :key="currentCassetteId" />
    </template>
    <template v-else-if="!isReceiveItems && mesLots.length > 0">
      <CompleteItems :mesLots="mesLots" :key="currentCassetteId" /> 
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { fetchMesLotsByCassetteId } from './RegistrationOfItem';
import type { LotStatus as MesLot } from '../../../interface/mes-interface';
import ReceiveItems from './ReceiveItems.vue';
import CompleteItems from './CompleteItems.vue';

const inputId = ref('');
const currentCassetteId = ref('');
const isReceiveItems = ref(true);
const mesLots = ref<MesLot[]>([]);

// Handle cassette ID input change
const changeInputId = async (newValue: string) => {
  if (newValue && newValue.trim() !== '') {
    // Fetch MesLots status by cassette ID
    const fetched = await fetchMesLotsByCassetteId(newValue.trim());
    mesLots.value = (fetched || [])
      

    // If fetch returned results, remember the cassette id and clear the input
    if (mesLots.value.length > 0) {
      currentCassetteId.value = newValue.trim();
      // clear input for next scan
      inputId.value = '';
    } else {
      // if not found, clear the displayed cassette id
      currentCassetteId.value = '';
    }
  }
}

</script>