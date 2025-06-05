<template>
  <div class="fab-application-form">
    <el-row :gutter="20" class="form-row">
      <el-col :span="6">
        <SelectOptionsNew2
          v-model="props.fabApplication.bandGroupId"
          label="Freq Range"
          :needBold="false"
          :disable="false"
          :options="freqRangeList"
        />
      </el-col>
      <el-col :span="6">
        <SelectOptionsNew2
          v-model="props.fabApplication.waferType"
          label="Filter Tech"
          :needBold="false"
          :disable="false"
          :options="getWaferList()"
        />
      </el-col>
      <el-col :span="6">
        <SelectOptionsNew2
          v-model="props.fabApplication.destinationId"
          label="Assay Site"
          prop="process"
          placeholder="EX) WHC or WTC"
          :options="destinationList"
          :disable="false"
          class="wide-select"
        />
      </el-col>
      <el-col :span="6">
        <SelectOptionsNew2
          v-model="props.fabApplication.packageId"
          label="Package"
          prop="process"
          placeholder="CSP or WLP"
          :options="packageList"
          :disable="false"
          class="wide-select"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20" class="form-row">
      <el-col :span="7">
        <input-text
          v-model="props.fabApplication.productName"
          props="ProductName"
          label="Product Name"
        />
      </el-col>
      <el-col :span="7">
        <input-text
          v-model="props.fabApplication.bomMainCode"
          props="Code"
          label="대표코드"
          :disable="true"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20" class="form-row">
      <el-col :span="4">
        <SelectCheckBox
          v-model="props.fabApplication.isAoi"
          label="AOI"
          prop="isAoi"
          :disable="false"
          :rules="[]"
          class="wide-select"
        />
      </el-col>
      <el-col :span="4"
        ><SelectCheckBox
          v-model="props.fabApplication.isDv2"
          label="DV2"
          prop="isDv2"
          :disable="false"
          :rules="[]"
          class="wide-select"
        />
      </el-col>
      <el-col :span="4"
        ><SelectCheckBox
          v-model="props.fabApplication.isNeedEngineerCall"
          label="개발자 Call"
          prop="isNeedEngineerCall"
          :disable="false"
          :rules="[]"
          class="wide-select"
        />
      </el-col>
      <el-col :span="4"
        ><SelectCheckBox
          v-model="props.fabApplication.isAlPad"
          label="AL PAD 적용"
          prop="isAlPad"
          :disable="false"
          :rules="[]"
          class="wide-select"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <SelectOptionsNew2
          v-model="props.fabApplication.customerId"
          label="Customer (고객사)"
          prop="cusomterId"
          placeholder="EX) K1 or 전장"
          :options="clients"
          :disable="false"
          class="wide-select"
        />
      </el-col>
      <el-col :span="6">
        <input-text-by-recommad
          v-model="props.fabApplication.samplePurpose"
          label="샘플용도"
          prop="cusomterId"
          placeholder="EX) DVR"
          :options="samplePurposeOptions"
          :disable="false"
          class="wide-select"
      /></el-col>
      <el-col :span="6">
        <input-text-by-recommad
          v-model="props.fabApplication.samplePurposeDetail"
          label="　"
          prop="cusomterId"
          placeholder="EX) 내부 평가용"
          :options="samplePurposeContentOptions"
          :disable="false"
          class="wide-select"
      /></el-col>
    </el-row>
    <div class="form-row">
      <LongInputText
        v-model="props.fabApplication.note"
        label="용도 / 목적"
        class="custom-input"
        :row-cnt="'2'"
      />
    </div>
    <User2
      v-model:fabApplication="props.fabApplication"
      designer-prop="designerId"
      requester-prop="requesterId"
    ></User2>

    <!-- 두 번째 행 -->
    <el-row :gutter="20" class="form-row">
      <el-col :span="6">
        <InputText
          v-model="props.fabApplication.band"
          label="Band"
          prop="band"
          :rules="[]"
          placeholder="Enter Band Info"
        ></InputText>
      </el-col>
      <el-col :span="6">
        <SelectOptionsNew2
          v-if="props.fabApplication.destinationId !== '개발전달'"
          label="Filter Type"
          prop="filterType"
          v-model="props.fabApplication.filterType"
          :options="filterTypeList"
        ></SelectOptionsNew2>
      </el-col>
      <el-col :span="6">
        <select-number-option
          label="Assay Chip 수"
          prop="AssyChipQuantity"
          v-model="props.fabApplication.assyChipQuantity"
          :options="getOptionNumbers(1, 6)"
        />
      </el-col>
      <el-col :span="6">
        <input-text
          v-model="props.fabApplication.priorityId"
          prop="process"
          label="Priority"
          :disable="true"
        />
        <!-- <SelectOptionsNew2
          v-model="props.fabApplication.priorityId"
          label="Priority"
          prop="process"
          placeholder="긴급도를 선택하세요"
          :options="priorityList"
          :disable="true"
          class="wide-select"
        /> -->
      </el-col>
    </el-row>

    <el-row :gutter="20" class="form-row">
      <el-col :span="6">
        <input-text
          v-model="props.fabApplication.maskTurn"
          label="Mask 차수"
          prop="maskTurn"
          placeholder=""
          :disable="false"
          class="wide-select"
        />
      </el-col>
      <el-col :span="6">
        <InputNumber
          v-model="props.fabApplication.maskCd"
          label="Mask CD"
          placeholder=""
          :disable="false"
          class="wide-select"
        />
      </el-col>
      <el-col :span="6">
        <InputNumber
          v-if="props.sawType.sawTypeId === 'TC'"
          v-model="props.fabApplication.aspectRatio"
          label="Aspect Ratio"
          placeholder=""
          :disable="false"
          class="wide-select"
        />
      </el-col>
    </el-row>

    <!--  MHM08AA4001A , MH748AA40L1A -->
    <ApplicationChip
      v-model:fabApplication="props.fabApplication"
    ></ApplicationChip>

    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <SelectNumberOption
          v-model="props.fabApplication.quantity"
          label="Quantity (Wafer)"
          prop="process"
          placeholder="EX) Filter Type"
          :options="getOptionNumbers(1, 24)"
          :disable="false"
          class="wide-select"
        />
      </el-col>
      <el-col :span="12">
        <SelectOptionsNew2
          v-model="props.fabApplication.code"
          label="C/H Code"
          placeholder="EX) C or H"
          :options="codeList"
          :disable="false"
          class="wide-select"
        />
      </el-col>
    </el-row>

    <!-- 날짜 선택 -->
    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <el-form-item label="FAB Est Start (Fab 투입 예정일)" prop="wantedFabStartDate">
          <el-date-picker
            type="date"
            placeholder="FAB Est Start"
            v-model="props.fabApplication.wantedFabStartDate"
            class="custom-date-picker"
            :label-position="'left'"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!-- <el-form-item label="FAB 완료 예정일" class="date-picker-container"> -->
        <el-form-item label="FAB Est Out (Fab 완료 예정일)" prop="wantedFabFinishDate">
          <el-date-picker
            type="date"
            placeholder="FAB Est Complete"
            v-model="props.fabApplication.wantedFabFinishDate"
            class="custom-date-picker"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 날짜 선택 -->
    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <el-form-item label="MASK 입고일 IDT" prop="idtMaskArrivalDate">
          <el-date-picker
            type="date"
            placeholder="FAB Est Start"
            v-model="props.fabApplication.idtMaskArrivalDate"
            class="custom-date-picker"
            :label-position="'left'"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!-- <el-form-item label="FAB 완료 예정일" class="date-picker-container"> -->
        <el-form-item label="MASK 입고일 PST" prop="pstMaskArrivalDate">
          <el-date-picker
            type="date"
            placeholder="FAB Est Complete"
            v-model="props.fabApplication.pstMaskArrivalDate"
            class="custom-date-picker"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 용도 / 목적 -->
    <Bom
      v-if="props.fabApplication.isNewBom"
      v-model:fabApplication="props.fabApplication"
      :bom="props.fabApplication.bom"
      :sawType="sawType"
      :bom-number="'Bom1'"
    ></Bom>
    <Bom
      v-if="props.fabApplication.isNewBom2"
      v-model:fabApplication="props.fabApplication"
      :bom="props.fabApplication.bom2"
      :sawType="sawType"
      :bom-number="'Bom2'"
    ></Bom>
    <idt-process
      :fab-application="props.fabApplication"
      :saw-type="props.sawType"
    />

    <div class="form-row">
      <!-- <long-input-text
          v-model="props.fabApplication.purpose"
          label="기타 상세"
          class="custom-input"
          :row-cnt="'3'"
        /> -->
      <extraProcess
        v-model:fabApplication="props.fabApplication"
        :sawType="sawType"
      ></extraProcess>
      <note-section
        :fab-application="props.fabApplication"
        :saw-type="props.sawType"
      ></note-section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { getWaferList } from "../../../utils/Fab/fab_application-wafer-utils";
