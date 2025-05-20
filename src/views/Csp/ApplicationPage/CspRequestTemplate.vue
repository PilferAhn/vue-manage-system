<template>
      <div v-if="username === '이정민'">
  <el-form :model="applicationData" :rules="rules" label-position="top" label-width="100px" ref="applicationForm">

    <div class="container" v-if="!loading">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <div style="text-align:center;">
              <span style="font-size: 25px; font-weight: bold;"> 변경품 / New Model 투입 의뢰서</span><br />
              <span style="font-size: 25px; font-weight: bold;">[Yêu cầu input new model/ sản phẩm thay đổi]</span>
            </div>
          </el-card>
          <el-card>
            <table class="custom-top-table">
              <colgroup>
                <col style="width: 11%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 19%;" />

                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
              </colgroup>

              <tbody>
                <tr>
                  <td colspan="1" class="hcell">Model<br />기종명</td>
                  <td colspan="2" contenteditable="true" ref="modelCell"
                    @input="e => formData.default_modelName = (e.target as HTMLElement).innerText"
                    @keydown.enter.prevent="handleEnter">
                  </td>

                  <td colspan="1" class="hcell">Người yêu cầu<br />의뢰인</td>
                  <td colspan="1"> {{ username }} </td>
                  <td colspan="1" class="hcell">Ngày yêu cầu<br />의뢰날짜</td>
                  <td colspan="3"> {{ today }}</td>
                </tr>
                <tr>
                  <td colspan="1" class="hcell">Số lượng yêu cầu <br />
                    의뢰수량</td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formData.default_requireAmount = (e.target as HTMLElement).innerText"></td>
                  <td colspan="1" class="hcell">Yêu cầu packing
                    <br />포장요구사항
                  </td>
                  <td colspan="5" contenteditable="true"
                    @input="e => formData.default_pkgRequirement = (e.target as HTMLElement).innerText"></td>

                </tr>
                <tr>
                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">Product Size</td>
                  <td colspan="2" @input="e => formData.default_productSize = (e.target as HTMLElement).innerText"></td>

                  <td colspan="1" class="hcell">mục đích test<br />
                    실험목적</td>
                  <td colspan="5" contenteditable="true"
                    @input="e => formData.default_purpose = (e.target as HTMLElement).innerText"></td>
                </tr>

              </tbody>
            </table>
          </el-card>


          <el-card>
            <table class="custom-table">
              <colgroup>
                <col style="width: 11%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 19%;" />

                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
              </colgroup>

              <tbody>
                <tr>
                  <td colspan="1" class="hcell">Loại hình <br /> 유형</td>
                  <td colspan="1" class="hcell">Hạng mục
                    <br /> 항목
                  </td>
                  <td colspan="7" class="hcell">Quy cách
                    <br /> 규격
                  </td>
                </tr>

                <!-- MERERIAL System -->
                <tr>
                  <td colspan="1" rowspan="11" class="hcell">Vật liệu
                    <br />
                    자재
                  </td>
                  <td colspan="1" rowspan="3" class="hcell">System <br /> 시스템</td>
                  <td colspan="1" rowspan="3" class="hcell" style="background-color: #ff00ff;">ERP BOM</td>
                  <td colspan="1" style="background-color: #ff00ff;">WAFER</td>
                  <td colspan="1">{{ `${resultReq.fbasecode} &nbsp` }}</td>
                  <td colspan="1" rowspan="3" class="hcell" style="background-color: #ff00ff;">MES CODE
                  </td>
                  <td colspan="1" style="background-color: #ff00ff;">
                    WAFER
                  </td>
                  <td colspan="2">{{ `${resultReq.fmname} &nbsp` }}</td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: #ff00ff;">PKG/PCB</td>
                  
                  <td colspan="1">
                    {{ `${resultReq.fpkgcode} &nbsp` }}
                  </td>
                  <td colspan="1" style="background-color: #ff00ff;">PKG/PCB</td>
                  <td colspan="2">
                    {{ `${resultReq.fpkgpartnumber}&nbsp` }}
                  </td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: #ff00ff;">EPOXY</td>
                  <td colspan="1">{{ `${resultReq.fepoxycode}&nbsp` }}</td>
                  <td colspan="1" style="background-color: #ff00ff;">EPOXY</td>
                  <td colspan="2">{{ `${resultReq.fepoxymodel}&nbsp` }}</td>
                </tr>
                <!-- MERERIAL Wafer -->
                <tr>
                  <td rowspan="4" class="hcell">
                    Wafer
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Chip size
                  </td>
                  <td colspan="2">
                    {{ resultReq.fchipsize }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Wafer Thickness
                  </td>
                  <td colspan="3">
                    {{ `${resultReq.fwcop} ${resultReq.fwthickness}` }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    PAD Type/유형
                  </td>
                  <td colspan="2" contenteditable="true">

                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Số lượng gửi <br />
                    발송수량
                  </td>
                  <td colspan="3" contenteditable="true">
                    {{ resultReq.fbasechipea }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    MES Code
                  </td>
 
                  <td colspan="2" contenteditable="true">
                    {{ resultReq.fmname }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Wafer Mark
                  </td>
                  <td colspan="3" contenteditable="true">
                    {{ resultReq.fassyname }}
                  </td>
                </tr>
                <tr>
                  <td class="hcell">
                    Wafer LOT NO
                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formData.wafer_lot_no = (e.target as HTMLElement).innerText">

                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Chip Qty
                  </td>
                  <td colspan="3">
                    {{ `${resultReq.fbasechipea}*${resultReq.fcnt}` }}
                  </td>
                </tr>


                <!-- MERERIAL PKG -->


                <tr>
                  <td rowspan="3" class="hcell">
                    PKG
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    PKG <br /> Số hàng * Số cột
                  </td>
                  <td colspan="2" contenteditable="true">

                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    ERP Code
                  </td>
                  <td colspan="3" contenteditable="true">
                    {{ resultReq.fbasecode }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell">
                    Chât liệu <br /> 재질
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formData.pkg_meterial = (e.target as HTMLElement).innerText">

                  </td>

                </tr>
                <tr>

                  <td class="hcell">
                    Mục chú ý <br />주의사항
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formData.pkg_note = (e.target as HTMLElement).innerText">

                  </td>
                </tr>
                <tr>
                  <td rowspan="1" class="hcell">
                    Epoxy
                  </td>
                  <td class="hcell">
                    Model
                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formData.epoxy_model = (e.target as HTMLElement).innerText">

                  </td>
                  <td class="hcell">
                    Thickness
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formData.epoxy_thickness = (e.target as HTMLElement).innerText">
                  </td>
                </tr>



                <!-- 중점공정 -->
                <tr>
                  <td rowspan="15" class="hcell">
                    Trọng tâm công đoạn <br />
                    중점공정
                  </td>
                  <td class="hcell" colspan="1">
                    B/B
                  </td>
                  <td class="hcell" colspan="1" style="background-color: #ff00ff;">
                    BALL SIZE
                  </td>
                  <td colspan="6">
                    {{ resultReq.fbumpboll }}
                  </td>

                </tr>
                <tr>
                  <td class="hcell" colspan="1">
                    B/G
                  </td>
                  <td class="hcell" colspan="1">
                    Thickness <br />
                    B/G 를 하는것만 작성
                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formData.bg_thickness = (e.target as HTMLElement).innerText">

                  </td>
                  <td class="hcell" colspan="1">
                    Độ dày sau B/G <br />
                    B/G후두께
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formData.bg_afterthickness = (e.target as HTMLElement).innerText">

                  </td>
                </tr>
                <tr>

                  <td class="hcell" colspan="1">
                    D/C
                  </td>
                  <td class="hcell" colspan="1">
                    Phân loại chất liệu
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formData.dc_meterial = (e.target as HTMLElement).innerText">

                  </td>

                </tr>

                <tr>

                  <td class="hcell" rowspan="2" colspan="1">
                    F/B
                  </td>
                  <td class="hcell" colspan="1">
                    Hướng lắp ráp FB<br />
                    FB 조립 방향
                    <span>
                      （photo size：4cm*?cm）

                    </span>

                  </td>
                  <td colspan="2">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputFB1')">
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(file, index) in imagesetFB1" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지"
                          style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageFB1(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputFB1" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeFB1" multiple />
                    </div>
                  </td>
                  <!-- <td colspan="2" contenteditable="true" >

                  </td> -->



                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <!-- <td colspan="3">
                    img
                  </td> -->
                  <td colspan="3">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputFB2')">
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(file, index) in imagesetFB2" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지"
                          style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageFB2(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputFB2" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeFB2" multiple />
                    </div>
                  </td>
                </tr>

                <tr>


                  <td class="hcell" colspan="1">
                    F/B#1
                    <br />
                    (Numering)

                  </td>
                  <td colspan="2">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputFB3')">
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(file, index) in imagesetFB3" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지"
                          style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageFB3(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputFB3" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeFB3" multiple />
                    </div>
                  </td>
                  <td class="hcell" colspan="1">
                    F/B#2
                    <br />
                    (SPL)
                  </td>
                  <td colspan="3">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputFB4')">
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(file, index) in imagesetFB4" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지"
                          style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageFB4(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputFB4" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeFB4" multiple />
                    </div>
                  </td>
                </tr>




                <tr>
                  <td class="hcell" colspan="1">
                    M/K
                  </td>
                  <td class="hcell" colspan="1">
                    Marking <br />
                    Hình phương hướng<br />
                    <span style="font-size: 8px;">
                      （photo size：3cm*4cm）
                    </span>

                  </td>
                  <td colspan="2">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputMK1')">
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(file, index) in imagesetMK1" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지"
                          style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageMK1(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputMK1" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeMK1" multiple />
                    </div>
                  </td>
                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formData.mk_note = (e.target as HTMLElement).innerText">

                  </td>
                </tr>

                <tr>
                  <td class="hcell" colspan="1">
                    P/D
                  </td>
                  <td class="hcell" colspan="1">
                    Dicing Line Size

                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formData.pd_dicing_line_size = (e.target as HTMLElement).innerText">

                  </td>
                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formData.pd_note = (e.target as HTMLElement).innerText">

                  </td>
                </tr>



                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    E/L
                  </td>
                  <td class="hcell" colspan="1">
                    Cách liên kết JIG<br />
                    연결방식
                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formData.el_link_method = (e.target as HTMLElement).innerText">

                  </td>
                  <td class="hcell" colspan="1">
                    EVB Setup Port
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formData.el_EVB_setup_port = (e.target as HTMLElement).innerText">

                  </td>

                </tr>


                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    Analysis FA
                  </td>
                  <td class="hcell" colspan="1">
                    Item /항목
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formData.analysis_fa_item = (e.target as HTMLElement).innerText">

                  </td>


                </tr>
                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    Độ tin cậy <br />
                    신뢰성
                  </td>
                  <td class="hcell" colspan="1">
                    Item /항목
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formData.reliability_item = (e.target as HTMLElement).innerText">

                  </td>


                </tr>

              </tbody>
            </table>

            <div style="width: 100%; margin-top: 30px;">
              <el-button type="primary" style="width: 100%;height: 100px; font-weight: bold; font-size: 34px;"
                @click="handleSubmitButtton">
                SUBMIT<el-icon class="el-icon--right">
                </el-icon>
              </el-button>
            </div>

          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-form>
</div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, computed, reactive, Ref } from "vue";
import {
  sendApplicationData2,
  downloadSolderApplicationXlsx,
  loadApplicationData,
  getMeasurementLabel,
  updateStatusByUuid,
  updateMeasurement,
} from "./CspRequest";
import inputText from "../../Common/InputText.vue";
import type {
  ApplicationData,
} from "../../../interface/cspRequestFormInterface";
import { handleGetDataByModelCode, dataValidation, handleSubmitForm } from '../../../utils/cspRequestFormUtill'

import { cspRequestRules } from "./CspRequestRules";

const props = defineProps<{
  applicationData: ApplicationData;
  applicationType: string;
}>();
const rules = cspRequestRules;

const formData = reactive<ApplicationData>({
  default_modelName: '',
  default_requireName: '',
  default_requireDate: '',
  default_requireAmount: '',
  default_pkgRequirement: '',
  default_productSize: '',
  default_purpose: '',

  system_erp_wafer: '',
  system_erp_pkg: '',
  system_erp_epoxy: '',

  system_mes_wafer: '',
  system_mes_pkg: '',
  system_mes_epoxy: '',

  wafer_chip_size: '',
  wafer_thickness: '',
  wafer_pad_type: '',
  wafer_send_quantity: '',
  wafer_mes_code: '',
  wafer_mark: '',
  wafer_lot_no: '',
  wafer_chip_qty: '',

  pkg_size: '',
  pkg_erp_code: '',
  pkg_meterial: '',
  pkg_note: '',

  epoxy_model: '',
  epoxy_thickness: '',

  bb_ballsize: '',

  bg_thickness: '',
  bg_afterthickness: '',

  dc_meterial: '',
  mk_note: "",

  pd_dicing_line_size: "",
  pd_note: "",

  el_link_method: "",
  el_EVB_setup_port: "",

  analysis_fa_item: "",

  reliability_item: ""
})

const resultReq = reactive({
  fbasecode: "",
  fpkgcode: "",
  fepoxycode: "",
  fmname: "",
  fpkgpartnumber: "",
  fepoxymodel: "",
  fchipsize: "",
  fwthickness: '',
  fwcop: '',
  fbasechipea: '',
  fassyname: '',
  fcnt: '',
  fbumpboll: "",
})

const loading = ref(true);
const application = ref<ApplicationData>({});

const modelCell = ref<HTMLElement | null>(null);
const username = ref('');
const today = ref('');
const todayDate = new Date();

const fileInputFB1 = ref<HTMLInputElement | null>(null);
const fileInputFB2 = ref<HTMLInputElement | null>(null);
const fileInputFB3 = ref<HTMLInputElement | null>(null);
const fileInputFB4 = ref<HTMLInputElement | null>(null);
const fileInputMK1 = ref<HTMLInputElement | null>(null);

const imagesetFB1 = ref<File[]>([]);
const imagesetFB2 = ref<File[]>([]);
const imagesetFB3 = ref<File[]>([]);
const imagesetFB4 = ref<File[]>([]);
const imagesetMK1 = ref<File[]>([]);


const imageUrl = ref<string | null>(null);

function handleFilesChangeFB1(e: Event) {
  onFilesChange(e, imagesetFB1);
}
function handleFilesChangeFB2(e: Event) {
  onFilesChange(e, imagesetFB2);
}
function handleFilesChangeFB3(e: Event) {
  onFilesChange(e, imagesetFB3);
}

function handleFilesChangeFB4(e: Event) {
  onFilesChange(e, imagesetFB4);
}

function handleFilesChangeMK1(e: Event) {
  onFilesChange(e, imagesetMK1);
}

function removeImageFB1(index: number) {
  imagesetFB1.value.splice(index, 1);
}
function removeImageFB2(index: number) {
  imagesetFB2.value.splice(index, 1);
}function removeImageFB3(index: number) {
  imagesetFB3.value.splice(index, 1);
}function removeImageFB4(index: number) {
  imagesetFB4.value.splice(index, 1);
}function removeImageMK1(index: number) {
  imagesetMK1.value.splice(index, 1);
}

function getObjectURL(file: File): string {
  return URL.createObjectURL(file)
}


// 파일 선택창 열기
function triggerFileSelect(target: 'fileInputFB1' | 'fileInputFB2' | 'fileInputFB3' | 'fileInputFB4' | 'fileInputMK1') {
  if (target === 'fileInputFB1') fileInputFB1.value?.click();
  if (target === 'fileInputFB2') fileInputFB2.value?.click();
  if (target === 'fileInputFB3') fileInputFB3.value?.click();
  if (target === 'fileInputFB4') fileInputFB4.value?.click();
  if (target === 'fileInputMK1') fileInputMK1.value?.click();
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


function handleSubmitButtton() {
  if (!dataValidation(formData)) {
    return;
  }
  handleSubmitForm(formData, imagesetFB1.value, imagesetFB2.value,imagesetFB3.value,imagesetFB4.value, imagesetMK1.value);
}


function onDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    imageUrl.value = URL.createObjectURL(file);
  } else {
    alert("이미지 파일만 업로드할 수 있습니다.");
  }
}


onMounted(() => {
  application.value = props.applicationData;
  username.value = localStorage.getItem('ms_username') || 'Guest';

  // 날짜 포맷 YYYY-MM-DD
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const date = String(todayDate.getDate()).padStart(2, '0');

  today.value = `${year}-${month}-${date}`;

  loading.value = false;
  formData.default_requireName = username.value;
  formData.default_requireDate = today.value;
});


async function handleEnter() {
  const value = modelCell.value?.innerText.trim() || "";
  const username = ref(localStorage.getItem('ms_username'));
  const req = await handleGetDataByModelCode(value);
  if (req.default_modelName === 'false') {
    alert(value + " NOT FOUND");
    return;
  }
  // 여기서 필요한 처리 수행 (예: 저장, API 호출 등)
  Object.assign(resultReq, req[0])
  console.log(req[0]);
  formData.system_erp_wafer = req[0].fbasecode
  formData.system_erp_pkg = req[0].fpkgcode
  formData.system_erp_epoxy = req[0].fepoxycode

  formData.system_mes_wafer = req[0].fmname
  formData.system_mes_pkg = req[0].fpkgpartnumber
  formData.system_mes_epoxy = req[0].fepoxymodel


  formData.wafer_chip_size = req[0].fchipsize
  formData.wafer_thickness = req[0].fwcop + req[0].fwthickness
  formData.wafer_pad_type = "-"
  formData.wafer_chip_qty = req[0].fbasechipea
  formData.wafer_mes_code = req[0].fbasecode
  formData.wafer_mark = req[0].fassyname
  formData.wafer_chip_qty = req[0].fchipsize + "*" + req[0].fcnt
  formData.pkg_size = ''
  formData.pkg_erp_code = req[0].fpkgcode
  formData.bb_ballsize = ''
}


</script>

<script lang="ts">
export default {};
</script>

<style scoped>
@import "../../../assets/style/cspRequest.css";
</style>




<!-- 
  API NOTE
    10.20.10.128

    "fbasecode": "WSG42AA50T00",
    "fpkgcode": "MG41W9A50CD",
    "fepoxycode": "0103W00C23N",


    "fmname": "TSG42AA5002C",
    "fpkgpartnumber": "A5-C",
    "fepoxypurpose": "230",

-->