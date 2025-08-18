<template>
    <div class="overlay"></div>
    <div class="modal">
        <!-- 모달 내용 넣기 -->


        <div @click="handleCloseModalSu">

            xxxxxxxxxxxxx
        </div>

        <div style="display: flex; width: 100%;">
            <div style="width: 310px;">
                FROM :
                <el-select v-model="value" value-key="id" placeholder="Select" style="width: 240px">
                    <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item" />
                </el-select>
            </div>
            <div style="width: 310px;">
                TO :
                <el-select v-model="value" value-key="id" placeholder="Select" style="width: 240px">
                    <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item" />
                </el-select>
            </div>
        </div>
        <div>
            로딩 바
        </div>
    </div>
</template>

<script lang="ts" setup>
// 스크립트 로직이 따로 없다면 setup 내부에 특별히 수정할 내용은 없습니다.
import { ref, Ref } from "vue";

const props = defineProps<{
    handleCloseModalSu: () => void
    levelsList: Ref<string[]>
}>()


type Option = {
    id: number
    label: string
    desc: string
}
const value = ref<Option>()
const options = ref([
    { id: 1, label: 'Option A', desc: 'Option A - 230506' },
    { id: 2, label: 'Option B', desc: 'Option B - 230506' },
    { id: 3, label: 'Option C', desc: 'Option C - 230506' },
    { id: 4, label: 'Option A', desc: 'Option A - 230507' },
])
const copyValue = ref("");
const pasteValue = ref("");

console.log(props.levelsList)


</script>

<style scoped>
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    height: 200px;
    width: 620px;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.modal-td {
    border: 2px solid #dcdcdc;
    padding: 10px;
    text-align: center;
    background-color: #f2f2f2;
    font-weight: bold;
    width: 25%;
    font-size: 15px;
}
</style>