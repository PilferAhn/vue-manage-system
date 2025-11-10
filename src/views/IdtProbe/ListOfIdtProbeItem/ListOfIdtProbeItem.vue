<template>
    <!-- single root wrapper to avoid Transition warning -->
    <div class="list-of-idt-probe-items">

        <!-- table of wafers -->
        <el-table :data="idtProbeItems" class="table" border>
            <el-table-column prop="lotId" label="Lot ID" width="120" />
            <el-table-column prop="productName" label="Product Name"  />
            <el-table-column label="Designer">
                <template #default="{ row }">
                    {{ row.designer?.userName ?? '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="probeType" label="Probe Type"/>
            <el-table-column prop="iteration" label="Iter" width="50"/>
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
import type { IdtProbeItem, IdtProbeStatus } from '../../../interface/idt-probe-interfaces';
import { ValidItdtProbeItemOrderParams, fetchCountIdtProbeItems, fetchIdtProbeItems } from './ListOfIdtProbeItem';

const props = withDefaults(defineProps<{
    pageSize?: number;
    status?: IdtProbeStatus | undefined;
    orderParams?: ValidItdtProbeItemOrderParams;
}>(), {
    pageSize: 10,
    orderParams: () => { return { orderBy: 'received_date', direction: 'asc' } },
});

const idtProbeItems = ref<IdtProbeItem[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);

const handlePageChange = async () => {
    const totalItemsPromise = fetchCountIdtProbeItems(props.status);
    const idtProbeItemsPromise = fetchIdtProbeItems(props.status, props.pageSize, currentPage.value, props.orderParams);
    totalItems.value = await totalItemsPromise;
    idtProbeItems.value = await idtProbeItemsPromise;
};

onMounted(async () => {
    const totalItemsPromise = fetchCountIdtProbeItems(props.status);
    const idtProbeItemsPromise = fetchIdtProbeItems(props.status, props.pageSize, currentPage.value, props.orderParams);
    totalItems.value = await totalItemsPromise;
    idtProbeItems.value = await idtProbeItemsPromise;
});
</script>

<style scoped>
.table {
  table-layout: fixed;
}
</style>