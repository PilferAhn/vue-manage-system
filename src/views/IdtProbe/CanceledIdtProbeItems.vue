<template>
    <div class="container">
        <ListOfIdtProbeItem :page-size="15" status="canceled" :order-params="orderParams" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ListOfIdtProbeItem from './ListOfIdtProbeItem/ListOfIdtProbeItem.vue';
import { ValidItdtProbeItemOrderParams } from './ListOfIdtProbeItem/ListOfIdtProbeItem';

const orderParams = ref<ValidItdtProbeItemOrderParams>({
    orderBy: ['received_date'],
    direction: 'asc'
});
</script>