import { filterTypeOptions } from "../../../utils/dropdown-options";
import type {
  FabRequestForm,
  SawType,
  BomCode,
} from "../../../interface/fab-application-rev2";
import SelectOptions from "../../Common/SelectOptions.vue";
import SelectCheckBox from "../../Common/SelectCheckBox.vue";
import InputTextByRecommad from "../../Common/InputTextByRecommad.vue";
import InputText from "../../Common/InputText.vue";
import InputNumber from "../../Common/InputNumber.vue";

import BooleanInput from "../../Common/SelectBoolean.vue";
import LongInputText from "../../Common/LongInputText2.vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import User2 from "../../Common/User2.vue";
import ProductName from "./ProductName.vue";
import { getOptionNumbers } from "../../../utils/Fab/options";
import SelectNumberOption from "../../Common/SelectNumberOption.vue";
import ApplicationChip from "./ApplicationSize.vue";
import type { OptionInterface } from "../../../interface/option";
import {
  receiveDestinationList,
  receivePriorityList,
  receivefilterTypeList,
  getCostomerList,
  getBomCodeList,
  addWorkdays,
  calFabOutLeadTime,
} from "../../../utils/Fab/fab-application-utils";
import extraProcess from "./extra_process/ExtraProcess.vue";
import IdtProcess from "./IdtProcess.vue";
import Dvb from "./dvr/Dvr.vue";
import BandSection from "./band/band.vue";
import NoteSection from "./Note.vue";
import {
  groupList,
  processList,
  // destinationList,
  getSampleQuantityOptions,
  codeList,
  waferTypes,
  waferComList,
  machineList,
  sendFormData,
  freqRangeList,
  samplePurposeOptions,
  samplePurposeContentOptions,
} from "../Common/Application";
import axios from "axios";
import { Option } from "element-plus/es/components/select-v2/src/select.types";
import { initBom } from "../../../utils/Fab/bom-utils";
import Bom from "./bom/Bom.vue";
import { rules } from "../../Solder/Stock/Common/ApplicationRules";
import { composeEventHandlers } from "element-plus/es/utils";
import {getPackageList} from "../../../utils/utility"

