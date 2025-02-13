<template>
  <ApplicationTemplate
    :fab-application="fabApplication"        
    applicationType="create"
    :options="sawTypes"
    :sawType="sawType"
  />
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";
import ApplicationTemplate from "./ApplicationTemplate.vue";
import { initBom } from "../../../utils/Fab/bom-utils";
import {
  SawType,
  FabWafer,
  FabWaferRecommendation,
  PstType,
  HsType,
  PstLayer,
  TcType,
  IdtType,
  IdtMachine,
  Layer,
  band,
  Bom
} from "./../../../interface/fab-application-rev2";
import {
  initFabApplication,
  initFabApplication2,
  initFabApplication3,
  getBandList,
} from "../../../utils/Fab/fab-application-utils";

import { getUserId, getUserName } from "../../../utils/account-utils";
import axios from "axios";
//   import type { FabApplicationInterface  } from "../../interface/fab";

const bom = initBom();
const { fabApplication } = initFabApplication2();
const bandList = ref<band[]>([]);
const sawTypes = reactive<SawType[]>([]);
const sawType = reactive<SawType>({});

onMounted(async () => {
  fabApplication.requester.userName = getUserName();
  fabApplication.requester.id = getUserId();
  fabApplication.requesterId = getUserId();

  // fabApplication.designer.userName = getUserName();
  // fabApplication.designer.id = getUserId();
  // fabApplication.designerId = getUserId();
  
  try {
    const response = await axios.get(
      "http://10.29.11.124:40000/fab_monitoring_rev2/get_saw_types_list"
    );

    const rawData = response.data;

    // bandList.value = await getBandList();

    Object.assign(sawTypes , convertPep8ToCamelCase2(rawData))

    // console.log(bandList.value)

    // const rawData = [
    //   {
    //     saw_type_id: "HS",
    //     wafers: [
    //       {
    //         wafer_id: 5,
    //         saw_type_id: "HS",
    //         wafer_type: "BLT",
    //         wafer_company: "NGK",
    //         size: 4,
    //         recommendations: [
    //           {
    //             wafer_thickness: 500,
    //             wafer_angle: 43,
    //           },
    //         ],
    //         hs_types: [
    //           {
    //             hs_id: 1,
    //             name: "LT(820)/SiO2(800)/a-Si(450)/Si",
    //             pe_angle: 43,
    //             silicon_rotation: "<111>(011)",
    //             layers: [
    //               {
    //                 idx: 1,
    //                 material: "LT",
    //                 thickness: 820,
    //               },
    //               {
    //                 idx: 2,
    //                 material: "SiO2",
    //                 thickness: 800,
    //               },
    //               {
    //                 idx: 3,
    //                 material: "a-Si",
    //                 thickness: 450,
    //               },
    //             ],
    //           },
    //           {
    //             hs_id: 2,
    //             name: "LT(610)/SiO2(400)/a-Si(450)/Si",
    //             pe_angle: 43,
    //             silicon_rotation: "<111>(011)",
    //             layers: [
    //               {
    //                 idx: 1,
    //                 material: "LT",
    //                 thickness: 610,
    //               },
    //               {
    //                 idx: 2,
    //                 material: "SiO2",
    //                 thickness: 400,
    //               },
    //               {
    //                 idx: 3,
    //                 material: "a-Si",
    //                 thickness: 450,
    //               },
    //             ],
    //           },
    //           {
    //             hs_id: 3,
    //             name: "LT(520)/SiO2(400)/a-Si(450)/Si",
    //             pe_angle: 43,
    //             silicon_rotation: "<111>(011)",
    //             layers: [
    //               {
    //                 idx: 1,
    //                 material: "LT",
    //                 thickness: 520,
    //               },
    //               {
    //                 idx: 2,
    //                 material: "SiO2",
    //                 thickness: 400,
    //               },
    //               {
    //                 idx: 3,
    //                 material: "a-Si",
    //                 thickness: 450,
    //               },
    //             ],
    //           },
    //           {
    //             hs_id: 4,
    //             name: "LT(750)/SiO2(400)/a-Si(450)/Si",
    //             pe_angle: 43,
    //             silicon_rotation: "<111>(011)",
    //             layers: [
    //               {
    //                 idx: 1,
    //                 material: "LT",
    //                 thickness: 750,
    //               },
    //               {
    //                 idx: 2,
    //                 material: "SiO2",
    //                 thickness: 400,
    //               },
    //               {
    //                 idx: 3,
    //                 material: "a-Si",
    //                 thickness: 450,
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //     idt_types: [
    //       {
    //         idt_id: 4,
    //         idt_process_id: "Lift-off",
    //         name: "Ti/Cu/AlCu8%/Ti",
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "Ti",
    //           },
    //           {
    //             idx: 2,
    //             material: "Cu",
    //           },
    //           {
    //             idx: 3,
    //             material: "AlCu8%",
    //           },
    //           {
    //             idx: 4,
    //             material: "Ti",
    //           },
    //         ],
    //         idt_machines: [
    //           {
    //             machine_name: "IDT#5",
    //           },
    //           {
    //             machine_name: "IDT#6",
    //           },
    //         ],
    //       },
    //       {
    //         idt_id: 5,
    //         idt_process_id: "Lift-off",
    //         name: "Ti/Cu/AlCu/Cu/Ti",
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "Ti",
    //           },
    //           {
    //             idx: 2,
    //             material: "Cu",
    //           },
    //           {
    //             idx: 3,
    //             material: "AlCu",
    //           },
    //           {
    //             idx: 4,
    //             material: "Cu",
    //           },
    //           {
    //             idx: 5,
    //             material: "Ti",
    //           },
    //         ],
    //         idt_machines: [
    //           {
    //             machine_name: "IDT#5",
    //           },
    //           {
    //             machine_name: "IDT#6",
    //           },
    //         ],
    //       },
    //     ],
    //     pst_types: [
    //       {
    //         pst_id: 2,
    //         name: "dPST",
    //         is_metal_pst: false,
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "dPST",
    //           },
    //         ],
    //       },
    //       {
    //         pst_id: 3,
    //         name: "mPST",
    //         is_metal_pst: true,
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "mPST",
    //           },
    //         ],
    //       },
    //     ],
    //     tc_types: [],
    //   },
    //   {
    //     saw_type_id: "NS",
    //     wafers: [
    //       {
    //         wafer_id: 1,
    //         saw_type_id: "NS",
    //         wafer_type: "BLT",
    //         wafer_company: "S",
    //         size: 4,
    //         recommendations: [
    //           {
    //             wafer_thickness: 150,
    //             wafer_angle: 42,
    //           },
    //           {
    //             wafer_thickness: 150,
    //             wafer_angle: 46.3,
    //           },
    //           {
    //             wafer_thickness: 200,
    //             wafer_angle: 42,
    //           },
    //           {
    //             wafer_thickness: 200,
    //             wafer_angle: 46.3,
    //           },
    //           {
    //             wafer_thickness: 250,
    //             wafer_angle: 42,
    //           },
    //         ],
    //         hs_types: [],
    //       },
    //     ],
    //     idt_types: [
    //       {
    //         idt_id: 1,
    //         idt_process_id: "Etching",
    //         name: "Ti/Al",
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "Ti",
    //           },
    //           {
    //             idx: 2,
    //             material: "Al",
    //           },
    //         ],
    //         idt_machines: [
    //           {
    //             machine_name: "아넬바#2",
    //           },
    //           {
    //             machine_name: "아넬바#3",
    //           },
    //         ],
    //       },
    //       {
    //         idt_id: 2,
    //         idt_process_id: "Lift-off",
    //         name: "Ti/Cu/Al/Ti",
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "Ti",
    //           },
    //           {
    //             idx: 2,
    //             material: "Cu",
    //           },
    //           {
    //             idx: 3,
    //             material: "Al",
    //           },
    //           {
    //             idx: 4,
    //             material: "Ti",
    //           },
    //         ],
    //         idt_machines: [
    //           {
    //             machine_name: "IDT#5",
    //           },
    //           {
    //             machine_name: "IDT#6",
    //           },
    //         ],
    //       },
    //     ],
    //     pst_types: [],
    //     tc_types: [],
    //   },
    //   {
    //     saw_type_id: "TS",
    //     wafers: [
    //       {
    //         wafer_id: 2,
    //         saw_type_id: "TS",
    //         wafer_type: "BLN",
    //         wafer_company: "S",
    //         size: 4,
    //         recommendations: [
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 126,
    //           },
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 127,
    //           },
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 128,
    //           },
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 175,
    //           },
    //         ],
    //         hs_types: [],
    //       },
    //       {
    //         wafer_id: 3,
    //         saw_type_id: "TS",
    //         wafer_type: "BLN",
    //         wafer_company: "Y",
    //         size: 4,
    //         recommendations: [
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 126,
    //           },
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 127,
    //           },
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 128,
    //           },
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 175,
    //           },
    //         ],
    //         hs_types: [],
    //       },
    //       {
    //         wafer_id: 4,
    //         saw_type_id: "TS",
    //         wafer_type: "BLN",
    //         wafer_company: "Y_특수",
    //         size: 4,
    //         recommendations: [
    //           {
    //             wafer_thickness: 350,
    //             wafer_angle: 170,
    //           },
    //         ],
    //         hs_types: [],
    //       },
    //     ],
    //     idt_types: [
    //       {
    //         idt_id: 3,
    //         idt_process_id: "Lift-off",
    //         name: "Cr/Ag/Cu/Cr",
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "Cr",
    //           },
    //           {
    //             idx: 2,
    //             material: "Ag",
    //           },
    //           {
    //             idx: 3,
    //             material: "Cu",
    //           },
    //           {
    //             idx: 4,
    //             material: "Cr",
    //           },
    //         ],
    //         idt_machines: [
    //           {
    //             machine_name: "IDT#1",
    //           },
    //           {
    //             machine_name: "IDT#2",
    //           },
    //           {
    //             machine_name: "IDT#3",
    //           },
    //         ],
    //       },
    //     ],
    //     pst_types: [
    //       {
    //         pst_id: 1,
    //         name: "Cr/Cu/Cr",
    //         is_metal_pst: true,
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "Cr",
    //           },
    //           {
    //             idx: 2,
    //             material: "Cu",
    //           },
    //           {
    //             idx: 3,
    //             material: "Cr",
    //           },
    //         ],
    //       },
    //     ],
    //     tc_types: [
    //       {
    //         tc_id: 1,
    //         name: "SiO2",
    //         layers: [
    //           {
    //             idx: 1,
    //             material: "SiO2",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ];

    // 데이터 매핑
    // sawTypes.push(
    //   ...rawData.map(
    //     (item: any): SawType => ({
    //       sawTypeId: item.saw_type_id,
    //       isAllowBridge : item.is_allow_bridge,
    //       wafers: item.wafers?.map(
    //         (wafer: any): FabWafer => ({
    //           waferId: wafer.wafer_id,
    //           sawTypeId: wafer.saw_type_id,
    //           waferType: wafer.wafer_type,
    //           waferCompany: wafer.wafer_company,
    //           size: wafer.size,
    //           recommendations: wafer.recommendations?.map(
    //             (rec: any): FabWaferRecommendation => ({
    //               waferThickness: rec.wafer_thickness,
    //               waferAngle: rec.wafer_angle,
    //             })
    //           ),
    //           hsTypes: wafer.hs_types?.map(
    //             (hs: any): HsType => ({
    //               hsId: hs.hs_id,
    //               name: hs.name,
    //               siliconRotation: hs.silicon_rotation,
    //               peAngle: hs.pe_angle,
    //               layers: hs.layers?.map(
    //                 (layer: any): Layer => ({
    //                   idx: layer.idx,
    //                   material: layer.material,
    //                   thickness: layer.thickness,
    //                 })
    //               ),
    //             })
    //           ),
    //         })
    //       ),
    //       pstTypes: item.pst_types?.map(
    //         (pst: any): PstType => ({
    //           pstId: pst.pst_id,
    //           sawTypeId: item.saw_type_id,
    //           name: pst.name,
    //           layers: pst.layers?.map(
    //             (layer: any): PstLayer => ({
    //               pstId: pst.pst_id,
    //               idx: layer.idx,
    //               material: layer.material,
    //             })
    //           ),
    //         })
    //       ),
    //       tcTypes: item.tc_types?.map(
    //         (tc: any): TcType => ({
    //           tcId: tc.tc_id,
    //           name: tc.name,
    //           layers: tc.layers?.map(
    //             (layer: any): Layer => ({
    //               idx: layer.idx,
    //               material: layer.material,
    //             })
    //           ),
    //         })
    //       ),
    //       idtTypes: item.idt_types?.map(
    //         (idt: any): IdtType => ({
    //           idtId: idt.idt_id,
    //           idtProcessId: idt.idt_process_id,
    //           name: idt.name,
    //           layers: idt.layers?.map(
    //             (layer: any): Layer => ({
    //               idx: layer.idx,
    //               material: layer.material,
    //             })
    //           ),
    //           idtMachines: idt.idt_machines?.map(
    //             (machine: any): IdtMachine => ({
    //               machineName: machine.machine_name,
    //             })
    //           ),
    //         })
    //       ),
    //     })
    //   )
    // );

    
  } catch (error) {
    console.error("Error fetching saw types:", error);
  }
});
</script>

<style>
/* 스타일 정의 */
</style>
