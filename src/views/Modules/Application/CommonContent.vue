<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card>
        <NaNfToogle :application="props.application" />
        <el-divider content-position="center">기본 정보</el-divider>
         <el-row :gutter="20">
            <el-col :span="6">
              <input-text
                v-model="props.application.requester"
                label="의뢰인"
                prop="requester"
                :disable="false"
                placeholder="의뢰인 이름"
              />
            </el-col>
            <el-col :span="6">
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
          <el-col :span="6">
              <inputText
                v-model="props.application.productName"
                label="Model Name"
                prop="productName"
                placeholder="ex) SFMD7R0E101(11자리)"
                :maxlength="11"
              />
            </el-col>
           <el-col :span="6">
              <el-form-item label="Quantity" prop="quantity">
                <el-input
                  v-model.number="props.application.quantity"
                  placeholder="수량을 입력하세요"
                />
              </el-form-item>
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
         </el-row>

         <el-row :gutter="20">
          <el-col :span="12">
            <div class="order-sheet-wrapper">
              <div class="order-sheet-input" style="flex-basis: 15%;">
                <input-text
                v-model="props.application.assemblyOrder"
                label="조립차수(OrderSheet)"
                prop="assemblyOrder"
                :disable="false"
                :need-bold="false"
                style="flex-grow: 1;"
                />
              </div>
              <div class="order-sheet-input" style="flex-basis: 50%;">
                <inputText
                  v-model="props.application.smtHistory"
                  label=""
                  prop="smtHistory"
                  placeholder=""
                  style="flex-grow: 2; width: 100%;"
                />
              </div>
              <el-button
                type="primary"
                size="small"
                class="order-sheet-btn"
                @click="handleOrderSheetClick"
                style="flex-grow: 0; margin-left: 10px;"
              >
                Order Sheet 찾기
              </el-button>
            </div>
          </el-col>
           <el-col :span="4">
            <input-text
              v-model="props.application.deliveryPerson"
              label="전달자"
              prop="deliveryPerson"
              :disable="false"
              :need-bold="false"
            />
          </el-col>
           <el-col :span="6">            
            <el-form-item prop="dateOfDeliveryDate" label="자재 전달 일자">              
              <el-date-picker
                v-model="props.application.dateOfDeliveryDate"
                placeholder="Click date"
              >
              </el-date-picker>
            </el-form-item>
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
            <input-text
              v-model="props.application.deliveryMethod"
              label="EVB조립 메뉴얼"
              prop="deliveryMethod"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>
        
        <!-- ✅ NA 측정 정보 -->
        <el-row v-if="props.application.isNa && props.application.naApp" :gutter="20">
          <el-col :span="12" class="formatForManager">
            <input-text
              v-model="props.application.naApp!.measurementManager"
              label="NA 측정 담당자(Người phụ trách đo)-측정자작성"
              prop="naApp.measurementManager"
              :disable="false"
              placeholder="NA 측정 담당자 이름"
              :need-bold="false"
            />
          </el-col>
          <el-col :span="6">
            <el-form-item
              prop="naApp.completionDueDate"
            >
                <template #label>
                <div>
                  NA 완료 예정일(측정자 작성)<br />
                  Ngày dự kiến hoàn thành (Người đo điền)
                </div>
              </template>
              <el-date-picker
                v-model="props.application.naApp!.completionDueDate"
                type="date"
                value-format="YYYY-MM-DD HH:mm"
                placeholder="Click date"
                :disabled-date="disableBeforeToday"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="naApp.finishedDate">
              <template #label>
                <div>
                  NA 완료일(측정자 작성)<br />
                  Ngày hoàn thành (Người đo điền)
                </div>
              </template>
              <el-date-picker
                v-model="props.application.naApp!.finishedDate"
                type="date"
                value-format="YYYY-MM-DD HH:mm"
                placeholder="Click date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- ✅ NF 측정 정보 -->
        <el-row v-if="props.application.isNf && props.application.nfApp" :gutter="20">
          <el-col :span="12" class="formatForManager">
            <input-text
              v-model="props.application.nfApp!.measurementManager"
              label="NF 측정 담당자(Người phụ trách đo)-측정자작성"
              prop="nfApp.measurementManager"
              :disable="false"
              placeholder="NF 측정 담당자 이름"
              :need-bold="false"
            />
          </el-col>
          <el-col :span="6">
            <el-form-item
              prop="nfApp.completionDueDate"
            >
              <template #label>
                <div>
                  NF 완료 예정일(측정자 작성)<br />
                  Ngày dự kiến hoàn thành (Người đo điền)
                </div>
              </template>
              <el-date-picker
                v-model="props.application.nfApp!.completionDueDate"
                type="date"
                value-format="YYYY-MM-DD HH:mm"
                placeholder="Click date"
                :disabled-date="disableBeforeToday"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="nfApp.finishedDate">
              <template #label>
                <div>
                  NF 완료일(측정자 작성)<br />
                  Ngày hoàn thành (Người đo điền)
                </div>
              </template>
              <el-date-picker
                v-model="props.application.nfApp!.finishedDate"
                type="date"
                value-format="YYYY-MM-DD HH:mm"
                placeholder="Click date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <CommonFiles
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
        ></CommonFiles>

        <!-- NA / NF를 가로로 배치 -->
        <el-row :gutter="20">
        <!-- NA: 왼쪽 -->
        <el-col
          v-if="props.application.isNa"
          :span="props.application.isNa && props.application.isNf ? 12 : 24"
        >
        <NaSection          
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
           @updatePortextensionLoss="props.application.naApp.portExtensionLoss = $event"
        ></NaSection>
        </el-col> 

        <!-- NF: 오른쪽 -->
         <el-col
          v-if="props.application.isNf"
          :span="props.application.isNa && props.application.isNf ? 12 : 24"
        >
        <NfSection          
          :application="props.application"
          :applicationType="props.applicationType"
          :file-obj-list="props.fileObjList"
        ></NfSection>
         </el-col>
        </el-row>
        <el-dialog
          v-model="orderSheetDialogVisible"
          title="Order Sheet 차수 선택"
          width="400px"
        >
          <div style="margin-bottom: 8px; font-size: 14px;">
            Model Code: <strong>{{ orderSheetModelCode }}</strong>
          </div>
        
          <el-scrollbar style="height: 260px;">
            <div
              v-for="level in orderSheetLevels"
              :key="level"
              class="order-sheet-level-item"
              @click="handleSelectOrderSheetLevel(level)"
            >
              {{ level }}
            </div>
          </el-scrollbar>
        
          <template #footer>
            <el-button @click="orderSheetDialogVisible = false">닫기</el-button>
          </template>
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  components: { FileTable },};
</script>
<script setup lang="ts">
import type { ModuleMeasurementApp, ModuleFiles } from "../../../interface/module_group/application/application";
import * as appUtiles from "../../../utils/module_group/application-utils";
import InputText from "../../Common/InputText.vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import { onMounted, ref, watch } from "vue";
import NaNfToogle from "./NaNfToogle.vue";
import NaSection from "./Na.vue";
import NfSection from "./Nf.vue";
import CommonFiles from "./CommonFiles.vue";
import FileTable from './FileTable.vue';
import LongInputText2 from "../../Common/LongInputText2.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getLevels, getSheetsByLevel } from "../../../utils/orderShiitUtils";
const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList : ModuleFiles;
}>();

