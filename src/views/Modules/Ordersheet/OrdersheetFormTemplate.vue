<script lang="ts">
export default {};
</script>
<template v-if="isLoading">
    <el-form label-position="top" label-width="100px" ref="applicationForm">
        <div style="display: flex;">
            <div style="min-width: 200px;">
                <el-row :gutter="20" style="margin-bottom: 20px;">
                    <el-col :span="24">
                        <el-card style="min-height: 600px; position:fixed">
                            <div style="height: 400px;">
                                <div class="folder-tree-container">
                                    <div>
                                        {{ formData.model_name }} - {{ formData.assy_purpose_level }}
                                        -{{ formData.sheet_id }}
                                    </div>

                                    <div v-for="(item, index) in levels" :key="index" class="folder-item">
                                        <div class="level-item" @click="clickLevel(item)">
                                            <div class="folder-icon">▶</div>
                                            <div class="item-name">{{ item }}</div>
                                        </div>

                                        <div v-if="item === selectLevel" class="sheets-list">
                                            <div v-for="(sheetItem, sheetIndex) in sheetsList" :key="sheetIndex"
                                                class="sheet-item">
                                                <div style="display: flex;"
                                                    :style="{ 'font-weight': sheetItem.sheet_id === formData.sheet_id ? 'bold' : '' }"
                                                    @click="moveAnotherPage(sheetItem)">
                                                    <div class="sheet-icon">📄</div>
                                                    <div class="item-name">{{ sheetItem.sheet_name }}</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!-- <div style="border-bottom: 1px solid black; margin-bottom: 10px;" /> -->
                            <!-- 
                            <div>
                                <div :style="{
                                    marginBottom: '10px',
                                    fontWeight: 'bold',
                                    color: viewSelect === 0 ? '#409EFF' : '#666',
                                    cursor: 'pointer'
                                }" @click=" changeView(0)">ALL VIEW</div>
                                <div :style="{
                                    marginBottom: '10px',
                                    fontWeight: 'bold',
                                    color: viewSelect !== 0 ? '#409EFF' : '#666'
                                }">STEP VIEW</div>
                                <div :style="{ marginBottom: '10px', color: viewSelect === 1 ? '#409EFF' : '#666', fontSize: '12px', cursor: 'pointer' }"
                                    @click="changeView(1)">
                                    STEP 1 - Default Info
                                </div>
                                <div :style="{ marginBottom: '10px', color: viewSelect === 2 ? '#409EFF' : '#666', fontSize: '12px', cursor: 'pointer' }"
                                    @click="changeView(2)">
                                    STEP 2 - SMT Info</div>
                                <div :style="{ marginBottom: '10px', color: viewSelect === 3 ? '#409EFF' : '#666', fontSize: '12px', cursor: 'pointer' }"
                                    @click="changeView(3)">
                                    STEP 3 - Ass'y Process
                                </div>

                            </div> -->

                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <!-- <div class="container" v-if="!loading"> -->

            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="24">
                    <el-card>
                        <div style="text-align: center; font-size: 26px; font-weight: bold;">
                            개발품 Ass'y Order Sheet
                        </div>
                        <!-- <div style="text-align: right;">
                            <button @click="tempSave">
                                <span style="font-size: 14px;">
                                    임시저장
                                </span>
                            </button>
                        </div> -->
                    </el-card>


                    <div v-if="viewSelect === 0">
                        <All v-if="isLoading" :formData="formData" :formDataTemp="formDataTemp" :changeProw="changeProw"
                            :changeSrow="changeSrow" :prow="prow" :srow="srow" :mappingTempM="mappingTempM" />
                    </div>

                    <!-- STEP 모드: 선택된 스텝만 보여줌 -->
                    <div v-else>
                        <Step1 v-if="viewSelect === 1" />
                        <Step2 v-if="viewSelect === 2" />
                        <Step3 v-if="viewSelect === 3" />
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- </div> -->

    </el-form>

</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { getOds, getLevels, getSheetsByLevel } from '../../../utils/orderShiitUtils';
import Step1 from "./Steps/Step1.vue";
import Step2 from "./Steps/Step2.vue";
import Step3 from "./Steps/Step3.vue";
import All from "./Steps/All.vue";
import cloneDeep from 'lodash/cloneDeep';
import type {
    ApplicationData
} from "../../../interface/orderSheetInterface";

