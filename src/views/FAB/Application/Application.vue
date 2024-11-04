<template>
  <div>
    <!-- <h2>Feb 투입 의뢰서</h2> -->
    <!-- Element Plus Form -->
    <el-form :model="props.processData" label-width="100">
      <!-- Group Input -->
      <div>
        <inputText
          v-model="props.processData.modelName"
          label="기종명"
          prop="modelName"
          placeholder="EX ) XMN6AHY@1MA"
          class="wide-select"
        ></inputText>
      </div>

      <div class="inline-fields">
        <el-form-item label="개발자">
          <el-autocomplete
            v-model="props.processData.designer"
            placeholder="개발자를 입력하세요"
            :fetch-suggestions="
              (queryString, cb) => querySearch(queryString, cb, 'designer')
            "
            @select="(item) => handleSelect(item, 'designer')"
            value-key="label"
            class="wide-select"
          ></el-autocomplete>
        </el-form-item>

        <!-- 의뢰자 입력 -->
        <el-form-item label="의뢰자">
          <el-autocomplete
            v-model="props.processData.requester"
            placeholder="의뢰자를 입력하세요"
            :fetch-suggestions="
              (queryString, cb) => querySearch(queryString, cb, 'requester')
            "
            @select="(item) => handleSelect(item, 'requester')"
            value-key="label"
            class="wide-select"
          ></el-autocomplete>
        </el-form-item>
      </div>

      <div class="inline-fields">
        <SelectOptions
          v-model="props.processData.group"
          label="그룹"
          prop="process"
          placeholder="그룹을 선택하세요"
          :options="groupList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
        <SelectOptions
          v-model="props.processData.process"
          label="공정"
          prop="process"
          placeholder="공정을 선택하세요"
          :options="processList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>

      <div class="inline-fields">
        <SelectOptions
          v-model="props.processData.priority"
          label="긴급도"
          prop="priority"
          placeholder="긴급도를 선택하세요"
          :options="priorityList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
        <SelectOptions
          v-model="props.processData.packageType"
          label="패키지"
          prop="package"
          placeholder="패키지 종류를 선택하세요"
          :options="packageList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>

      <div>
        <inputText
          v-model="props.processData.purpose"
          label="용도 / 목적"
          prop="purpose"
          placeholder="EX ) 1109 B40 TRx Filter VE 특성확인"
          class="wide-select"
        ></inputText>
      </div>

      <div>
        <inputText
          v-model="props.processData.idtThickness"
          label="막두께(nm)"
          prop="idtThickness"
          placeholder="EX ) Cr / Cu / Cr = 5 / 350 / 5"
          class="wide-select"
        ></inputText>
      </div>

      <div class="inline-fields">
        <SelectOptions
          v-model="props.processData.destination"
          label="출하"
          prop="destination"
          placeholder="EX ) WHC_CSP or WTC"
          :options="destinationList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
        <BooleanInput
          v-model="props.processData.isAoi"
          label="AOI 유무"
          prop="isAoi"
          :disable="false"
          :rules="[]"
          class="wide-select"
        />
      </div>

      <div class="inline-fields">
        <selectNumberOption
          v-model="props.processData.quantity"
          label="수량"
          prop="sampleQuantity"
          placeholder="1 ~ 30"
          :options="getSampleQuantityOptions()"
          class="wide-select"
        ></selectNumberOption>
        <SelectOptions
          v-model="props.processData.code"
          label="투입 코드"
          prop="code"
          placeholder="H or C"
          :options="codeList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>

      <div class="inline-fields">
        <SelectOptions
          v-model="props.processData.waferCompany"
          label="Wafer 제조사"
          prop="waferComapny"
          placeholder="S or NGK"
          :options="waferComList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
        <inputText
          v-model="props.processData.waferAngle"
          label="Wafer 각도"
          prop="waferAngle"
          placeholder="42 or 175"
          class="wide-select"
        ></inputText>
      </div>

      <div class="inline-fields">
        <inputText
          v-model="props.processData.waferThickness"
          label="Wafer 두께"
          prop="waferThickness"
          placeholder="200 or 500 "
          class="wide-select"
        ></inputText>
        <SelectOptions
          v-model="props.processData.waferType"
          label="Wafer 종류"
          prop="waferType"
          placeholder="BLT or HS"
          :options="waferTypes"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>

      <div class="inline-fields">
        <inputText
          v-model="props.processData.condition"
          label="HS W/F 조건"
          prop="condition"
          placeholder="NGK 4 43LT (520)/SiO2(400)/a-si(450)/Si(111)<011> 3ea"
          class="wide-select"
        ></inputText>
        <SelectOptions
          v-model="props.processData.machineName"
          label="성막 설비"
          prop="machineName"
          placeholder="ID#5"
          :options="machineList"
          :disable="false"
          class="wide-select"
        ></SelectOptions>
      </div>
      <el-row :gutter="20">
        <el-col :span="9">
          <InputText
            v-model="props.processData.moldingName"
            label="Molding"
            prop="machineName"
            placeholder="0103W00180T - FILM MOLDING ; 90MM*90MM,180T, A2029"
            class="wide-select"
          ></InputText>
        </el-col>
        <el-col :span="6"
          ><el-button type="info" @click="dialogVisible = true">
            Show Molding Data Table
          </el-button>
        </el-col>
      </el-row>

      <el-form-item label="Package">
        <el-col :span="15">
          <el-autocomplete
            v-model="props.processData.packageName"
            :fetch-suggestions="suggestPackageList"
            placeholder="Enter value (e.g., 'Q')"
            clearable            
          />
        </el-col>
      </el-form-item>

      <div class="inline-fields">
        <el-form-item
          prop="fabInsertDate"
          label="FAB 투입일"
          class="wide-select"
        >
          <el-date-picker
            type="date"
            placeholder="FAB 투입일"
            v-model="props.processData.wantedFabStartDate"
          ></el-date-picker>
        </el-form-item>

        <el-form-item
          prop="fabFinishDate"
          label="FAB 종료일"
          class="wide-select"
        >
          <el-date-picker
            type="date"
            placeholder="FAB 종료일"
            v-model="props.processData.wantedFabFinishDate"
          ></el-date-picker>
        </el-form-item>
      </div>

      <!-- Add more fields as necessary -->

      <el-form-item v-if="props.applicationType === 'create'">
        <el-button type="primary" @click="handleSendFormData"
          >FAB 투입 계획서 작성</el-button
        >
        <!-- <el-button type="warning" disabled>초기화</el-button> -->
        <!-- <el-button type="success" disabled>의뢰서 다운로드</el-button> -->
      </el-form-item>
      <el-form-item v-else>
        <!-- <el-button type="primary" @click="handleSendFormData"
          >FEB 의뢰 작성</el-button
        > -->
        <el-button type="primary" @click="handleUpdateFormData"
          >업데이트</el-button
        >
        <el-button type="warning" @click="handleDeleteFormData"
          >의뢰서 삭제</el-button
        >
      </el-form-item>
      <!-- Dialog with Table -->
      <!-- Dialog with Table -->
      <!-- Dialog with Table -->
      <el-dialog
        title="Molding Data Table"
        v-model="dialogVisible"
        width="820px"
        @close="handleClose"
      >
        <!-- Table to display molding data -->
        <el-table :data="moldingData" border style="width: 100%">
          <el-table-column
            prop="epoxyCode"
            label="Epoxy Code"
            width="130"
          ></el-table-column>
          <el-table-column
            prop="thickness"
            label="두께"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="type"
            label="구분"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="filmType"
            label="필름구분"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="company"
            label="업체"
            width="120"
          ></el-table-column>

          <!-- Action column with Select button -->
          <el-table-column label="Action" width="100">
            <template #default="scope">
              <el-button type="primary" @click="selectRow(scope.row)">
                Select
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Dialog footer with actions -->
        <template>
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >Confirm</el-button
          >
        </template>
      </el-dialog>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";

