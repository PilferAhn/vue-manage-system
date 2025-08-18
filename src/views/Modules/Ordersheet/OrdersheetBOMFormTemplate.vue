<script lang="ts">
export default {};
</script>
<template>
    <el-form style="" label-position="top" label-width="100px">
        <div style="display: flex;">
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="24">
                    <el-card>
                        <div style="text-align: center; font-size: 26px; font-weight: bold;">
                            개발품 BOM List
                        </div>
                        <div style="text-align: right;">

                        </div>
                    </el-card>
                    <el-row :gutter="20">
                        <el-col :span="20">
                        </el-col>
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
    " @click="postBom">
                                BOM등록
                            </div>
                        </el-col>
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
                    <el-card v-if="isLoading" style="min-height: 600px;">
                        <table class="custom-top-table">
                            <colgroup>
                                <col style="width :2%;" />
                                <col style="width :8%;" />
                                <col style="width :14%;" />
                                <col style="width :20%;" />
                                <col style="width :6%;" />
                                <col style="width :8%;" />
                                <col style="width :6%;" />
                                <col style="width :6%;" />
                                <col style="width :10%;" />
                                <col style="width :10%;" />
                                <col style="width :10%;" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td class="bcell" style="height: 50px;">
                                        No
                                    </td>
                                    <td class="bcell" style="background-color: #ffff00;">
                                        Ref
                                    </td>
                                    <td class="bcell">
                                        SAP Code
                                    </td>
                                    <td class="bcell" style="background-color: #ffff00;">
                                        P/N
                                    </td>
                                    <td class="bcell">
                                        Value
                                    </td>
                                    <td class="bcell" style="background-color: #ffff00;">
                                        Size
                                    </td>
                                    <td class="bcell">
                                        Maker
                                    </td>
                                    <td class="bcell">
                                        신규/양산
                                    </td>
                                    <td class="bcell" style="line-height: 1.2;">
                                        이동평균단가<br />
                                        (화폐단위 :KRW)

                                    </td>
                                    <td class="bcell" style="line-height: 1.2;">
                                        MOQ <br />
                                        (구매최소수량)
                                    </td>
                                    <td class="bcell">
                                        비고
                                    </td>
                                </tr>

                                <tr v-for="(item, index) in bomList" :key="index">
                                    <td>
                                        {{ index + 1 }}. </td>
                                    <td style="padding: 0px;">
                                        <CustomSelect v-model="bomListTemp[index].sref" :options="refs" />
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => bomListTemp[index].sbom = (e.target as HTMLElement).innerText">
                                        {{ item.sbom }}
                                    </td>
                                    <td contenteditable="true" @keydown.enter.prevent="handleEnterKey('default', index)"
                                        @input="e => bomListTemp[index].spn = (e.target as HTMLElement).innerText"> {{
                                            item.spn }} </td>
                                    <td contenteditable="true"
                                        @input="e => bomListTemp[index].svalue = (e.target as HTMLElement).innerText">
                                        {{
                                            item.svalue }} </td>
                                    <td contenteditable="true"
                                        @input="e => bomListTemp[index].ssize = (e.target as HTMLElement).innerText">
                                        {{
                                            item.ssize }} </td>
                                    <!-- <td style="padding: 0px;">
                                        <CustomSelect v-model="bomListTemp[index].smarker" :options="makers" />
                                    </td> -->
                                    <td style="padding: 0px;" v-if="bomListTemp[index].sref === 'IC'">
                                        <CustomSelect v-model="bomListTemp[index].smarker" :options="makers_ics" />
                                    </td>
                                    <td style="padding: 0px;" v-else-if="bomListTemp[index].sref === 'PCB'">
                                        <CustomSelect v-model="bomListTemp[index].smarker" :options="makers_pcb" />
                                    </td>
                                    <td style="padding: 0px;"
                                        v-else-if="bomListTemp[index].sref === 'Inductor' || bomListTemp[index].sref === 'Capacitor' || bomListTemp[index].sref === 'Resistor'">
                                        <CustomSelect v-model="bomListTemp[index].smarker" :options="makers_smd" />
                                    </td>
                                    <td style="padding: 0px;" v-else-if="bomListTemp[index].sref === 'SAW'">
                                        <CustomSelect v-model="bomListTemp[index].smarker" :options="makers_saw" />
                                    </td>
                                    <td style="padding: 0px;" v-else>
                                        <CustomSelect v-model="bomListTemp[index].smarker" :options="markers" />
                                    </td>
                                    <td contenteditable="true"
                                        @input="e => bomListTemp[index].version_check = (e.target as HTMLElement).innerText">
                                        {{
                                            item.version_check }} </td>
                                    <td contenteditable="true"
                                        @input="e => bomListTemp[index].moving_avgp = (e.target as HTMLElement).innerText">
                                        {{
                                            item.moving_avgp }} </td>
                                    <td contenteditable="true"
                                        @input="e => bomListTemp[index].moq = (e.target as HTMLElement).innerText">
                                        {{
                                            item.moq }} </td>
                                    <td contenteditable="true"
                                        @input="e => bomListTemp[index].remark = (e.target as HTMLElement).innerText">
                                        {{ item.remark }} </td>
                                </tr>

                            </tbody>
                        </table>


                    </el-card>

                </el-col>
            </el-row>
        </div>
        <el-card>
            <div style="text-align: center; font-size: 26px; font-weight: bold;">
                원자재 등록
            </div>
            <div style="text-align: right;">

            </div>
        </el-card>
        <el-card>

            <table>
                <colgroup>
                    <col style="width :10%;" />
                    <col style="width :40%;" />
                    <col style="width :40%;" />

                    <col style="width :10%;" />
                </colgroup>
                <tbody>
                    <tr>
                        <td class="bcell">
                            Ref
                        </td>
                        <td class="bcell" style="height: 29px;">
                            SAP CODE
                        </td>
                        <td class="bcell" style="background-color: #ffff00;">
                            P/N
                        </td>

                        <td class="bcell" style="background-color: #ffff00;">
                            등록
                        </td>
                    </tr>
                    <tr v-for="(item, index) in noneBomList" :key="index">
                        <td>
                            {{ item.sref }}
                        </td>
                        <td>
                            {{ item.sbom }}
                        </td>
                        <td>
                            {{ item.spn }}
                        </td>
                        <td>
                            <button @click="addMeterial(index)"> 등록</button>
                        </td>
                    </tr>
                </tbody>



            </table>
        </el-card>

        <!-- </div> -->

    </el-form>
    <BomSelectModal v-if="showBomPopup" :items="bomOptions" @select="onSelectBom" @close="showBomPopup = false" />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick, reactive, Ref } from "vue";
