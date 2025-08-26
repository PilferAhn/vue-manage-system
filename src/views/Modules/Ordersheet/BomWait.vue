<script lang="ts">
export default {};
</script>
<template>
    <el-form label-position="top" label-width="100px" ref="applicationForm">
        <div class="container" v-if="isLoading">

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-card>
                        <div style="text-align: center; font-size: 26px; font-weight: bold;">
                            BOM 등록 대기
                            <!-- 아쎄이 오다 씻 -->
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-card>
                        <table class="custom-top-table">
                            <tr>

                                <td class="hcell">
                                    모델명
                                </td>
                                <td class="hcell">
                                    레벨
                                </td>
                                <td class="hcell">
                                    요청 일자
                                </td>
                                <td class="hcell">
                                    요청자
                                </td>
                                <td class="hcell">
                                    확정 여부
                                </td>
                                <td class="hcell">
                                    보기
                                </td>
                                <td class="hcell">
                                    등록
                                </td>
                                <td class="hcell">
                                    삭제
                                </td>

                            </tr>
                            <tr v-for="(item, index) in moduleBomTable" :key="index">
                                <td>
                                    {{ item.model_code }}
                                </td>
                                <td>
                                    {{ item.level }}
                                </td>
                                <td>
                                    {{ item.rdate }}
                                </td>

                                <td>
                                    {{ item.ruser }}
                                </td>
                                <td>
                                    <button v-if="!item.comfirmyn" @click="handleClickConfirm(item.wtid)">확정하기</button>
                                    <span v-else>{{ item.comfirmyn }}</span>
                                </td>
                                <td>
                                    <button @click="handleClickShow(item.wtid)">
                                        보기
                                    </button>
                                </td>


                                <td>
                                    <button v-if="item.comfirmyn && item.status === '미등록'"
                                        @click="postBom(item.wtid)">등록</button>
                                    <!-- <span v-else>{{ item.confirmyn }}</span> -->
                                </td>
                                <td>
                                    <button v-if="item.status !== '등록'" @click="deleteBom(item.wtid)">삭제</button>
                                    <!-- <span v-else>{{ item.confirmyn }}</span> -->
                                </td>
                            </tr>

                        </table>

                    </el-card>
                </el-col>

            </el-row>
        </div>
    </el-form>
    <BomViewModal v-if="showModal" :bomList="bomList" @close="showModal = false" />

</template>


<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick, reactive, Ref } from "vue";
import BomViewModal from "./components/BomViewModal.vue";
import { getBomWait, getBomWaitById, postConfirm, delBom, SendModuleBoms } from '../../../utils/orderShiitUtils';
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { all } from "axios";


const isLoading = ref(false)
const bomList = ref([]);
const showModal = ref(false);
const moduleBomTable = ref([]);


const handleSizeAddButton = async () => {

}

const handleClickShow = async (wtid: number) => {
    const result = await getBomWaitById(wtid)


    bomList.value = result.map((r: any) => r.ModuleBomWait)

    showModal.value = true
}

const handleClickConfirm = async (wtid: number) => {
    const username = localStorage.getItem("ms_username")
    const result = await postConfirm(wtid, username)
    moduleBomTable.value = result.map((r: any) => r.ModuleBomWaitTable)
}
const postBom = async (wtid: number) => {
    const list = await getBomWaitById(wtid)
    const result = await SendModuleBoms(list, wtid)
    const data = result.map((r: any) => r.ModuleBomWait)
    // moduleBomTable.value = data
}
const deleteBom = async (wtid: number) => {
    const result = await delBom(wtid)
    const data = result.map((r: any) => r.ModuleBomWait)
}




onMounted(async () => {
    const result = await getBomWait()
    moduleBomTable.value = result.map(r => r.ModuleBomWaitTable) // <-- 평탄화
    console.log(moduleBomTable.value)
    isLoading.value = true
    console.log(result)
    isLoading.value = true

})

</script>

<style scoped>
@import "../../../assets/style/orderSheet.css";
</style>


<style scoped>
.btn-register {
    background-color: #007bff;
    /* 기본 파랑 */
    color: #fff;
    /* 글자는 흰색 */
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    /* 모서리 살짝 둥글게 */
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-register:hover {
    background-color: #0056b3;
    /* hover 시 진한 파랑 */
}
</style>