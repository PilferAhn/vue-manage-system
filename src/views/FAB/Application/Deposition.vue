<template>
  <div class="deposition-container">
    <section class="section">
      <h3 class="section-title">IDT (1st Metal)</h3>
      <el-row :gutter="20" class="align-center">
        <el-col :span="8">
          <el-form-item>
            <el-select v-model="props.fabApplication.idtProcessId">
              <el-option
                v-for="idtProcessOption in newidtProcessList"
                :key="idtProcessOption.key"
                :label="idtProcessOption.label"
                :value="idtProcessOption.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-select
              v-model="props.fabApplication.idtId"
              placeholder="Select IDT"
              class="custom-select"
              clearable
            >
              <el-option
                v-for="condition in depositionOptions"
                :key="condition.key"
                :label="condition.label"
                :value="condition.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item prop="idtId">
            <el-input
              v-model="props.fabApplication.idtProcessId"
              :disabled="true"
              width="200"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="idtProcessIdList.length > 1" prop="idtId">
            <el-select v-model="props.fabApplication.idtProcessId">
              <el-option
                v-for="idtProcessOption in idtProcessIdList"
                :key="idtProcessOption.key"
                :label="idtProcessOption.label"
                :value="idtProcessOption.value"
              ></el-option>
            </el-select>            
          </el-form-item>
        </el-col> -->
      </el-row>
    </section>

    <!-- IDT 정보 테이블 섹션 -->
    <section class="section">
      <h3 class="section-title2">IDT Thickness</h3>
      <el-table :data="layers" stripe class="custom-table">
        <!-- INDEX 컬럼 -->
        <el-table-column
          label="INDEX"
          prop="idx"
          :align="'center'"
          width="100"
        ></el-table-column>

        <!-- IDT Name 컬럼 -->
        <el-table-column
          label="IDT Name"
          prop="material"
          :align="'center'"
          width="150"
        ></el-table-column>

        <!-- Thickness 컬럼 -->
        <el-table-column label="Thickness" :align="'center'">
          <template #default="scope">
            <el-input
              v-model="scope.row.thickness"
              placeholder="Enter thickness"
              width="150"
              class="custom-input"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- <section class="section">
      <idt-process
        :fab-application="props.fabApplication"
        :saw-type="props.sawType"      
      />
    </section> -->
    <section class="section">
      <h3 class="section-title2">IDT Deposition Machine</h3>
      <br />
      <el-select v-model="props.fabApplication.idtMachineName">
        <el-option
          v-for="machine in machineOptions"
          :key="machine.key"
          :label="machine.label"
          :value="machine.value"
        ></el-option>
      </el-select>
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  SawType,
  Layer,
  FabRequestForm,
  IdtType,
} from "../../../interface/fab-application-rev2";
import {
  generateIdtOptions,
  generateIdtOptions2,
  getLayerNameFromIdtTypes,
  generateMachineOptions,
  getIdtTypeByIdtId,
  genIdtProcessOptions,
} from "../../../utils/Fab/fab-application-deposition.utils";
import IdtProcess from "./IdtProcess.vue";
import { ref, watch, reactive, onMounted } from "vue";
import { OptionInterface } from "../../../interface/option";
import { tr } from "element-plus/es/locale";

// props 정의
const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();

// 상태 관리
const depositionOptions = ref<OptionInterface[]>([]);
const layerNames = ref<string | undefined>("");
const machineName = ref<string>("");
const machineOptions = ref<OptionInterface[]>([]);
const layers = reactive<Layer[]>([]);
const idtType = reactive<IdtType>({});
const idtProcessIdList = ref<OptionInterface[]>([]);
const newidtProcessList = ref<OptionInterface[]>([
  { key: 1, label: "Etching", value: "Etching" },
  { key: 2, label: "Lift-off", value: "Lift-off" },
]);

onMounted(() => {
  if (Object.keys(props.sawType).length !== 0) {
    depositionOptions.value = generateIdtOptions(props.sawType.idtTypes);
    Object.assign(layers, props.fabApplication.idtLayers);
    // props.fabApplication.idtProcessId = props.fabApplication.idtType.idtProcessId;
    machineOptions.value = generateMachineOptions(
      props.sawType.idtTypes,
      props.fabApplication.idtId.toString()
    );
  }
});

// IDT Thickness 입력을 활성하게 해주는 Watch
watch(
  () => props.fabApplication.idtProcessId,
  (newVal) => {
    depositionOptions.value = generateIdtOptions2(
      props.sawType.idtTypes,
      newVal
    );

    

    if(depositionOptions.value.length == 1){
      props.fabApplication.idtId = parseInt(depositionOptions.value[0].value)
    }

  }
);


// waferType 변경 감지
watch(
  () => props.fabApplication.waferType,
  (newVal) => {
    // depositionOptions.value = generateIdtOptions(props.sawType.idtTypes);
    layerNames.value = "";
    props.fabApplication.depositionCondi = undefined;
    layers.length = 0;
    idtProcessIdList.value = [];
    props.fabApplication.idtProcessId = "";
    depositionOptions.value = [];
    props.fabApplication.idtId = null;
    props.fabApplication.idtMachineName = "";

    if (newVal === "TC") {
      newidtProcessList.value = [
        { key: 2, label: "Lift-off", value: "Lift-off" },
      ];
      props.fabApplication.idtProcessId = "Lift-off"
    } else if (["NS", "HS"].includes(newVal)) {
      newidtProcessList.value = [
        { key: 1, label: "Etching", value: "Etching" },
        { key: 2, label: "Lift-off", value: "Lift-off" },
      ];
    }
  }  
);

// depositionCondi 변경 감지
watch(
  () => props.fabApplication.idtId,
  () => {
    if (props.fabApplication.idtId != null) {
      Object.assign(
        idtType,
        getIdtTypeByIdtId(props.sawType.idtTypes, props.fabApplication.idtId)
      );
      // props.fabApplication.idtProcess = idtType.idtProcessId;
      // idtProcessIdList.value = [];
      // props.fabApplication.idtProcessId = "";

      // if (idtType.idtProcesses.length == 1) {
      //   props.fabApplication.idtProcessId = idtType.idtProcesses[0].idtProcessId;
      // } else {
      //   // console.log(props.fabApplication.idtId)
      //   // console.log(props.sawType.idtTypes)
      //   idtProcessIdList.value = genIdtProcessOptions(
      //     props.sawType.idtTypes,
      //     props.fabApplication.idtId
      //   );
      // }

      layerNames.value = getLayerNameFromIdtTypes(
        props.sawType.idtTypes,
        props.fabApplication.idtId,
        layers
      );



      machineOptions.value = generateMachineOptions(
        props.sawType.idtTypes,
        props.fabApplication.idtId.toString()
      );
      // props.fabApplication.idtId = parseInt(props.fabApplication.depositionCondi);
      props.fabApplication.idtLayers = layers;
    }
  }
);
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.align-center {
  display: flex;
  align-items: center; /* 요소들을 수직 중앙 정렬 */
}
.el-form-item {
  margin-bottom: 0; /* 마진 제거 */
}
.custom-select,
.el-input {
  height: 40px; /* 동일한 높이 */
}

.deposition-container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 섹션 구분 및 타이틀 */
.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
}

.section-title2 {
  font-size: 1.0rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  border-left: 4px solid #4c4eaf;
  padding-left: 8px;
}

/* 드롭다운 스타일 */
.custom-select {
  width: 300px;
  margin-top: 8px;
}

/* 테이블 스타일 */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
}

/* 입력 필드 스타일 */
.custom-input {
  width: 100%;
}
</style>