import { useRoute, useRouter } from "vue-router";



const formData = reactive<ApplicationData>({
    sheet_id: '',
    model_name: '',
    full_model_name: '',
    metal_mask: '',
    pcb_code: '',
    quantity: '',
    pcb_amount: '',
    assy_purpose_type: '',
    assy_purpose_level: '',
    assy_purpose_submit_yn: '',
    assy_purpose_shipment: '',
    assy_purpose_shipment_etc: '',
    request_requestor: '',
    request_receiver: '',
    request_request_date: '',
    request_date_end: '',
    module_type: '',
    saw_type: '',
    msl_level: '',
    assembly_history: '',
    changed_yn: '',
    history_remark: '',
    requirement_remark: '',
    assembly_type: '',
    heat: '',
    ft: '',
    fa: '',
    taping: '',
    array_x: '',
    array_y: '',
    array_quantinty: '',
    cellsize_l: '',
    cellsize_w: '',
    cellsize_t: '',
    ap_smt_flag: '',
    ap_smt_item: '',
    ap_smt_flux: '',
    ap_smt_solder: '',
    ap_smt_remark: '',
    ap_molding_flag: '',
    ap_molding_item: '',
    ap_molding_description: '',
    ap_molding_remark: '',
    ap_grinding_flag: '',
    ap_grinding_item: '',
    ap_grinding_description: '',
    ap_grinding_remark: '',
    ap_marking_flag: '',
    ap_marking_item: '',
    ap_marking_description: '',
    ap_marking_remark: '',
    ap_dicing_flag: '',
    ap_dicing_item: '',
    ap_dicing_l: '',
    ap_dicing_w: '',
    ap_dicing_t: '',
    ap_dicing_remark: '',
    smt_list: [],
    position_list: [],
    image_List: [],
})

const formDataTemp = reactive<ApplicationData>({
    sheet_id: '',
    model_name: '',
    full_model_name: '',
    metal_mask: '',
    pcb_code: '',
    quantity: '',
    pcb_amount: '',
    assy_purpose_type: '',
    assy_purpose_level: '',
    assy_purpose_submit_yn: '',
    assy_purpose_shipment: '',
    assy_purpose_shipment_etc: '',
    request_requestor: '',
    request_receiver: '',
    request_request_date: '',
    request_date_end: '',
    module_type: '',
    saw_type: '',
    msl_level: '',
    assembly_history: '',
    changed_yn: '',
    history_remark: '',
    requirement_remark: '',
    assembly_type: '',
    heat: '',
    ft: '',
    fa: '',
    taping: '',
    array_x: '',
    array_y: '',
    array_quantinty: '',
    cellsize_l: '',
    cellsize_w: '',
    cellsize_t: '',
    ap_smt_flag: '',
    ap_smt_item: '',
    ap_smt_flux: '',
    ap_smt_solder: '',
    ap_smt_remark: '',
    ap_molding_flag: '',
    ap_molding_item: '',
    ap_molding_description: '',
    ap_molding_remark: '',
    ap_grinding_flag: '',
    ap_grinding_item: '',
    ap_grinding_description: '',
    ap_grinding_remark: '',
    ap_marking_flag: '',
    ap_marking_item: '',
    ap_marking_description: '',
    ap_marking_remark: '',
    ap_dicing_flag: '',
    ap_dicing_item: '',
    ap_dicing_l: '',
    ap_dicing_w: '',
    ap_dicing_t: '',
    ap_dicing_remark: '',
    smt_list: [],
    position_list: [],
    image_List: []
})

const viewSelect = ref(0);
const prow = ref(0);
const srow = ref(0);
const data = ref({})
const levels = ref([])
const sheetsList = ref([])
const isLoading = ref(false)
const selectLevel = ref("")


const router = useRouter();
const route = useRoute();




function changeView(step: number) {
    viewSelect.value = step
}


function changeProw(event, deleteindex) {
    const sheetId = route.params.sheetId as '';
    const num = prow.value
    // console.log("piondex",pindex)
    const pindex = `${formData.position_list.length + 1}`
    if (event === 'u') {
        prow.value = num + 1

        formData.position_list.push({
            position_id: 0,
            sheet_id: sheetId,
            point: `${pindex}`,
            xtop: '',
            ytop: '',
            pindex
        })
    } else {
        if (num > 0) {
            prow.value = num - 1
            const deleteNum = deleteindex + 2
            formDataTemp.position_list[deleteindex].pindex = '-1'
            formData.position_list.splice(deleteNum, 1)
        }
    }
}

