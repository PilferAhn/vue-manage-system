<template>
    <section class="section">
      <!-- <h3 class="section-title">Set Wafer Details</h3> -->
  
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item class="custom-form-item" prop="waferAngle">
            <el-input
              v-model="props.fabApplication.waferAngle"
              placeholder="Enter Angle"
              style="width: 250px"
            >
              <template #prepend>{{ cutLabel }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item
            v-if="['NS', 'TC'].includes(props.fabApplication.waferType)"
            class="custom-form-item"
            prop="Angle Options"
          >
            <el-select
              v-model="props.fabApplication.waferAngle"
              placeholder="Select Anlge"
              style="width: 200px"
            >
              <!-- <el-options></el-options> -->
              <el-option
                v-for="angleOption in angleOptions"
                :key="angleOption.key"
                :label="angleOption.label"
                :value="angleOption.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
  
        <el-col :span="7">
          <el-form-item
            class="custom-form-item"
            prop="waferThickness"
            v-if="props.fabApplication.waferType !== 'HS'"
          >
            <el-input
              v-model="props.fabApplication.waferThickness"
              placeholder="Enter Thickness"
              style="width: 250px"
            >
              <template #prepend>Thickness</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3"
          ><el-select
            v-model="props.fabApplication.waferThickness"
            placeholder="Select Anlge"
            style="width: 200px"
            v-if="props.fabApplication.waferType !== 'HS'"
          >
            <!-- <el-options></el-options> -->
            <el-option
              v-for="angleOption in thickOptions"
              :key="angleOption.key"
              :label="angleOption.label"
              :value="angleOption.value"
            ></el-option> </el-select
        ></el-col>
        <!-- <el-col :span="7">
          <input-text-by-recommad
            v-model="props.fabApplication.waferCode"
            :options="waferCodeOptions"
            :use-template="true"
            :template-label="'Code'"
          ></input-text-by-recommad>
        </el-col>
        <el-col :span="3">
          
        </el-col>
        <el-col :span="7">
          <input-text-by-recommad
            v-model="props.fabApplication.waferCode"
            :options="waferCodeOptions"
            :use-template="true"
            :template-label="'Code'"
          ></input-text-by-recommad>
        </el-col>-->
      </el-row> 
      <div
        class="flex-container"
        v-if="props.fabApplication.waferType !== 'HS'"
      ></div>
    </section>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch, onMounted } from "vue";
  import InputTextByRecommad from "../../../Common/InputTextByRecommadAsLabel.vue";
  import {
    getFabWaferFromWaferId,
    createHsWaferCondition,
    createAngleOptions,
    createThicknessOptions,
    getWaferCodeObjectList,
    createWaferCodeOptions,
  } from "../../../../utils/Fab/fab_application-wafer-utils";
  import type { OptionInterface } from "../../../../interface/option";
  import type {
    SawType,
    FabWafer,
    FabRequestForm,
    Layer,
  } from "../../../../interface/fab-application-rev2";
  
  // Props 및 Emit 정의
  const props = defineProps<{
    fabApplication: FabRequestForm;
    waferId: string;
    sawType: SawType;
    hsWaferOptions: OptionInterface[];
    hsLayers: Layer[];
    wafer: FabWafer;
    applicationType: string;
  }>();
  
  const cutLabel = ref<String>("LT CUT");
  getWaferCodeObjectList();
  const wafer = ref<FabWafer>({});
  const angleOptions = ref<OptionInterface[]>([]);
  const thickOptions = ref<OptionInterface[]>([]);
  const waferCodeOptions = ref<OptionInterface[]>([]);
  // 로컬 상태 정의
  
  const waferThickness = ref(0);
  const angAndThink = ref("");
  
  const emit = defineEmits([
    "update:hsWaferOptions",
    "update:hsLayers",
    "update:wafer",
  ]);
  
  onMounted(async () => {
    if (props.applicationType === "load") {
      wafer.value = getFabWaferFromWaferId(
        props.fabApplication.waferId.toString(),
        props.sawType.wafers
      );
      if (props.fabApplication.waferType === "HS") {
        // props.fabApplication.waferThickness = 500;
        emit("update:hsWaferOptions", createHsWaferCondition(wafer.value));
        emit("update:wafer", wafer.value);
        emit("update:hsLayers", createHsWaferCondition(wafer.value));
      }
    }
  
    waferCodeOptions.value = createWaferCodeOptions(
      await getWaferCodeObjectList()
    );
  });
  
  watch(
    () => props.fabApplication.waferType,
    (newVal) => {
      if (newVal === "TC") {
        cutLabel.value = "LN CUT";
      }
      // else if(newVal === "NS"){
      //   props.sawType.wafers
      // }
      else {
        cutLabel.value = "LT CUT";
      }
    }
  );
  
  watch(
    () => props.fabApplication.waferId,
    (newVal) => {
      if (props.applicationType !== "load") {
        if (props.fabApplication.waferType === "TC") {
          props.fabApplication.waferAngle = 126;          
        }
        else if(props.fabApplication.waferType === "NS"){
          props.fabApplication.waferAngle = 42;
        }
         else {
          props.fabApplication.waferAngle = 43;
        }
  
        props.fabApplication.waferThickness = 0;
        waferThickness.value = 0;
        angAndThink.value = "";
  
        if (props.fabApplication.waferId !== undefined) {
          wafer.value = getFabWaferFromWaferId(
            newVal.toString(),
            props.sawType.wafers
          );
          props.fabApplication.waferId = parseInt(newVal.toString());
  
          if (props.fabApplication.waferType === "HS") {
            props.fabApplication.waferThickness = 500;
            emit("update:hsWaferOptions", createHsWaferCondition(wafer.value));
            emit("update:wafer", wafer.value);
            emit("update:hsLayers", createHsWaferCondition(wafer.value));
          } else if (["NS", "TC"].includes(props.fabApplication.waferType)) {
            angleOptions.value = createAngleOptions(
              props.sawType,
              parseInt(newVal.toString())
            );
            thickOptions.value = createThicknessOptions(
              props.sawType,
              parseInt(newVal.toString())
            );
  
            if (thickOptions.value.length == 1) {
              props.fabApplication.waferThickness = parseInt(
                thickOptions.value[0].value
              );
            }
          }
        }
      }
    }
  );
  
  // watch(
  //   () => angAndThink.value,
  //   (newVal) => {
  //     const tempList = newVal.split(",");
  //     if (tempList.length === 2) {
  //       props.fabApplication.waferAngle = parseFloat(tempList[0]);
  //       props.fabApplication.waferThickness = parseInt(tempList[1]);
  //     }
  //   }
  // );
  
  // Watch로 부모 업데이트
  //   watch(localAngle, (newValue) => emit("update:angle", newValue));
  //   watch(localThickness, (newValue) => emit("update:thickness", newValue));
  //   watch(localAngAndThink, (newValue) => emit("update:angAndThink", newValue));
  </script>
  <script lang="ts">
  export default {};
  </script>
  <style scoped>
  .flex-container {
    display: flex;
    gap: 20px;
  }
  </style>