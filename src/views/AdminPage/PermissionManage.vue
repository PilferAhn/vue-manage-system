<template>
  <div class="container permission-manage">
    <el-alert
      type="info"
      :closable="false"
      show-icon
      class="guide"
      title="화면/기능 권한을 사번 또는 부서 단위로 부여합니다. admin 계정은 항상 모든 권한을 가집니다."
      description="화면 권한: 등록한 화면만 제한되며, 등록하지 않은 화면은 기존처럼 누구나 접근할 수 있습니다. 화면을 등록하면 부여받은 사용자/부서만 접근할 수 있으니 등록 직후 대상을 추가해주세요."
    />

    <el-tabs v-model="activeType" @tab-change="onTabChange">
      <el-tab-pane label="기능 권한" name="action" />
      <el-tab-pane label="화면 권한" name="screen" />
    </el-tabs>

    <el-row :gutter="16">
      <!-- 권한 목록 -->
      <el-col :xs="24" :md="12">
        <div class="toolbar">
          <el-input
            v-model="keyword"
            placeholder="코드/이름/분류 검색"
            clearable
            size="small"
            class="search"
          />
          <el-button type="primary" size="small" @click="openCreate">
            {{ activeType === "screen" ? "화면 등록" : "권한 추가" }}
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="filteredPermissions"
          border
          size="small"
          highlight-current-row
          row-key="permCode"
          :current-row-key="selectedCode"
          @current-change="onSelect"
          class="perm-table"
        >
          <el-table-column prop="category" label="분류" width="90" />
          <el-table-column prop="name" label="이름" min-width="150" show-overflow-tooltip />
          <el-table-column prop="permCode" label="코드" min-width="170" show-overflow-tooltip />
          <el-table-column label="부여" width="60" align="center">
            <template #default="{ row }">{{ row.grants.length }}</template>
          </el-table-column>
          <el-table-column label="" width="140" align="center">
            <template #default="{ row }">
              <el-button type="primary" plain size="small" @click.stop="openEdit(row)">수정</el-button>
              <el-button type="danger" plain size="small" @click.stop="removePermission(row)">삭제</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!-- 부여 대상 -->
      <el-col :xs="24" :md="12">
        <el-card v-if="selected" shadow="never" class="grant-card">
          <template #header>
            <div class="grant-header">
              <div>
                <div class="grant-title">{{ selected.name }}</div>
                <div class="grant-code">{{ selected.permCode }}</div>
              </div>
            </div>
            <div v-if="selected.description" class="grant-desc">{{ selected.description }}</div>
          </template>

          <div class="grant-add">
            <el-radio-group v-model="newGrant.grantType" size="small">
              <el-radio-button label="user">사번</el-radio-button>
              <el-radio-button label="department">부서</el-radio-button>
            </el-radio-group>
            <el-select
              v-if="newGrant.grantType === 'user'"
              v-model="newGrant.grantValue"
              filterable
              allow-create
              default-first-option
              placeholder="이름 또는 사번"
              size="small"
              class="grant-select"
            >
              <el-option
                v-for="u in users"
                :key="u.id"
                :label="userLabel(u.id)"
                :value="u.id"
              />
            </el-select>
            <el-select
              v-else
              v-model="newGrant.grantValue"
              filterable
              allow-create
              default-first-option
              placeholder="부서 선택 또는 입력"
              size="small"
              class="grant-select"
            >
              <el-option v-for="d in departments" :key="d" :label="d" :value="d" />
            </el-select>
            <el-button type="primary" size="small" :disabled="!newGrant.grantValue" @click="submitGrant">
              추가
            </el-button>
          </div>

          <div class="grant-section">
            <div class="grant-section-title">부서 ({{ deptGrants.length }})</div>
            <el-empty v-if="deptGrants.length === 0" :image-size="40" description="없음" />
            <el-tag
              v-for="g in deptGrants"
              :key="g.id"
              closable
              type="warning"
              class="grant-tag"
              @close="removeGrant(g)"
            >
              {{ g.grantValue }}
            </el-tag>
          </div>
          <div class="grant-section">
            <div class="grant-section-title">사번 ({{ userGrants.length }})</div>
            <el-empty v-if="userGrants.length === 0" :image-size="40" description="없음" />
            <el-tag
              v-for="g in userGrants"
              :key="g.id"
              closable
              class="grant-tag"
              :type="userMap.has(g.grantValue) ? '' : 'danger'"
              @close="removeGrant(g)"
            >
              {{ userLabel(g.grantValue) }}
            </el-tag>
          </div>
        </el-card>
        <el-empty v-else description="왼쪽에서 권한을 선택하세요" />
      </el-col>
    </el-row>

    <!-- 권한 추가/수정 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editMode ? '권한 수정' : activeType === 'screen' ? '화면 등록' : '권한 추가'"
      width="520px"
    >
      <el-form :model="form" label-width="80px" size="small">
        <template v-if="activeType === 'screen' && !editMode">
          <el-form-item label="화면">
            <el-select
              v-model="selectedRouteName"
              filterable
              placeholder="화면 이름 또는 경로 검색"
              class="full"
              @change="onRouteChange"
            >
              <el-option-group v-for="g in registrableRouteGroups" :key="g.label" :label="g.label">
                <el-option
                  v-for="r in g.routes"
                  :key="r.name"
                  :label="`${r.title}  (${r.path})`"
                  :value="r.name"
                />
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="showNonMenuRoutes">
              메뉴에 없는 화면도 표시 (상세 화면, 예전 화면 등)
            </el-checkbox>
          </el-form-item>
        </template>
        <el-form-item label="코드">
          <el-input
            v-model="form.permCode"
            :disabled="editMode || activeType === 'screen'"
            placeholder="예) fab.request.update"
          />
        </el-form-item>
        <el-form-item label="이름">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="분류">
          <el-input v-model="form.category" placeholder="예) FAB, DV2, Solder" />
        </el-form-item>
        <el-form-item label="설명">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="정렬">
          <el-input-number v-model="form.orderIdx" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="dialogVisible = false">취소</el-button>
        <el-button size="small" type="primary" @click="submitPermission">저장</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  addGrant,
  deleteGrant,
  deletePermission,
  fetchDepartments,
  fetchPermissionList,
  fetchUsers,
  savePermission,
  type PermType,
  type UserBrief,
  type WebPermission,
  type WebPermissionGrant,
} from "../../utils/web-permission";
import { screenPermCode, usePermissStore } from "../../store/permiss";
import { getUserId } from "../../utils/account-utils";
import { menuItems } from "../../components/menu-items";