function changeSrow(event, deleteindex) {
    const sheetId = route.params.sheetId as '';
    const num = srow.value
    if (event === 'u') {
        srow.value = num + 1

        formData.smt_list.push({
            sheet_id: sheetId,
            sorder: '',
            sref: '',
            sbom: '',
            spn: '',
            svalue: '',
            ssize: '',
            smarker: '',
            sx: '',
            sy: '',
            smt_id: 0
        })

    } else {
        if (num > 0) {
            srow.value = num - 1
            const deleteNum = deleteindex + 2
            formData.smt_list.splice(deleteNum, 1)
        }
    }
}
function tempSave() {

}

function mappingTempM(fq: ApplicationData) {
    const sheetId = route.params.sheetId as '';
    formData.sheet_id = sheetId
    formData.model_name = fq.model_name
    formData.full_model_name = fq.full_model_name
    formData.metal_mask = fq.metal_mask
    formData.pcb_code = fq.pcb_code
    formData.quantity = fq.quantity
    formData.pcb_amount = fq.pcb_amount
    formData.assy_purpose_type = fq.assy_purpose_type
    formData.assy_purpose_level = fq.assy_purpose_level
    formData.assy_purpose_submit_yn = fq.assy_purpose_submit_yn
    formData.assy_purpose_shipment = fq.assy_purpose_shipment
    formData.request_requestor = fq.request_requestor
    formData.request_receiver = fq.request_receiver
    formData.request_request_date = fq.request_request_date
    formData.request_date_end = fq.request_date_end
    formData.module_type = fq.module_type
    formData.saw_type = fq.saw_type
    formData.assembly_history = fq.assembly_history
    formData.changed_yn = fq.changed_yn
    formData.history_remark = fq.history_remark
    formData.requirement_remark = fq.requirement_remark
    formData.assembly_type = fq.assembly_type
    formData.heat = fq.heat
    formData.ft = fq.ft
    formData.fa = fq.fa
    formData.taping = fq.taping
    formData.array_x = fq.array_x
    formData.array_y = fq.array_y
    formData.array_quantinty = fq.array_quantinty
    formData.cellsize_l = fq.cellsize_l
    formData.cellsize_w = fq.cellsize_w
    formData.cellsize_t = fq.cellsize_t
    formData.ap_smt_flag = fq.ap_smt_flag
    formData.ap_smt_item = fq.ap_smt_item
    formData.ap_smt_flux = fq.ap_smt_flux
    formData.ap_smt_solder = fq.ap_smt_solder
    formData.ap_smt_remark = fq.ap_smt_remark
    formData.ap_molding_flag = fq.ap_molding_flag
    formData.ap_molding_item = fq.ap_molding_item
    formData.ap_molding_description = fq.ap_molding_description
    formData.ap_molding_remark = fq.ap_molding_remark
    formData.ap_grinding_flag = fq.ap_grinding_flag
    formData.ap_grinding_item = fq.ap_grinding_item
    formData.ap_grinding_description = fq.ap_grinding_description
    formData.ap_grinding_remark = fq.ap_grinding_remark
    formData.ap_marking_flag = fq.ap_marking_flag
    formData.ap_marking_item = fq.ap_marking_item
    formData.ap_marking_description = fq.ap_marking_description
    formData.ap_marking_remark = fq.ap_marking_remark
    formData.ap_dicing_flag = fq.ap_dicing_flag
    formData.ap_dicing_item = fq.ap_dicing_item
    formData.ap_dicing_l = fq.ap_dicing_l
    formData.ap_dicing_w = fq.ap_dicing_w
    formData.ap_dicing_t = fq.ap_dicing_t
    formData.ap_dicing_remark = fq.ap_dicing_remark
    formData.image_List = fq.image_List
    formData.msl_level = fq.msl_level

    formDataTemp.sheet_id = sheetId
    formDataTemp.model_name = fq.model_name
    formDataTemp.full_model_name = fq.full_model_name
    formDataTemp.metal_mask = fq.metal_mask
    formDataTemp.pcb_code = fq.pcb_code
    formDataTemp.quantity = fq.quantity
    formDataTemp.pcb_amount = fq.pcb_amount
    formDataTemp.assy_purpose_type = fq.assy_purpose_type
    formDataTemp.assy_purpose_level = fq.assy_purpose_level
    formDataTemp.assy_purpose_submit_yn = fq.assy_purpose_submit_yn
    formDataTemp.assy_purpose_shipment = fq.assy_purpose_shipment
    formDataTemp.request_requestor = fq.request_requestor
    formDataTemp.request_receiver = fq.request_receiver
    formDataTemp.request_request_date = fq.request_request_date
    formDataTemp.request_date_end = fq.request_date_end
    formDataTemp.module_type = fq.module_type
    formDataTemp.saw_type = fq.saw_type
    formDataTemp.assembly_history = fq.assembly_history
    formDataTemp.changed_yn = fq.changed_yn
    formDataTemp.history_remark = fq.history_remark
    formDataTemp.requirement_remark = fq.requirement_remark
    formDataTemp.assembly_type = fq.assembly_type
    formDataTemp.heat = fq.heat
    formDataTemp.ft = fq.ft
    formDataTemp.fa = fq.fa
    formDataTemp.taping = fq.taping
    formDataTemp.array_x = fq.array_x
    formDataTemp.array_y = fq.array_y
    formDataTemp.array_quantinty = fq.array_quantinty
    formDataTemp.cellsize_l = fq.cellsize_l
    formDataTemp.cellsize_w = fq.cellsize_w
    formDataTemp.cellsize_t = fq.cellsize_t
    formDataTemp.ap_smt_flag = fq.ap_smt_flag
    formDataTemp.ap_smt_item = fq.ap_smt_item
    formDataTemp.ap_smt_flux = fq.ap_smt_flux
    formDataTemp.ap_smt_solder = fq.ap_smt_solder
    formDataTemp.ap_smt_remark = fq.ap_smt_remark
    formDataTemp.ap_molding_flag = fq.ap_molding_flag
    formDataTemp.ap_molding_item = fq.ap_molding_item
    formDataTemp.ap_molding_description = fq.ap_molding_description
    formDataTemp.ap_molding_remark = fq.ap_molding_remark
    formDataTemp.ap_grinding_flag = fq.ap_grinding_flag
    formDataTemp.ap_grinding_item = fq.ap_grinding_item
    formDataTemp.ap_grinding_description = fq.ap_grinding_description
    formDataTemp.ap_grinding_remark = fq.ap_grinding_remark
    formDataTemp.ap_marking_flag = fq.ap_marking_flag
    formDataTemp.ap_marking_item = fq.ap_marking_item
    formDataTemp.ap_marking_description = fq.ap_marking_description
    formDataTemp.ap_marking_remark = fq.ap_marking_remark
    formDataTemp.ap_dicing_flag = fq.ap_dicing_flag
    formDataTemp.ap_dicing_item = fq.ap_dicing_item
    formDataTemp.ap_dicing_l = fq.ap_dicing_l
    formDataTemp.ap_dicing_w = fq.ap_dicing_w
    formDataTemp.ap_dicing_t = fq.ap_dicing_t
    formDataTemp.ap_dicing_remark = fq.ap_dicing_remark
    formDataTemp.msl_level = fq.msl_level

    const temppositionlist = [...fq.position_list]
    if (temppositionlist.length < 3) {
        const diff = 3 - temppositionlist.length
        for (let i = 0; i < diff; i++) {
            temppositionlist.push({
                position_id: 0,
                sheet_id: sheetId,
                point: '',
                xtop: '',
                ytop: '',
                pindex: `${temppositionlist.length + i + 1}`
            })
        }
    } else {
        prow.value = temppositionlist.length - 3
    }

    const tempsmtlist = [...fq.smt_list]

    if (tempsmtlist.length < 3) {
        const diff = 3 - tempsmtlist.length
        for (let i = 0; i < diff; i++) {
            tempsmtlist.push({
                smt_id: 0,
                sheet_id: sheetId,
                sorder: `${tempsmtlist.length + i + 1}`,
                sref: '',
                sbom: '',
                spn: '',
                svalue: '',
                ssize: '',
                smarker: '',
                sx: '',
                sy: '',
            })
        }
        const k = diff + 3
        srow.value = 4

        // srow.value = diff
    } else {
        srow.value = tempsmtlist.length + 1
    }
    // srow.value = tempsmtlist.length

    formData.smt_list = tempsmtlist
    formDataTemp.smt_list = cloneDeep(formData.smt_list);
    formData.position_list = temppositionlist
    formDataTemp.position_list = cloneDeep(temppositionlist);
}

