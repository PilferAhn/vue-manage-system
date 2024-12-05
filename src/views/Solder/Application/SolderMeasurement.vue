<template>
  <div>
    <el-descriptions
      v-for="(meas, index) in sortedMeasurements"
      :key="index"
      class="margin-top"
      :title="meas.measurementType"
      :column="4"
      :size="size"
      :border="true"
    >
      <!-- <template v-if="props.applicationType === 'load'" #extra>
        <el-button type="primary">Update</el-button>
      </template> -->
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            Quantity
          </div>
        </template>
        <el-input v-model="meas.quantity" :disabled="!meas.isMeasured"></el-input>
      </el-descriptions-item>
      <el-descriptions-item :align="true">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <tickets />
            </el-icon>
            측정 유무
          </div>
        </template>
        <!-- <el-tag size="small">School</el-tag> -->
        　　
        <el-checkbox v-model="meas.isMeasured"></el-checkbox>
        　
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Calendar />
            </el-icon>
            완료 희망일
          </div> </template
        >　
        <el-date-picker
          v-model="meas.wantedFinishedDate"
          type="date"
          placeholder="완료 희망일"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :disabled="!meas.isMeasured"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Calendar />
            </el-icon>
            완료일
          </div> </template
        >　
        <el-date-picker
          v-model="meas.finishedDate"
          type="date"
          placeholder=""
          :readonly="true"
        />
      </el-descriptions-item>

      <el-descriptions-item span="3">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            측정 상세 요청 사항
          </div>
        </template>
        <el-input v-model="meas.detail" :disabled="!meas.isMeasured"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            Status
          </div>
        </template>
        　
        <el-select
          class="m-4"
          v-model="meas.status"
          placeholder="Select"
          style="width: 150px"
          :disabled="!meas.isMeasured"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        　        
      </el-descriptions-item>
      <el-descriptions-item span="3">
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            측정 진행 사항 (WHC)
          </div>
        </template>
        <el-input v-model="meas.detailInHanoi" :disabled="!meas.isMeasured"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            Action
          </div>
        </template>
        　
        <el-button type="primary" style="width: 150px;" @click="updateMeasurement(meas)">Update</el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>
import type { Measurement } from "../../../interface/solderAppInterface";
import { computed, ref } from "vue";
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from "@element-plus/icons-vue";
import type { ComponentSize } from "element-plus";
import { statusList } from "../ApplicationList/SolderApplicationList";
import { updateMeasurement } from "./SolderApplication";

const props = defineProps<{
  measurements: Measurement[];
  applicationType: string;
}>();
const size = ref<ComponentSize>("default");

const iconStyle = computed(() => {
  const marginMap = {
    large: "8px",
    default: "6px",
    small: "4px",
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  };
});
const blockMargin = computed(() => {
  const marginMap = {
    large: "32px",
    default: "28px",
    small: "24px",
  };
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  };
});

// Sorting Measurements by 'number'
const sortedMeasurements = computed(() => {
  return [...props.measurements].sort((a, b) => {
    const numA = a.number ? parseInt(a.number, 10) : 0;
    const numB = b.number ? parseInt(b.number, 10) : 0;
    return numA - numB;
  });
});
</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
