<template>
	<v-header />
	<v-sidebar />
	<div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
		<v-tags></v-tags>
		<div class="content">
			<router-view :key="$route.params.productName" v-slot="{ Component }">
				<transition name="move" mode="out-in">
					<keep-alive :include="tags.nameList">
						<component :is="Component"></component>
					</keep-alive>
				</transition>
			</router-view>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../store/sidebar';
import { useTagsStore } from '../store/tags';
import vHeader from '../components/header.vue';
import vSidebar from '../components/sidebar.vue';
import vTags from '../components/tags.vue';
import { onMounted } from 'vue';
import { getUserId } from '../utils/account-utils';
import { showMyCancelCheckPopup } from '../utils/Fab/fab-card-monitor';

const sidebar = useSidebarStore();
const tags = useTagsStore();

// 로그인(또는 새로고침) 후 한 번: 내 의뢰서 중 Fab Card 작성 현황의 "투입취소 확인 요망" 건이 있으면 팝업
// Fab Card 작성 현황에서 사라질 때까지(보류 / MES 등록) 로그인할 때마다 표시 (2026-11-22)
onMounted(() => {
	showMyCancelCheckPopup(getUserId());
});
</script>
