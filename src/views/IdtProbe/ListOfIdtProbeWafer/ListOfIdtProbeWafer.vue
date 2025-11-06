<template>
    <!-- single root wrapper to avoid Transition warning -->
    <div class="list-of-idt-probe-wafers">

        <!-- table of wafers -->
        <el-table :data="idtProbeWafers" class="table" border>
            <el-table-column prop="lotId" label="Lot ID" width="120" />
            <el-table-column prop="productName" label="Product Name"  />
            <el-table-column label="Designer">
                <template #default="{ row }">
                    {{ row.designer?.userName ?? '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="probeType" label="Probe Type"/>
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
            <el-table-column prop="note" label="Note"/>
        </el-table>
        <el-pagination :hide-on-single-page="true" :total="totalItems" :page-size="props.pageSize"
            v-model:current-page="currentPage" layout="prev, pager, next" 
            @change="handlePageChange" 
        />
    </div>
</template>


<script setup lang="ts">
import { formatDateTime } from '../../../utils/date-utils';
import { ref, onMounted } from 'vue';
import type { IdtProbeWafer, IdtProbeStatus } from '../../../interface/idt-probe-interfaces';
import { ValidItdtProbeWaferOrderParams, fetchCountIdtProbeWafers, fetchIdtProbeWafers } from './ListOfIdtProbeWafer';

const props = withDefaults(defineProps<{
    pageSize?: number;
    status?: IdtProbeStatus | undefined;
    orderParams?: ValidItdtProbeWaferOrderParams;
}>(), {
    pageSize: 10,
    orderParams: () => { return { orderBy: 'received_date', direction: 'asc' } },
});

const idtProbeWafers = ref<IdtProbeWafer[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);

const handlePageChange = async () => {
    idtProbeWafers.value = await fetchIdtProbeWafers(props.status, props.pageSize, currentPage.value, props.orderParams);
};

onMounted(async () => {
    totalItems.value = await fetchCountIdtProbeWafers(props.status);
    idtProbeWafers.value = await fetchIdtProbeWafers(props.status, props.pageSize, currentPage.value, props.orderParams);
});
</script>

<style scoped>
.table {
  table-layout: fixed;
}
</style>