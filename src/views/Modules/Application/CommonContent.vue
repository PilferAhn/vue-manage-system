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
              :placeholder="''"
              :options="quantityList"
              :need-bold="false"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <inputText
              v-model="props.application.requester"
              label="Requester"
              prop="productName"
              placeholder="ex) XMN5CTV@1A"
            />
          </el-col>
          <el-col :span="6">
            <inputText
              v-model="props.application.requesterId"
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
              v-model="props.application.smtHistory"
              label="SMT 이력"
              prop="smtHistory"
              placeholder=""
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
          <el-col :span="6">
            <el-form-item prop="dateOfConvey" label="자재 전달 일자">
              <el-date-picker
                v-model="props.application.dateOfConvey"
                placeholder="Pick one or more dates"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="완료 요청 일자">
              <el-date-picker
                type="dates"
                placeholder="Pick one or more dates"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <SelectOptionsNew2
              v-model="props.application.mold"
              label="MOLD"
              :options="appUtiles.createMoldOptions()"
            ></SelectOptionsNew2>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- <el-form-item label="완료 요청 일자">
              <el-date-picker
                type="dates"
                placeholder="Pick one or more dates"
              />
            </el-form-item> -->
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

        <NaSection
          v-if="props.application.isNa"
          :application="props.application"
          :applicationType="props.applicationType"
        ></NaSection>

        <NfSection
          v-if="props.application.isNf"
          :application="props.application"
          :applicationType="props.applicationType"
        ></NfSection>
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
import NfSection from "./Nf.vue";
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
