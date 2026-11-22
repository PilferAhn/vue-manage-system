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

    <!-- 맨 아래: 변경 이력 (접힌 상태에서는 아이콘만) -->
    <router-link
      to="/changelog"
      class="sidebar-changelog"
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

// 메뉴를 고르면 왼쪽 메뉴를 접어 본문을 넓게 쓴다 (왼쪽 위 버튼으로 다시 펼침)
function collapseAfterSelect() {
  stopPeek();
  if (!sidebar.collapse) sidebar.handleCollapse();
}

// 마우스 자동 펼침 (접힌 상태에서만). 스쳐 지나갈 때 펼쳐지지 않도록 잠깐 머물러야 펼치고,
// 메뉴 밖으로 잠깐 벗어났다 돌아와도 닫히지 않도록 약간 늦게 닫는다.
const isPeeking = ref(false);
let peekTimer: ReturnType<typeof setTimeout> | undefined;
function onPeekEnter() {
  clearTimeout(peekTimer);
  if (!sidebar.collapse || isPeeking.value) return;
  peekTimer = setTimeout(() => (isPeeking.value = true), 150);
}
function onPeekLeave() {
  clearTimeout(peekTimer);
  if (!isPeeking.value) return;
  peekTimer = setTimeout(() => (isPeeking.value = false), 250);
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
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
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
.sidebar-changelog {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 250px;
  box-sizing: border-box;
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #bfcbd9;
  font-size: 14px;
  text-decoration: none;
}
.sidebar-changelog.collapsed {
  width: 64px;
  justify-content: center;
  padding: 14px 0;
}
.sidebar-changelog:hover,
.sidebar-changelog.router-link-active {
  color: #20a0ff;
  background: rgba(0, 0, 0, 0.12);
}
</style>
