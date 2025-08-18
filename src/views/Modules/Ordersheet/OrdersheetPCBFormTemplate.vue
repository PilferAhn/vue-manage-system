<script lang="ts">
export default {};
</script>
<template v-if="isLoading">
    <el-form label-position="top" label-width="100px" ref="applicationForm">
        <div style="display: flex;">

            <!-- <div class="container" v-if="!loading"> -->

            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="24">
                    <el-card>
                        <div style="text-align: center; font-size: 26px; font-weight: bold;">
                            개발품 PCB Capture
                        </div>
                        <div style="text-align: right;">

                        </div>
                    </el-card>
                    <el-row>
                        <el-col :span="2">
                            <div style="
      background-color: white;
      color: black;
      /* font-family: 'Courier New', monospace; */
      border: 4px solid white;
      border-radius: 65px;
      padding: 6px 10px;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.4;
      cursor: pointer;
      white-space: pre-wrap;
    " @click="saveChildren">
                                SAVE
                            </div>
                        </el-col>
                    </el-row>
                    <el-card>
                        <table class="custom-top-table">
                            <!-- HEADER TABLE -->
                            <colgroup>
                                <col style="width :10%;" />
                                <col style="width :10%;" />
                                <col style="width :6%;" />
                                <col style="width :2%;" />
                                <col style="width :8%;" />
                                <col style="width :8%;" />
                                <col style="width :10%;" />
                                <col style="width :8%;" />
                                <col style="width :8%;" />
                                <col style="width :25%;" />
                            </colgroup>
                            <tbody>
                                <!-- # 1 Row -->
                                <tr>
                                    <td class="hcell" colspan="2">
                                        Array 구분 여부
                                    </td>
                                    <td colspan="8" contenteditable="true"
                                        @input="e => formDataTemp.array_flag = (e.target as HTMLElement).innerText">
                                        {{ formData.array_flag }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ccell" colspan="2" :rowspan="prow" @click="changeProw('u', 0)"
                                        style="cursor: pointer;">
                                        Array 영역 <br />
                                        (X,Y,수량)
                                    </td>
                                    <td class="hcell" colspan="2">
                                        Array No.
                                    </td>
                                    <td class="hcell">
                                        X
                                    </td>
                                    <td class="hcell">
                                        Y
                                    </td>
                                    <td class="hcell">
                                        Quantity
                                    </td>
                                    <td class="hcell">
                                        열 No.
                                    </td>
                                    <td class="hcell">
                                        행 No.
                                    </td>
                                    <td class="hcell">
                                        비고
                                    </td>
                                </tr>
                                <tr v-for="(pcb, index) in formDataTemp.pcb_list" :key="index">
                                    <td contenteditable="true"
                                        @input="e => formDataTemp.pcb_list[index].array_no = (e.target as HTMLElement).innerText">
                                        {{ pcb.array_no }}
                                    </td>
                                    <td style="background-color: #f2f2f2;" @click="changeProw('d', index)">
                                        ㅡ
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => formDataTemp.pcb_list[index].px = (e.target as HTMLElement).innerText">
                                        {{ pcb.px }}
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => formDataTemp.pcb_list[index].py = (e.target as HTMLElement).innerText">
                                        {{ pcb.py }}
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => formDataTemp.pcb_list[index].quantity = (e.target as HTMLElement).innerText">
                                        {{ pcb.quantity }}
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => formDataTemp.pcb_list[index].colno = (e.target as HTMLElement).innerText">
                                        {{ pcb.colno }}
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => formDataTemp.pcb_list[index].rowno = (e.target as HTMLElement).innerText">
                                        {{ pcb.rowno }}
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => formDataTemp.pcb_list[index].remark = (e.target as HTMLElement).innerText">
                                        {{ pcb.remark }}
                                    </td>


                                </tr>
                                <tr>
                                    <td class="hcell" colspan="2">
                                        주의 사항
                                    </td>
                                    <td colspan="8" contenteditable="true"
                                        @input="e => formDataTemp.remark = (e.target as HTMLElement).innerText">
                                        {{ formData.remark }}

                                    </td>
                                </tr>
                                <tr>
                                    <td class="hcell" colspan="2">
                                        비고
                                    </td>
                                    <td colspan="8" contenteditable="true"
                                        @input="e => formDataTemp.note = (e.target as HTMLElement).innerText">
                                        {{ formData.note }}
                                    </td>
                                </tr>
                            </tbody>

                        </table>


                    </el-card>
                    <el-card>
                        <div style="text-align: center; font-size: 26px; font-weight: bold;">
                            PCB Images
                        </div>
                        <div class="drop-zone" @click="triggerFileSelect('fileInputPCB')" @drop.prevent="onDropPCB"
                            style="min-height: 300px;" @dragover.prevent>
                            <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                            <div v-for="(img, index) in existingPCB" :key="'existing-' + index"
                                style="position: relative; display: inline-block; margin: 10px;">
                                <img :src="img.url" style="max-width:1000px;" />

                                <button @click.stop="removeExistingImagePCB(index)"
                                    style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                    ❌
                                </button>
                            </div>
                            <div v-for="(file, index) in imagesetPCB" :key="index"
                                style="position: relative; display: inline-block; margin: 10px;">
                                <img :src="getObjectURL(file)" alt="업로드된 이미지"
                                    style="max-width: 1000px; max-height: 800px;" />
                                <button @click.stop="removeImagePCB(index)"
                                    style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                    ❌
                                </button>
                            </div>
                            <input ref="fileInputPCB" type="file" accept="image/*" style="display:none"
                                @change="handleFilesChangePCB" multiple />
                        </div>

                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- </div> -->

    </el-form>

</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick, reactive, Ref } from "vue";
import { getCodeWpms, getPcbSheet, savePcb } from '../../../utils/orderShiitUtils';
import { el } from "element-plus/es/locale";


