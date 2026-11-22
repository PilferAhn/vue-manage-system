<template>
  <!-- 수정자 MES: 마우스를 대면 MES 가 무엇을 바꿨는지(이력) 표시 (2026-11-22) -->
  <el-popover trigger="hover" placement="left" :width="420" :show-after="150" @show="load">
    <template #reference>
      <span class="mes-badge">
        {{ label }}
        <el-icon class="mes-icon"><InfoFilled /></el-icon>
      </span>
    </template>
    <div class="mes-title">{{ L.title }} · {{ productName }}</div>
    <div v-if="loading" class="mes-empty">{{ L.loading }}</div>
    <div v-else-if="failed" class="mes-empty">{{ L.failed }}</div>
    <div v-else-if="!logs.length" class="mes-empty">{{ L.none }}</div>
    <table v-else class="mes-table">
      <thead>
        <tr>
          <th>{{ L.when }}</th>
          <th>{{ L.field }}</th>
          <th>{{ L.change }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, i) in logs" :key="i">
          <td>{{ log.changed_at }}</td>
          <td>{{ fieldLabel(log) }}</td>
          <td>
            <span class="old">{{ log.old_value ?? "-" }}</span>
            →
            <span class="new">{{ log.new_value ?? "-" }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="logs.length && logs[0].source" class="mes-source">{{ L.source }}: {{ logs[0].source }}</div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { sendPostRequest } from "../../../utils/httpProtocol";
import { isJapaneseUser } from "../../../utils/i18n";

const props = defineProps<{
  productName: string;
  label?: string;
  /** 메인 화면에서만 true: WJC 사용자에게 일본어 */
  translate?: boolean;
}>();

type ChangeLog = {
  product_name: string;
  changed_at: string;
  changed_by: string;
  field: string;
  field_label: string;
  old_value: string | null;
  new_value: string | null;
  source: string | null;
};

const label = computed(() => props.label ?? "MES");
const ja = computed(() => !!props.translate && isJapaneseUser());
const L = computed(() =>
  ja.value
    ? { title: "MES による変更履歴", loading: "読み込み中…", failed: "履歴を取得できませんでした", none: "履歴なし", when: "日時", field: "項目", change: "変更前 → 変更後", source: "出典" }
    : { title: "MES 변경 이력", loading: "불러오는 중…", failed: "이력을 불러오지 못했습니다", none: "기록 없음", when: "일시", field: "항목", change: "변경 전 → 후", source: "출처" }
);
const JA_FIELDS: Record<string, string> = { quantity: "枚数", wanted_fab_start_date: "投入予定日", product_name: "P/N" };
function fieldLabel(log: ChangeLog) {
  return ja.value ? JA_FIELDS[log.field] ?? log.field : log.field_label;
}

const logs = ref<ChangeLog[]>([]);
const loading = ref(false);
const failed = ref(false);
let loaded = false;

async function load() {
  if (loaded || loading.value) return;
  loading.value = true;
  failed.value = false;
  try {
    const form = new FormData();
    form.append("product_names", props.productName);
    const data = (await sendPostRequest("/fab_monitoring_rev2/get_fab_request_change_logs", form)) as ChangeLog[];
    logs.value = (data ?? []).filter((x) => x.changed_by === "MES");
    loaded = true;
  } catch (e) {
    console.error("MES 변경 이력 조회 실패:", e);
    failed.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.mes-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 0 6px;
  border-radius: 4px;
  background: #fdf6ec;
  color: #b88230;
  font-weight: 700;
  cursor: help;
}
.mes-icon {
  font-size: 12px;
}
.mes-title {
  font-weight: 700;
  margin-bottom: 6px;
}
.mes-empty {
  color: #909399;
  font-size: 13px;
}
.mes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.mes-table th,
.mes-table td {
  border-bottom: 1px solid #ebeef5;
  padding: 4px 6px;
  text-align: left;
  white-space: nowrap;
}
.mes-table th {
  color: #909399;
  font-weight: 600;
}
.old {
  color: #909399;
  text-decoration: line-through;
}
.new {
  color: #e6a23c;
  font-weight: 700;
}
.mes-source {
  margin-top: 6px;
  font-size: 11px;
  color: #909399;
}
</style>
