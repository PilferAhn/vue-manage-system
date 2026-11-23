<template>
  <!-- 접힌 상태에서 마우스를 대면 본문 위에 겹쳐 펼침(본문 폭은 그대로 → 표 재계산 없음), 벗어나면 다시 접힘 -->
  <div
    class="sidebar"
    :class="{ 'sidebar--peek': isPeeking }"
    @mouseenter="onPeekEnter"
    @mouseleave="onPeekLeave"
  >
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse && !isPeeking"
      :collapse-transition="false"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
      @select="collapseAfterSelect"
    >
      <template v-for="item in visibleItems" :key="item.index + '_item'">
        <template v-if="item.subs">
          <el-sub-menu
            :index="item.index"
            :key="item.index + '_submenu'"
            v-permiss="item.permiss"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>

            <template
              v-for="subItem in item.subs"
              :key="subItem.index + '_subItem'"
            >
              <el-sub-menu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index + '_submenu'"
                v-permiss="subItem.permiss"
              >
                <template #title>{{ subItem.title }}</template>

                <template
                  v-for="threeItem in subItem.subs"
                  :key="threeItem.index + '_threeItem'"
                >
                  <el-sub-menu
                    v-if="threeItem.subs"
                    :index="threeItem.index"
                    :key="threeItem.index + '_submenu'"
                    v-permiss="threeItem.permiss"
                  >
                    <template #title>{{ threeItem.title }}</template>

                    <el-menu-item
                      v-for="fourItem in threeItem.subs"
                      :key="fourItem.index + '_fourItem'"
                      :index="fourItem.index"
                      v-permiss="fourItem.permiss"
                    >
                      {{ fourItem.title }}
                    </el-menu-item>
                  </el-sub-menu>

                  <el-menu-item
                    v-else
                    :key="threeItem.index + '_menuitem'"
                    :index="threeItem.index"
                    v-permiss="threeItem.permiss"
                  >
                    {{ threeItem.title }}
                  </el-menu-item>
                </template>
              </el-sub-menu>

              <el-menu-item
                v-else
                :key="subItem.index + '_menuitem'"
                :index="subItem.index"
                v-permiss="subItem.permiss"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>

        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index + '_menuitem'"
            v-permiss="item.permiss"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>

    <!-- 맨 아래: 메뉴 고정 (펼쳤을 때만) + 변경 이력 (접힌 상태에서는 아이콘만) -->
    <div
      v-if="!(sidebar.collapse && !isPeeking)"
      class="sidebar-bottom-item sidebar-pin"
      :class="{ active: sidebar.pinned }"
      :title="sidebar.pinned ? '메뉴 고정 해제: 화면을 고르면 메뉴가 접힘' : '메뉴 고정: 메뉴를 항상 펼쳐 둠 (이 브라우저에 저장)'"
      @click="togglePin"
    >
      <span class="pin-icon">📌</span>
      <span>{{ sidebar.pinned ? "메뉴 고정 해제" : "메뉴 고정" }}</span>
    </div>
    <router-link
      to="/changelog"
      class="sidebar-bottom-item sidebar-changelog"
      :class="{ collapsed: sidebar.collapse && !isPeeking }"
      title="변경 이력"
      @click="collapseAfterSelect"
    >
      <el-icon><Document /></el-icon>
      <span v-if="!(sidebar.collapse && !isPeeking)">변경 이력</span>
    </router-link>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute, useRouter } from "vue-router";
import { usePermissStore } from "../store/permiss";
import { SidebarItem } from "../interface/sidebar";
import { menuItems as items } from "./menu-items";

// 권한관리(web_permission) 기준으로 메뉴 필터링
// - 등록된 화면은 부여받은 사용자에게만 표시, perm 지정 메뉴는 해당 권한 보유자에게만 표시
// - 하위 메뉴가 모두 숨겨진 그룹은 그룹째 숨김
const router = useRouter();
const permissStore = usePermissStore();

function isLeafVisible(node: { index: string; perm?: string }): boolean {
  if (node.perm && !permissStore.hasPerm(node.perm)) return false;
  if (!node.index.startsWith("/")) return true;
  const resolved = router.resolve(node.index);
  return permissStore.canAccessScreen(resolved.name);
}

