<template>
    <div class="modal-overlay">
        <div class="modal">
            <h3>BOM LIST</h3>
            <table class="custom-top-table">
                <colgroup>
                    <col style="width :12%;" />
                    <col style="width :20%;" />
                    <col style="width :5%;" />
                    <col style="width :15%;" />
                    <col style="width :33%;" />
                    <col style="width :5%;" />
                    <col style="width :5%;" />
                </colgroup>
                <tr>
                    <td class="hcell">
                        MATNR(40)
                    </td>
                    <td class="hcell">
                        MAKTX
                    </td>
                    <td class="hcell">
                        BOM Item Number
                    </td>
                    <td class="hcell">
                        BOM component

                    </td>
                    <td class="hcell">
                        내역

                    </td>
                    <td class="hcell">
                        MENGE(13)

                    </td>
                    <td class="hcell">
                        MEINS(3)
                    </td>
                </tr>
                <tr v-for="(item, i) in props.bomList" :key="i">
                    <td style="text-align: left;">{{ item.material_numbering }}</td>
                    <td style="text-align: left;">{{ item.desc }}</td>
                    <td>{{ item.bom_item_number }}</td>
                    <td style="text-align: left;">{{ item.bom_component }}</td>
                    <td style="text-align: left;">{{ item.maktx }}</td>
                    <td style="text-align: right;">{{ item.comoponent_quantity }}</td>
                    <td>{{ item.unit }}</td>
                </tr>
            </table>


            <button @click="$emit('close')">닫기</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props =
    defineProps<{
        bomList: any[];
    }>();
const emit = defineEmits(['close']);
console.log("🚀 bomList props:", props.bomList);
function closeModal() {
    emit('close'); // 부모로 "close" 이벤트 발행
} 
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

.custom-top-table td {
    word-break: break-all;
    /* 긴 단어 강제로 끊기 */
    white-space: normal;
    /* 줄바꿈 허용 */
}
</style>

<style scoped>
@import "../../../../assets/style/orderSheet.css";
</style>