const moveAnotherPage = (sheet) => {
    console.log(sheet)
    if (sheet.stype == 'sheet') {
        router.push({
            name: "OrderSheetCreate",
            params: { sheetId: sheet.sheet_id },
        });
    } else if (sheet.stype == 'pcb') {
        router.push({
            name: "OrderSheetPcbCreate",
            params: { sheetId: sheet.sheet_id },
        });
    }
    else if (sheet.stype == 'bom') {
        router.push({
            name: "OrderSheetBomCreate",
            params: { sheetId: sheet.sheet_id },
        });
    }
}

const clickLevel = async (item) => {
    if (item !== selectLevel) {
        sheetsList.value = await getSheetsByLevel(formData.model_name, item)
        selectLevel.value = item
    }
}


onMounted(async () => {
    console.log('컴포넌트가 마운트될 때 딱 한 번 실행');
    // API 호출, 초기 로딩 등
    const sheetId = route.params.sheetId as '';
    const sheet = await getOds(sheetId);
    levels.value = await getLevels(sheet.model_name)
    sheetsList.value = await getSheetsByLevel(sheet.model_name, sheet.assy_purpose_level)
    selectLevel.value = sheet.assy_purpose_level

    await mappingTempM(sheet)
    isLoading.value = true
});

</script>