function filterNodes<T extends { index: string; perm?: string; subs?: any[] }>(nodes: T[]): T[] {
  const result: T[] = [];
  for (const node of nodes) {
    if (node.subs && node.subs.length > 0) {
      if (node.perm && !permissStore.hasPerm(node.perm)) continue;
      const subs = filterNodes(node.subs);
      if (subs.length > 0) result.push({ ...node, subs });
    } else if (isLeafVisible(node)) {
      result.push(node);
    }
  }
  return result;
}

const visibleItems = computed(() => filterNodes(items.filter((i) => !i.hideInSidebar)));

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();

// 메뉴를 고르면 왼쪽 메뉴를 접어 본문을 넓게 쓴다 (상단 메뉴 아이콘으로 다시 펼침). 메뉴 고정 중이면 그대로 둠
function collapseAfterSelect() {
  stopPeek();
  sidebar.collapseIfNotPinned();
}

// 메뉴 고정 켜기/끄기 (자동 펼침으로 잠깐 열린 상태에서 켜도 그대로 펼친 채 고정)
function togglePin() {
  stopPeek();
  sidebar.togglePinned();
}

// 마우스 자동 펼침 (접힌 상태에서만). 스쳐 지나갈 때 펼쳐지지 않도록 잠깐 머물러야 펼치고,
// 메뉴 밖으로 잠깐 벗어났다 돌아와도 닫히지 않도록 약간 늦게 닫는다.
const isPeeking = ref(false);
let peekTimer: ReturnType<typeof setTimeout> | undefined;
// 자동 펼침 대기 시간 (2026-11-23 사용자 요청: 너무 빠름 → 0.15초에서 0.5초로)
const PEEK_OPEN_DELAY = 500; // 메뉴 위에 이만큼 머물러야 펼침 (ms)
const PEEK_CLOSE_DELAY = 400; // 메뉴 밖으로 나가고 이만큼 지나야 접힘 (ms)
function onPeekEnter() {
  clearTimeout(peekTimer);
  if (!sidebar.collapse || isPeeking.value) return;
  // 의뢰서 작성/수정 화면(meta.noSidebarPeek)에서는 자동 펼침 안 함 → 상단 메뉴 아이콘으로 열기 (2026-11-23)
  if (route.meta?.noSidebarPeek) return;
  peekTimer = setTimeout(() => (isPeeking.value = true), PEEK_OPEN_DELAY);
}
function onPeekLeave() {
  clearTimeout(peekTimer);
  if (!isPeeking.value) return;
  peekTimer = setTimeout(() => (isPeeking.value = false), PEEK_CLOSE_DELAY);
}
function stopPeek() {
  clearTimeout(peekTimer);
  isPeeking.value = false;
}
// 왼쪽 위 버튼으로 고정/해제하면 겹쳐 펼친 상태는 정리
watch(() => sidebar.collapse, stopPeek);
onBeforeUnmount(() => clearTimeout(peekTimer));
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 40px; /* header.vue 높이와 맞춤 */
  bottom: 0;
  overflow-y: scroll;
}
/* 겹쳐 펼침: 본문 위에 띄움 */
.sidebar--peek {
  z-index: 1000;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.25);
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
/* 펼친 메뉴 폭 250 → 190px (2026-11-23). 본문 위치는 main.css .content-box left 와 같이 맞출 것
   긴 이름은 한 줄로 늘이지 않고 두 줄로 꺾음 */
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 190px;
}
.sidebar-el-menu:not(.el-menu--collapse) :deep(.el-menu-item),
.sidebar-el-menu:not(.el-menu--collapse) :deep(.el-sub-menu__title) {
  white-space: normal;
  word-break: keep-all;
  height: auto;
  min-height: 46px;
  line-height: 1.35;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-right: 34px; /* 오른쪽 펼침 화살표 자리 */
}
/* 메뉴가 위를 채우고 "변경 이력" 은 맨 아래에 붙음 */
.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #324157;
}
.sidebar > ul {
  flex: 1 0 auto;
}
.sidebar-bottom-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 190px;
  box-sizing: border-box;
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #bfcbd9;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
}
.sidebar-bottom-item.collapsed {
  width: 64px;
  justify-content: center;
  padding: 14px 0;
}
.sidebar-bottom-item:hover,
.sidebar-changelog.router-link-active {
  color: #20a0ff;
  background: rgba(0, 0, 0, 0.12);
}
.pin-icon {
  width: 18px;
  text-align: center;
  filter: grayscale(1);
  opacity: 0.7;
}
.sidebar-pin.active {
  color: #20a0ff;
}
.sidebar-pin.active .pin-icon {
  filter: none;
  opacity: 1;
}
</style>