import { getBomList, getMenu, saveBomList, getBomCode } from '../../../utils/orderShiitUtils';
import { el } from "element-plus/es/locale";
import CustomSelect from './components/CustomSelect.vue';

import type {
    BomList,
    ModuleMenu,
    SmtItem,
    BomMeterial
} from "../../../interface/orderSheetInterface";

import { useRoute, useRouter } from "vue-router";
import ModelName from "../../TegPage/Application/ModelName.vue";
import BomSelectModal from "./components/BomSelectModal.vue";
const route = useRoute();

const bomList = ref<BomList[]>([]);
const bomListTemp = ref<BomList[]>([]);
const noneBomList = ref<BomList[]>([]);
const isLoading = ref(false)


const refs = ref<ModuleMenu[]>([]);
const epoxys = ref<ModuleMenu[]>([]);
const markers = ref<ModuleMenu[]>([]);
const makers_ics = ref<ModuleMenu[]>([]);
const makers_pcb = ref<ModuleMenu[]>([]);
const makers_car = ref<ModuleMenu[]>([]);
const makers_smd = ref<ModuleMenu[]>([]);
const makers_saw = ref<ModuleMenu[]>([]);
const carriertapes = ref<ModuleMenu[]>([]);
const ics = ref<ModuleMenu[]>([]);

const showBomPopup = ref(false);