const router = useRouter();
const permissStore = usePermissStore();

const activeType = ref<PermType>("action");
const keyword = ref("");
const loading = ref(false);
const permissions = ref<WebPermission[]>([]);
const selectedCode = ref<string | null>(null);
const users = ref<UserBrief[]>([]);
const departments = ref<string[]>([]);

const userMap = computed(() => new Map(users.value.map((u) => [u.id, u])));

function userLabel(id: string) {
  const u = userMap.value.get(id);
  if (!u) return `${id} (사용자 없음)`;
  return `${u.userName ?? id} (${id})${u.department ? " · " + u.department : ""}`;
}

const filteredPermissions = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  return permissions.value.filter(
    (p) =>
      p.permType === activeType.value &&
      (!kw ||
        p.permCode.toLowerCase().includes(kw) ||
        p.name.toLowerCase().includes(kw) ||
        (p.category ?? "").toLowerCase().includes(kw))
  );
});

const selected = computed(
  () => permissions.value.find((p) => p.permCode === selectedCode.value) ?? null
);
const userGrants = computed(
  () => selected.value?.grants.filter((g) => g.grantType === "user") ?? []
);
const deptGrants = computed(
  () => selected.value?.grants.filter((g) => g.grantType === "department") ?? []
);

async function reload() {
  loading.value = true;
  try {
    permissions.value = await fetchPermissionList();
  } catch (e) {
    showError(e, "권한 목록을 불러오지 못했습니다.");
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await reload();
  try {
    [users.value, departments.value] = await Promise.all([fetchUsers(), fetchDepartments()]);
  } catch (e) {
    showError(e, "사용자/부서 목록을 불러오지 못했습니다.");
  }
});

