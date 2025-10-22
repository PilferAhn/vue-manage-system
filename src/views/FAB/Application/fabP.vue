<template>
  <div class="deposition-container">
    <h3 class="section-title">FAB P</h3>
    <div class="kv-rows" >
    <div class="kv-row">
      <div class="kv-label">Chip Card</div>
        <div class="kv-field">
          <el-input v-model="props.fabApplication.chipCard" />
        </div>
    </div>

    <div class="kv-row">
      <div class="kv-label">입고일</div>
        <div class="kv-field">
          <el-date-picker
          v-model="props.fabApplication.stockDate"
          type="date"
          value-format="YYYY-MM-DDT00:00:00"
          placeholder="입고일 선택"
          style="width: 100%"
        />
        </div>
    </div>

    <div class="kv-row">
      <div class="kv-label">입고여부</div>
        <div class="kv-field">
          <el-select v-model="props.fabApplication.stockYn" placeholder="선택">
            <el-option label="입고완료"   value="Y" />
            <el-option label="미입고" value="N" />
          </el-select>
        </div>
    </div>

    <div class="kv-row">
      <div class="kv-label">1차 Chip측정</div>
        <div class="kv-field">
          <el-select v-model="props.fabApplication.firstchipMeas" placeholder="선택">
            <el-option label="측정"   value="Y" />
            <el-option label="SKIP" value="N" />
          </el-select>
      </div>
    </div>

    <div class="kv-row" v-if="props.fabApplication.packageId === 'WLP'">
      <div class="kv-label">SiN 후 측정</div>
        <div class="kv-field">
          <el-select v-model="props.fabApplication.sinMeas" placeholder="선택">
            <el-option label="측정"   value="Y" />
            <el-option label="SKIP" value="N" />
        </el-select>
        </div>
    </div>

    <div class="kv-row">
      <div class="kv-label">2차 Chip측정</div>
        <div class="kv-field">
          <el-select v-model="props.fabApplication.secondchipMeas" placeholder="선택">
            <el-option label="측정"   value="Y" />
            <el-option label="SKIP" value="N" />
          </el-select>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import SelectOptionsNew2 from "../../Common/SelectOptionsNew2.vue";
import {
  type SawType,
  type Layer,
  type FabRequestForm,
  type IdtType,
  passivationType,
} from "../../../interface/fab-application-rev2";
import InputText from "../../Common/InputText.vue";
import {
  OptionInterface,
  OptionNumberInterface,
} from "../../../interface/option";

const props = defineProps<{
  fabApplication: FabRequestForm;
  sawType: SawType;
}>();

</script>
<script lang="ts">
export default {};
</script>
<style scoped>
.align-center {
  display: flex;
  align-items: center;
  gap: 8px; /* Seed 버튼과 제목 간격 */
}
.deposition-container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.section {
  margin-top: 16px;
}
.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
}

.kv-rows {
  width: 420px;              /* 필요한 폭으로 조절 */
}
.kv-row {
  display: grid;
  grid-template-columns: 140px 1fr; /* 왼쪽 라벨 / 오른쪽 입력 */
  align-items: center;
  background: #a5a2a2;      /* 라벨 배경과 분리감 주기 위해 래퍼 배경 */
  margin-bottom: 4px;
}
.kv-label {
  background: #adabab;
  color: #fff;
  font-weight: 600;
  padding: 4px 10px 4px 10px;
}
.kv-field {
  background: #fff;
  padding: 0;      
}
.kv-field :deep(.el-input),
.kv-field :deep(.el-select),
.kv-field :deep(.el-date-editor) {
  width: 100%;
}
</style>
