<template>
    <div class="modal-overlay" @keyup.esc="$emit('close')" tabindex="0" ref="modalContainer">
        <div class="modal">
            <h3>기준 SHEET 선택</h3>
            <table class="custom-top-table">
                <tr v-for="(item, i) in items" :key="i" @click="selectItem(item)" class="modal-item ">
                    <td class="ccell">
                        {{ item.sheet_name }}
                    </td>

                </tr>
            </table>


            <button @click="$emit('close')">닫기</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
defineProps<{
    items: any[];
}>();
const emit = defineEmits(['select', 'close']);

function selectItem(item: any) {
    emit('select', item);
    emit('close');
}

const modalContainer = ref(null);

onMounted(() => {
    // 모달이 화면에 나타난 후 포커스를 줍니다.
    modalContainer.value.focus();
});


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
    width: 1000px;
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
