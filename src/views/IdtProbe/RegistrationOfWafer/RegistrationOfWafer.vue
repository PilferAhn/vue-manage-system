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

    <!-- show current cassette id below the input when available -->
    <div v-if="currentCassetteId" style="margin-top: 6px; color: var(--el-text-color-secondary); font-size: 12px;">
      Current cassette: <strong>{{ currentCassetteId }}</strong>
    </div>

    <!-- table of wafers -->
    <el-table v-if="idtProbeWafers.length > 0" :data="idtProbeWafers" style="width: 100%; margin-top: 12px;" border>
      <el-table-column prop="lotId" label="Lot ID" width="120" />
      <el-table-column prop="productName" label="Product Name"/>
      <el-table-column label="Designer">
        <template #default="{ row }">
          {{ row.designer?.userName ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column label="Probe Type">
          <template #default="{ row }">
            <template v-if="!row.status">
              <el-select v-model="row.probeType" placeholder="Select probe type" >
                <el-option
                  v-for="t in idtProbeTypes"
                  :key="t.probeType"
                  :label="t.probeType"
                  :value="t.probeType"
                />
              </el-select>
            </template>
            <template v-else>
              {{ row.probeType ?? '-' }}
            </template>
          </template>
        </el-table-column>
      <el-table-column label="Status" width="120">
        <template #default="{ row }">
          {{ row.status ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column label="Received" width="140">
        <template #default="{ row }">
          {{ formatDateTime(row.receivedDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Completed" width="140">
        <template #default="{ row }">
          {{ formatDateTime(row.completedDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Note">
        <template #default="{ row }">
          <template v-if="row.status==='completed'">
            {{row.note}}
          </template>
          <template v-else>
            <el-input v-model="row.note" placeholder="Enter note" @change="handleNoteChange(row)" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="105">
        <template #default="{ row }">
          <template v-if="!row.status">
            <el-button type="primary" size="small" :disabled="!row.probeType" @click="handleReceive(row)">Receive</el-button>
          </template>
          <template v-else-if="row.status === 'received'">
            <el-button type="success" size="small" @click="handleComplete(row)">Complete</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '../../../utils/date-utils';
import { ref, onMounted } from 'vue';
import type { IdtProbeWafer, IdtProbeType } from '../../../interface/idt-probe-interfaces';
import { fetchMesLotsStatusByCasseteId, fetchIdtProbeTypes, receiveIdtProbeWafer, completeIdtProbeWafer, updateIdtProbeWaferNote } from './RegistrationOfWafer';
import { ElMessage } from 'element-plus';
const inputId = ref('');
const currentCassetteId = ref('');
const idtProbeWafers = ref<IdtProbeWafer[]>([]);
const idtProbeTypes = ref<IdtProbeType[]>([]);

const changeInputId = async (newValue: string) => {    
  if (newValue && newValue.trim() !== '') {
    // Fetch MesLots status by cassette ID
    const fetched = await fetchMesLotsStatusByCasseteId(newValue.trim());

    // Build wafers list for the table (fallback to minimal wafer when missing)
    idtProbeWafers.value = (fetched || []).map(lot => {
      return lot.idtProbeWafer ?? ({
        lotId: lot.lotId,
        productName: (lot as any).materialId,
      } as IdtProbeWafer);
    });


    // If fetch returned results, remember the cassette id and clear the input
    if (idtProbeWafers.value.length > 0) {
      currentCassetteId.value = newValue.trim();
      // clear input for next scan
      inputId.value = '';
    } else {
      // if not found, clear the displayed cassette id
      currentCassetteId.value = '';
    }
  }
}

// preload probe types for selector
onMounted(async () => {
  try {
    idtProbeTypes.value = await fetchIdtProbeTypes();
  } catch (e) {
    // silent fail; selector will simply be empty
    idtProbeTypes.value = [];
  }
});

// Actions
const handleReceive = async (row: IdtProbeWafer) => {
  if (!row.probeType) return;
  const updated = await receiveIdtProbeWafer(row);
  if (updated) {
    Object.assign(row, updated);
  }
}

const handleComplete = async (row: IdtProbeWafer) => {
  const updated = await completeIdtProbeWafer(row.lotId);
  if (updated) {
    Object.assign(row, updated);
  }
}

const handleNoteChange = async (row: IdtProbeWafer) => {
  if (!row.status) return;
  try {
    const updated = await updateIdtProbeWaferNote(row.lotId, row.note);
      Object.assign(row, updated);
  } catch (e) {
    ElMessage.error('Failed to update note.');
    console.error(e);
  }
}


</script>