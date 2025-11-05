<template>
    <div class="container">
        <ListOfIdtProbeWafer :page-size="15" status="completed" :order-params="orderParams" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ListOfIdtProbeWafer from './ListOfIdtProbeWafer/ListOfIdtProbeWafer.vue';
import { ValidItdtProbeWaferOrderParams } from './ListOfIdtProbeWafer/ListOfIdtProbeWafer';

const orderParams = ref<ValidItdtProbeWaferOrderParams>({
    orderBy: 'completed_date',
    direction: 'desc'
});
</script>