const bomOptions = ref<any[]>([]);
const enterIndex = ref<number>(0);
const selectedBom = ref<any | null>(null);

const bomSearchResult = ref<BomMeterial[]>([]);

function addMeterial(index: number) {
    console.log(noneBomList.value);
    const row = noneBomList.value[index]
    const eref = row.sref
    const evalue = row.svalue
    const epn = row.spn
    const esize = row.ssize
    const emaker = row.smarker
    const moq = row.moq
    const epp = row.moving_avgp


    if (eref === 'PCB') {
        const sc1 = 'pcb_module';
        const ssStr = String(epn || "").trim();

        const [d1, d2] = ssStr.toUpperCase().split('_REV');
        const pn = d1.trim();
        const ss = esize
        const desc1 = d2.trim();
        const mk = 'S (SMST AKM)';
        const rv = moq;
        const pp = epp;

        // 값 확인용 로그 
        console.log("ss:", ssStr);
        console.log("d1:", d1);
        console.log("d2:", d2);
        console.log("pn:", pn);
        console.log("desc1:", desc1);
        console.log("mk:", mk);
        console.log("rv:", rv);
        console.log("pp:", pp);
        // const link = `http://10.20.10.128/sapmaterialsetup.html?source=fromRF&sc1=${encodeURIComponent(sc1)}&ss=${encodeURIComponent(ssStr)}&pn=${encodeURIComponent(pn)}&mk=${encodeURIComponent(mk)}&rv=${encodeURIComponent(rv)}&pp=${encodeURIComponent(pp)}&desc1=${encodeURIComponent(desc1)}`;
        const link = `http://localhost:3000?source=fromRF&sc1=${encodeURIComponent(sc1)}&ss=${encodeURIComponent(ss)}&pn=${encodeURIComponent(pn)}&mk=${encodeURIComponent(mk)}&rv=${encodeURIComponent(rv)}&pp=${encodeURIComponent(pp)}&desc1=${encodeURIComponent(desc1)}&i1=${encodeURIComponent(desc1)}&i2=${encodeURIComponent(desc1)}`;

        window.open(link, '_blank');
    }


    // this.maker = ['S (SMST AKM)', 'N (NJRC)', 'D (Daisho Denshi)', 'H (대덕전자)'];
    // this.makers = ['R (RODING)', 'C (C-PAK)', 'H (RongCheng)', 'E (E&R)'];
    // this.makers = ['N (NR Rab)', 'C (CanaanTek)', 'W (WISOL)', 'T (Thoshiba)', 'F (FERFICS)', 'I (Infineon)', 'P (Peregrine)', 'S (Silanna)', 'R (Tower Semi)', 'D (Radrock)'];
    // this.makers = ['U (Uniohm)'];
    // this.makers = ['M (MURATA)'];
    // this.makers = ['M (MURATA)', 'S (SUNLOARD)', 'T (TDK)'];
    // this.makers = ['S (SANYUREC)', 'N (NAGASE)', 'T (NITTO)', 'B (NITTO_BDMP)', 'C (조광페인트)'];

    else if (eref === 'IC') {
        const sc1 = 'ic'
        const sc2 = String(evalue).toLowerCase();
        const ss = esize.trim()
        // const pn = epn.trim()
        const mk = 'S (SMST AKM)'
        const rv = moq;
        const pp = epp
        const match = epn.match(/^(.+?)\((.+?)\)$/);
        let pn = "";
        let vP = "";

        if (match) {
            pn = match[1]; // sf2333
            vP = match[2]; // x0v01
        }
        if (!vP || vP.length < 5) {
            alert("PN 값 형식 오류")
            return; // 5글자 이하일 경우 함수 종료
        }

        const i1 = vP.slice(0, 2);
        const i2 = vP.slice(2, 5);

        const link = `http://localhost:3000?source=fromRF&sc1=${encodeURIComponent(sc1)}&sc2=${encodeURIComponent(sc2)}&ss=${encodeURIComponent(ss)}
        &pn=${encodeURIComponent(pn)}&mk=${encodeURIComponent(mk)}&rv=${encodeURIComponent(rv)}&pp=${encodeURIComponent(pp)}
        &desc1=${encodeURIComponent('')}&i1=${encodeURIComponent(i1)}&i2=${encodeURIComponent(i2)}`;
        window.open(link, '_blank');

    } else if (eref === 'Inductor' || eref === 'Capacitor' || eref === 'Register') {

    }
}


