<template>
  <el-dialog
    v-model="isVisible"
    title="Dv2 데이터 입력"
    width="1000px"
    @close="handleClose"
  >
    <el-form label-width="120px" :label-position="'top'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="P/N">
            <el-input v-model="localDv2.productName" />
          </el-form-item>
        </el-col>

        <el-col :span="12"> </el-col>

        <el-col :span="6">
          <el-form-item label="관리자">
            <el-input v-model="localDv2.supporter" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="관리자 ID">
            <el-input v-model="localDv2.supporterId" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="개발자">
            <el-input v-model="localDv2.designer" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="개발자 ID">
            <el-input v-model="localDv2.designerId" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="차수">
            <el-input v-model="localDv2.turn" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="영업">
            <el-input v-model="localDv2.salesTerritory" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="TECH - CHIP">
            <!-- <el-input v-model="localDv2.chip" /> -->
            <el-select v-model="localDv2.chip">
              <el-option v-for="opt in processList"
              :key="opt.key"
              :label="opt.label"
              :value="opt.value"></el-option>
             </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="TECH - PKG">
            <!-- <el-input v-model="localDv2.package" /> -->
             <el-select v-model="localDv2.package">
              <el-option v-for="opt in packageOptions"
              :key="opt.key"
              :label="opt.label"
              :value="opt.value"></el-option>
             </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Project - Main">
            <el-input v-model="localDv2.main" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Project - Sub">
            <el-input v-model="localDv2.sub" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Project - 고객">
            <el-input v-model="localDv2.client" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="Type">
            <el-input v-model="localDv2.category" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="Band">
            <el-input v-model="localDv2.band" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="FAB P/N">
            <el-input v-model="localDv2.fabPartNumber" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="Priority">
            <el-input v-model="localDv2.priority" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="EST MDR Date (예정일)">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedMdr"
              type="date"
              placeholder="EST MDR Date (예정일)"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="MDR Date">
            <el-date-picker
              v-model="localDv2.dateOfMdr"
              type="date"
              placeholder="MDR Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="EST Fab In (Fab 투입 예정일)">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedFabIn"
              type="date"
              placeholder="EST Fab In Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="EST Fab Out (Fab 출고 예정일)">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedFabOut"
              type="date"
              placeholder="EST Fab Out Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="EST HQ Out">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedHqOut"
              type="date"
              placeholder="EST Fab In Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="EST WHC In">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedWhcIn"
              type="date"
              placeholder="EST Fab Out Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="EST Assy In">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedAssyIn"
              type="date"
              placeholder="EST Fab In Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="EST D/C Out">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedDCOut"
              type="date"
              placeholder="EST Fab Out Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="EST Meas In">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedMeasIn"
              type="date"
              placeholder="EST Fab In Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12"> </el-col>

        <el-col :span="6">
          <el-form-item label="EST CER Date (CER 예정일)">
            <el-date-picker
              v-model="localDv2.dateOfEstimatedCer"
              type="date"
              placeholder="EST Fab In Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="CER Date">
            <el-date-picker
              v-model="localDv2.dateOfCer"
              type="date"
              placeholder="Pick a Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">취소</el-button>
        <el-button type="success" @click="handleSubmit">등록</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, Ref, onMounted } from "vue";
import type { Dv2 } from "../../../interface/Dv2/dv2-list-interface";
import { convertKeysToPEP8 } from "../../../utils/key-converter";
import { sendDv2 } from "../../../utils/Dv2/dv2-list-utils";
import { getPackageList } from "../../../utils/utility";
import { OptionInterface } from "../../../interface/option";
import { processList } from "../../FAB/Common/Application";

// ✅ props로 `dv2` 데이터를 받음
const props = defineProps<{
  modelValue: boolean;
  dv2: Dv2;
}>();

// ✅ `v-model`을 사용하기 위해 `isVisible`을 관리
const isVisible = ref(props.modelValue);

// ✅ `dv2` 데이터를 로컬 상태로 복사
const localDv2: Ref<Dv2> = ref({ ...props.dv2 });

const packageOptions = ref<OptionInterface[]>([]);

onMounted(async()=> {
  packageOptions.value = await getPackageList()
})

// ✅ `emit`을 통해 부모 컴포넌트로 데이터 전달
const emit = defineEmits(["update:modelValue", "submit"]);

// ✅ 모달 상태 변경 감지
watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue;
    localDv2.value = { ...props.dv2 }; // 새로운 데이터 복사
  }
);

// ✅ 다이얼로그 닫기 이벤트
const handleClose = () => {
  isVisible.value = false;
  emit("update:modelValue", false);
};

// ✅ 등록 버튼 클릭 시
const handleSubmit = () => {
  //   emit("submit", localDv2.value); // 부모 컴포넌트로 데이터 전달
  sendDv2(convertKeysToPEP8(localDv2.value), "create")
  handleClose();
};
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

