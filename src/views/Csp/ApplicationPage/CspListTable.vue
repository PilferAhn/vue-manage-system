<template>
  <!-- ✅ 컬럼 그룹 토글 UI -->
  <div class="col-toggle">
    <el-checkbox-group v-model="enabledGroups">
      <el-checkbox v-for="g in groupOrder" :key="g.key" :label="g.key">
        {{ g.label }}
      </el-checkbox>
    </el-checkbox-group>

    <el-button size="small" @click="enableAll">전체</el-button>
    <el-button size="small" @click="enableCoreOnly">기본</el-button>
  </div>
  <div class="table-wrapper">
    <el-table :data="customList" style="width: 100%" border stripe height="600">
      <el-table-column v-if="isOn('core')" fixed="left" prop="default_modelName" label="모델명" min-width="160" />
      <el-table-column v-if="isOn('core')" prop="form_status" label="상태" width="110">

        <template #default="scope">
          <el-tag :type="getTagType(scope.row.form_status)">
            {{ scope.row.form_status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="isOn('core')" prop="box_id" label="boxid" width="110" />
      <el-table-column v-if="isOn('core')" prop="tx_date" label="출하일" width="110" />

      <el-table-column v-if="isOn('core')" prop="default_requireName" label="요구자" width="120" />
      <el-table-column v-if="isOn('core')" prop="default_requireDate" label="요구일" width="120" />
      <el-table-column v-if="isOn('core')" prop="default_requireAmount" label="요구수량" width="110" />

      <el-table-column v-if="isOn('default')" prop="default_pkgRequirement" label="패키지 요구사항" min-width="160" />
      <el-table-column v-if="isOn('default')" prop="default_productSize" label="제품 크기" min-width="120" />
      <el-table-column v-if="isOn('default')" prop="default_purpose" label="용도" min-width="120" />

      <el-table-column v-if="isOn('erp')" prop="system_erp_wafer" label="ERP Wafer" min-width="140" />
      <el-table-column v-if="isOn('erp')" prop="system_erp_pkg" label="ERP 패키지" min-width="140" />
      <el-table-column v-if="isOn('erp')" prop="system_erp_epoxy" label="ERP 에폭시" min-width="140" />

      <el-table-column v-if="isOn('mes')" prop="system_mes_wafer" label="MES Wafer" min-width="140" />
      <el-table-column v-if="isOn('mes')" prop="system_mes_pkg" label="MES 패키지" min-width="140" />
      <el-table-column v-if="isOn('mes')" prop="system_mes_epoxy" label="MES 에폭시" min-width="140" />

      <el-table-column v-if="isOn('wafer')" prop="wafer_chip_size" label="칩 사이즈" min-width="120" />
      <el-table-column v-if="isOn('wafer')" prop="wafer_thickness" label="웨이퍼 두께" min-width="120" />
      <el-table-column v-if="isOn('wafer')" prop="wafer_pad_type" label="패드 타입" min-width="120" />
      <el-table-column v-if="isOn('wafer')" prop="wafer_send_quantity" label="보내는 수량" min-width="120" />
      <el-table-column v-if="isOn('wafer')" prop="wafer_mes_code" label="MES 코드" min-width="120" />
      <el-table-column v-if="isOn('wafer')" prop="wafer_mark" label="마크" min-width="120" />
      <el-table-column v-if="isOn('wafer')" prop="wafer_lot_no" label="Lot No" min-width="140" />
      <el-table-column v-if="isOn('wafer')" prop="wafer_chip_qty" label="Chip 수량" min-width="120" />

      <el-table-column v-if="isOn('pkg')" prop="pkg_size" label="패키지 사이즈" min-width="140" />
      <el-table-column v-if="isOn('pkg')" prop="pkg_erp_code" label="패키지 ERP 코드" min-width="160" />
      <el-table-column v-if="isOn('pkg')" prop="pkg_meterial" label="패키지 재질" min-width="140" />
      <el-table-column v-if="isOn('pkg')" prop="pkg_note" label="패키지 비고" min-width="140" />

      <el-table-column v-if="isOn('epoxy')" prop="epoxy_model" label="에폭시 모델" min-width="140" />
      <el-table-column v-if="isOn('epoxy')" prop="epoxy_thickness" label="에폭시 두께" min-width="140" />
      <el-table-column v-if="isOn('epoxy')" prop="bb_ballsize" label="볼 사이즈" min-width="120" />
      <el-table-column v-if="isOn('epoxy')" prop="bg_thickness" label="BG 두께" min-width="120" />
      <el-table-column v-if="isOn('epoxy')" prop="bg_afterthickness" label="BG 후두께" min-width="120" />

      <el-table-column v-if="isOn('etc')" prop="dc_meterial" label="DC 재질" min-width="120" />
      <el-table-column v-if="isOn('etc')" prop="mk_note" label="마킹 비고" min-width="140" />
      <el-table-column v-if="isOn('etc')" prop="pd_dicing_line_size" label="다이싱 라인" min-width="140" />
      <el-table-column v-if="isOn('etc')" prop="pd_note" label="패드 비고" min-width="140" />
      <el-table-column v-if="isOn('etc')" prop="el_link_method" label="연결 방식" min-width="140" />
      <el-table-column v-if="isOn('etc')" prop="el_EVB_setup_port" label="EVB 세팅 포트" min-width="160" />

      <el-table-column v-if="isOn('analysis')" prop="analysis_fa_item" label="FA 분석 항목" min-width="160" />
      <el-table-column v-if="isOn('analysis')" prop="reliability_item" label="신뢰성 항목" min-width="160" />

      <el-table-column fixed="right" label="EXCEL" width="110">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleExcelClick(scope.row)">
            EXCEL
          </el-button>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="WebView" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleWebViewClick(scope.row)">
            WebView
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { excelDownloadOne } from "../../../utils/cspRequestFormUtill";

const props = defineProps<{ customList: Array<any> }>();
const router = useRouter();

const groupOrder = [
  { key: "core", label: "기본" },
  { key: "default", label: "기본(확장)" },
  { key: "erp", label: "ERP" },
  { key: "mes", label: "MES" },
  { key: "wafer", label: "Wafer" },
  { key: "pkg", label: "PKG" },
  { key: "epoxy", label: "Epoxy/BG" },
  { key: "etc", label: "기타(DC/MK/PD/EL)" },
  { key: "analysis", label: "분석/신뢰성" },
] as const;

type GroupKey = typeof groupOrder[number]["key"];

/** ✅ 기본으로 켜둘 그룹 (원하면 바꾸면 됨) */
const enabledGroups = ref<GroupKey[]>(["core", "default", "erp", "mes"]);

const isOn = (k: GroupKey) => enabledGroups.value.includes(k);

const enableAll = () => {
  enabledGroups.value = groupOrder.map(g => g.key);
};

const enableCoreOnly = () => {
  enabledGroups.value = ["core"];
};

const boxIdFormat = (str: string) => {
  if (!str) return '';

  const [datePart] = str.split('/');     // 20260102122811
  const yyyyMMdd = datePart.substring(0, 8);

  return yyyyMMdd;
};


const getTagType = (status: string) => {
  switch (status) {
    case "완료":
      return "primary";
    case "임시저장":
      return "warning";
    default:
      return "info";
  }
};

const handleExcelClick = (row: any) => {
  excelDownloadOne(row.default_modelName);
};

const handleWebViewClick = (row: any) => {
  router.push({
    name: "CSPFormView",
    params: { productName: row.default_modelName },
  });
};
</script>

<style scoped>
.col-toggle {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

/* el-table 내부 가로 스크롤바 */
:deep(.el-scrollbar__bar.is-horizontal) {
  height: 14px !important;   /* 원하는 두께 */  
  bottom: 0 !important;
}

:deep(.el-scrollbar__bar.is-horizontal .el-scrollbar__thumb) {
  height: 100% !important;
}
</style>
