<script lang="ts">
export default {
  components: {},
};
</script>
<template>
    <div>
      <el-form
        ref="fabFormRef"
        :model="props.fabApplication"
        :rules="fabRequestFormRules"
        :label-position="'top'"
        
      >
        <!-- Split Screen Layout -->
        <div class="form-container">
          <!-- Left Side: Application -->
          <div class="left-section">
            <ApplicationContent
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
              :application-type="props.applicationType"
            />
  
            <Buttons
              v-model:fabApplication="props.fabApplication"
              :fabFormRef="fabFormRef"
              :application-type="props.applicationType"
              :packageEvidenceFile="packageEvidenceFile"
              :refreshPackageEvidence="() => packageEvidenceRef?.refreshEvidence?.()"
              @clear-package-evidence-file="packageEvidenceFile = null"
            />
          </div>
  
          <!-- Right Side: Wafer and Deposition -->
          <div class="right-section">
            <Wafer
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
              :applicationType="props.applicationType"
            />
            <Deposition
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
            />
            <Pst
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
            />
  

  
            <Ct
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
            />
            <Passivation
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
            />

            <PhotoSection
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
            />
            
            <fabP
              v-model="props.fabApplication"
              :package-id="props.fabApplication.packageId"
            /> 
            <Seed
              v-if="sawType?.seedTypes?.length > 0"
              v-model:fabApplication="props.fabApplication"
              :sawType="sawType"
            />
            <PackageEvidenceUpload
              ref="packageEvidenceRef"
              v-model:fabApplication="props.fabApplication"
              :mode="props.applicationType"
              @selected-file="handleSelectedEvidenceFile"
            />
          </div>
        </div>
      </el-form>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { watch, ref, reactive } from "vue";
  import { SawType, band } from "./../../../interface/fab-application-rev2";
  import { defineSawTypeByWaferType } from "../../../utils/Fab/fab_application-wafer-utils";
  import Wafer from "./wafer/Wafer.vue";
  import Deposition from "./Deposition.vue";
  import Ct from "./Ct.vue";
  import Pst from "./Pst.vue";
  import Seed from "./seed/seed.vue";
  import Passivation from "./Passivation.vue";
  import fabP from "./fabP.vue";
  import PackageEvidenceUpload from "./PackageEvidenceUpload.vue";
  import ProductName from "./ProductName.vue";
  import Buttons from "./Buttons.vue";
  import ApplicationContent from "./ApplicationContent.vue";
  import type { FabRequestForm, FabprobeInformation} from "./../../../interface/fab-application-rev2";
  import PhotoSection from "./photo/photo.vue";
  import { fabRequestFormRules } from "../../../utils/rules/fab-application";
  import type { FormInstance } from "element-plus";
  
  
  const fabFormRef = ref<FormInstance | null>(null);
  const packageEvidenceFile = ref<File | null>(null);
  const packageEvidenceRef = ref<InstanceType<typeof PackageEvidenceUpload> | null>(null);
  function handleSelectedEvidenceFile(file: File | null) {
    packageEvidenceFile.value = file;
  }

  const props = defineProps<{
    fabApplication: FabRequestForm;
    simpleFabApp: FabprobeInformation;
    applicationType: string;
    options: SawType[];
    sawType: SawType;
  }>();
  
  const sawType = reactive<SawType>({ ...props.sawType });
  
  
  
  watch(
    () => props.fabApplication.waferType,
    (newVal, oldVal) => {
      Object.assign(sawType, defineSawTypeByWaferType(newVal, props.options));
    }
  );
  </script>
  

  
  <style scoped>
  .form-container {
    display: flex;
    width: 100%;
    justify-content: space-between; /* 공백이 없도록 조정 */
    align-items: flex-start;
  }
  
  .section-box {
    flex: 1;
    padding: 20px;
    box-sizing: border-box; /* 패딩과 테두리를 포함하여 정확한 크기 유지 */
  }
  
  .left-section {
    width: 50%;
    margin-right: 10px; /* border-right 대신 margin 사용 */
  }
  
  .right-section {
    width: 50%;
  }
  
.right-section :deep(*) {
  --el-font-size-base: 18px;
  --el-font-size-small: 16px;
  --el-font-size-large: 20px;
  font-size: 18px;
}

/* 필요하면 폼 라벨도 더 키우기 */
.right-section :deep(.el-form-item__label) {
  font-size: 18px;
}

/* input/select/textarea 등 컨트롤 글자 */
.right-section :deep(.el-input__inner),
.right-section :deep(.el-textarea__inner),
.right-section :deep(.el-select__selected-item),
.right-section :deep(.el-radio__label),
.right-section :deep(.el-checkbox__label) {
  font-size: 20px;
  font-weight: 700;
}

.right-section :deep(.el-button),
.right-section :deep(.el-table),
.right-section :deep(.el-table th),
.right-section :deep(.el-table td) {
  font-size: 18px;
}


:global(.right-lg-popper .el-select-dropdown__item) {
  font-size: 18px;
  height: 40px;
  line-height: 40px;
}
:global(.right-lg-popper .el-select-dropdown__empty),
:global(.right-lg-popper .el-select-group__title) {
  font-size: 18px;
}

  /* 반응형 디자인 - 화면이 너무 작아질 때 */
  @media (max-width: 1024px) {
    .form-container {
      flex-direction: column;
    }
  
    .left-section,
    .right-section {
      flex: 1 1 auto;
      width: 100%;
      border-right: none;
    }
  }
  </style>