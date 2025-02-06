<template>
  <div class="deposition-container">
    <!-- <el-form-item label="Bom 정보"> -->
    <el-descriptions
      class="margin-top"
      title="Bom 정보"
      :column="4"
      :size="size"
      border
    >
      <!-- <template #extra>
          <el-button type="primary">Operation</el-button>
        </template> -->
      <el-descriptions-item span="4">
        <template #label>
          <div class="cell-item">완제품 규격</div>
        </template>
        <div>
          <el-select v-model="props.fabApplication.bom.finishedProductSize">
            <el-option
              v-for="bumpSizeOption in sizeList"
              :key="bumpSizeOption"
              :label="bumpSizeOption"
              :value="bumpSizeOption"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">범프볼 규격</div>
        </template>
        <div class="cell-value">
          <el-select v-model="props.fabApplication.bom.bump.size">
            <el-option
              v-for="bumpSizeOption in bumpSizeList"
              :key="bumpSizeOption"
              :label="bumpSizeOption"
              :value="bumpSizeOption"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">범프볼 수</div>
        </template>
        <div class="cell-value">
          <el-select v-model="props.fabApplication.bom.bump.quantity">
            <el-option
              v-for="bumpSizeOption in bumpQuantityList"
              :key="bumpSizeOption"
              :label="bumpSizeOption"
              :value="bumpSizeOption"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div>Epoxy</div>
        </template>
        <div class="cell-value">
          <!-- <el-input
            v-model="props.fabApplication.bom.epoxy.modelName"
          ></el-input> -->
          <el-select v-model="props.fabApplication.bom.epoxy.modelName">
            <el-option
              v-for="m in epoList"
              :key="m['index']"
              :label="m['model']"
              :value="m['model']"
            ></el-option>
          </el-select>
          <!-- <el-option v-model="props.fabApplication.bom.epoxy.modelName">
            <el-select  v-for="m in epoList"
              :key="m.index"
              :label="m.model"
              :value="m.model"></el-select>
          </el-option> -->
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div>규격</div>
        </template>
        <div class="cell-value">
          <el-input
            type="number"
            v-model="props.fabApplication.bom.epoxy.size"
          ></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div>용도</div>
        </template>
        <div class="cell-value">
          <el-select v-model="props.fabApplication.bom.epoxy.purpose">
            <el-option
              v-for="bumpSizeOption in epoxyPurposeList"
              :key="bumpSizeOption"
              :label="bumpSizeOption"
              :value="bumpSizeOption"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div>자제코드</div>
        </template>
        <div class="cell-value">
          <el-input v-model="props.fabApplication.bom.epoxy.code"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="6">
        <template #label>
          <div>Packge명</div>
        </template>
        <div>
          <!-- <el-input
            style="max-width: 300px"
            v-model="props.fabApplication.bom.epoxy.code"
          ></el-input> -->
          <el-select v-model="props.fabApplication.bom.package">
            <el-option
              v-for="p in packageOptioins"
              :key="p.key"
              :label="p.label"
              :value="p.value"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="6">
        <template #label>
          <div></div>
        </template>
      </el-descriptions-item>
    </el-descriptions>
    <!-- </el-form-item> -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import type {
  FabRequestForm,
  Bom,
  SawType,
} from "../../../../interface/fab-application-rev2";
import {
  getPackageList,
  getEpoInfoList,
  initBom,
  createPackageOptions
} from "../../../../utils/Fab/bom-utils";
import type { ComponentSize } from "element-plus";
import { OptionInterface } from "../../../../interface/option";
const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();
const epoList = ref<object[]>([]);
const tempEpoList = ref<object[]>([]);
const packageList = ref<object[]>([]);
const packageOptioins = ref<OptionInterface[]>([])
const bumpSizeList = ["", "55nm", "65nm", "70nm", "70nm-특수"];
const bumpQuantityList = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const epoxyPurposeList = ["일반", "방열"];
const companyList = ["Kyocera", "Daisho Denshi"];
const epoModel = ref<string>("");
const epoCode = ref<string>("");

const sizeList = [
  "",
  "0907",
  "1109",
  "1310",
  "1410",
  "1411",
  "1511",
  "1612",
  "1713",
  "1814",
  "2016",
  "2520",
];

const bom = {
  finishedProductSize: null,
  size: undefined,
  bump: {
    size: "",
    quantity: 0,
  },
  epoxy: {
    modelName: "",
    size: undefined,
    code: undefined,
    purpose: undefined,
  },
  package: undefined,
};

watch(
  () => props.fabApplication.packageId,
  (newVal) => {
    if (
      epoList.value.length != 0 &&
      props.fabApplication.packageId !== undefined
    ) {
      // props.fabApplication.bom = bom;
      // const packageList = tempEpoList.value.find(
      //   (t) => t["pkgtype"] === newVal
      // );
      // console.log(tempEpoList);
    }
  }
);

watch(
  () => props.fabApplication.packageId,
  (newVal, oldVal) => {
    if (["WLP", "BDMP"].includes(oldVal) && newVal === "CSP") {
      props.fabApplication.bom = initBom();

      if (epoList.value.length > 0) {
        const temp = epoList.value.find((e) => e["model"] === newVal);
        epoCode.value = temp["code"];
        props.fabApplication.bom.epoxy.code = temp["code"];
      }
    } 
    if(newVal === "CSP"){

    }
    else {
      props.fabApplication.bom = null;
    }
  },
  { immediate: true }
);

watch(
  () => props.fabApplication.bom?.epoxy?.modelName,
  (newVal) => {
    if (epoList.value.length > 0) {
      const temp = epoList.value.find((e) => e["model"] === newVal);
      epoCode.value = temp["code"];
      props.fabApplication.bom.epoxy.code = temp["code"];
    }
  }
);

// watch( () => props.)

// watch(
//   () => props.fabApplication.bom.package,
//   (newVal) => {
//     // console.log(props.fabApplication.bom);
//   }
// );

watch(() => packageList.value, (newVal) => {
  if(newVal.length >= 1){
    packageOptioins.value =  createPackageOptions(packageList.value)
  }
})

const size = ref<ComponentSize>("default");
onMounted(async () => {
  // props.fabApplication.bom = bom;
  packageList.value = await getPackageList();
  epoList.value = await getEpoInfoList();
  // console.log(epoList.value);
});
</script>
<script lang="ts">
export default { components: {} };
</script>
<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  /* display: flex; */
  align-items: center;
  /* width: 80px; */
}
.cell-value {
  width: 245px;  
}
.margin-top {
  margin-top: 20px;
}

/* 전체 컨테이너 스타일 */
.align-center {
  display: flex;
  align-items: center; /* 요소들을 수직 중앙 정렬 */
}
.el-form-item {
  margin-bottom: 0; /* 마진 제거 */
}
.custom-select,
.el-input {
  height: 40px; /* 동일한 높이 */
}

.deposition-container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 섹션 구분 및 타이틀 */
.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
}

/* 드롭다운 스타일 */
.custom-select {
  width: 300px;
  margin-top: 8px;
}

/* 테이블 스타일 */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
}

/* 입력 필드 스타일 */
.custom-input {
  width: 100%;
}
</style>