function onTabChange() {
  selectedCode.value = null;
  keyword.value = "";
}

function onSelect(row: WebPermission | null) {
  selectedCode.value = row?.permCode ?? null;
  newGrant.grantValue = "";
}

function showError(e: any, fallback: string) {
  console.error(e);
  ElMessage.error(e?.response?.data?.detail ?? fallback);
}

/* ---------- 부여 대상 ---------- */
const newGrant = reactive<{ grantType: "user" | "department"; grantValue: string }>({
  grantType: "user",
  grantValue: "",
});

async function submitGrant() {
  if (!selected.value || !newGrant.grantValue) return;
  const value = newGrant.grantValue.trim();
  try {
    await addGrant(selected.value.permCode, newGrant.grantType, value, getUserId());
    newGrant.grantValue = "";
    await afterChange();
  } catch (e) {
    showError(e, "권한 부여에 실패했습니다.");
  }
}

async function removeGrant(g: WebPermissionGrant) {
  const label = g.grantType === "user" ? userLabel(g.grantValue) : g.grantValue;
  try {
    await ElMessageBox.confirm(`${label} 의 권한을 회수할까요?`, "권한 회수", { type: "warning" });
  } catch {
    return;
  }
  try {
    await deleteGrant(g.id!, getUserId());
    await afterChange();
  } catch (e) {
    showError(e, "권한 회수에 실패했습니다.");
  }
}

async function afterChange() {
  await reload();
  // 본인 권한이 바뀌었을 수 있으므로 갱신
  await permissStore.loadWebPermissions(true);
  ElMessage.success("저장되었습니다.");
}

/* ---------- 권한 추가/수정 ---------- */
const dialogVisible = ref(false);
const editMode = ref(false);
const selectedRouteName = ref("");
const form = reactive({
  permCode: "",
  name: "",
  category: "",
  description: "",
  orderIdx: 0,
});

const EXCLUDED_ROUTES = new Set(["Login", "login", "403", "404", "PermissionManage"]);

type RouteOption = { name: string; title: string; path: string };

/** 사이드바 메뉴에 있는 화면: 라우트 name → { 메뉴 그룹, 메뉴 제목 } */
const menuRouteInfo = (() => {
  const map = new Map<string, { group: string; title: string }>();
  const walk = (nodes: { index: string; title: string; subs?: any[] }[], group: string) => {
    for (const node of nodes) {
      if (node.subs?.length) {
        walk(node.subs, group || node.title);
        continue;
      }
      if (!node.index.startsWith("/")) continue;
      const name = router.resolve(node.index).name;
      if (typeof name === "string" && !map.has(name)) {
        map.set(name, { group: group || "기본", title: node.title });
      }
    }
  };
  walk(menuItems, "");
  return map;
})();

const showNonMenuRoutes = ref(false);

const registrableRoutes = computed<RouteOption[]>(() => {
  const registered = new Set(permissions.value.map((p) => p.permCode));
  const seen = new Set<string>();
  return router
    .getRoutes()
    .filter((r) => typeof r.name === "string" && r.meta?.title && !EXCLUDED_ROUTES.has(r.name))
    .filter((r) => !registered.has(screenPermCode(r.name as string)))
    .filter((r) => (seen.has(r.name as string) ? false : (seen.add(r.name as string), true)))
    .map((r) => ({ name: r.name as string, title: String(r.meta.title), path: r.path }));
});

