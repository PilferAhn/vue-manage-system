<template>
        <!-- table of wafers -->
    <el-table :data="idtProbeItems" style="width: 100%; margin-top: 12px;" border>
      <el-table-column prop="slotNo" label="Slot" width="60" />
      <el-table-column prop="lotId" label="Lot ID" width="120" />
      <el-table-column prop="productName" label="Product Name"/>
      <el-table-column label="Designer">
        <template #default="{ row }">
          {{ row.designer?.userName ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="probeType" label="Probe Type"/>
      <el-table-column prop="status" label="Status" width="120"/>
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
          <template v-if="row.status === 'received'">
            <el-button type="success" size="small" @click="handleComplete(row)">Complete</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { formatDateTime } from '../../../utils/date-utils';
import { ref, onMounted } from 'vue';
import type { IdtProbeItem } from '../../../interface/idt-probe-interfaces';
import { completeIdtProbeItem, updateIdtProbeItemNote, fetchIdtProbeItemsByLotId } from './RegistrationOfItem';
import { ElMessage } from 'element-plus';
import { LotStatus as MesLot } from '../../../interface/mes-interface';

interface IdtProbeItemsWithSlotNo extends IdtProbeItem {
  slotNo?: string;
}

const props = defineProps<{
    mesLots: MesLot[];
}>();

const idtProbeItems = ref<IdtProbeItemsWithSlotNo[]>([]);

onMounted(async () => {
  
    // // Get lot IDs to fetch corresponding IdtProbeItems
    const lotIds = props.mesLots.map(lot => lot.lotId);
    const fetchedIdtProbeItems = await fetchIdtProbeItemsByLotId(lotIds);

    // Build a lookup Record for MesLotStatus keyed by lotId
    const mesLotsById: Record<string, MesLot> = {};
    props.mesLots.forEach(lot => {
       mesLotsById[lot.lotId] = lot;
    });

    idtProbeItems.value = fetchedIdtProbeItems.map(item => {
      return {
        ...item,
        slotNo: mesLotsById[item.lotId]?.slotNo,
      } as IdtProbeItemsWithSlotNo;
    });

});

// Handle note change
const handleNoteChange = async (row: IdtProbeItem) => {
  if (!row.status) return;
  try {
    const updated = await updateIdtProbeItemNote(row.lotId, row.probeType, row.note);
      Object.assign(row, updated);
  } catch (e) {
    ElMessage.error('Failed to update note.');
    console.error(e);
  }
}

// Actions
const handleComplete = async (row: IdtProbeItem) => {
  const updated = await completeIdtProbeItem(row.lotId, row.probeType);
  if (updated) {
    Object.assign(row, updated);
  }
}

</script>