import InputText from "../../Common/InputText.vue";
import SelectOptions from "../../Common/SelectOptions.vue";
import BooleanInput from "../../Common/SelectBoolean.vue";
import SelectNumberOption from "../../Common/SelectNumberOption.vue";
import {
  groupList,
  processList,
  priorityList,
  packageList,
  destinationList,
  getSampleQuantityOptions,
  codeList,
  waferTypes,
  waferComList,
  machineList,
  sendFormData,
} from "../Common/Application";

import type { ProcessData } from "../Interface/ApplicationInterface";
import { ElMessageBox, ElMessage } from "element-plus";
import { useUserOptions } from "../../Common/utility";
import { getSuggestions } from "../Common/Application";
import { chipMoldingList, moldingData } from "../../../utils/ChipMoldingList";

const dialogVisible = ref(false);
// Function to handle selecting a row
const selectRow = (row) => {
  console.log(row);
  props.processData.moldingName = `${row.thickness} - ${row.type} - ${row.filmType} - ${row.company} - (${row.epoxyCode})`;
  props.processData.moldingCode = row.epoxyCode;
  dialogVisible.value = false; // Close the dialog after selection
};

const handleClose = () => {
  console.log("Dialog closed");
};

// fetch-suggestions를 호출할 때 getSuggestions를 사용
const suggestPackageList = (
  queryString: string,
  cb: (suggestions: any[]) => void
) => {
  getSuggestions(queryString, cb);
};

