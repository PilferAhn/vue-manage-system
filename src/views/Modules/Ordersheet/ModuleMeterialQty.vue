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
                            모듈 Size 기준 원자재 소요량
                            <!-- 아쎄이 오다 씻 -->
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-card>
                        <table class="custom-top-table">
                            <tr>
                                <td class="hcell">
                                    기종명
                                </td>
                                <td class="hcell">
                                    Size
                                </td>
                                <td class="hcell">
                                    두께
                                </td>
                                <td class="hcell">
                                    Base Qty
                                </td>
                            </tr>
                            <tr v-for="(item, index) in moduleSize" :key="index">
                                <td>
                                    {{ item.mname }}
                                </td>
                                <td>
                                    {{ item.msize }}
                                </td>
                                <td>
                                    {{ item.mthickness }}
                                </td>
                                <td>
                                    {{ item.mbaseqty }}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    기종명
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSize.mname" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Size
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSize.msize" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Thickness
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSize.mthickness" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Base Qty
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSize.mbaseqty" />
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <button class="btn-register" style="width: 100%;font-weight: bold;"
                                        @click="handleSizeAddButton">ADD</button>
                                </td>
                            </tr>
                        </table>

                    </el-card>
                </el-col>
                <el-col :span="14">
                    <el-card>
                        FILM 기준 ( 예를 들어 Model 기존 별)---> BDMP 현재 기준
                        <table class="custom-top-table">
                            <tr>
                                <td class="hcell">
                                    Model
                                </td>
                                <td class="hcell">
                                    Size
                                </td>
                                <td class="hcell">
                                    Thickness
                                </td>
                                <td class="hcell">
                                    FILM
                                </td>
                                <td class="hcell">
                                    EA/PCB
                                </td>
                                <td class="hcell">
                                    Bad Cell
                                </td>
                                <td class="hcell">
                                    소요량
                                </td>
                                <td class="hcell">
                                    BOM 요청
                                </td>
                                <td class="hcell">
                                    SAP
                                </td>
                            </tr>
                            <tr v-for="(item, index) in moduleBdmp" :key="index">
                                <td>
                                    {{ item.mname }}
                                </td>
                                <td>
                                    {{ item.msize }}
                                </td>
                                <td>
                                    {{ item.mthickness }}
                                </td>
                                <td>
                                    {{ item.mfilm }}
                                </td>

                                <td>
                                    {{ item.meapcb }}
                                </td>
                                <td>
                                    {{ item.mbadcell }}
                                </td>
                                <td>
                                    {{ item.mqty }}
                                </td>
                                <td>
                                    {{ item.mbomrequest }}
                                </td>
                                <td style="line-height: 1.2;">
                                    {{ item.msap }}
                                </td>
                            </tr>
                        </table>
                    </el-card>
                    <el-card>
                        EPOXY 기준/ MOLD 있음 (FILM 없음) ( 예를 들어 Model 기존 별)---> WLP,SCSP
                        <table class="custom-top-table">
                            <tr>
                                <td class="hcell">
                                    Model
                                </td>
                                <td class="hcell">
                                    Size
                                </td>
                                <td class="hcell">
                                    Thickness
                                </td>
                                <td class="hcell">
                                    1 TIP
                                </td>
                                <td class="hcell">
                                    PCB
                                </td>

                                <td class="hcell">
                                    EA/PCB
                                </td>
                                <td class="hcell">
                                    Bad Cell
                                </td>
                                <td class="hcell">
                                    소요량
                                </td>
                                <td class="hcell">
                                    BOM 요청
                                </td>
                            </tr>

                            <tr v-for="(item, index) in moduleWlp" :key="index">
                                <td>
                                    {{ item.mname }}
                                </td>
                                <td>
                                    {{ item.msize }}
                                </td>
                                <td>
                                    {{ item.mthickness }}
                                </td>
                                <td>
                                    {{ item.mtip }}
                                </td>
                                <td>
                                    {{ item.mpcb }}
                                </td>
                                <td>
                                    {{ item.meapcb }}
                                </td>
                                <td>
                                    {{ item.mbadcell }}
                                </td>
                                <td>
                                    {{ item.mqty }}
                                </td>
                                <td>
                                    {{ item.mbomrequest }}
                                </td>

                            </tr>
                        </table>
                    </el-card>
                    <el-card>
                        <table class="custom-top-table">
                            <tr>
                                <td class="hcell">
                                    Model
                                </td>
                                <td class="hcell">
                                    Size
                                </td>
                                <td class="hcell">
                                    Thickness
                                </td>
                                <td class="hcell">
                                    1 TIP
                                </td>
                                <td class="hcell">
                                    PCB
                                </td>

                                <td class="hcell">
                                    EA/PCB
                                </td>
                                <td class="hcell">
                                    Bad Cell
                                </td>
                                <td class="hcell">
                                    소요량
                                </td>
                                <td class="hcell">
                                    BOM 요청
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Model
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.mname" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    SAW TYPE
                                </td>
                                <td colspan="8">
                                    <select style="width:100%" v-model="addMeterial.saw_type">
                                        <option value="BDMP">BDMP</option>
                                        <option value="wlp">SCSP/WLP</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Size
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.msize" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Thickness
                                </td>
                                <input style="width:100%" v-model="addMeterial.mthickness"
                                    @input="addMeterial.mthickness = normalizeInput($event.target.value)" />
                            </tr>
                            <tr>
                                <td>
                                    FILM
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.mfilm" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    1TIP
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.mtip" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    PCB
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.mpcb" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    EA/PCB
                                </td>

                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.meapcb" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Bad Cell
                                </td>

                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.mbadcell" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    소요량
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.mqty" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    BOM 요청
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.mbomrequest" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    SAP
                                </td>
                                <td colspan="8">
                                    <input style="width:100%" v-model="addMeterial.msap" />
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9">
                                    <button class="btn-register" style="width: 100%;font-weight: bold;"
                                        @click="handleMeterialAddButton">ADD</button>
                                </td>
                            </tr>
                        </table>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-card>
                        <table class="custom-top-table">
                            <tr>
                                <td class="hcell">
                                    Model
                                </td>
                                <td class="hcell">
                                    Cover
                                </td>
                                <td class="hcell">
                                    CARRIER
                                </td>
                                <td class="hcell">
                                    Solder
                                </td>
                            </tr>

                            <tr v-for="(item, index) in moduleSolder" :key="index">
                                <td>
                                    {{ item.msize }}
                                </td>
                                <td>
                                    {{ item.mcover }}
                                </td>
                                <td>
                                    {{ item.mcarrier }}
                                </td>
                                <td>
                                    {{ item.msolder }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Model
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSolder.msize" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Cover
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSolder.mcover" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    CARRIER
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSolder.mcarrier" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Solder
                                </td>
                                <td colspan="3">
                                    <input style="width:100%" v-model="addSolder.msolder" />
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <button class="btn-register" style="width: 100%;font-weight: bold;"
                                        @click="handleSolderAddButton">ADD</button>
                                </td>
                            </tr>
                        </table>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </el-form>

</template>


<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick, reactive, Ref } from "vue";
import { getMMQ, postModuleSize, postModuleSolder, postModuleMeterial } from '../../../utils/orderShiitUtils';
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { all } from "axios";