/** 기본은 사이드바 메뉴에 있는 화면만, 체크 시 나머지 화면도 "메뉴에 없는 화면" 그룹으로 표시 */
const registrableRouteGroups = computed(() => {
  const groups = new Map<string, RouteOption[]>();
  const others: RouteOption[] = [];
  for (const r of registrableRoutes.value) {
    const info = menuRouteInfo.get(r.name);
    if (info) {
      if (!groups.has(info.group)) groups.set(info.group, []);
      groups.get(info.group)!.push({ ...r, title: info.title });
    } else if (showNonMenuRoutes.value) {
      others.push(r);
    }
  }
  const result = [...groups.entries()].map(([label, routes]) => ({ label, routes }));
  if (others.length) {
    result.push({ label: "메뉴에 없는 화면", routes: others.sort((a, b) => a.path.localeCompare(b.path)) });
  }
  return result;
});

function onRouteChange(name: string) {
  const r = registrableRoutes.value.find((x) => x.name === name);
  if (!r) return;
  form.permCode = screenPermCode(r.name);
  form.name = menuRouteInfo.get(r.name)?.title ?? r.title;
  form.category = r.path.split("/")[1] ?? "";
  form.description = r.path;
}

function openCreate() {
  editMode.value = false;
  selectedRouteName.value = "";
  Object.assign(form, { permCode: "", name: "", category: "", description: "", orderIdx: 0 });
  dialogVisible.value = true;
}

function openEdit(p: WebPermission) {
  editMode.value = true;
  Object.assign(form, {
    permCode: p.permCode,
    name: p.name,
    category: p.category ?? "",
    description: p.description ?? "",
    orderIdx: p.orderIdx,
  });
  dialogVisible.value = true;
}

async function submitPermission() {
  if (!form.permCode.trim() || !form.name.trim()) {
    ElMessage.warning("코드와 이름은 필수입니다.");
    return;
  }
  if (activeType.value === "screen" && !form.permCode.startsWith("screen:")) {
    ElMessage.warning("화면을 선택해주세요.");
    return;
  }
  if (activeType.value === "action" && form.permCode.startsWith("screen:")) {
    ElMessage.warning("기능 권한 코드는 'screen:' 으로 시작할 수 없습니다.");
    return;
  }
  try {
    const saved = await savePermission(
      { ...form, permCode: form.permCode.trim(), permType: activeType.value },
      getUserId()
    );
    dialogVisible.value = false;
    await afterChange();
    selectedCode.value = saved.permCode;
  } catch (e) {
    showError(e, "저장에 실패했습니다.");
  }
}

async function removePermission(p: WebPermission) {
  const msg =
    p.permType === "screen"
      ? `'${p.name}' 화면 등록을 해제할까요? 해제하면 기존처럼 누구나 접근할 수 있습니다.`
      : `'${p.name}' 권한을 삭제할까요? 부여된 대상 ${p.grants.length}건도 함께 삭제되며, 이 권한을 쓰는 화면에서는 admin 외에 아무도 해당 기능을 쓸 수 없게 됩니다.`;
  try {
    await ElMessageBox.confirm(msg, "삭제", { type: "warning" });
  } catch {
    return;
  }
  try {
    await deletePermission(p.permCode, getUserId());
    if (selectedCode.value === p.permCode) selectedCode.value = null;
    await afterChange();
  } catch (e) {
    showError(e, "삭제에 실패했습니다.");
  }
}
</script>

<style scoped>
.guide {
  margin-bottom: 12px;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.search {
  flex: 1;
}
.perm-table {
  width: 100%;
  cursor: pointer;
}
.grant-card {
  min-height: 300px;
}
.grant-title {
  font-weight: 600;
}
.grant-code {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.grant-desc {
  margin-top: 6px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
.grant-add {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.grant-select {
  flex: 1;
  min-width: 200px;
}
.grant-section {
  margin-bottom: 12px;
}
.grant-section-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}
.grant-tag {
  margin: 0 6px 6px 0;
}
.full {
  width: 100%;
}
</style>
