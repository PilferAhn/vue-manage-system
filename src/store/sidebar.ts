import { defineStore } from 'pinia';
import { hasSession, loadSession, saveSession } from '../utils/session-state';

// 왼쪽 메뉴 접힘 상태는 sessionStorage 에 저장 → F5 후에도 유지 (브라우저 탭을 닫으면 초기화)
const STORAGE_KEY = 'sidebar_collapse';

export const useSidebarStore = defineStore('sidebar', {
	state: () => {
		return {
			collapse: loadSession<boolean>(STORAGE_KEY, false) === true,
			/** 저장된 접힘 상태가 있었는지 (있으면 화면 폭에 따른 자동 접기를 하지 않음) */
			restored: hasSession(STORAGE_KEY)
		};
	},
	getters: {},
	actions: {
		handleCollapse() {
			this.collapse = !this.collapse;
			saveSession(STORAGE_KEY, this.collapse);
		}
	}
});