const isLoading = ref(false)
const moduleBdmp = ref([]);
const moduleSize = ref([]);
const moduleWlp = ref([]);
const moduleSolder = ref([]);

const addSize = ref({
    mname: '',
    msize: '',
    mthickness: '',
    mbaseqty: ''
})
const addSolder = ref({
    msize: '',
    mcover: '',
    mcarrier: '',
    msolder: ''
})
const addMeterial = ref({
    saw_type: '',
    mname: '',
    msize: '',
    mthickness: '',
    mtip: '',
    mfilm: '',
    mpcb: '',
    meapcb: '',
    mbadcell: '',
    mqty: '',
    mbomrequest: '',
    msap: ''

})


const handleSizeAddButton = async () => {
    const alllist = await postModuleSize(addSize.value)
    if (alllist) {
        moduleSize.value = alllist.size
        moduleSolder.value = alllist.solder
        isLoading.value = true
        moduleBdmp.value = alllist.meterial.filter(item => item.saw_type === 'BDMP')
        moduleWlp.value = alllist.meterial.filter(item => item.saw_type === 'wlp')
    }
    addSize.value = {
        mname: '',
        msize: '',
        mthickness: '',
        mbaseqty: ''
    }
}
const handleSolderAddButton = async () => {
    const alllist = await postModuleSolder(addSolder.value)
    if (alllist) {
        moduleSize.value = alllist.size
        moduleSolder.value = alllist.solder
        isLoading.value = true
        moduleBdmp.value = alllist.meterial.filter(item => item.saw_type === 'BDMP')
        moduleWlp.value = alllist.meterial.filter(item => item.saw_type === 'wlp')
    }
    addSolder.value = {
        msize: '',
        mcover: '',
        mcarrier: '',
        msolder: ''
    }
}
const handleMeterialAddButton = async () => {
    const alllist = await postModuleMeterial(addMeterial.value)
    if (alllist) {
        moduleSize.value = alllist.size
        moduleSolder.value = alllist.solder
        isLoading.value = true
        moduleBdmp.value = alllist.meterial.filter(item => item.saw_type === 'BDMP')
        moduleWlp.value = alllist.meterial.filter(item => item.saw_type === 'wlp')
    }
    addMeterial.value = {
        saw_type: '',
        mname: '',
        msize: '',
        mthickness: '',
        mtip: '',
        mfilm: '',
        mpcb: '',
        meapcb: '',
        mbadcell: '',
        mqty: '',
        mbomrequest: '',
        msap: ''
    }
}
function normalizeInput(val: string): string {
    if (!val) return val;
    return val
        .normalize("NFKC")         // 유니코드 표준 정규화
        .replace(/\u00A0/g, " ")   // NBSP → 일반 스페이스
        .replace(/\s+/g, " ")      // 여러 공백 → 하나
        .trim();
}

onMounted(async () => {
    const alllist = await getMMQ()
    if (alllist) {
        moduleSize.value = alllist.size
        moduleSolder.value = alllist.solder
        isLoading.value = true
        moduleBdmp.value = alllist.meterial.filter(item => item.saw_type === 'BDMP')
        moduleWlp.value = alllist.meterial.filter(item => item.saw_type === 'wlp')
    }
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