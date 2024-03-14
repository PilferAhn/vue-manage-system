<template>
    <reserved-application-list :status="'reserved'"></reserved-application-list>
    <reserved-application-list :status="'finished'"></reserved-application-list>
</template>

<script lang="ts" setup>
import ReservedApplicationList from './ReservedApplicationList.vue'
</script> 