// 사용자의 입력을 기준으로 필터링된 결과를 반환하는 공통 함수
const querySearch = (
  queryString: string,
  cb: (suggestions: { value: string; label: string; key: string }[]) => void,
  fieldType: string // 'designer' 또는 'requester'로 구분
) => {
  const results = userOptions.value.filter((user) =>
    user.label.toLowerCase().includes(queryString.toLowerCase())
  );
  cb(results);
};

// 개발자와 의뢰자 선택 시 처리하는 공통 함수
const handleSelect = (
  item: { value: string; label: string },
  fieldType: string
) => {
  const selectedUser = userOptions.value.find(
    (user) => user.label === item.label
  );
  if (selectedUser) {
    if (fieldType === "designer") {
      props.processData.designerId = selectedUser.value; // 개발자 ID 할당
    } else if (fieldType === "requester") {
      props.processData.requesterId = selectedUser.value; // 의뢰자 ID 할당
    }
  }
};

// Define props to receive processData
const props = defineProps<{
  processData: ProcessData;
  applicationType: string;
}>();

const { userOptions } = useUserOptions();

// Handle sending form data to the server in PEP8 style (snake_case)
const handleSendFormData = () => {
  sendFormData("/fab_monitoring/create_fab_request", props.processData); // Automatically converts to PEP8 (snake_case) in Application.ts
};

const handleUpdateFormData = () => {
  sendFormData("/fab_monitoring/update_fab_request", props.processData); // Automatically converts to PEP8 (snake_case) in Application.ts
};

const handleDeleteFormData = () => {
  // Show a confirmation dialog before deleting
  ElMessageBox.confirm(
    "정말로 삭제하겠습니까? 삭제한 데이터는 되돌릴 수 없습니다.", // The confirmation message
    "확인 필요", // The title of the confirmation dialog
    {
      confirmButtonText: "삭제", // The label of the confirm button
      cancelButtonText: "취소", // The label of the cancel button
      type: "warning", // The type (which will affect the color and icon)
    }
  )
    .then(() => {
      // If the user confirms the deletion
      sendFormData("/fab/remove_application", props.processData);
      ElMessage({
        type: "success",
        message: "데이터가 성공적으로 삭제되었습니다.",
      });
    })
    .catch(() => {
      // If the user cancels the deletion
      ElMessage({
        type: "info",
        message: "삭제가 취소되었습니다.",
      });
    });
};
</script>

<style scoped>
@import "../../../assets/css/PDTRequestForm.css";
</style>