const router = useRouter();

// ✅ OrderSheet용 상태
const orderSheetDialogVisible = ref(false);
const orderSheetLevels = ref<string[]>([]);
const orderSheetModelCode = ref("");

watch(
  () => props.fileObjList,
  (newApp) => {
    console.log("fileObjList changed:", newApp);
  },
  { deep: true }
);

watch(
  () => props.application,
  (newApp) => {
    // console.log("Application changed:", newApp);
  },
  { deep: true }
);
const disableBeforeToday = (time: Date) => {
  // dateOfCreate가 없으면 오늘 기준으로 처리
  const base = new Date();

  // 00:00:00으로 고정
  base.setHours(0, 0, 0, 0);

  // 의뢰일 이전 날짜는 선택 불가
  return time.getTime() < base.getTime();
};

const extractModelCode = (productName: string): string => {
  const p = productName.replace(/\s+/g, "");
  if (p.length >= 7) {
    return p.slice(3, 7);        // 3,4,5,6 → D7R0
  }
  // 길이가 애매할 때 fallback: 마지막 4글자
  return p.slice(-4);
};

const handleOrderSheetClick = async () => {
  const modelName = (props.application.productName ?? "").trim();
  if (!modelName) {
    ElMessage.warning("먼저 Model Name을 입력해주세요.");
    return;
  }

  const modelCode = extractModelCode(modelName);
  console.log("Extracted Model Code:", modelCode);
  if (!modelCode || modelCode.length !== 4) {
    ElMessage.warning("기종명에서 4자리 코드(D7R0 등)를 추출할 수 없습니다.");
    return;
  }

  // levels 조회
  const levels = await getLevels(modelCode);
  console.log("getLevels result:", modelCode, levels);

  if (!levels || levels.length === 0) {
    ElMessage.warning("해당 모델에 대한 차수 정보가 없습니다.");
    return;
  }

  orderSheetModelCode.value = modelCode;
  orderSheetLevels.value = levels;
  orderSheetDialogVisible.value = true;
}

const handleSelectOrderSheetLevel = async (level: string) => {
  const modelCode = orderSheetModelCode.value;

  // 1) 단순 쿼리 URL 형태로 링크 만들기 (백엔드에 맞춰 수정 가능)
  const sheets: any[] = await getSheetsByLevel(modelCode, level);
  if (!sheets || sheets.length === 0) {
    ElMessage.warning("선택한 차수에 대한 Order Sheet가 없습니다.");
    return;
  }
  // stype === 'sheet' 인 것 우선 사용
  const targetSheet =
    sheets.find((s) => s.stype === "sheet") ?? sheets[0];

  const sheetId = targetSheet.sheet_id;

  // router로 URL 문자열만 생성
  const resolved = router.resolve({
    name: "OrderSheetCreate", // 이미 OrderSheet 화면에서 쓰는 라우트 name
    params: { sheetId },
  }).href; // → "/#/modules/application/ordersheet/sheet/D7R050001" 형식

  const fullUrl = window.location.origin + resolved;
  console.log("Resolved Order Sheet URL:", fullUrl);
  // ✅ 조립차수 input에 최종 URL 저장
  props.application.assemblyOrder = level;
  props.application.smtHistory = fullUrl;

  orderSheetDialogVisible.value = false;
};

function getOrderSheetUrl(sheet_id: string) {
  return router.resolve({
    name: "OrderSheetCreate",
    params: { sheetId: sheet_id },
  }).href;
}

</script>

<style>
.order-sheet-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.order-sheet-input {
  flex: 1; 
}

.order-sheet-btn {
  margin-bottom: 22px;
  flex-grow: 0;
}

.order-sheet-level-item {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s;
  border: 1px solid #dcdfe6;
  margin-bottom: 6px;
}

.order-sheet-level-item:hover {
  background-color: #f0f9ff;
  border-color: #409eff;
   transform: scale(1.01);
}

.formatForManager {
  margin-top: 22px;
}
</style>
