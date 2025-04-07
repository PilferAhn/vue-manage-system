<template>
    <div class="deposition-container">
      <h3 class="section-title">Photo</h3>
  
      <el-table
        :data="props.fabApplication.photo.photoProcesses"
        v-if="props.fabApplication.photo !== null"
      >
        <el-table-column
          label="Process Name"
          prop="processName"
          :align="'center'"
        >
          <!-- <template #default="scope">
            <el-input v-model="scope.row.processName"></el-input>
          </template> -->
        </el-table-column>
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
  import { ref, watch, computed } from "vue";
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
  
  
  
  // IDT 1
  // GFL 2
  // M-PST 3
  // PST 4
  // D-PST 5
  // COT 6
  // LTE 7
  // 브릿지 8
  // CAP 9 
  // BPD 10
  // P-PAD 11
  // PAD 12
  // SiO 13
  // SiO Shot명 14
  // M1b IDT 15
  // MS 16
  
  const needIdt = ref<boolean>(false);
  const needGfl = ref<boolean>(false);
  const needMPst = ref<boolean>(false);
  const needPst = ref<boolean>(false);
  const needDpst = ref<boolean>(false);
  const needCot = ref<boolean>(false);
  const needLte = ref<boolean>(false);
  const needBridge = ref<boolean>(false);
  const needCap = ref<boolean>(false);
  const needBpd = ref<boolean>(false);
  const needPPad = ref<boolean>(false);
  const needPad = ref<boolean>(false);
  const needSio = ref<boolean>(false);
  const needSioShot = ref<boolean>(false);
  const needM1bIdt = ref<boolean>(false);
  const needMs = ref<boolean>(false);
  
  
  const trackedValues = computed(() => ({
    sawTypeId: props.sawType.sawTypeId,
    packageId: props.fabApplication.packageId,
    destinationId: props.fabApplication.destinationId,
    idtProcessId: props.fabApplication.idtProcessId,
    hasBridge : props.fabApplication.hasBridge,
    isDualIdt : props.fabApplication.isDualIdt,
    pstId : props.fabApplication.pstId,
    isGfl : props.fabApplication.isGfl,
    isCap : props.fabApplication.isCap,
    isMst : props.fabApplication.isMst,
    needLteEtching : props.fabApplication.isNeededLtEtching
  }));
  
  watch(
    trackedValues,
    (newValues) => {
      if (
        newValues.sawTypeId !== null &&
        newValues.packageId !== null &&
        newValues.destinationId !== null &&
        newValues.idtProcessId !== null
      ) {
        

        needIdt.value = true;
        needBpd.value = newValues.packageId === "BDMP";
        needGfl.value = props.fabApplication.isGfl;
        needBridge.value = props.fabApplication.hasBridge;
        needPad.value = true;
        needSio.value = true;
        needCap.value = ["NS", "TC"].includes(newValues.sawTypeId) && props.fabApplication.isCap
        needM1bIdt.value = props.fabApplication.isDualIdt
        props.fabApplication.photo.photoProcesses = [];
        needCot.value = newValues.sawTypeId === "TC"
        needPst.value = newValues.sawTypeId === "TC"
        needPPad.value = newValues.sawTypeId === "TC" && newValues.packageId === "BDMP"
        needMs.value = newValues.sawTypeId === "TC" && props.fabApplication.isMst
        needLte.value = newValues.sawTypeId === "HS" && props.fabApplication.isNeededLtEtching
        
        if(needLte.value){
          props.fabApplication.photo.photoProcesses.push({
            processName: "LTE",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 7,
          });
        }

        if(needMs.value){
          props.fabApplication.photo.photoProcesses.push({
            processName: "MS",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 16,
          });
        }
  
        if(needCot.value){
          props.fabApplication.photo.photoProcesses.push({
            processName: "COT",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 6,
          });
        }
  
        if(needCot.value){
          props.fabApplication.photo.photoProcesses.push({
            processName: "PST",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 4,
          });
        }
  
        if(needPPad.value){
          props.fabApplication.photo.photoProcesses.push({
            processName: "P-PAD",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 11,
          });
        }
  
  
        if(newValues.sawTypeId === "HS"){
  
          let temp = -1
  
          for(let i = 0 ; i < props.sawType.pstTypes.length; i++){
            if(props.sawType.pstTypes[i].pstId == newValues.pstId){
  
              if(props.sawType.pstTypes[i].name === "M-PST" ){
                needMPst.value = true
                needDpst.value = false
              }
              else if(props.sawType.pstTypes[i].name === "D-PST" ){
                needMPst.value = false
                needDpst.value = true
              }
            }
          }
  
        }
        else{
          needMPst.value = false
          needDpst.value = false
        }
  
        if(needM1bIdt.value){
          props.fabApplication.photo.photoProcesses.push({
            processName: "M1b IDT",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 15,
          });
        }
  
        if (needIdt.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "IDT",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 1,
          });
        }
  
        if (needBpd.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "BPD",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 10,
          });
        }
  
        if (needGfl.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "GFL",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 2,
          });
        }
        
        
        if (needBridge.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "브릿지",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 8,
          });
        }
  
        if (needPad.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "PAD",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 12,
          });
        }
  
  
  
        if (needSio.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "SiO",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 13,
          });
        }
  
        if (needCap.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "CAP",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 9,
          });
        }
  
        if (needMPst.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "M-PST",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 3,
          });
        }
  
        if (needDpst.value) {
          props.fabApplication.photo.photoProcesses.push({
            processName: "D-PST",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 5,
          });
        }
  
        props.fabApplication.photo.photoProcesses.sort((a, b) => a.order - b.order);
  
      } else {
      }
    },
    { deep: true }
  );
  
  
  // watch(
  //   () => props.fabApplication.hasBridge,
  //   (newVal, oldVal) => {
  //     const temp = {
  //       processName: "브릿지",
  //       machineName: "Nikon",
  //       reticleName: "",
  //       isMutable: false,
  //       order: 3,
  //     };
  
  //     if (oldVal !== undefined) {
  //       if (newVal) {
  //         props.fabApplication.photo.photoProcesses.splice(
  //           temp.order - 1,
  //           0,
  //           temp
  //         );
  //       } else {
  //         for (
  //           let i = props.fabApplication.photo.photoProcesses.length - 1;
  //           i >= 0;
  //           i--
  //         ) {
  //           if (
  //             props.fabApplication.photo.photoProcesses[i].processName ===
  //             "브릿지"
  //           ) {
  //             props.fabApplication.photo.photoProcesses.splice(i, 1);
  //             return; // 한 번만 삭제 후 종료
  //           }
  //         }
  //       }
  //     }
  //   }
  // );
  
  // watch(
  //   () => props.fabApplication.pstId,
  //   (newVal) => {
  //     if (props.fabApplication.waferType === "HS") {
  //       // pst id == 2 D PST
  //       // pst id == 3 M PST
  //       console.log(newVal);
  //       for (let j = 0; j < props.sawType.pstTypes.length; j++) {
  //         if (props.sawType.pstTypes[j].pstId == newVal) {
  //           for (
  //             let i = 0;
  //             i < props.fabApplication.photo.photoProcesses.length;
  //             i++
  //           ) {
  //             if (
  //               ["M_PST", "D_PST"].includes(
  //                 props.fabApplication.photo.photoProcesses[i].processName
  //               )
  //             ) {
  //               props.fabApplication.photo.photoProcesses[i].processName =
  //                 props.sawType.pstTypes[j].name;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // );
  
  // watch(
  //   () => props.fabApplication.packageId,
  //   (newVal, oldVal) => {
  //     if (
  //       props.fabApplication.waferType !== undefined &&
  //       props.fabApplication.waferType !== null
  //     ) {
  //       const temp = {
  //         processName: "BDP",
  //         machineName: "Nikon",
  //         reticleName: "",
  //         isMutable: false,
  //         order: 10,
  //       };
  
  //       if (newVal === "BDMP") {
  //         for (
  //           let i = props.fabApplication.photo.photoProcesses.length - 1;
  //           i >= 0;
  //           i--
  //         ) {
  //           if (props.fabApplication.photo.photoProcesses[i].order >= 10) {
  //             props.fabApplication.photo.photoProcesses.splice(i - 1, 0, temp);
  //             return;
  //           }
  //         }
  //       } else {
  //         for (
  //           let i = props.fabApplication.photo.photoProcesses.length - 1;
  //           i >= 0;
  //           i--
  //         ) {
  //           if (
  //             props.fabApplication.photo.photoProcesses[i].processName === "BDP"
  //           ) {
  //             props.fabApplication.photo.photoProcesses.splice(i, 1);
  //             return;
  //           }
  //         }
  //       }
  //     }
  //   }
  // );
  
  // watch(
  //   () => props.fabApplication.waferType,
  //   (newVal) => {
  //     let temp: PhotoProcess[] = [];
  
  //     if (props.fabApplication.photo.photoProcesses.length <= 2) {
  //       if (newVal === "NS") {
  //         temp = [
  //           {
  //             processName: "IDT",
  //             machineName: "",
  //             reticleName: "",
  //             isMutable: true,
  //             order: 1,
  //           },
  
  //           {
  //             processName: "PAD",
  //             machineName: "Nikon",
  //             reticleName: "",
  //             isMutable: false,
  //             order: 12,
  //           },
  //           {
  //             processName: "SiO",
  //             machineName: "Nikon",
  //             reticleName: "",
  //             isMutable: false,
  //             order: 13,
  //           },
  //         ];
  //       } else if (newVal === "HS") {
  //         temp = [
  //           {
  //             processName: "IDT",
  //             machineName: "",
  //             reticleName: "",
  //             isMutable: true,
  //             order: 1,
  //           },
  //           {
  //             processName: "D-PST",
  //             machineName: "",
  //             reticleName: "",
  //             isMutable: true,
  //             order: 5,
  //           },
  //           {
  //             processName: "PAD",
  //             machineName: "Nikon",
  //             reticleName: "",
  //             isMutable: false,
  //             order: 12,
  //           },
  //           {
  //             processName: "SiO",
  //             machineName: "Nikon",
  //             reticleName: "",
  //             isMutable: false,
  //             order: 13,
  //           },
  //         ];
  //       } else {
  //         temp = [
  //           {
  //             processName: "IDT",
  //             machineName: "",
  //             reticleName: "",
  //             isMutable: true,
  //             order: 1,
  //           },
  //           {
  //             processName: "PST",
  //             machineName: "",
  //             reticleName: "",
  //             isMutable: true,
  //             order: 4,
  //           },
  //           {
  //             processName: "COT",
  //             machineName: "Nikon",
  //             reticleName: "",
  //             isMutable: false,
  //             order: 6,
  //           },
  //           {
  //             processName: "PAD",
  //             machineName: "Nikon",
  //             reticleName: "",
  //             isMutable: false,
  //             order: 12,
  //           },
  //           {
  //             processName: "SiO",
  //             machineName: "Nikon",
  //             reticleName: "",
  //             isMutable: false,
  //             order: 13,
  //           },
  //         ];
  //       }
  
  //       props.fabApplication.photo.photoProcesses = temp;
  //     }
  //   }
  // );
  
  const tempMachineList = ["ASML#4", "ASML#5", "ASML#4,5"];
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