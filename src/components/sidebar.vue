<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
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
  </div>
</template>


<script setup lang="ts">
import { computed } from "vue";
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

const visibleItems = computed(() => filterNodes(items));

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();

// 메뉴를 고르면 왼쪽 메뉴를 접어 본문을 넓게 쓴다 (왼쪽 위 버튼으로 다시 펼침)
function collapseAfterSelect() {
  if (!sidebar.collapse) sidebar.handleCollapse();
}
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
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
