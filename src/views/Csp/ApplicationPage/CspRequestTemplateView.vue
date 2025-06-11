<template>
  <!-- <div v-if="username === '이정민'"> -->
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
                  <td colspan="2">
                    {{ `${formData.default_modelName}` }}
                  </td>

                  <td colspan="1" class="hcell">Người yêu cầu<br />의뢰인</td>
                  <td colspan="1"> {{ formData.default_requireName }} </td>
                  <td colspan="1" class="hcell">Ngày yêu cầu<br />의뢰날짜</td>
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
                  <td colspan="5">
                    {{ formData.default_pkgRequirement }}
                  </td>

                </tr>
                <tr>
                  <td colspan="1" class="hcell">Product Size</td>
                  <td colspan="2">
                    {{ `${formData.default_productSize}` }}

                  </td>

                  <td colspan="1" class="hcell">mục đích test<br />
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
                  <td colspan="1" rowspan="3" class="hcell">ERP BOM</td>
                  <td colspan="1">WAFER</td>
                  <td colspan="1">{{ `${formData.system_erp_wafer} &nbsp` }}</td>
                  <td colspan="1" rowspan="3" class="hcell">MES CODE
                  </td>
                  <td colspan="1">
                    WAFER
                  </td>
                  <td colspan="2">{{ `${formData.system_mes_wafer} &nbsp` }}</td>
                </tr>
                <tr>
                  <td colspan="1">PKG/PCB</td>

                  <td colspan="1">
                    {{ `${formData.system_erp_pkg} &nbsp` }}
                  </td>
                  <td colspan="1">PKG/PCB</td>
                  <td colspan="2">
                    {{ `${formData.system_mes_pkg}&nbsp` }}
                  </td>
                </tr>
                <tr>
                  <td colspan="1">EPOXY</td>
                  <td colspan="1">{{ `${formData.system_erp_epoxy}&nbsp` }}</td>
                  <td colspan="1">EPOXY</td>
                  <td colspan="2">{{ `${formData.system_mes_epoxy}&nbsp` }}</td>
                </tr>
                <!-- MERERIAL Wafer -->
                <tr>
                  <td rowspan="4" class="hcell">
                    Wafer
                  </td>
                  <td class="hcell">
                    Chip size
                  </td>
                  <td colspan="2">
                    {{ formData.wafer_chip_size }}
                  </td>
                  <td class="hcell">
                    Wafer Thickness
                  </td>
                  <td colspan="3">
                    {{ `${formData.wafer_thickness}` }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell">
                    PAD Type/유형
                  </td>
                  <td colspan="2">
                    {{ formData.wafer_pad_type }}

                  </td>
                  <td class="hcell">
                    Số lượng gửi <br />
                    발송수량
                  </td>
                  <td colspan="3">
                    {{ formData.wafer_send_quantity }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell">
                    MES Code
                  </td>

                  <td colspan="2">
                    {{ formData.system_mes_wafer }}
                  </td>
                  <td class="hcell">
                    Wafer Mark
                  </td>
                  <td colspan="3">
                    {{ formData.wafer_mark }}
                  </td>
                </tr>
                <tr>
                  <td class="hcell">
                    Wafer LOT NO
                  </td>
                  <td colspan="2">
                    {{ formData.wafer_lot_no }}
                  </td>


                  <td class="hcell">
                    Chip Qty
                  </td>
                  <td colspan="3">
                    {{ `${formData.wafer_chip_qty}*${formData.wafer_send_quantity}` }}
                  </td>
                </tr>


                <!-- MERERIAL PKG -->


                <tr>
                  <td rowspan="3" class="hcell">
                    PKG
                  </td>
                  <td class="hcell">
                    PKG <br /> Số hàng * Số cột
                  </td>
                  <td colspan="2">
                    {{ formData.pkg_size }}
                  </td>
                  <td class="hcell">
                    ERP Code
                  </td>
                  <td colspan="3">
                    {{ formData.system_erp_wafer }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell">
                    Chât liệu <br /> 재질
                  </td>
                  <td colspan="6">
                    {{ formData.pkg_meterial }}
                  </td>

                </tr>
                <tr>

                  <td class="hcell">
                    Mục chú ý <br />주의사항
                  </td>
                  <td colspan="6">
                    {{ formData.pkg_note }}
                  </td>
                </tr>
                <tr>
                  <td rowspan="1" class="hcell">
                    Epoxy
                  </td>
                  <td class="hcell">
                    Model
                  </td>
                  <td colspan="2">
                    {{ formData.epoxy_model }}

                  </td>
                  <td class="hcell">
                    Thickness
                  </td>
                  <td colspan="3">
                    {{ formData.epoxy_thickness }}
                  </td>
                </tr>



                <!-- 중점공정 -->
                <tr>
                  <td rowspan="10" class="hcell">
                    Trọng tâm công đoạn <br />
                    중점공정
                  </td>
                  <td class="hcell" colspan="1">
                    B/B
                  </td>
                  <td class="hcell" colspan="1">
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
                  <td colspan="2">
                    {{ formData.bg_thickness }}

                  </td>
                  <td class="hcell" colspan="1">
                    Độ dày sau B/G <br />
                    B/G후두께
                  </td>
                  <td colspan="3">
                    {{ formData.bg_afterthickness }}

                  </td>
                </tr>
                <tr>

                  <td class="hcell" colspan="1">
                    D/C
                  </td>
                  <td class="hcell" colspan="1">
                    Phân loại chất liệu
                  </td>
                  <td colspan="6">
                    {{ formData.dc_meterial }}

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
                    <div v-for="(img, index) in existingFB1" :key="'existing-' + index"
                      style="position: relative; display: inline-block; margin: 10px;">
                      <img :src="img.url" style="max-width:200px;" />
                    </div>

                  </td>

                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <!-- <td colspan="3">
                    img
                  </td> -->
                  <td colspan="3">
                    <div v-for="(img, index) in existingFB2" :key="'existing-' + index"
                      style="position: relative; display: inline-block; margin: 10px;">
                      <img :src="img.url" style="max-width:200px;" />


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
                    <div v-for="(img, index) in existingFB3" :key="'existing-' + index"
                      style="position: relative; display: inline-block; margin: 10px;">
                      <img :src="img.url" style="max-width:200px;" />


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
                    <div v-for="(img, index) in existingMK1" :key="'existing-' + index"
                      style="position: relative; display: inline-block; margin: 10px;">
                      <img :src="img.url" style="max-width:200px;" />


                    </div>
                  </td>
                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <td colspan="3">
                    {{ formData.mk_note }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell" colspan="1">
                    P/D
                  </td>
                  <td class="hcell" colspan="1">
                    Dicing Line Size

                  </td>
                  <td colspan="2">
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
                  <td colspan="2">
                    {{ formData.el_link_method }}
                  </td>
                  <td class="hcell" colspan="1">
                    EVB Setup Port
                  </td>
                  <td colspan="3">
                    {{ formData.el_EVB_setup_port }}
                  </td>

                </tr>


                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    Analysis FA
                  </td>
                  <td class="hcell" colspan="1">
                    Item /항목
                  </td>
                  <td colspan="6">
                    {{ formData.analysis_fa_item }}
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
                  <td colspan="6">
                    <el-checkbox :label="'PV'" :true-label="'PV'" :false-label="''" v-model="formData.reliability_item"
                      :disabled="true" :class="{ 'highlighted-checkbox': formData.reliability_item.includes('PV') }">
                      PV
                    </el-checkbox>

                    <el-checkbox :label="'PRA'" :true-label="'PRA'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('PRA') }">
                      PRA
                    </el-checkbox>

                    <el-checkbox :label="'PCCB'" :true-label="'PCCB'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('PCCB') }">
                      PCCB
                    </el-checkbox>

                    <el-checkbox :label="'Pre_Condition'" :true-label="'Pre_Condition'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('Pre_Condition') }">
                      Pre.Condition
                    </el-checkbox>

                    <el-checkbox :label="'LTS'" :true-label="'LTS'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('LTS') }">
                      LTS
                    </el-checkbox>

                    <el-checkbox :label="'HTS'" :true-label="'HTS'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('HTS') }">
                      HTS
                    </el-checkbox>

                    <el-checkbox :label="'HTHHS'" :true-label="'HTHHS'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('HTHHS') }">
                      HTHHS
                    </el-checkbox>

                    <el-checkbox :label="'uHAST'" :true-label="'uHAST'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('uHAST') }">
                      uHAST
                    </el-checkbox>

                    <el-checkbox :label="'Dorp'" :true-label="'Dorp'" :false-label="''"
                      v-model="formData.reliability_item" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.reliability_item.includes('Dorp') }">
                      Dorp
                    </el-checkbox>
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
                      v-model="formData.others_cer_check" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.others_cer_check.includes('YES') }">
                      YES
                    </el-checkbox>
                    <el-checkbox :label="'NO'" :true-label="'NO'" :false-label="''"
                      v-model="formData.others_cer_check" :disabled="true"
                      :class="{ 'highlighted-checkbox': formData.others_cer_check.includes('NO') }">
                    
                      NO
                    </el-checkbox>
                  </td>
                </tr>

              </tbody>
            </table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-form>


  <!-- </div> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, reactive, Ref } from "vue";
 
import { useRoute } from "vue-router";
 
import type {
  ApplicationData,
} from "../../../interface/cspRequestFormInterface";
import { handleGetDataByModelCode, dataValidation, handleSubmitForm, getColumnData, handleSubmitTempForm } from '../../../utils/cspRequestFormUtill'

import { cspRequestRules } from "./CspRequestRules";

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
  mk_note: "",

  pd_dicing_line_size: "",
  pd_note: "",

  el_link_method: "",
  el_EVB_setup_port: "",

  analysis_fa_item: "",

  reliability_item: "",
  others_cer_check: "",
  fb_2_spl: ""
})


