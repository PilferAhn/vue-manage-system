<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card>
        <NaNfToogle :application="props.application" />
        <el-divider content-position="center">기본 정보</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <inputText
              v-model="props.application.productName"
              label="Model Name"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
            />
          </el-col>
          <el-col :span="12">
            <SelectOptionsNew2
              v-model="props.application.quantity"
              label="Quantity"
              prop="quantity"
              :disable="false"
              :placeholder="'고객사를 선택하세요'"
              :options="quantityList"
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <inputText
              v-model="props.application.productName"
              label="Requester"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
            />
          </el-col>
          <el-col :span="6">
            <inputText
              v-model="props.application.productName"
              label="Requester ID"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
            />
          </el-col>
          <el-col :span="12">
            <SelectOptionsNew2
              v-model="props.application.quantity"
              label="측정 SPL"
              prop="quantity"
              :disable="false"
              :placeholder="'고객사를 선택하세요'"
              :options="quantityList"
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <inputText
              v-model="props.application.productName"
              label="SMT 이력"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
            />
          </el-col>
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="의뢰목적"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <long-input-text-2
              v-model="props.application.productName"
              label="자제 전달 일자"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
              row-cnt="3"
            />
          </el-col>
          <el-col :span="12">
            <long-input-text-2
              v-model="props.application.productName"
              label="Mold"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
              row-cnt="3"
            />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="완료 요청 일자">
              <el-date-picker
                type="dates"
                placeholder="Pick one or more dates"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="Golden Sample 측정"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <long-input-text-2
              v-model="props.application.productName"
              label="Reference 특성"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
              row-cnt="2"
            />
          </el-col>
          <el-col :span="12">
            <long-input-text-2
              v-model="props.application.productName"
              label="자제 전달 일자"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
              row-cnt="2"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="TCF 측정"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="TCF 측정 온도"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="RFFE FIle 선택"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <long-input-text-2
              v-model="props.application.productName"
              label="측정 항목"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
              row-cnt="3"
            />
          </el-col>
          <el-col :span="12">
            <long-input-text-2
              v-model="props.application.productName"
              label="EVB 조립 메뉴얼"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
              row-cnt="2"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="TCF 측정 온도"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
          <el-col :span="12">
            <input-text
              v-model="props.application.purpose"
              label="RFFE FIle 선택"
              prop="quantity"
              :disable="false"
              placeholder=""
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <NaSection v-if="props.application.isNa"
          :application="props.application"
          :applicationType="props.applicationType"
        ></NaSection>

        <NfSection v-if="props.application.isNf"
          :application="props.application"
          :applicationType="props.applicationType"
        ></NfSection>

        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="개발자" style="width: 525px" prop="designer">
              <el-autocomplete
                placeholder="개발자를 입력하세요"
                value-key="label"
                style="width: 100%"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="의뢰자" style="width: 525px" prop="requester">
              <el-autocomplete
                placeholder="의뢰자를 입력하세요"
                value-key="label"
                style="width: 100%"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Filter Type" prop="filterType">
              <el-select placeholder="Select Filter Type">
                <el-option label="DPX" value="DPX"></el-option>
                <el-option label="QPX" value="QPX"></el-option>
                <el-option label="RX" value="RX"></el-option>
                <el-option label="TRX" value="TRX"></el-option>
                <el-option
                  label="DDPX (6 Port)"
                  value="DDPX (6 Port)"
                ></el-option>
                <el-option
                  label="DUAL (2X1/1X2)"
                  value="DUAL (2X1/1X2)"
                ></el-option>
                <el-option label="DUAL (2X2)" value="DUAL (2X2)"></el-option>
                <el-option label="기타" value="기타"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Deembed Mode" prop="deembedMode">
              <el-select placeholder="Select Deembed Mode">
                <el-option
                  label="Port Extention"
                  value="Port Extention"
                ></el-option>
                <el-option
                  label="External Deembeding"
                  value="External Deembeding"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Band" prop="band">
              <el-select placeholder="Band 28">
                <el-option
                  v-for="key in []"
                  :key="key"
                  :label="key"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">            
            <el-form-item label="EVB Shipment Date" prop="shipmentInfo">
              <el-date-picker
                type="date"
                placeholder="Select Date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Matching Component Type"
              prop="matchingComponentType"
            >
              <el-select placeholder="Select TN or HQ ?">
                <el-option label="TN" value="TN"></el-option>
                <el-option label="HQ" value="HQ"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="WHC Material List">
              <el-button type="primary"> WHC EVB LIST EXCEL </el-button>
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- <el-row :gutter="20">
          
          <el-col :span="8">
            <div style="display: flex; align-items: center">
          
              <el-form-item
                label="EVB Type"
                prop="evbType"
                style="flex-grow: 1"
              >
                <el-select placeholder="Select EVB Type">
                  <el-option
                    v-for="item in []"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="EVB Type"
                prop="evbType"
                style="flex-grow: 1"
              >
                <inputText
                  label=""
                  placeholder="Enter custom EVB Type"
                  style="width: 100%"
                />
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="4"> </el-col>

          
          <el-col :span="12">
            <inputText
              label="EVB name for external deembeding"
              prop="evbInfo"
              placeholder="ex) EVB name for external deembeding"
            />
          </el-col>
        </el-row> -->
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import type { Application } from "../../../interface/Modules/Application/application";
import * as appUtiles from "../../../utils/moduleGroup/application-utiles";
import InputText from "../../Common/InputText.vue";
import LongInputText2 from "../../Common/LongInputText2.vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import type { OptionInterface } from "../../../interface/option";
import { onMounted, ref, watch } from "vue";
import NaNfToogle from "./NaNfToogle.vue";
import NaSection from "./Na.vue";
import NfSection from "./Nf.vue"
const quantityList = ref<OptionInterface[]>([]);

onMounted(() => {
  quantityList.value = appUtiles.createQuantityOptions(20);
});

const props = defineProps<{
  application: Application;
  applicationType: string;
}>();

watch(
  () => props.application.isNa,
  (newVal) => {
    if (newVal) {
      props.application.naApp = appUtiles.initNa();
    } else if (newVal === null) {
      props.application.naApp = null;
    }
  }
);

watch(
  () => props.application.isNf,
  (newVal) => {
    if (newVal) {
      props.application.nfApp = appUtiles.initNf();
    } else if (newVal === null) {
      props.application.nfApp = null;
    }
  }
);
</script>

<script lang="ts">
export default {
  components: { LongInputText2 },
};
</script>

<style></style>