async function saveChildren() {
    await mappingData();
    saveBomList(bomList.value)
}

async function postBom() {
    alert("boom not work")
}

async function mappingData() {
    bomList.value = [...bomListTemp.value];
}


function onSelectBom(item: any) {
    console.log("선택된 BOM old:", item);
    // 예시: 선택한 항목을 현재 행에 반영
    if (item.WGBEZ === 'x9z00') {

        // showMeterialPop.value = true
        return;
    }
    const index = enterIndex.value
    bomList.value[index].sbom = item.MATNR
    bomListTemp.value[index].sbom = item.MATNR
    const maktx = item.MAKTX || "";
    let refs = '';
    const markerMap: Record<string, string> = {
        S: "AKM",
        D: "Daisho Denshi",
        N: "NJRC",
    };
    const markerMapIC: Record<string, string> = {
        N: "NR lab",
        C: "Canaana",
        W: "Wisol",
        T: "Thoshiba",
        F: "Ferfics",
        I: "Infineno",
        P: "Peregrine",
        S: "Silanna",
        R: "TowerSemi",
        D: "Radrock",
    };
    const markerMapSmd: Record<string, string> = {
        U: "Uniohm",
        M: "Murata",
        S: "Sunload",
        T: "TDK"
    };
    if (maktx) {
        const parts = maktx.split(";");

        refs = parts[0]

        if (item.MATNR) {
            if (item.MATNR.startsWith("2702")) {
                refs = 'Resistor';
            }
        }
        if (parts[0] === 'SWITCH' || parts[0] === 'LNA' || parts[0] === 'COMBO') {
            refs = 'IC';
        }
    }
    if (bomListTemp.value[index].sref === 'Inductor' || refs === 'IND') {
        // 사이즈 추출 (쉼표 뒤 마지막 단어)
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";

        const markerName = markerMapSmd[mk] || "Unknown";
        // ssize: "IND; 0402" → split(";")[1] → " 0402" → trim()
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        // svalue: 그냥 두 번째 파트
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        bomList.value[index].sbom = item.MATNR
        bomListTemp.value[index].sbom = item.MATNR
        bomListTemp.value[index].sref = 'Inductor'
        bomListTemp.value[index].smarker = markerName
        bomList.value[index].smarker = markerName
        bomList.value[index].sref = 'Inductor'
        bomList.value[index].svalue = svalue
        bomListTemp.value[index].svalue = svalue

        bomList.value[index].ssize = ssize
        bomListTemp.value[index].ssize = ssize
    }
    if (bomListTemp.value[index].sref === 'Capacitor' || refs === 'CAP') {
        // 사이즈 추출 (쉼표 뒤 마지막 단어)
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapSmd[mk] || "Unknown";
        // ssize: "IND; 0402" → split(";")[1] → " 0402" → trim()
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        // svalue: 그냥 두 번째 파트
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        bomList.value[index].sbom = item.MATNR
        bomListTemp.value[index].sbom = item.MATNR
        bomListTemp.value[index].sref = 'Capacitor'
        bomList.value[index].sref = 'Capacitor'
        bomListTemp.value[index].smarker = markerName
        bomList.value[index].smarker = markerName
        bomList.value[index].svalue = svalue
        bomListTemp.value[index].svalue = svalue
        bomList.value[index].ssize = ssize
        bomListTemp.value[index].ssize = ssize
    }
    if (bomListTemp.value[index].sref === 'Resistor' || refs === 'Resistor') {
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapSmd[mk] || "Unknown";
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        const spn = parts.length > 2 ? parts[2].trim() : "";
        bomList.value[index].sbom = item.MATNR
        bomListTemp.value[index].sbom = item.MATNR
        bomListTemp.value[index].sref = refs
        bomList.value[index].sref = refs
        bomListTemp.value[index].smarker = markerName
        bomList.value[index].smarker = markerName
        bomList.value[index].svalue = svalue
        bomListTemp.value[index].svalue = svalue
        bomList.value[index].ssize = ssize
        bomListTemp.value[index].ssize = ssize
        bomList.value[index].spn = spn
        bomListTemp.value[index].spn = spn

    }
    if (bomListTemp.value[index].sref === 'PCB' || refs === 'PCB') {
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMap[mk] || "Unknown";
        const parts = maktx.split(",");
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        console.log(ssize, svalue);
        bomListTemp.value[index].sref = 'PCB'
        bomList.value[index].sref = 'PCB'
        bomListTemp.value[index].smarker = markerName
        bomList.value[index].smarker = markerName
        bomList.value[index].spn = svalue
        bomListTemp.value[index].spn = svalue
        bomList.value[index].ssize = ssize
        bomListTemp.value[index].ssize = ssize
        // formDataTemp.pcb_code = svalue
        // formData.pcb_code = svalue
    }
    if (bomListTemp.value[index].sref == 'IC' || refs === 'IC') {
        const maktx = item.MAKTX || "";
        const sref = maktx.split(";")[0].trim();
        const parts = maktx.split(",");
        const ssize = parts.length > 1 ? parts[parts.length - 1].trim() : "";
        const spn = parts.length > 0
            ? parts[0].split(";")[1].trim()
            : "";
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapIC[mk] || "Unknown";
        bomList.value[index].sbom = item.MATNR
        bomListTemp.value[index].sbom = item.MATNR

        bomList.value[index].sref = refs
        bomListTemp.value[index].sref = refs
        bomList.value[index].svalue = sref

        bomListTemp.value[index].svalue = sref
        bomList.value[index].ssize = ssize
        bomListTemp.value[index].ssize = ssize
        bomList.value[index].smarker = markerName
        bomListTemp.value[index].smarker = markerName
        bomListTemp.value[index].spn = spn
        bomList.value[index].spn = spn
    }
    if (bomListTemp.value[index].sref == 'SAW') {
        bomList.value[index].smarker = 'Wisol'
        bomListTemp.value[index].smarker = 'Wisol'


    }
    enterIndex.value = 0
}

