<template>
  <!-- <div class="tags" v-if="tags.show">
    <el-button type="primary" @click="goBack">뒤로가기</el-button>
	<el-button type="primary" @click="goForward">앞으로가기</el-button>
  </div> -->
  <div class="tags" v-if="tags.show">
		<!-- 뒤로 / 앞으로 (브라우저 기록 기준. Alt+← / 마우스 뒤로 버튼과 동일) -->
		<div class="tags-nav">
			<el-tooltip content="뒤로 (Alt + ←)" placement="bottom" :show-after="400">
				<button class="tags-nav-btn" :disabled="!canGoBack" @click="goBack">
					<el-icon><ArrowLeft /></el-icon>
				</button>
			</el-tooltip>
			<el-tooltip content="앞으로 (Alt + →)" placement="bottom" :show-after="400">
				<button class="tags-nav-btn" :disabled="!canGoForward" @click="goForward">
					<el-icon><ArrowRight /></el-icon>
				</button>
			</el-tooltip>
		</div>
		<ul>
			<li
				class="tags-li"
				v-for="(item, index) in tags.list"
				:class="{ active: isActive(item.path) }"
				:key="index"
			>
				<router-link :to="item.path" class="tags-li-title">{{ item.title }}</router-link>
				<el-icon @click="closeTags(index)"><Close /></el-icon>
			</li>
		</ul>
		<!-- <div class="tags-close-box">
			<el-dropdown @command="handleTags">
				<el-button size="small" type="primary">
					标签选项
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</el-button>
				<template #dropdown>
					<el-dropdown-menu size="small">
						<el-dropdown-item command="other">关闭其他</el-dropdown-item>
						<el-dropdown-item command="all">关闭所有</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useTagsStore } from "../store/tags";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isActive = (path: string) => {
  return path === route.fullPath;
};

// vue-router 는 history.state 에 back/forward 경로를 기록함 → 갈 곳이 없으면 버튼 비활성
const canGoBack = ref(false);
const canGoForward = ref(false);
const refreshNavState = () => {
  const state = (window.history.state ?? {}) as { back?: string | null; forward?: string | null };
  canGoBack.value = !!state.back;
  canGoForward.value = !!state.forward;
};
watch(() => route.fullPath, () => nextTick(refreshNavState), { immediate: true });

const goBack = () => {
  router.back();
};
const goForward = () => {
  router.forward();
};
const tags = useTagsStore();
// 关闭单个标签
const closeTags = (index: number) => {
  const delItem = tags.list[index];
  tags.delTagsItem(index);
  const item = tags.list[index] ? tags.list[index] : tags.list[index - 1];
  if (item) {
    delItem.path === route.fullPath && router.push(item.path);
  } else {
    router.push("/");
  }
};

// 设置标签
const setTags = (route: any) => {
  const isExist = tags.list.some((item) => {
    return item.path === route.fullPath;
  });
  if (!isExist) {
    if (tags.list.length >= 12) tags.delTagsItem(0); // 최근 12개 화면 유지 (이전 8개)
    tags.setTagsItem({
      name: route.name,
      title: route.meta.title,
      path: route.fullPath,
    });
  }
};
setTags(route);
onBeforeRouteUpdate((to) => {
  setTags(to);
});

// 关闭全部标签
const closeAll = () => {
  tags.clearTags();
  router.push("/");
};
// 关闭其他标签
const closeOther = () => {
  const curItem = tags.list.filter((item) => {
    return item.path === route.fullPath;
  });
  tags.closeTagsOther(curItem);
};
const handleTags = (command: string) => {
  command === "other" ? closeOther() : closeAll();
};

// 关闭当前页面的标签页
// tags.closeCurrentTag({
//     $router: router,
//     $route: route
// });
</script>

<style>
.tags {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 30px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 5px 10px #ddd;
}

.tags-nav {
  display: flex;
  gap: 2px;
  padding: 0 6px;
  border-right: 1px solid #e9eaec;
  flex-shrink: 0;
}

.tags-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 22px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  background: #fff;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}

.tags-nav-btn:hover:not(:disabled) {
  background: #ecf5ff;
}

.tags-nav-btn:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

/* 탭이 많으면 줄을 넘기지 않고 각 탭이 줄어듦 (가로 스크롤 없음) */
.tags ul {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  height: 100%;
  list-style: none;
}

.tags-li {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  min-width: 60px;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  flex: 1;
  min-width: 0;
  max-width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
