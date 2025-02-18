<template>
  <!-- 첫 번째 조건부 섹션 -->
  <div
    v-if="['NS', 'HS'].includes(props.fabApplication.waferType)"
    class="section"
  >
    <h3>Extra Process Information [HS / NS]</h3>    
    <!-- <div v-if="props.fabApplication.packageId === 'CSP'" class="checkbox-group"> -->
    <div class="checkbox-group">
      <el-checkbox
        v-model="props.sawType.isAllowBridge"
        label="브릿지"
      ></el-checkbox>
      <el-checkbox
        v-model="props.fabApplication.isIdtXoi"
        label="IDT-Oxi"
      ></el-checkbox>      
      <span
        v-if="
          props.fabApplication.packageId === 'CSP' &&
          props.fabApplication.idtProcessId === 'Lift-off'
        "
      >
        <!-- <el-checkbox
          v-model="props.sawType.isAllowBridge"
          label="Dual IDT"
        ></el-checkbox>
        <el-checkbox
          v-model="props.fabApplication.isAllowBridge"
          label="산포 개선 노광량 사용"
        ></el-checkbox> -->
      </span>

      <el-checkbox
        v-model="props.fabApplication.isNeedExtraShot"
        label="TEG Shot 추가(더블샷)"
      ></el-checkbox>
      <el-checkbox
        v-model="props.fabApplication.isDualIdt"
        label="Dual IDT"
      ></el-checkbox>
      <el-checkbox
        v-model="props.fabApplication.isToneInverted"
        label="PAD 6um 적용(톤반전)"
      ></el-checkbox>
      <el-checkbox
        v-model="props.fabApplication.isSeedSio2"
        label="SiO2Seed"
      ></el-checkbox>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  FabRequestForm,
  SawType,
  IdtType,
} from "../../../interface/fab-application-rev2";

// props 정의
const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
  
}>();
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
/* 전체 섹션 스타일 */
.section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
}

/* 제목 스타일 */
h3 {
  margin-bottom: 12px;
  font-size: 18px;
  color: #333;
}

h4 {
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
}

/* 체크박스 그룹 스타일 */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
