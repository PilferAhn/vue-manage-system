<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card>
        <NaNfToogle :application="props.application" />
        <el-divider content-position="center">기본 정보</el-divider>
         <el-row :gutter="20">
            <!-- 의뢰인 -->
            <el-col :span="12">
              <input-text
                v-model="props.application.requester"
                label="의뢰인"
                prop="requester"
                :disable="false"
                placeholder="의뢰인 이름"
              />
            </el-col>
          
            <!-- 개발자 -->
            <el-col :span="12">
              <input-text
                v-model="props.application.designer"
                label="개발자"
                prop="designer"
                :disable="false"
                placeholder="개발자 이름"
              />
            </el-col>
          </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <inputText
              v-model="props.application.productName"
              label="Model Name"
              prop="productName"
              placeholder="ex) SFMD7R0E101"
              :maxlength="11"
            />
          </el-col>
           <el-col :span="12">
              <el-form-item label="Quantity" prop="quantity">
                <el-input
                  v-model.number="props.application.quantity"
                  placeholder="수량을 입력하세요"
                />
              </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <SelectOptionsNew2
              v-model="props.application.purpose"
              label="의뢰목적"
              :prop="'purpose'"
              :rules="[{required: true,}]"
              :need-bold="false"
              :disable="false"
              :placeholder="''"
              :options="appUtiles.createPurposeOptions()"
              :enable-others="true"
              othersValue="others"
              othersPlaceholder="기타 목적을 입력하세요."
              />
          </el-col>
          <el-col :span="12">
           <LongInputText2
              v-model="props.application.quantityDetail"
              label="세부 수량"
              prop="quantityDetail"
              :disable="false"
              placeholder="예)줄바꿈으로 구분 가능"
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <inputText
              v-model="props.application.smtHistory"
              label="조립차수(Order Sheet)"
              prop="smtHistory"
              placeholder=""
            />
          </el-col>
           <el-col :span="12">
            <input-text
              v-model="props.application.deliveryPerson"
              label="전달자"
              prop="deliveryPerson"
              :disable="false"
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <SelectOptionsNew2
              v-model="props.application.mold"
              label="MOLD"
              :prop="'mold'"
              :rules="[{required: true,}]"
              :need-bold="false"
              :disable="false"
              :placeholder="''"
              :options="appUtiles.createMoldOptions()"
            ></SelectOptionsNew2>
          </el-col>
          <el-col :span="6">            
            <el-form-item prop="dateOfDeliveryDate" label="자재 전달 일자">              
              <el-date-picker
                v-model="props.application.dateOfDeliveryDate"
                placeholder="Click date"
                :disabled-date="disableBeforeToday"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">            
            <el-form-item prop="dateOfExpectedFinished" label="완료 요청 일자">
              <el-date-picker
                v-model="props.application.dateOfExpectedFinished"                
                placeholder="Click date"
                :disabled-date="disableBeforeToday"
              />
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <input-text
              v-model="props.application.tcfTemperature"
              label="TCF 측정"
              prop="tcfTemperature"
              placeholder="예) 25 -> -30 -> 25 -> 85 -> 25"
              :need-bold="false"
            />
          </el-col>
          <el-col :span="12">
            <LongInputText2
              v-model="props.application.deliveryMethod"
              label="샘플 전달 방법"
              prop="deliveryMethod"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
            <!-- <input-text
              v-model="props.application.deliveryMethod"
              label="샘플 전달방법"
              prop="deliveryMethod"
              :disable="false"
              placeholder=""
              :need-bold="false"
            /> -->
          </el-col>
        </el-row>
            
        <el-row :gutter="20">
          <el-col :span="12">
            <input-text
              v-model="props.application.measurementManager"
              label="측정 담당자"
              prop="measurementManager"
              :disable="false"
              placeholder="측정 담당자 이름"
              :need-bold="false"
            />
          </el-col>
        
          <el-col :span="12">
            <el-form-item prop="completionDueDate" label="완료 예정일">
              <el-date-picker
                v-model="props.application.completionDueDate"
                type="date"
                value-format="YYYY-MM-DD HH:mm"
                placeholder="Click date"
                :disabled-date="disableBeforeToday"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="TCF 측정 유무">
              <el-select v-model="props.application.needTcf">
                <el-option
                  v-for="option in TrueAndFalseOptions"
                  :key="option.key"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          
        </el-row>
        
        <CommonFiles
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
        ></CommonFiles>

        <NaSection          
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
           @updatePortextensionLoss="props.application.naApp.portExtensionLoss = $event"
        ></NaSection>

        <NfSection          
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
        ></NfSection>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  components: { FileTable },};
</script>
<script setup lang="ts">
import { FormRules, UploadProps } from "element-plus";
import type { ModuleMeasurementApp, ModuleFiles } from "../../../interface/module_group/application/application";
import * as appUtiles from "../../../utils/module_group/application-utils";
import InputText from "../../Common/InputText.vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import type { OptionInterface, OptionNumberInterface } from "../../../interface/option";
import { onMounted, ref, watch } from "vue";
import NaNfToogle from "./NaNfToogle.vue";
import NaSection from "./Na.vue";
import NfSection from "./Nf.vue";
import CommonFiles from "./CommonFiles.vue";
import { TrueAndFalseOptions } from "../../../utils/dropdown-options";
import FileTable from './FileTable.vue';
import LongInputText2 from "../../Common/LongInputText2.vue";

const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList : ModuleFiles;
}>();

const disableBeforeToday = (time: Date) => {
  // dateOfCreate가 없으면 오늘 기준으로 처리
  const base = new Date();

  // 00:00:00으로 고정
  base.setHours(0, 0, 0, 0);

  // 의뢰일 이전 날짜는 선택 불가
  return time.getTime() < base.getTime();
};

// watch(
//   () => props.application.needTcf,
//   (newVal) => {
//     if (!newVal) {
//       props.application.tcfTemperature = null;
//     }
//   }
// );

</script>

<style></style>
