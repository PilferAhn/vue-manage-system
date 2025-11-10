<template>
        <!-- table of wafers -->
    <el-table v-if="idtProbeWafers.length > 0" :data="idtProbeWafers" style="width: 100%; margin-top: 12px;" border>
      <el-table-column prop="slotNo" label="Slot" width="60" />
      <el-table-column prop="lotId" label="Lot ID" width="120" />
      <el-table-column prop="productName" label="Product Name"/>
      <el-table-column label="Probe Type">
          <template #default="{ row }">
              <el-select v-model="row.probeTypes" placeholder="Select probe type" multiple>
                <el-option
                  v-for="t in idtProbeTypes"
                  :key="t.probeType"
                  :label="t.probeType"
                  :value="t.probeType"
                />
              </el-select>
          </template>
        </el-table-column>
      <el-table-column label="New Iter" width="80" align="center">
        <template #default="{ row }">
            <el-checkbox v-model="row.isNewIteration"/>
        </template>
      </el-table-column>
      <el-table-column label="Note">
        <template #default="{ row }">
            <el-input v-model="row.note" placeholder="Enter note" />
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="105">
        <template #default="{ row }">
            <el-button type="primary" size="small" :disabled="!(row.probeTypes && row.probeTypes.length > 0)" @click="handleReceive(row)">Receive</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IdtProbeItem, IdtProbeType } from '../../../interface/idt-probe-interfaces';
import { receiveIdtProbeItem } from './RegistrationOfItem';
import { fetchIdtProbeTypes } from '../../IdtProbe/IdtProbeCommon';
import { LotStatus as MesLot } from '../../../interface/mes-interface';

const props = defineProps<{
    mesLots: MesLot[];
}>();


interface IdtProbeWaferWithSlotNo {
  slotNo?: string;
  lotId: string;
  probeTypes: string[];
  isNewIteration: boolean;
  productName: string;
  note?: string;
}

const idtProbeWafers = ref<IdtProbeWaferWithSlotNo[]>([]);
const idtProbeTypes = ref<IdtProbeType[]>([]);

// preload probe types for selector
onMounted(async () => {
    const idtProbeTypesPromise = fetchIdtProbeTypes();
    idtProbeTypes.value = await idtProbeTypesPromise;

    for (const lot of props.mesLots) {
        idtProbeWafers.value.push({
            slotNo: lot.slotNo,
            lotId: lot.lotId,
            productName: lot.materialId,
            isNewIteration: false,
            probeTypes: [],
            });
    }
});

// Actions
const handleReceive = async (row: IdtProbeWaferWithSlotNo) => {

  for (const probeType of row.probeTypes) {
    const idtProbeItem: IdtProbeItem = {
      lotId: row.lotId,
      probeType: probeType,
      productName: row.productName,      
      note: row.note,
    };

    // Send the probe item for processing
    const result = await receiveIdtProbeItem(idtProbeItem, row.isNewIteration);

  }  
}

</script>