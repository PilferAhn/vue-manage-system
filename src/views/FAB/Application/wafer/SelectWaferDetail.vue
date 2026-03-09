<template>
    <section class="section">
      <!-- <h3 class="section-title">Set Wafer Details</h3> -->
  
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item class="custom-form-item" prop="waferAngle">
            <el-input
              v-model="props.fabApplication.waferAngle"
              placeholder="Enter Angle"
              style="width: 200px"
            >
              <template #prepend><span class="prepend-label">{{ cutLabel }}</span></template>
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
              style="width: 100px"
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
  
        <el-col :span="6">
          <el-form-item
            class="custom-form-item"
            prop="waferThickness"
            v-if="props.fabApplication.waferType !== 'HS'"
          >
            <el-input
              v-model="props.fabApplication.waferThickness"
              placeholder="Enter Thickness"
              style="width: 180px"
            >
              <template #prepend ><span class="prepend-label" >Thickness</span></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2"
          ><el-select
            v-model="props.fabApplication.waferThickness"
            placeholder="Select Anlge"
            style="width: 90px"
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
        <el-col :span="1"></el-col>
        <el-col
          v-if="props.fabApplication.isMixedWafer && props.fabApplication.waferType !== 'HS'"
          :span="6"
        >
          <el-form-item class="custom-form-item" prop="waferQty1">
            <el-input
              v-model.number="props.fabApplication.waferQty1"
              style="width: 150px"
            >
              <template #prepend><span class="qty-label">Qty1</span></template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> 
      <div v-if="props.fabApplication.isMixedWafer && props.fabApplication.waferType !== 'HS' " style="margin-top: 10px">
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="6">
            <el-form-item class="custom-form-item" prop="waferAngle2">
              <el-input
                v-model="props.fabApplication.waferAngle2"
                placeholder="2nd Angle"
                style="width: 180px"
              >
                <template #prepend><span class="prepend-label">{{ cutLabel }}2</span></template>
              </el-input>
            </el-form-item>
          </el-col>
        
          <el-col :span="3">
            <el-form-item
              v-if="['NS', 'TC'].includes(props.fabApplication.waferType)"
              class="custom-form-item"
              prop="Angle2 Options"
            >
              <el-select
                v-model="props.fabApplication.waferAngle2"
                placeholder="Select 2nd Angle"
                style="width: 100px"
              >
                <el-option
                  v-for="angleOption in angleOptions"
                  :key="angleOption.key"
                  :label="angleOption.label"
                  :value="angleOption.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="6">
            <el-form-item class="custom-form-item" prop="waferThickness2">
              <el-input
                v-model="props.fabApplication.waferThickness2"
                placeholder="2nd Thickness (same as 1st)"
                style="width: 180px"
                disabled
              >
                <template #prepend><span class="prepend-label">Thickness2</span></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3"></el-col>
          <el-col :span="6">
            <el-form-item class="custom-form-item" prop="waferQty2">
              <el-input
                v-model.number="props.fabApplication.waferQty2"
                placeholder="2nd Qty"
                style="width: 150px"
              >
                <template #prepend><span class="qty-label">Qty2</span></template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      
        <div style="margin-top: 8px; color: #666;">
          ※ 혼입은 2개까지만 가능합니다. Thickness는 1번과 동일해야 해서 자동으로 맞춰집니다.
        </div>
      </div>
      <div
        class="flex-container"
        v-if="props.fabApplication.waferType !== 'HS'"
      ></div>
    </section>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch, onMounted, computed} from "vue";
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
  
  const totalQty = computed(() => {
  const q1 = Number(props.fabApplication.waferQty1 ?? 0);
  const q2 = Number(props.fabApplication.waferQty2 ?? 0);
  return q1 + q2;
  });

  watch(
    () => [
      props.fabApplication.isMixedWafer,
      props.fabApplication.waferQty1,
      props.fabApplication.waferQty2,
      props.fabApplication.waferType,
    ] as const,
    ([mixed, _q1, _q2, waferType]) => {
      if (!mixed) return;
      if (waferType === "HS") return;
      props.fabApplication.quantity = totalQty.value;
    },
    { immediate: true }
  );

  watch(
  () => props.fabApplication.isMixedWafer,
  (enabled) => {
    if (!enabled) return;
    if (props.fabApplication.waferType === "HS") return;

    if (props.fabApplication.waferQty1 == null) {
      props.fabApplication.waferQty1 = Number(props.fabApplication.quantity ?? 0);
    }
    props.fabApplication.waferQty2 = Number(props.fabApplication.waferQty2 ?? 0);
    },
  { immediate: true }
  );

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
        
        if (props.fabApplication.isMixedWafer && props.fabApplication.waferType !== "HS") {
          props.fabApplication.waferAngle2 = props.fabApplication.waferAngle;
          props.fabApplication.waferQty2 = 0;
        }

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
            if(props.fabApplication.isMixedWafer && props.fabApplication.waferType !== "HS"){
              props.fabApplication.waferThickness2 = props.fabApplication.waferThickness;
            }
          }
        }
      }
    }
  );
  
  watch(
  () => props.fabApplication.waferThickness,
  (t) => {
    if (!props.fabApplication.isMixedWafer) return;
    if (props.fabApplication.waferType === "HS") return;
    if (t == null || t === 0) return;
    props.fabApplication.waferThickness2 = t;
  },
  { immediate: true }
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

  .prepend-label {
  display: inline-block;
  width: 60px;        
  text-align: center;
  white-space: nowrap;
  } 

 .qty-label {
  display: inline-block;
  width: 30px;        
  text-align: center;
  white-space: nowrap;
  } 

  </style>