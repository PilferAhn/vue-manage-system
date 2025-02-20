<template>
  <div class>
    {{ selectedPackageKey }}
    <!-- <el-form-item label="Bom 정보"> -->
    <el-descriptions
      v-if="props.bom !== null"
      class="margin-top"
      :title="desTitle"
      :column="4"
      :size="'small'"
      border
    >
      <!-- <template #extra>
          <el-button type="primary">Operation</el-button>
        </template> -->
      <el-descriptions-item :span="desSpanSize">
        <template #label>
          <div class="cell-item">Final Product Size</div>
        </template>
        <div>
          <el-select v-model="props.bom.finishedProductSize">
            <el-option
              v-for="bumpSizeOption in sizeList"
              :key="bumpSizeOption"
              :label="bumpSizeOption"
              :value="bumpSizeOption"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2" v-if="props.bomNumber === 'Bom1'">
        <template #label>
          <div class="cell-item" size="large">Bom2 등록</div>
        </template>
        <div>
          　<el-checkbox v-model="props.fabApplication.isNewBom2"></el-checkbox>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">Bump Size</div>
        </template>
        <div class="cell-value">
          <el-select v-model="props.bom.bump.size">
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
          <div class="cell-item">Bump Ea</div>
        </template>
        <div class="cell-value">
          <el-select v-model="props.bom.bump.quantity">
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
          <el-select v-model="props.bom.epoxy.modelName">
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
          <div>Size</div>
        </template>
        <div class="cell-value">
          <el-input type="number" v-model="props.bom.epoxy.size"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div>Epoxy Type</div>
        </template>
        <div class="cell-value">
          <el-select v-model="props.bom.epoxy.purpose">
            <el-option
              v-for="bumpSizeOption in epoxyPurposeList"
              :key="bumpSizeOption"
              :label="bumpSizeOption"
              :value="bumpSizeOption"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="4">
        <template #label>
          <div>Product Code</div>
        </template>
        <div>
          <el-input v-model="props.bom.epoxy.code"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">Package Name</div>
        </template>
        <div>
          <el-select v-model="props.bom.package">
            <el-option
              v-for="p in packageOptioins"
              :key="p.key"
              :label="p.label"
              :value="p.value"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">PKG Size</div>
        </template>
        <div>
          <el-input v-model="props.bom.pkgSize" disabled></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">P/N</div>
        </template>
        <div>
          <!-- <el-select v-model="props.bom.package">
            <el-option
              v-for="p in packageOptioins"
              :key="p.key"
              :label="p.label"
              :value="p.value"
            ></el-option>
          </el-select> -->
          <el-input v-model="props.bom.partNumber" disabled></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">SH당 수량</div>
        </template>
        <div>
          <el-input v-model="props.bom.shQuantity" disabled></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">제조사</div>
        </template>
        <div>
          <el-select v-model="props.bom.pkgCompany">
            <el-option
              v-for="p in bomCompanyOptions"
              :key="p.key"
              :label="p.label"
              :value="p.value"
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">PKG Top Au두께 (um)</div>
        </template>
        <div>
          <!-- <el-input
            style="max-width: 300px"
            v-model="props.fabApplication.bom.epoxy.code"
          ></el-input> -->
          <el-select v-model="props.bom.pkgTopAuThickness" :disabled="isCompanyDisabled">
            <el-option
              v-for="p in bomPkgTopAuThickness"
              :key="p.key"
              :label="p.label"
              :value="p.value"              
            ></el-option>
          </el-select>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">이동평균가(USD)</div>
        </template>
        <div>
          <el-input v-model="props.bom.usdAverage"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template #label>
          <div class="cell-item">이동평균가(KRW 1000EA)</div>
        </template>
        <div>
          <el-input v-model="props.bom.kwdAverage"></el-input>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <br />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import type {
  FabRequestForm,
  Bom,
  SawType,
} from "../../../../interface/fab-application-rev2";
import {
  getPackageList,
  getEpoInfoList,
  initBom,
  createPackageOptions,
  bomCompanyOptions,
  bomPkgTopAuThickness,
  getCostInfo,
  getPrice,
} from "../../../../utils/Fab/bom-utils";
import type { ComponentSize } from "element-plus";
import { OptionInterface } from "../../../../interface/option";
const props = defineProps<{
  fabApplication: FabRequestForm;
  bom: Bom;
  sawType: SawType;
  bomNumber: string;
}>();
const epoList = ref<object[]>([]);
const tempEpoList = ref<object[]>([]);
const packageList = ref<object[]>([]);
const packageOptioins = ref<OptionInterface[]>([]);
const bumpSizeList = ["", "55nm", "65nm", "70nm", "70nm-특수"];
const bumpQuantityList = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const epoxyPurposeList = ["일반", "방열"];
const companyList = ["Kyocera", "Daisho Denshi"];
const epoModel = ref<string>("");
const epoCode = ref<string>("");
const desSpanSize = ref<string>("4");
const desTitle = ref<string>("");
const selectedPackageKey = ref<string | number>("");
const purePackageList = ref<object[]>([])
const costList = ref<object[]>([])
onMounted(async () => {
  if (props.bomNumber === "Bom1") {
    desSpanSize.value = "2";
    desTitle.value = "Bom1 정보";
  } else {
    desSpanSize.value = "4";
    desTitle.value = "Bom2 정보";
  }
  purePackageList.value = await getPackageList();
  costList.value =  await getCostInfo()
});

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

