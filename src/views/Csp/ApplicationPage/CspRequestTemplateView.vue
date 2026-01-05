<template>
  <!-- <div v-if="username === '이정민'"> -->
  <el-form :model="applicationData" :rules="rules" label-position="top" label-width="100px" ref="applicationForm">

    <div class="container" v-if="!loading">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <div style="text-align: right;">

            </div>
          </el-card>
        </el-col>
      </el-row>

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
                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">Model<br />기종명</td>
                  <td colspan="2">
                    {{ `${formData.default_modelName}` }}
                  </td>

                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">Người yêu cầu<br />의뢰인</td>
                  <td colspan="1"> {{ formData.default_requireName }} </td>
                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">Ngày yêu cầu<br />의뢰날짜</td>
                  <td colspan="3"> {{ formData.default_requireDate }}</td>
                </tr>
                <tr>
                  <td colspan="1" class="hcell">Số lượng yêu cầu <br />
                    의뢰수량</td>

                  <td colspan="2">
                    {{ formData.default_requireAmount }}
                  </td>



                  <td colspan="1" class="hcell">Yêu cầu packing
                    <br />포장요구사항
                  </td>
                  <td colspan="5">{{ formData.default_pkgRequirement }}
                  </td>

                </tr>
                <tr>
                  <td colspan="1" class="hcell">Product Size</td>
                  <td colspan="2" style="background-color: #f0f9ff;">
                    {{ `${formData.default_productSize}` }}

                  </td>

                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">mục đích test<br />
                    실험목적</td>
                  <td colspan="5">
                    {{ `${formData.default_purpose}` }}

                  </td>
                </tr>

              </tbody>
            </table>
          </el-card>


          <el-card>
            <table class="custom-table">
              <colgroup>
                <col style="width: 8%;" />
                <col style="width: 6%;" />
                <col style="width: 8%;" />6
                <col style="width: 10%;" />
                <col style="width: 24%;" />

                <col style="width: 8%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 15%;" />
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
                  <td colspan="1" rowspan="9" class="hcell">Vật liệu
                    <br />
                    자재
                  </td>
                  <td colspan="1" rowspan="3" class="hcell">System <br /> 시스템</td>
                  <td colspan="1" rowspan="3" class="hcell" style="background-color: #ff00ff;">ERP BOM</td>
                  <td colspan="1" style="background-color: #ff00ff;">WAFER</td>
                  <td colspan="1">{{ `${formData.system_erp_wafer} &nbsp` }}</td>
                  <td colspan="1" rowspan="3" class="hcell" style="background-color: #ff00ff;">MES CODE
                  </td>
                  <td colspan="1" style="background-color: #ff00ff;">
                    WAFER
                  </td>
                  <td colspan="2">{{ `${formData.system_mes_wafer} &nbsp` }}</td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: #ff00ff;">PKG/PCB</td>

                  <td colspan="1">
                    {{ `${formData.system_erp_pkg} &nbsp` }}
                  </td>
                  <td colspan="1" style="background-color: #ff00ff;">PKG/PCB</td>
                  <td colspan="2">
                    {{ `${formData.system_mes_pkg}&nbsp` }}
                  </td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: #ff00ff;">EPOXY</td>
                  <td colspan="1">{{ `${formData.system_erp_epoxy}&nbsp` }}</td>
                  <td colspan="1" style="background-color: #ff00ff;">EPOXY</td>
                  <td colspan="2">{{ `${formData.system_mes_epoxy}&nbsp` }}</td>
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
                    {{ formData.wafer_chip_size }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Wafer Thickness
                  </td>
                  <td colspan="3">
                    {{ `${formData.wafer_thickness}` }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    PAD Type/유형
                  </td>
                  <td colspan="2">{{ formData.wafer_pad_type }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Số lượng gửi <br />
                    발송수량
                  </td>
                  <td colspan="3">{{ formData.wafer_send_quantity }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    MES Code
                  </td>

                  <td colspan="2">
                    {{ formData.system_mes_wafer }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Wafer Mark
                  </td>
                  <td colspan="3">
                    {{ formData.wafer_mark }}
                  </td>

                </tr>
                <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Wafer LOT NO
                  </td>
                  <td colspan="2">

                    {{ formData.wafer_lot_no }}
                  </td>

                  <td class="hcell" style="background-color: #ff00ff;">
                    Chip Qty
                  </td>
                  <td colspan="3">
                    {{ `${formData.wafer_chip_qty}*${formData.wafer_send_quantity}` }}
                  </td>
                </tr>


                <!-- MERERIAL PKG -->


                <tr>
                  <td rowspan="2" class="hcell">
                    PKG
                  </td>
                  <td class="hcell">
                    PKG <br /> Số hàng * Số cột
                  </td>
                  <td colspan="2">
                    <!-- {{ formData.pkg_size }} -->

                    <div v-for="(file, index) in filesetSS1" :key="index"
                      style="position: relative; display: inline-block; margin: 10px;">
                      <div @click="downloadFile(file)" style="cursor:pointer;">{{ file.file_name }}</div>

                    </div>

                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    ERP Code
                  </td>
                  <td colspan="3">
                    {{ formData.system_erp_wafer }}
                  </td>
                </tr>

                <!-- <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Chât liệu <br /> 재질
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formDataTemp.pkg_meterial = (e.target as HTMLElement).innerText">
                    {{ formData.pkg_meterial }}
                  </td>

                </tr> -->
                <tr>

                  <td class="hcell">
                    Mục chú ý <br />주의사항
                  </td>
                  <td colspan="6">{{ formData.pkg_note }}
                  </td>
                </tr>
                <!-- <tr>
                  <td rowspan="1" class="hcell">
                    Epoxy
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Model
                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formDataTemp.epoxy_model = (e.target as HTMLElement).innerText">
                    {{ formData.epoxy_model }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Thickness
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formDataTemp.epoxy_thickness = (e.target as HTMLElement).innerText">
                    {{ formData.epoxy_thickness }}
                  </td>
                </tr> -->



                <!-- 중점공정 -->
                <tr>
                  <td rowspan="10" class="hcell">
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
                    {{ formData.bb_ballsize }}
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
                  <td colspan="2" style=" background-color: #f0f9ff;">
                    {{ formData.bg_thickness }}
                  </td>
                  <td class="hcell" colspan="1">
                    Độ dày sau B/G <br />
                    B/G후두께
                  </td>
                  <td colspan="3" style=" background-color: #f0f9ff;">
                    {{ formData.bg_afterthickness }}
                  </td>
                </tr>
                <tr>

                  <td class="hcell" colspan="1">
                    D/C
                  </td>
                  <td class="hcell" colspan="1">
                    Phân loại chất liệu<br />
                    / 날 두께
                  </td>
                  <td colspan="1" style=" background-color: #f0f9ff;">
                    {{ formData.dc_meterial }}
                  </td>
                  <td colspan="1" style=" background-color: #f0f9ff;">
                    {{ formData.dc_blade_thickness }}
                  </td>
                  <td class="hcell" colspan="1">
                    DicingLine<br />
                    Thickness
                  </td>
                  <td colspan="3" style=" background-color: #f0f9ff;">
                    {{ formData.dc_thickness }}

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
                    <div style="display: flex;">

                      <div v-for="(img, index) in existingFB1" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />
                      </div>
                      <div style="width: 100%; border:1px solid black"></div>
                      {{ formData.fb_direction }}
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
                    <div style="display: flex;">
                      <div v-for="(img, index) in existingFB2" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />
                      </div>
                      <div style="width: 100%; border:1px solid black">
                        {{ formData.fb_note }}
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="hcell" colspan="1">
                    F/B#1
                    <br />
                    (Numbering)

                  </td>
                  <td colspan="2">
                    <div style="display: flex;">
                      <div v-for="(img, index) in existingFB3" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />

                      </div>

                      <div style="width: 100%; border:1px solid black">
                        {{ formData.fb_1_numbering }}
                      </div>

                    </div>
                  </td>
                  <td class="hcell" colspan="1">
                    F/B#2
                    <br />
                    (SPL)
                  </td>
                  <td colspan="3">
                    <div style="display: flex;">


                      <div v-for="(img, index) in existingFB4" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />


                      </div>


                      <div style="width: 100%; border:1px solid black">
                        {{ formData.fb_2_spl }}
                      </div>
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
                    <div style="display: flex;">
                      <div v-for="(img, index) in existingMK1" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />

                      </div>
                      <div style="width: 100%; border:1px solid black">
                        {{ formData.mk_marking }}
                      </div>
                    </div>
                  </td>
                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <td colspan="3">
                    <el-checkbox :label="'Marking WTC'" :true-label="'Marking WTC'" :false-label="''"
                      v-model="formData.mk_note" style="cursor: default; pointer-events: none;">
                      Marking WTC
                    </el-checkbox>
                    <el-checkbox :label="'Marking WHC'" :true-label="'Marking WHC'" :false-label="''"
                      v-model="formData.mk_note" style="cursor: default; pointer-events: none;">
                      Marking WHC
                    </el-checkbox>
                  </td>
                </tr>

                <tr>
                  <td class="hcell" colspan="1">
                    P/D
                  </td>
                  <td class="hcell" colspan="1">
                    Dicing Line Size

                  </td>
                  <td colspan="2" style=" background-color: #f0f9ff;">
                    {{ formData.pd_dicing_line_size }}
                  </td>

                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <td colspan="3">
                    {{ formData.pd_note }}
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
                  <td colspan="2">{{ formData.el_link_method }}
                  </td>
                  <td class="hcell" colspan="1">
                    EVB Setup Port
                  </td>
                  <td colspan="3">
                    <div style="display: flex;">
                      <div v-for="(img, index) in existingEV1" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />
                      </div>
                      <div style="width: 100%; border:1px solid black">
                        {{ formData.el_EVB_setup_port }}
                      </div>

                    </div>
                  </td>

                </tr>


                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    Analysis FA
                  </td>
                  <td class="hcell" colspan="1">
                    Item /항목
                  </td>
                  <td colspan="6">{{ formData.analysis_fa_item }}
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
                  <!-- <td colspan="6">
                    {{ formData.reliability_item }}
                  </td> -->
                  <td colspan="6">
                    <el-checkbox-group v-model="dotincay" size="small" class="readonly-checkbox">
                      <el-checkbox v-for="item in columnOptionsMap.reliability_items.value" :key="item.value"
                        style="cursor: default; pointer-events: none;" :label="item.label" />
                    </el-checkbox-group>
                  </td>
                </tr>
                <tr>
                  <td class="hcell">
                    기타<br />
                    Khác
                  </td>

                  <td colspan="2" class="hcell">
                    Did you check CER 0-2?
                  </td>
                  <td colspan="6">
                    <el-checkbox :label="'YES'" :true-label="'YES'" :false-label="''"
                      v-model="formData.others_cer_check" style="cursor: default; pointer-events: none;">
                      YES
                    </el-checkbox>
                    <el-checkbox :label="'NO'" :true-label="'NO'" :false-label="''" v-model="formData.others_cer_check"
                      style="cursor: default; pointer-events: none;">
                      NO
                    </el-checkbox>
                  </td>
                </tr>
                <tr>
                  <td class="hcell" rowspan="3">
                    첨부파일
                  </td>
                  <td class="hcell" colspan="2">
                    MWA(개발)
                  </td>
                  <td colspan="6">
                    <div>
                      <div v-for="(file, index) in filesetMWA1" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <div @click="downloadFile(file)" style="cursor:pointer;">{{ file.file_name }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="hcell" colspan="2">
                    PKG MAP
                  </td>
                  <td colspan="6">
                    <div>
                      <div v-for="(file, index) in filesetPMAP1" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <div @click="downloadFile(file)" style="cursor:pointer;">{{ file.file_name }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="hcell" colspan="2">
                    WAFER MAP
                  </td>
                  <td colspan="6">
                    <div>
                      <div v-for="(file, index) in filesetWMAP1" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <div @click="downloadFile(file)" style="cursor:pointer;">{{ file.file_name }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>

                </tr>
              </tbody>
            </table>
            <div>
              <span>
                이미지 엑셀 삽입 실사이즈
              </span>
            </div>

            <!-- 이미지 원사이즈 출력 -->
            <div v-for="(file, index) in existingFB1" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>FB 조립방향 {{ index + 1 }}</div>
              <img :src="file.url" />
            </div>
            <div v-for="(file, index) in existingFB2" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>F/B주의사항 {{ index + 1 }}</div>
              <img :src="file.url" />
            </div>

            <div v-for="(file, index) in existingFB3" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>FB#1 NUMBERING {{ index + 1 }}</div>
              <img :src="file.url" />
            </div>
            <div v-for="(file, index) in existingFB4" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>FB#2 SPL {{ index + 1 }}</div>
              <img :src="file.url" />
            </div>
            <div v-for="(file, index) in existingMK1" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>M/K Marking{{ index + 1 }}</div>
              <img :src="file.url" />
            </div>
            <div v-for="(file, index) in existingEV1" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>el_EVB_setup_port{{ index + 1 }}</div>
              <img :src="file.url" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-form>


  <!-- </div> -->


  <!-- </div> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, reactive, Ref } from "vue";

import { useRoute } from "vue-router";

import type {
  ApplicationData,
} from "../../../interface/cspRequestFormInterface";
import { handleGetDataByModelCode, dataValidation, handleSubmitForm, getColumnData, fileDownload } from '../../../utils/cspRequestFormUtill'

import { cspRequestRules } from "./CspRequestRules";
import { collapseItemProps } from "element-plus";

const props = defineProps<{
  applicationData: ApplicationData;
  applicationType: string;
}>();
const rules = cspRequestRules;

const route = useRoute();

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
  dc_blade_thickness: '',
  dc_thickness: '',
  mk_note: "",

  pd_dicing_line_size: "",
  pd_note: "",

  el_link_method: "",
  el_EVB_setup_port: "",

  analysis_fa_item: "",

  reliability_item: "",
  others_cer_check: "",
  fb_2_spl: "",
  fb_direction: "",
  fb_note: "",
  fb_1_numbering: "",
  mk_marking: "",
  form_status: ""
})

const selectedLots = ref<string[]>([]);
const lotsData = ref<string[]>([]);
const dotincay = ref<string[]>([])



const loading = ref(true);
const application = ref<ApplicationData>();

const username = ref('');
const today = ref('');
const todayDate = new Date();

const existingFB1 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingFB2 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingFB3 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingFB4 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingMK1 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingEV1 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const filesetSS1 = ref<File[]>([]);
const filesetMWA1 = ref<File[]>([]);
const filesetPMAP1 = ref<File[]>([]);
const filesetWMAP1 = ref<File[]>([]);


interface OptionItem {
  value: string
  label: string
}


const columnOptionsMap: Record<string, Ref<OptionItem[]>> = {
  pkg_meterial: ref([]),
  epoxy_model: ref([]),
  epoxy_thickness: ref([]),
  bg_thickness: ref([]),
  bg_afterthickness: ref([]),
  dc_meterial: ref([]),
  dc_thickness: ref([]),
  default_productSize: ref([]),
  pd_dicing_line_size: ref([]),
  wafer_pad_type: ref([]),
  reliability_items: ref([])
}


onMounted(async () => {
  const product_name = route.params.productName as string
  await handleEnter(product_name)

  const columnlist = await getColumnData();


  application.value = props.applicationData;
  username.value = localStorage.getItem('ms_username') || 'Guest';

  // 날짜 포맷 YYYY-MM-DD
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const date = String(todayDate.getDate()).padStart(2, '0');

  today.value = `${year}-${month}-${date}`;

  type ColumnKey = keyof typeof columnOptionsMap;
  for (const key in columnOptionsMap) {
    const columnKey = key as ColumnKey;
    columnOptionsMap[columnKey].value = columnlist
      .filter(item => item.column_name === columnKey)
      .map(item => ({
        value: item.column_value,
        label: item.column_value
      }));
  }
  loading.value = false;
});

const downloadFile = (file) => {
  fileDownload(file.img_id)
}

async function handleEnter(value) {
  // const value = modelCell.value?.innerText.trim() || "";
  // const username = ref(localStorage.getItem('ms_username'));
  const req = await handleGetDataByModelCode(value);

  if (req.default_modelName === 'false') {
    alert(value + " NOT FOUND");
    return;
  }


  // 여기서 필요한 처리 수행 (예: 저장, API 호출 등)

  if (req.reliability_item) {
    dotincay.value = req.reliability_item.split(",");
  }
  formData.default_modelName = req.default_modelName;
  formData.default_requireName = req.default_requireName;
  formData.default_requireDate = req.default_requireDate;
  formData.default_requireAmount = req.default_requireAmount;
  formData.default_pkgRequirement = req.default_pkgRequirement;
  formData.default_productSize = req.default_productSize;
  formData.default_purpose = req.default_purpose;

  formData.system_erp_wafer = req.system_erp_wafer;
  formData.system_erp_pkg = req.system_erp_pkg;
  formData.system_erp_epoxy = req.system_erp_epoxy;

  formData.system_mes_wafer = req.system_mes_wafer;
  formData.system_mes_pkg = req.system_mes_pkg;
  formData.system_mes_epoxy = req.system_mes_epoxy;

  formData.wafer_chip_size = req.wafer_chip_size;
  formData.wafer_thickness = req.wafer_thickness;
  formData.wafer_pad_type = req.wafer_pad_type;
  formData.wafer_send_quantity = req.wafer_send_quantity;
  formData.wafer_mes_code = req.wafer_mes_code;
  formData.wafer_mark = req.wafer_mark;
  formData.wafer_lot_no = req.wafer_lot_no;
  formData.wafer_chip_qty = req.wafer_chip_qty;

  formData.pkg_size = req.pkg_size;
  formData.pkg_erp_code = req.pkg_erp_code;
  formData.pkg_meterial = req.pkg_meterial;
  formData.pkg_note = req.pkg_note;

  formData.epoxy_model = req.epoxy_model;
  formData.epoxy_thickness = req.epoxy_thickness;

  formData.bb_ballsize = req.bb_ballsize;

  formData.bg_thickness = req.bg_thickness;
  formData.bg_afterthickness = req.bg_afterthickness;
  formData.dc_meterial = req.dc_meterial;
  formData.mk_note = req.mk_note;
  formData.pd_dicing_line_size = req.pd_dicing_line_size;
  formData.pd_note = req.pd_note;
  formData.el_link_method = req.el_link_method;
  formData.el_EVB_setup_port = req.el_EVB_setup_port;
  formData.analysis_fa_item = req.analysis_fa_item;
  req.reliability_item != null && (formData.reliability_item = req.reliability_item);
  req.others_cer_check != null && (formData.others_cer_check = req.others_cer_check);
  formData.fb_2_spl = req.fb_2_spl;
  formData.fb_direction = req.fb_direction;
  formData.fb_note = req.fb_note;
  formData.fb_1_numbering = req.fb_1_numbering;
  formData.mk_marking = req.mk_marking;

  formData.default_modelName = req.default_modelName
  formData.default_purpose = req.default_purpose
  formData.default_requireName = req.default_requireName

  formData.wafer_lot_no = req.wafer_lot_no
  formData.system_erp_wafer = req.system_erp_wafer
  formData.system_erp_pkg = req.system_erp_pkg
  formData.system_erp_epoxy = req.system_erp_epoxy
  formData.system_mes_wafer = req.system_mes_wafer
  formData.system_mes_pkg = req.system_mes_pkg
  formData.system_mes_epoxy = req.system_mes_epoxy
  formData.wafer_mes_code = req.system_mes_wafer
  formData.pkg_erp_code = req.system_erp_pkg

  formData.wafer_chip_qty = req.wafer_chip_qty
  formData.wafer_send_quantity = req.wafer_send_quantity
  formData.wafer_chip_size = req.wafer_chip_size
  formData.wafer_thickness = req.wafer_thickness
  formData.bb_ballsize = req.bb_ballsize
  formData.default_productSize = req.default_productSize
  formData.dc_blade_thickness = req.dc_blade_thickness
  formData.dc_thickness = req.dc_thickness


  // image seting
  if (req.image_List && req.image_List.length > 0) {
    console.log(req.image_List);
    req.image_List.forEach((item) => {
      if (item.cell_name === 'FB1') {
        existingFB1.value.push(item);
      } else if (item.cell_name === 'FB2') {
        existingFB2.value.push(item);
      } else if (item.cell_name === 'FB3') {
        existingFB3.value.push(item);
      } else if (item.cell_name === 'FB4') {
        existingFB4.value.push(item);
      } else if (item.cell_name === 'MK1') {
        existingMK1.value.push(item);
      } else if (item.cell_name === 'EV1') {
        existingEV1.value.push(item);
      }
      else if (item.cell_name === 'SS1') {
        filesetSS1.value.push(item);
      } else if (item.cell_name === 'WMA1') {
        filesetMWA1.value.push(item);
      } else if (item.cell_name === 'PMAP1') {
        filesetPMAP1.value.push(item);
      } else if (item.cell_name === 'WMAP1') {
        filesetWMAP1.value.push(item);
      }
    });
  }


}
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
@import "../../../assets/style/cspRequest.css";
</style>