const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
  applicationType: string;
}>();

const bomCodeList = ref<BomCode[]>([]);
const destinationList = ref<OptionInterface[]>([]);
const priorityList = ref<OptionInterface[]>([]);
const filterTypeList = ref<OptionInterface[]>([]);
const clients = ref<OptionInterface[]>([]);
const packageList = ref<OptionInterface[]>([]);

onMounted(async () => {
  destinationList.value = await receiveDestinationList();
  priorityList.value = await receivePriorityList();
  filterTypeList.value = await receivefilterTypeList();
  clients.value = await getCostomerList();
  bomCodeList.value = await getBomCodeList();
  packageList.value = await getPackageList();
});

watch(
  () => props.fabApplication.productName,
  (newVal) => {
    if (bomCodeList.value.length === 0) {
      console.warn("bomCodeList.value가 비어 있음");
      return;
    }

    if (newVal.length >= 10) {
      let isFound = false;
      const tempname = newVal.slice(0, 10);

      for (let i = 0; i < bomCodeList.value.length; i++) {
        if (bomCodeList.value[i].MATNR.slice(0, 10) === tempname) {
          const tempBomCode =
            bomCodeList.value[i].MAKTX.split(":")[1]?.replace(/\s+/g, "") || "";

          if (tempBomCode !== props.fabApplication.bomMainCode) {
            props.fabApplication.bomMainCode = tempBomCode
            isFound = true;
            break; // ✅ `return` 대신 `break` 사용
          }
        }
      }

      if (!isFound) {
        props.fabApplication.bomMainCode = "";
        props.fabApplication.isNewBom = true;
      } else {
        console.log("Comes to Here?")
        props.fabApplication.isNewBom = false;
        props.fabApplication.isNewBom2 = false;
        props.fabApplication.bom = null;
        props.fabApplication.bom2 = null;
      }
    }
  }
);

