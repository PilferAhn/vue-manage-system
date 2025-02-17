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
            :disabled="scope.row.machineName === 'Nikon'"
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
  () => props.sawType.isAllowBridge,
  (newVal, oldVal) => {
    const temp = {
      processName: "브릿지",
      machineName: "Nikon",
      reticleName: "",
      isMutable: false,
      order: 3,
    };

    console.log(newVal, oldVal);

    if (oldVal !== undefined) {
      if (newVal) {
        props.fabApplication.photo.photoProcesses.splice(temp.order - 1, 0, temp);
      } else {
        for (
          let i = props.fabApplication.photo.photoProcesses.length - 1;
          i >= 0;
          i--
        ) {
          if (
            props.fabApplication.photo.photoProcesses[i].processName ===
            "브릿지"
          ) {
            props.fabApplication.photo.photoProcesses.splice(i, 1);
            return; // 한 번만 삭제 후 종료
          }
        }
      }
    }
  }
);

watch(
  () => props.fabApplication.pstId,
  (newVal) => {
    if (props.fabApplication.waferType === "HS") {
      // pst id == 2 D PST
      // pst id == 3 M PST

      for (let j = 0; j < props.sawType.pstTypes.length; j++) {
        if (props.sawType.pstTypes[j].pstId == newVal) {
          for (
            let i = 0;
            i < props.fabApplication.photo.photoProcesses.length;
            i++
          ) {
            if (
              ["M_PST", "D_PST"].includes(
                props.fabApplication.photo.photoProcesses[i].processName
              )
            ) {
              props.fabApplication.photo.photoProcesses[i].processName =
                props.sawType.pstTypes[j].name;
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

    if (props.fabApplication.photo.photoProcesses.length <= 2) {
      if (newVal === "NS") {
        temp = [
          {
            processName: "IDT",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 1,
          },
          {
            processName: "브릿지",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 3,
          },
          {
            processName: "PAD",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 4,
          },
          {
            processName: "SiO",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 5,
          },
        ];
      } else if (newVal === "HS") {
        temp = [
          {
            processName: "IDT",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 1,
          },
          {
            processName: "D_PST",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 2,
          },
          {
            processName: "브릿지",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 3,
          },
          {
            processName: "PAD",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 4,
          },
          {
            processName: "SiO",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 5,
          },
        ];
      } else {
        temp = [
          {
            processName: "IDT",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 1,
          },
          {
            processName: "PST",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 2,
          },
          {
            processName: "COT",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 3,
          },
          {
            processName: "PAD",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 4,
          },
          {
            processName: "SiO",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 5,
          },
        ];
      }

      props.fabApplication.photo.photoProcesses = temp;
    }
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
