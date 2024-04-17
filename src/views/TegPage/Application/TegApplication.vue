<template>
  <div class="container">
    <el-form ref="tegApplicationRules" :model="form" label-width="100px">
      <div class="split-layout">
        <div class="form-box">
          <el-form-item label="기종명" prop="modelName">
            <el-input
              placeholder="ex) XG30BBW"
              v-model="form.modelName"
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item label="작성자">
            <el-col :span="11">
              <el-form-item prop="designer">
                <el-input
                  placeholder="개발자"
                  v-model="form.designer"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">/</el-col>
            <el-col :span="11">
              <el-form-item prop="requester">
                <el-input
                  placeholder="의뢰자"
                  v-model="form.requester"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="의뢰목적" prop="purpose">
            <el-input
              v-model="form.purpose"
              placeholder=" 예) 설계 측정"
            ></el-input>
          </el-form-item>

          <el-form-item label="Lot ID" prop="LotID">
            <el-input
              v-model="form.purpose"
              placeholder=" 예) NCHDE04703"
            ></el-input>
          </el-form-item>

          <el-form-item label="일정">
            <el-col :span="11">
              <el-form-item>
                <el-date-picker
                  type="date"
                  placeholder="샘플 전달일"
                  v-model="form.dateOfConvery"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="Wafer Size">
            <el-select v-model="form.waferSize" placeholder="Select Wafer Size">
              <el-option
                v-for="size in waferSizeList"
                :key="size"
                :label="size.trim()"
                :value="size.trim()"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="수량">
            <el-select v-model="waferQuantity" placeholder="Select a number">
              <el-option v-for="i in 30" :key="i" :label="i" :value="i"></el-option>
            </el-select>
          </el-form-item>
          <!-- Dynamic input fields for Wafer Name based on selected quantity -->
          <el-form-item
            v-for="n in parseInt(waferQuantity)"
            :key="n"
            
          >
            <el-input
              v-model="waferNames[n - 1]"
              placeholder="WAFER 이름을 입력하세요"
            ></el-input>
          </el-form-item>


          <el-form-item label="특이사항">
            <el-input type="textarea" rows="10" v-model="form.note"></el-input>
          </el-form-item>
          <el-button @click="submitForm">의뢰서 작성</el-button>
        </div>
        <div class="form-box">
          <Wafer
            :waferInfo="waferInfo"
            @updateActiveShots="handleActiveShots"
          />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
// import { tegApplicationRules } from "../../../utils/FromRule";
import { TegFormRuleInterface } from "../../../utils/types";
import {
  waferSizeList,
  getWaferInfoBySize,
} from "../../../utils/waferApplicationHelper";

import Wafer from "../Wafer.vue";


const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const waferQuantity = ref(0);
const waferNames = ref([]);

const form = reactive<TegFormRuleInterface>({
  name: "",
  region: "",
  count: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
  waferQuantity: 0,
  dateOfConvery: "",
  waferSize: "",
  note: "",
  purpose: "",
  lotID: "",
  designer: "",
  requester: "",
  modelName: "",
});

const waferInfo = reactive({
  shots: [],
  disableShots: [],
  size: 0,
  status: [],
});
let activeShots = [];

// Watch for changes in wafer size and call the getWaferInfoBySize function
watch(
  () => form.waferSize,
  (newSize, oldSize) => {
    if (newSize) {
      Object.assign(waferInfo, getWaferInfoBySize(newSize));
      console.log(waferInfo); // Logs updated wafer info for debugging
    }
  }
);

const handleActiveShots = (shots) => {
  activeShots = shots;
};

const submitForm = () => {
  console.log("Selected active shots:", activeShots);
};
</script>

<style>
.container {
  width: 90%;
  max-width: 90%;
}

.split-layout {
  display: flex;
  flex-wrap: nowrap;
}

.form-box {
  flex: 1;
  margin-right: 20px; /* 폼 박스 간의 간격 조정 */
}

.form-box:last-child {
  margin-right: 0;
}
</style>