async function handleEnterKey(state: string, index: number) {
    console.log(state, index);

    if (state === 'default') {

        const smt = bomListTemp.value[index];
        const request: SmtItem = {
            sheet_id: '123123123',
            sorder: '',
            sref: smt.sref || '',
            sbom: smt.sbom || '',
            spn: smt.spn || '',
            svalue: smt.svalue || '',
            ssize: smt.ssize || '',
            smarker: smt.smarker || '',
            sx: '',
            sy: '',
            smt_id: 0,
        };

        if (smt.sref === 'SAW') {
            // request.svalue = formDataTemp.saw_type;
        }

        const response = await getBomCode(request);
        console.log(response);
        bomOptions.value = response;
        showBomPopup.value = true;
        enterIndex.value = index;
        return;
    }
}


onMounted(async () => {
    // API getPCB CAp
    const sheetId = route.params.sheetId as '';
    // Mapping 
    const menu = await getMenu();
    refs.value = menu
        .filter(item => item.mtype === "refs")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    markers.value = menu
        .filter(item => item.mtype === "markers")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_ics.value = menu
        .filter(item => item.mtype === "markers_ics")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_pcb.value = menu
        .filter(item => item.mtype === "markers_pcb")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_car.value = menu
        .filter(item => item.mtype === "markers_car")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_smd.value = menu
        .filter(item => item.mtype === "markers_smd")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_saw.value = menu
        .filter(item => item.mtype === "markers_saw")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    // list 초기화
    const result = await getBomList(sheetId)
    bomList.value = result
    bomListTemp.value = result
    noneBomList.value = result.filter(item => !item.sbom || item.sbom == '');
    isLoading.value = true
    console.log(noneBomList.value)
});

</script>

<style scoped>
@import "../../../assets/style/orderSheet.css";
</style>