import type {
    PcbInterface, PcbList
} from "../../../interface/orderSheetInterface";

import { useRoute, useRouter } from "vue-router";
import ModelName from "../../TegPage/Application/ModelName.vue";




const fileInputPCB = ref<HTMLInputElement | null>(null);

const existingPCB = ref<{ url: string; file_index: string; cell_name: string }[]>([]);

const deleteImage = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const imagesetPCB = ref<File[]>([]);
const isLoading = ref(false)
const route = useRoute();
const prow = ref(1);
const delList = ref<PcbList[]>([])  // 빈 배열로 초기화


const formData = reactive<PcbInterface>({
    sheet_id: '',
    array_flag: '',
    remark: '',
    note: '',
    pcb_list: [],
    image_List: []
})
const formDataTemp = reactive<PcbInterface>({
    sheet_id: '',
    array_flag: '',
    remark: '',
    note: '',
    pcb_list: [],
    image_List: []
})
function changeProw(event: 'u' | 'd', deleteindex?: number) {
    const sheetId = route.params.sheetId as string
    const num = prow.value

    if (event === 'u') {
        prow.value = num + 1
        formData.pcb_list.push({
            pcb_id: 0,
            sheet_id: sheetId,
            array_no: '',
            px: '',
            py: '',
            quantity: '',
            colno: '',
            rowno: '',
            remark: '',
            status: 'a'
        })
        formDataTemp.pcb_list.push({
            pcb_id: 0,
            sheet_id: sheetId,
            array_no: '',
            px: '',
            py: '',
            quantity: '',
            colno: '',
            rowno: '',
            remark: '',
            status: 'a',
        })
    } else {
        if (
            num > 0 &&
            deleteindex !== undefined &&
            deleteindex >= 0 &&
            deleteindex < formData.pcb_list.length
        ) {
            prow.value = num - 1

            const target = formData.pcb_list[deleteindex]
            if (target?.pcb_id !== 0) {
                delList.value.push({
                    ...target,
                    px: '',
                    status: 'd'
                })
            }

            formData.pcb_list.splice(deleteindex, 1)
            formDataTemp.pcb_list.splice(deleteindex, 1)
            console.log(formDataTemp)
        }
    }
}

function triggerFileSelect(target: 'fileInputPCB') {
    console.log('triggerFileSelect 실행됨', fileInputPCB.value);
    if (target === 'fileInputPCB') fileInputPCB.value?.click();

}

function onDropPCB(event: DragEvent) {
    const files = event.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {

            imagesetPCB.value.push(file);

        } else {
            alert("이미지 파일만 업로드할 수 있습니다.");
        }
    }
}


function removeExistingImagePCB(index: number) {
    const target = existingPCB.value[index];
    if (target) {
        deleteImage.value.push(target);
        existingPCB.value.splice(index, 1);
    }
}

function removeImagePCB(index: number) {
    imagesetPCB.value.splice(index, 1);
}

function handleFilesChangePCB(e: Event) {
    onFilesChange(e, imagesetPCB);
}
function onFilesChange(event: Event, imageset: Ref<File[]>) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!imageset) {
        console.error('imageset이 undefined입니다!');
        return;
    }

    if (files) {
        for (const file of Array.from(files)) {
            if (file.type.startsWith('image/')) {
                imageset.value.push(file); // 🔥 여기서 진짜 파일을 저장해야 함
            }
        }
    }
}

function getObjectURL(file: File): string {
    return URL.createObjectURL(file)
}


function mappingTemp(fq: PcbInterface) {
    const sheetId = route.params.sheetId as '';
    formData.sheet_id = sheetId
    formData.array_flag = fq.array_flag
    formData.remark = fq.remark
    formData.note = fq.note
    formData.image_List = fq.image_List

    formDataTemp.sheet_id = sheetId
    formDataTemp.array_flag = fq.array_flag
    formDataTemp.remark = fq.remark
    formDataTemp.note = fq.note

    formDataTemp.image_List = fq.image_List
    if (fq.pcb_list.length > 0) {
        prow.value = fq.pcb_list.length + 1
    }
    formData.pcb_list = fq.pcb_list.map(item => ({
        ...item,
        status: 'u'
    }))

    formDataTemp.pcb_list = fq.pcb_list.map(item => ({
        ...item,
        status: 'u'
    }))
    if (formData.image_List && formData.image_List.length > 0) {
        formData.image_List.forEach((item) => {
            if (item.cell_name === 'PCB') {
                existingPCB.value.push(item);
            }
        });
    }

    console.log(formData)
}

function mappingData() {
    formData.array_flag = formDataTemp.array_flag
    formData.remark = formDataTemp.remark
    formData.note = formDataTemp.note
    const pcb = [...formDataTemp.pcb_list, ...delList.value]
    console.log(pcb)
    formData.pcb_list = pcb
}

async function saveChildren() {
    await mappingData()
    const result = savePcb(formData, imagesetPCB.value, deleteImage.value);

}

onMounted(async () => {
    // API getPCB CAp
    const sheetId = route.params.sheetId as string
    const result = await getPcbSheet(sheetId)
    console.log(result);
    if (!result) {
        isLoading.value = false
        return
    }
    // Mapping 
    await mappingTemp(result)
    // list 초기화
    isLoading.value = true

});

</script>

<style scoped>
@import "../../../assets/style/orderSheet.css";
</style>