<template>
  <div class="fab-application-form">
    <SelectOptionsNew2
      v-model="props.fabApplication.waferType"
      label="공정 선택"
      :needBold="false"
      :disable="false"
      :options="getWaferList()"
    />
    <ProductName
      v-model:fabApplication="props.fabApplication"
      :sawType="sawType"
    />
    <!-- 첫 번째 행 -->
    <User2
      v-model:fabApplication="props.fabApplication"
      designer-prop="designerId"
      requester-prop="requesterId"
    ></User2>
    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <SelectOptionsNew2
          label="Filter Type"
          prop="filterType"
          v-model="props.fabApplication.filterType"
          :options="filterTypeList"
        ></SelectOptionsNew2>
      </el-col>
      <el-col :span="5">
        <BooleanInput
          v-model="props.fabApplication.isAoi"
          label="AOI 유무"
          prop="isAoi"
          :disable="false"
          :rules="[]"
          class="wide-select"
        />
      </el-col>
      <el-col :span="5">
        <BooleanInput
          v-model="props.fabApplication.isDvr"
          label="DVR 유무"
          prop="isDvr"
          :disable="false"
          :rules="[]"
          class="wide-select"
        />
      </el-col>
    </el-row>

    <!-- 두 번째 행 -->
    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <el-form-item label="Band">
          <el-select v-model="props.fabApplication.bandCombinationId">
            <el-option
              v-for="band in props.bandList"
              :key="band.bandCombinationId"
              :label="band.label"
              :value="band.bandCombinationId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
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
    </el-row>

    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <SelectOptionsNew2
          v-model="props.fabApplication.priorityId"
          label="Priority"
          prop="process"
          placeholder="긴급도를 선택하세요"
          :options="priorityList"
          :disable="false"
          class="wide-select"
        />
      </el-col>
      <el-col :span="12">
        <SelectOptions
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

    <ApplicationChip
      v-model:fabApplication="props.fabApplication"
    ></ApplicationChip>

    <el-row :gutter="20" class="form-row">
      <el-col :span="12">
        <SelectNumberOption
          v-model="props.fabApplication.quantity"
          label="Quantity"
          prop="process"
          placeholder="EX) Filter Type"
          :options="getOptionNumbers(1, 10)"
          :disable="false"
          class="wide-select"
        />
      </el-col>
      <el-col :span="12">
        <SelectOptionsNew2
          v-model="props.fabApplication.code"
          label="Code"
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
        <el-form-item label="FAB 시작일" class="date-picker-container">
          <el-date-picker
            type="date"
            placeholder="FAB 시작일"
            v-model="props.fabApplication.wantedFabStartDate"
            class="custom-date-picker"
            :label-position="'left'"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="FAB 종료일" class="date-picker-container">
          <el-date-picker
            type="date"
            placeholder="FAB 종료일"
            v-model="props.fabApplication.wantedFabFinishDate"
            class="custom-date-picker"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 용도 / 목적 -->
    <div class="form-row">
      <LongInputText
        v-model="props.fabApplication.note"
        label="용도 / 목적"
        class="custom-input"
      />
    </div>
    <div class="form-row">
      <!-- <long-input-text
        v-model="props.fabApplication.purpose"
        label="기타 상세"
        class="custom-input"
      /> -->
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
  band,
} from "../../../interface/fab-application-rev2";
import SelectOptions from "../../Common/SelectOptions.vue";
import InputText from "../../Common/InputText.vue";
import InputNumber from "../../Common/InputNumber.vue";
import BooleanInput from "../../Common/SelectBoolean.vue";
import LongInputText from "../../Common/LongInputText.vue";
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
} from "../../../utils/Fab/fab-application-utils";
import Dvb from "./dvr/Dvr.vue";

import {
  groupList,
  processList,
  packageList,
  // destinationList,
  getSampleQuantityOptions,
  codeList,
  waferTypes,
  waferComList,
  machineList,
  sendFormData,
} from "../Common/Application";
import axios from "axios";
import { Option } from "element-plus/es/components/select-v2/src/select.types";
import { initBom } from "../../../utils/Fab/bom-utils";

const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
  bandList: band[];
}>();

const destinationList = ref<OptionInterface[]>([]);
const priorityList = ref<OptionInterface[]>([]);
const filterTypeList = ref<OptionInterface[]>([]);

onMounted(async () => {
  destinationList.value = await receiveDestinationList();
  priorityList.value = await receivePriorityList();
  filterTypeList.value = await receivefilterTypeList();
});

// watch(
//   () => props.fabApplication.packageId,
//   (newVal) => {
//     if (newVal === "CSP") {
//       props.fabApplication.bom = initBom();
//     }
//   }
// );

const emit = defineEmits(["update:fabApplication"]);
// $computed로 props와 emit 동기화
const localFabApplication = computed({
  get: () => props.fabApplication,
  set: (newValue) => emit("update:fabApplication", newValue), // 부모로 전달
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