watch(
  () => props.fabApplication.packageId,
  (newVal) => {
    if (newVal === "CSP") {
      if (props.fabApplication.bomMainCode === "") {
        props.fabApplication.bom = initBom();
        props.fabApplication.isNewBom = true;
      } else {
        props.fabApplication.isNewBom = false;
        props.fabApplication.bom = null;
      }
    } else {
      props.fabApplication.isNewBom = false;
      props.fabApplication.bom = null;
    }
  }
);

watch(
  () => props.fabApplication.isNewBom,
  (newVal) => {
    if (newVal !== null) {
      if (newVal) {
        props.fabApplication.bom = initBom();
      } else {
        props.fabApplication.bom = null;
      }
    }
  }
);

watch(
  () => props.fabApplication.isDv2,
  (newVal) => {
    if (newVal) {
      if (props.fabApplication.note === "") {
        props.fabApplication.note = "DV2 LOT";
      } else {
        props.fabApplication.note += " DV2 LOT";
      }
    }
  }
);

watch(
  () => props.fabApplication.packageId,
  (newVal) => {
    if (
      newVal === "CSP" &&
      props.fabApplication.bom === null &&
      props.fabApplication.bomMainCode === ""
    ) {
      props.fabApplication.bom = initBom();
    }
  }
);

watch(
  () => props.fabApplication.isNewBom2,
  (newVal) => {
    if (newVal) {
      if (props.fabApplication.bom2 === null) {
        props.fabApplication.bom2 = initBom();
      }
    } else {
      props.fabApplication.bom2 = null;
    }
  }
);

const emit = defineEmits(["update:fabApplication"]);
// $computed로 props와 emit 동기화
const localFabApplication = computed({
  get: () => props.fabApplication,
  set: (newValue) => emit("update:fabApplication", newValue), // 부모로 전달
});

const trackedValues = computed(() => ({
  sawTypeId: props.sawType.sawTypeId,
  wantedFabStartDate: props.fabApplication.wantedFabStartDate,
  packageId: props.fabApplication.packageId,
  isDualIdt: props.fabApplication.isDualIdt,
  isMst: props.fabApplication.isMst,
}));

const expectedDate = ref<number>(0);
watch(trackedValues, (newValues) => {
  if (newValues.sawTypeId !== null && newValues.wantedFabStartDate !== null) {
    expectedDate.value = calFabOutLeadTime(
      props.fabApplication,
      props.sawType.sawTypeId
    );
    props.fabApplication.wantedFabFinishDate = addWorkdays(
      new Date(newValues.wantedFabStartDate),
      expectedDate.value
    ).toString();
  }
});
</script>
<script lang="ts">
export default {};
</script>
<style scoped>
/* 전체 폼
  LongInputText 컨테이너 */
.fab-application-form {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 행 간격 설정 */
.form-row {
  margin-bottom: 16px;
}

/* 넓은 선택 상자 스타일 */
.wide-select {
  width: 100%;
}

/* 입력 스타일 */
.custom-input {
  width: 100%;
}

/* 날짜 선택기 스타일 */
.custom-date-picker {
  width: 100%;
}

.date-picker-container {
  display: flex;
}
</style>
