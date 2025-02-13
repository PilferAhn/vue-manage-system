<template>
  <div class="deposition-container">
    <h3 class="section-title">Photo</h3>

    <el-table :data="props.fabApplication.photo.photoProcesses">
      <el-table-column
        label="Process Name"
        prop="processName"
        :align="'center'"
      ></el-table-column>
      <el-table-column label="Machine Name" :align="'center'">
        <template #default="scope">
          <el-select
            v-model="scope.row.machineName"
            :disabled="!scope.row.isMutable"
          >
            <el-option
              v-for="machine in tempMachineList"
              :key="machine"
              :label="machine"
              :value="machine"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Reticle Name" :align="'center'">
        <template #default="scope">
          <el-input v-model="scope.row.reticleName"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onMounted } from "vue";
import type {
  FabRequestForm,
  SawType,
  PhotoProcess,
} from "../../../../interface/fab-application-rev2";
import { sendGetRequest2 } from "../../../../utils/httpProtocol";
import { machineList } from "../../Common/Application";
const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();


// Piston 선택에 의해서
// HS 의 경우에는 Photo 의 PST 을 변경시킨다.
//
watch(
  () => props.fabApplication.pstId,
  (newVal) => {
    if (props.fabApplication.waferType === "HS") {
      // pst id == 2 D PST
      // pst id == 3 M PST

      for (let j = 0; j < props.sawType.pstTypes.length; j++) {
        if (props.sawType.pstTypes[j].pstId == newVal) {
          for (let i = 0; i < props.fabApplication.photo.photoProcesses.length; i++) {
            if(["M_PST", "D_PST"].includes(props.fabApplication.photo.photoProcesses[i].processName)){

              props.fabApplication.photo.photoProcesses[i].processName = props.sawType.pstTypes[j].name

            }
          }
        }
      }
    }
  }
);

watch(
  () => props.fabApplication.waferType,
  (newVal) => {
    let temp: PhotoProcess[] = [];
    if (newVal === "NS") {
      temp = [
        {
          processName: "IDT",
          machineName: "",
          reticleName: "",
          isMutable: true,
        },
        {
          processName: "브릿지",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "PAD",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "SiO",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
      ];
    } else if (newVal === "HS") {
      temp = [
        {
          processName: "IDT",
          machineName: "",
          reticleName: "",
          isMutable: true,
        },
        {
          processName: "D_PST",
          machineName: "",
          reticleName: "",
          isMutable: true,
        },
        {
          processName: "브릿지",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "PAD",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "SiO",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
      ];
    } else {
      temp = [
        {
          processName: "IDT",
          machineName: "",
          reticleName: "",
          isMutable: true,
        },
        {
          processName: "PST",
          machineName: "",
          reticleName: "",
          isMutable: true,
        },
        {
          processName: "COT",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "PAD",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
        {
          processName: "SiO",
          machineName: "Nikon",
          reticleName: "",
          isMutable: false,
        },
      ];
    }

    props.fabApplication.photo.photoProcesses = temp;
  }
);

const tempMachineList = ["ASML#4", "ASML#4.5", "ASML#5"];
</script>

<script lang="ts">
export default { components: {} };
</script>
<style>
.deposition-container {
  padding: 20px;
  background-color: #ffffff;
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
</style>
