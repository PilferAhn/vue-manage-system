<template>
    <div class="modal-overlay">
        <div class="modal">
            <!-- <div style="display: flex;
            max-width: 1200px;
            margin: 0 auto;">
                <div v-html="htmlContent">
                </div>
            </div> -->

            <iframe src="http://10.20.10.128/sapmaterialsetup.html" width="100%" height="1800px" frameborder="0">

            </iframe>
            <button @click="$emit('close')">닫기</button>
        </div>
    </div>
</template>


<script setup lang="ts">
import htmlFile from '../../../../assets/sapmaterialsetup.html?raw'

// value settings
/**
 * refs  - PCB / IC
 * value  - SWITHCH / LNA
 * pn 
 * maker
 * level
 * moq
 * pp
 * 
 */

// props / emits
const props = defineProps<{ items: any[] }>()
const emit = defineEmits<{
    (e: 'select', item: any): void
    (e: 'close'): void
}>()

function selectItem(item: any) {
    emit('select', item)
    emit('close')
}

// v-html에 넣을 내용
const htmlContent = htmlFile
</script>
<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 1200px;
    width: 1400px;
    max-height: 500px;
    overflow-y: auto;
}


.modal-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
}

.modal-item:hover {
    background-color: #f0f0f0;
}

.ccell {
    line-height: 36px;
    /* background-color: #ffff99; */
    word-break: break-word;
    white-space: normal;
    text-align: center !important;
}

.custom-top-table {
    width: 100%;
    border: 1px solid black;
    border-collapse: collapse;
    font-family: Arial, 'Malgun Gothic', sans-serif;

    font-size: 13px;
    /* font-weight: bold; */
    table-layout: fixed;
}
</style>
