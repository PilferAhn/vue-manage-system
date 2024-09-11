<template>
  <el-form :model="applicationData" label-position="top" label-width="100px">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="12">
          <inputText
            v-model="applicationData.modelName"
            label="기 종 명"
            prop="shotSize"
            placeholder="ex) XMN5CTV@1A"
          />
        </el-col>
        <el-col :span="12">
          <inputText
            v-model="applicationData.lotId"
            label="LOT ID"
            prop="chipSize"
            placeholder="ex) NCIFE0A30"
          />
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <inputText
            v-model="applicationData.developerName"
            label="개 발 자"
            prop="developerName"
            placeholder="ex) 개 발 자"
          />
        </el-col>
        <el-col :span="12">
          <inputText
            v-model="applicationData.requesterName"
            label="의 뢰 자"
            prop="requesterName"
            placeholder="ex) 의 뢰 자"
          />
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <inputText
            v-model="applicationData.evbType"
            label="EVB Type"
            prop="evbType"
            placeholder="ex) 1612_Rev5_W200"
          />
        </el-col>
        <el-col :span="12">
          <inputText
            v-model="applicationData.shipmentInfo"
            label="EVB 출하정보"
            prop="shipmentInfo"
            placeholder="ex) 2024-07-30 출하완료"
          />
        </el-col>
      </el-row>
      <inputText
        v-model="applicationData.pkgType"
        label="측정 PKG"
        prop="pkgType"
        placeholder="ex) HZ-B"
      />
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- Dropdown for measurementQuantity -->
          <el-form-item label="측정 수량">
            <el-select
              v-model="applicationData.measurementQuantity"
              placeholder="Select quantity"
              @change="updateMeasurements"
            >
              <el-option
                v-for="n in 10"
                :key="n"
                :label="n"
                :value="n"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <!-- el-table for displaying the measurements -->
          <el-table :data="applicationData.measurements" style="width: 100%">
            <el-table-column
              prop="measurementType"
              label="측정 종류"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="scope.row.measurementType"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="isMeasured" label="측정 여부" width="100">
              <template #default="scope">
                <el-checkbox v-model="scope.row.isMeasured"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="수량" width="120">
              <template #default="scope">
                <el-input v-model="scope.row.quantity" type="number"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { initializeApplicationData } from "../../../utils/solderApplicationUtil";
import inputText from "../../Common/InputText.vue";
import { reactive } from "vue";

// Initialize application data as reactive
const applicationData = reactive(initializeApplicationData());

// Function to update the measurements array based on the selected quantity
const updateMeasurements = () => {
  const selectedQuantity = applicationData.measurementQuantity;
  // If the new quantity is larger, add empty objects
  // measurements 배열을 선택된 수량만큼 초기화
  applicationData.measurements = Array.from(
    { length: selectedQuantity },
    () => ({
      measurementType: "", // 빈 문자열
      isMeasured: false, // 초기값 false
      quantity: 0, // 초기값 0
    })
  );
};
</script>

<style scoped>
@import "../../../assets/style/solderAppStyle.css";
</style>
