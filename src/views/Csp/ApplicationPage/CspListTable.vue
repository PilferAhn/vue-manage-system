<template>
  <el-table :data="cspTableData" style="width: 100%">
    <el-table-column prop="default_modelName" label="모델명" />
    <el-table-column prop="default_requireName" label="요구자" />
    <el-table-column prop="default_requireDate" label="요구일" />
    <el-table-column prop="default_requireAmount" label="요구수량" />
    <el-table-column prop="default_pkgRequirement" label="패키지 요구사항" />
    <el-table-column prop="default_productSize" label="제품 크기" />
    <el-table-column prop="default_purpose" label="용도" />

    <el-table-column prop="system_erp_wafer" label="ERP Wafer" />
    <el-table-column prop="system_erp_pkg" label="ERP 패키지" />
    <el-table-column prop="system_erp_epoxy" label="ERP 에폭시" />

    <el-table-column prop="system_mes_wafer" label="MES Wafer" />
    <el-table-column prop="system_mes_pkg" label="MES 패키지" />
    <el-table-column prop="system_mes_epoxy" label="MES 에폭시" />

    <el-table-column prop="wafer_chip_size" label="칩 사이즈" />
    <el-table-column prop="wafer_thickness" label="웨이퍼 두께" />
    <el-table-column prop="wafer_pad_type" label="패드 타입" />
    <el-table-column prop="wafer_send_quantity" label="보내는 수량" />
    <el-table-column prop="wafer_mes_code" label="MES 코드" />
    <el-table-column prop="wafer_mark" label="마크" />
    <el-table-column prop="wafer_lot_no" label="Lot No" />
    <el-table-column prop="wafer_chip_qty" label="Chip 수량" />

    <el-table-column prop="pkg_size" label="패키지 사이즈" />
    <el-table-column prop="pkg_erp_code" label="패키지 ERP 코드" />
    <el-table-column prop="pkg_meterial" label="패키지 재질" />
    <el-table-column prop="pkg_note" label="패키지 비고" />

    <el-table-column prop="epoxy_model" label="에폭시 모델" />
    <el-table-column prop="epoxy_thickness" label="에폭시 두께" />

    <el-table-column prop="bb_ballsize" label="볼 사이즈" />

    <el-table-column prop="bg_thickness" label="BG 두께" />
    <el-table-column prop="bg_afterthickness" label="BG 후두께" />

    <el-table-column prop="dc_meterial" label="DC 재질" />
    <el-table-column prop="mk_note" label="마킹 비고" />

    <el-table-column prop="pd_dicing_line_size" label="다이싱 라인" />
    <el-table-column prop="pd_note" label="패드 비고" />

    <el-table-column prop="el_link_method" label="연결 방식" />
    <el-table-column prop="el_EVB_setup_port" label="EVB 세팅 포트" />

    <el-table-column prop="analysis_fa_item" label="FA 분석 항목" />
    <el-table-column prop="reliability_item" label="신뢰성 항목" />

    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleExcelClick(scope.row)">
          EXCEL
        </el-button>
        <!-- <el-button link type="primary" size="small">Edit</el-button> -->
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleWebViewClick(scope.row)">
          WebView
        </el-button>
      </template>
    </el-table-column>


  </el-table>
</template>

<script lang="ts" setup>

import { watch, watchEffect } from 'vue';
import { Router, useRouter } from "vue-router";
 
import { excelDownloadOne } from '../../../utils/cspRequestFormUtill'
const props = defineProps<{ cspTableData: Array<any> }>();
const router = useRouter();
watch(
  () => props.cspTableData,
  (val) => {
    console.log("📡 전달된 props 변경됨:", val);
  },
  { immediate: true, deep: true }
);
watchEffect(() => {
  console.log("📡 watchEffect: 테이블 데이터 변경 감지됨", props.cspTableData);
});

const handleExcelClick = (row: any) => {
  console.log('클릭한 행의 model_name:', row.default_modelName);
  excelDownloadOne( row.default_modelName)
};
const handleWebViewClick = (row: any) => {
  console.log('클릭한 행의 model_name:', row.default_modelName);
  router.push({
      name:"CSPFormView",
      params: { productName: row.default_modelName },
    })
};


</script>