watch(()=>props.bom.pkgCompany, (newVal)=>{
  if(props.bom.pkgSize !== null){
    console.log(props.bom.pkgSize , newVal)
    getPrice(props.bom , costList.value, props.bom.pkgSize, newVal)
  }
})

watch(
  () => props.bom.package,
  (newVal) => {
    selectedPackageKey.value =
      packageOptioins.value.find((p) => p.value === props.bom.package)?.key ||
      "";

    extractValues(purePackageList.value[selectedPackageKey.value], props.bom)
  }
);

const isCompanyDisabled = ref<boolean>(false)
watch(()=>props.bom.pkgCompany, (newVal)=>{
  console.log(newVal)
  if(newVal !== null){
    console.log(props.bom.pkgCompany === "Daisho Denshi")
    if(props.bom.pkgCompany === "Daisho Denshi"){
      isCompanyDisabled.value = true
      console.log(isCompanyDisabled.value)
      props.bom.pkgTopAuThickness = null
    }
  }
})

watch(
  () => props.fabApplication.packageId,
  (newVal, oldVal) => {
    if (["WLP", "BDMP"].includes(oldVal) && newVal === "CSP") {
      // props.fabApplication.bom = initBom();

      if (epoList.value.length > 0) {
        const temp = epoList.value.find((e) => e["model"] === newVal);
        epoCode.value = temp["code"];
        props.fabApplication.bom.epoxy.code = temp["code"];
      }
    }
    if (newVal === "CSP") {
    } else {
      // props.fabApplication.bom = null;
    }
  },
  { immediate: true }
);

const extractValues = (data: object, bom: Bom) => {
  // package 값 설정
  const packageValue = data["MATNR"] || "";

  // 정규 표현식으로 size 찾기 (ex: 1814)
  const sizeMatch = data["MAKTX"].match(/(\d{4})/);
  bom.pkgSize = sizeMatch ? sizeMatch[1] : "";

  // 정규 표현식으로 partNumber 찾기 (ex: YV-C(0.3um))
  const partNumberMatch = data["MAKTX"].match(/,\s*([^,]+),/);
  bom.partNumber = partNumberMatch ? partNumberMatch[1].trim() : "";

  // 정규 표현식으로 shQuantity 찾기 (ex: 2,668)
  const shQuantityMatch = data["MAKTX"].match(/(\d{1,3}(,\d{3})*)pcs/);
  bom.shQuantity = shQuantityMatch ? shQuantityMatch[1] : "";

  // return {
  //   size,
  //   shQuantity,
  //   partNumber,
  //   package: packageValue,
  // };
};

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

watch(
  () => packageList.value,
  (newVal) => {
    if (newVal.length >= 1) {
      packageOptioins.value = createPackageOptions(packageList.value);
    }
  }
);

watch(
  () => bom.package,
  (newVal) => {}
);

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
