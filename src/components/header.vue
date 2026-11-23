<template>
	<div class="header">
		<!-- 홈 버튼 (예전 메뉴 접기 버튼 자리). 메뉴는 왼쪽에 마우스를 대면 펼쳐짐 -->
		<div class="collapse-btn" title="Home" @click="goHome">
			<el-icon><HomeFilled /></el-icon>
		</div>
		<!-- 메뉴 열기/닫기 (의뢰서 작성 화면처럼 자동 펼침이 꺼진 곳에서 사용) -->
		<div class="collapse-btn menu-btn" :title="sidebar.collapse ? '메뉴 열기' : '메뉴 닫기'" @click="sidebar.handleCollapse()">
			<el-icon><Expand v-if="sidebar.collapse" /><Fold v-else /></el-icon>
		</div>
		<div class="logo" title="Home" @click="goHome">RF 개발팀</div>
		<!-- 업데이트 날짜 / 개발자 / 개선 요청 안내 (WJC 사용자는 일본어 + 미검수 안내) -->
		<div class="header-info">
			<span>{{ info.updated }} {{ LAST_UPDATED }}</span>
			<span class="sep">|</span>
			<span>{{ info.developer }} {{ info.devName }}</span>
			<span class="sep">|</span>
			<span class="welcome">{{ info.welcome }}</span>
			<template v-if="info.notice">
				<span class="sep">|</span>
				<span class="notice">{{ info.notice }}</span>
			</template>
		</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 消息中心 -->
				<!-- <div class="btn-bell" @click="router.push('/tabs')">
					<el-tooltip
						effect="dark"
						:content="message ? `有${message}条未读消息` : `消息中心`"
						placement="bottom"
					>
						<i class="el-icon-lx-notice"></i>
					</el-tooltip>
					<span class="btn-bell-badge" v-if="message"></span>
				</div> -->
				<!-- 用户头像 -->
				<el-avatar class="user-avator" :size="24" :src="imgurl" />
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ username }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<!-- <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
								<el-dropdown-item>项目仓库</el-dropdown-item>
							</a> -->
							<!-- <el-dropdown-item command="user">个人中心</el-dropdown-item> -->
							<el-dropdown-item divided command="loginout">Logout</el-dropdown-item>
							<el-dropdown-item divided command="goMyInfo">My Info</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';
import imgurl from '../assets/img/img.jpg';
import { isJapaneseUser } from '../utils/i18n';
import { resetCancelCheckPopup } from '../utils/Fab/fab-card-monitor';
import { clearLoginState } from '../utils/login-session';

// 화면을 고칠 때마다 이 날짜를 바꿔 주세요
const LAST_UPDATED = '2026-11-23';
const info = isJapaneseUser()
	? {
			updated: '更新日',
			developer: '開発者',
			devName: '오해관',
			welcome: '改善のご要望はいつでも歓迎します',
			notice: '※ 日本語表示はまだネイティブチェックを受けていません',
		}
	: {
			updated: '업데이트',
			developer: '개발자',
			devName: '오해관',
			welcome: '개선 요청사항은 언제든 환영합니다',
			notice: '',
		};

const username: string | null = localStorage.getItem('ms_username');
const message: number = 2;

const sidebar = useSidebarStore();

// 메뉴 접기 버튼을 홈 버튼으로 바꿨으므로 메뉴는 항상 접힌 상태로 시작 (마우스를 대면 펼쳐짐)
onMounted(() => {
	if (!sidebar.collapse) sidebar.handleCollapse();
});

// 用户名下拉菜单选择事件
const router = useRouter();
const goHome = () => {
	// 메인 화면에 열려 있는 팝업(의뢰서 선택 등)을 닫으라고 알림 (DeveloperDashboard.vue 의 'go-home' 수신)
	window.dispatchEvent(new Event('go-home'));
	router.push('/dashboard');
};
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		resetCancelCheckPopup(); // 다음 로그인 때 "투입취소 확인 요망" 팝업 다시 확인
		clearLoginState(); // 로그인 정보/세션/권한/화면 탭 모두 삭제 (브라우저 재시작 때와 같은 처리)
		router.push('/login');
	} else if (command == 'user') {
		router.push('/user');
	}
	else if (command == 'goMyInfo') {
		router.push('/user');
	}
};
</script>
<style scoped>
/* 상단 헤더: 내용 영역을 넓히기 위해 70px → 40px 로 축소 (main.css .content-box, sidebar.vue top 과 맞춤) */
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 40px;
	font-size: 15px;
	color: #fff;
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 14px;
	font-size: 18px;
	cursor: pointer;
}
.collapse-btn.menu-btn {
	padding: 0 10px 0 2px;
}
.collapse-btn:hover {
	color: #20a0ff;
}
.header .logo {
	float: left;
	line-height: 40px;
	font-weight: 600;
	cursor: pointer;
}
.header-info {
	float: left;
	line-height: 40px;
	margin-left: 18px;
	font-size: 12px;
	color: #a9b6c8;
	white-space: nowrap;
}
.header-info .sep {
	margin: 0 8px;
	color: #5d6b80;
}
.header-info .welcome {
	color: #d6e4f5;
}
.header-info .notice {
	color: #f3c26b;
}
.header-right {
	float: right;
	padding-right: 20px;
}
.header-user-con {
	display: flex;
	height: 40px;
	align-items: center;
	font-size: 14px;
}
.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}
.btn-bell .el-icon-lx-notice {
	color: #fff;
}
.user-name {
	margin-left: 10px;
}
.user-avator {
	margin-left: 20px;
}
.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.el-dropdown-menu__item {
	text-align: center;
}
</style>