<style scoped>
@import "../../../assets/style/orderSheet.css";
</style>
<style scoped>
/* 전체 컨테이너 스타일 */
.folder-tree-container {
    font-family: Arial, sans-serif;
    padding: 2px;
    background-color: white;
    /* border: 1px solid #ddd; */
    /* border-radius: 5px; */
}

/* 폴더 아이템 스타일 */
.folder-item {
    cursor: pointer;
    margin-bottom: 5px;
    user-select: none;
    /* 텍스트 선택 방지 */
}

/* 레벨 항목 스타일 */
.level-item {
    display: flex;
    align-items: center;
    padding: 5px;
    background-color: #e0e0e0;
    border-radius: 3px;
    transition: background-color 0.2s;
}

.level-item:hover {
    background-color: #d0d0d0;
}

.folder-icon {
    font-size: 14px;
    margin-right: 8px;
    color: #4a90e2;
    /* 아이콘 색상 */
}

/* 시트 리스트 (들여쓰기) */
.sheets-list {
    margin-left: 20px;
    /* 들여쓰기 효과 */
    border-left: 1px dotted #ccc;
    /* 점선으로 계층 구조 표현 */
    padding-left: 10px;
    margin-top: 5px;
}

/* 시트 아이템 스타일 */
.sheet-item {
    display: flex;
    align-items: center;
    padding: 5px;
    background-color: #f9f9f9;
    border-radius: 3px;
    margin-bottom: 3px;
    transition: background-color 0.2s;
}

.sheet-item:hover {
    background-color: #f0f0f0;
}

.sheet-icon {
    font-size: 14px;
    margin-right: 8px;
    color: #ff9800;
    /* 아이콘 색상 */
}

.item-name {
    font-size: 14px;
    color: #333;
}
</style>

<!-- 
9.4
3.7
2.4
2.4
4
3.4
2.4
2.4
2.4
3.9
2.4
2.4
2.4
2.4
2.4
2.9
2.4
2.9
2.4
2.9
2.4
2.9
2.4
2.4
2.4
2.4
2.4
2.4
2.4
2.4
3.4
2.9
2.9
2.4
2.4
2.4
2.4
2.4



<col style = "width :8.74%;"/>
<col style = "width :3.44%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :3.72%;"/>
<col style = "width :3.16%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :3.62%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.7%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.7%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.7%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.7%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :3.16%;"/>
<col style = "width :2.7%;"/>
<col style = "width :2.7%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>
<col style = "width :2.23%;"/>


-->