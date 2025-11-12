<template>
    <!-- single root wrapper to avoid Transition warning -->
    <div class="list-of-idt-probe-items">

        <!-- table of wafers -->
        <el-table :data="idtProbeItems" class="table" border @filter-change="handleFilterChange">
            <el-table-column type="index" :index="indexMethod" label="No" width="50" :align="'center'"/>
            <el-table-column prop="lotId" label="Lot ID" width="120" />
            <el-table-column prop="productName" label="Product Name"  />
            <el-table-column prop="priority" label="Priority" width="80" />
            <el-table-column label="Designer">
                <template #default="{ row }">
                    {{ row.designer?.userName ?? '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="probeType" label="Probe Type" :filters="idtProbeTypesFilters" column-key="probeTypes"/>
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
import type { IdtProbeItem, IdtProbeStatus, IdtProbeType } from '../../../interface/idt-probe-interfaces';
import { ValidItdtProbeItemOrderParams, fetchCountIdtProbeItems, fetchIdtProbeItems, FilterIdtProbeItemBy } from './ListOfIdtProbeItem';
import { fetchIdtProbeTypes } from '../../IdtProbe/IdtProbeCommon';

const props = withDefaults(defineProps<{
    pageSize?: number;
    status?: IdtProbeStatus | undefined;
    orderParams?: ValidItdtProbeItemOrderParams;
}>(), {
    pageSize: 10,
    orderParams: () => { return { orderBy: ['received_date'], direction: 'asc' } },
});

type ColumnFilterOption = {
    text: string;
    value: string;
};

const idtProbeItems = ref<IdtProbeItem[]>([]);
const idtProbeTypesFilters = ref<ColumnFilterOption[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);
let filterBy : FilterIdtProbeItemBy = {};

// Items indexed
const indexMethod = (index: number) => {
    return (props.pageSize! * (currentPage.value - 1)) + index + 1;
};

const handlePageChange = async () => {
    const totalItemsPromise = fetchCountIdtProbeItems(props.status, filterBy);
    const idtProbeItemsPromise = fetchIdtProbeItems(props.status, filterBy, props.pageSize, currentPage.value, props.orderParams);
    totalItems.value = await totalItemsPromise;
    console.log('totalItemsPromise:', totalItemsPromise);
    idtProbeItems.value = await idtProbeItemsPromise;
};

const handleFilterChange = async (newFilters: FilterIdtProbeItemBy) => {
    filterBy = newFilters;
    handlePageChange();
};

onMounted(async () => {
    const idtProbeTypesPromise = fetchIdtProbeTypes();

    handlePageChange();
        
    const idtProbeTypes = await idtProbeTypesPromise;
    idtProbeTypesFilters.value = idtProbeTypes.map((type: IdtProbeType) => {
        return {
            text: type.probeType,
            value: type.probeType,
        };
    });
    
});
</script>

<style scoped>
.table {
  table-layout: fixed;
}
</style>