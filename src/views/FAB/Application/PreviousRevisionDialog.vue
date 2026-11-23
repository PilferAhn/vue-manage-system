<template>
  <el-dialog
    :model-value="props.visible"
    :title="isJa ? '前回の工程条件の読み込み' : '이전 차수 공정 조건 불러오기'"
    width="680px"
    :close-on-click-modal="false"
    @update:model-value="(v: boolean) => !v && emit('skip')"
  >
    <!-- WJC 사용자는 일본어 (utils/i18n.ts 의 isJapaneseUser) -->
    <p v-if="isJa" style="margin: 0 0 12px; line-height: 1.6">
      <strong>{{ props.productName }}</strong> の前回の依頼書があります。<br />
      選択した依頼書の <strong>Package, Designer, Band, Filter Type, Freq Range, Wafer, HS Wafer Structure, IDT, Piston, Passivation, SiO2, Photo</strong>
      条件を読み込みます。読み込んだ後に値を変更すると、提出時に警告が表示されます。
    </p>
    <p v-else style="margin: 0 0 12px; line-height: 1.6">
      <strong>{{ props.productName }}</strong> 이전 차수의 의뢰서가 있습니다.<br />
      선택한 의뢰서의 <strong>Package, Designer, Band, Filter Type, Freq Range, Wafer, HS Wafer Structure, IDT, Piston, Passivation, SiO2, Photo</strong>
      조건을 불러옵니다. 불러온 뒤 값을 바꾸면 제출 시 경고가 표시됩니다.
    </p>

    <el-table
      :data="props.candidates"
      highlight-current-row
      max-height="320"
      border
      @row-click="(row: PreviousRevision) => (selected = row.productName)"
    >
      <el-table-column width="50" align="center">
        <template #default="scope">
          <el-radio v-model="selected" :value="scope.row.productName" :label="scope.row.productName">
            <span />
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="P/N" width="160" align="center" />
      <el-table-column :label="isJa ? '登録日' : '등록일'" width="120" align="center">
        <template #default="scope">{{ formatDate(scope.row.createdDate) }}</template>
      </el-table-column>
      <el-table-column :label="isJa ? 'FAB 投入日' : 'FAB 투입일'" width="120" align="center">
        <template #default="scope">{{ formatDate(scope.row.wantedFabStartDate) }}</template>
      </el-table-column>
      <el-table-column prop="designerName" :label="isJa ? '開発者' : '개발자'" align="center" />
    </el-table>

    <template #footer>
      <el-button @click="emit('skip')">{{ isJa ? "読み込まない" : "불러오지 않음" }}</el-button>
      <el-button type="primary" :disabled="!selected" :loading="props.loading" @click="emit('load', selected)">
        {{ isJa ? "読み込む" : "불러오기" }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { PreviousRevision } from "../../../utils/Fab/fab-revision-utils";
import { formatDate } from "../../../utils/date-utils";
import { isJapaneseUser } from "../../../utils/i18n";

const isJa = isJapaneseUser();

const props = defineProps<{
  visible: boolean;
  productName: string;
  candidates: PreviousRevision[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "load", productName: string): void;
  (e: "skip"): void;
}>();

const selected = ref("");

// 열릴 때마다 기본 선택 = 직전 차수의 마지막 변형 (후보는 차수/변형 오름차순)
watch(
  () => [props.visible, props.candidates] as const,
  ([visible, candidates]) => {
    if (visible) selected.value = candidates.length ? candidates[candidates.length - 1].productName : "";
  },
  { immediate: true }
);
</script>

<script lang="ts">
export default {};
</script>
