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
        <el-col :span="7">
          <el-select
            v-model="props.fabApplication.idtMachineName"
            placeholder="IDT Deposition Machine"
          >
            <el-option
              v-for="machine in machineOptions"
              :key="machine.key"
              :label="machine.label"
              :value="machine.key"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </section>

    <!-- IDT 정보 테이블 섹션 -->
    <br />

    <section class="section">
      <!-- <h3 class="section-title2">IDT Thickness</h3> -->
      <div
        v-if="
          props.fabApplication.waferType === 'TC' &&
          props.fabApplication.idtId === 99
        "
      >
        <long-input-text-2 label="성막조건" row-cnt="3"></long-input-text-2>
      </div>
      <div v-else>
        <el-descriptions title="Thickness" :column="4" :border="true">
          <el-descriptions-item
            v-for="layer in layers"
            :key="layer.idx"
            :label="layer.material"
            :span="1"
          >
            <el-input v-model="layer.thickness"></el-input>
          </el-descriptions-item>
        </el-descriptions>
      </div>
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
import LongInputText2 from "../../Common/LongInputText2.vue";

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

    if (machineOptions.value.length == 1) {
      props.fabApplication.idtMachineName = machineOptions.value[0].value;
    }
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

    // if (props.fabApplication.waferType === "TC") {
    //   const temp = {
    //     key: 99,
    //     label: "ETC",
    //     value: "99",
    //   };
    //   depositionOptions.value.push(temp);
    //   props.fabApplication.idtId = parseInt(depositionOptions.value[0].value);
    // }

    if (depositionOptions.value.length == 1) {
      props.fabApplication.idtId = parseInt(depositionOptions.value[0].value);
    }

    if (props.fabApplication.idtId !== null) {
      machineOptions.value = generateMachineOptions(
        props.sawType.idtTypes,
        props.fabApplication.idtId.toString()
      );

      if (machineOptions.value.length == 1) {
        props.fabApplication.idtMachineName = machineOptions.value[0].value;
      }
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
      props.fabApplication.idtProcessId = "Lift-off";
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

      layerNames.value = getLayerNameFromIdtTypes(
        props.sawType.idtTypes,
        props.fabApplication.idtId,
        layers
      );

      // console.log(props.fabApplication.idtId);
      // if (props.fabApplication.waferType === "TC" && props.fabApplication.idtId === "ETC") {
      // } else {
      //   machineOptions.value = generateMachineOptions(
      //     props.sawType.idtTypes,
      //     props.fabApplication.idtId.toString()
      //   );
      // }
      machineOptions.value = generateMachineOptions(
        props.sawType.idtTypes,
        props.fabApplication.idtId.toString()
      );
      if (machineOptions.value.length == 1) {
        props.fabApplication.idtMachineName = machineOptions.value[0].value;
      }
      // props.fabApplication.idtId = parseInt(props.fabApplication.depositionCondi);
      props.fabApplication.idtLayers = layers;
    }
  }
);
</script>

<script lang="ts">
export default {
  components: { LongInputText2 },
};
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

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
}

.section-title2 {
  font-size: 1rem;
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