const formDataTemp = reactive<ApplicationData>({
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

  reliability_item: "",
  others_cer_check: "",
  fb_2_spl: ""
})
 

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
  default_productSize: ref([]),
  pd_dicing_line_size: ref([]),
  wafer_pad_type: ref([])
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

  loading.value = false;
  // formData.default_requireName = username.value;
  formData.default_requireDate = today.value;


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
});


async function handleEnter(value) {
  // const value = modelCell.value?.innerText.trim() || "";
  // const username = ref(localStorage.getItem('ms_username'));
  const req = await handleGetDataByModelCode(value);
  console.log(req.image_List);
  if (req.default_modelName === 'false') {
    alert(value + " NOT FOUND");
    return;
  }

  // 여기서 필요한 처리 수행 (예: 저장, API 호출 등)


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
  formData.reliability_item = req.reliability_item;
  formData.others_cer_check = req.others_cer_check;
  formData.fb_2_spl = req.fb_2_spl;

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

  formDataTemp.default_requireAmount = formData.default_requireAmount
  formDataTemp.default_pkgRequirement = formData.default_pkgRequirement
  formDataTemp.wafer_mark = formData.wafer_mark
  formDataTemp.pkg_size = formData.pkg_size
  formDataTemp.pkg_note = formData.pkg_note
  formDataTemp.fb_2_spl = formData.fb_2_spl
  formDataTemp.mk_note = formData.mk_note
  formDataTemp.pd_note = formData.pd_note
  formDataTemp.el_link_method = formData.el_link_method
  formDataTemp.el_EVB_setup_port = formData.el_EVB_setup_port
  formDataTemp.analysis_fa_item = formData.analysis_fa_item

  // image seting
  if (req.image_List && req.image_List.length > 0) {
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

<!-- 
  먼저 formDataTemp에 저장후 formData 로 이동 안그럼 content 모씀

-->