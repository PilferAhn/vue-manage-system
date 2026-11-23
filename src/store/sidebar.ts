import { defineStore } from 'pinia';
import { hasSession, loadSession, saveSession } from '../utils/session-state';

// 왼쪽 메뉴 접힘 상태는 sessionStorage 에 저장 → F5 후에도 유지 (브라우저 탭을 닫으면 초기화)
const STORAGE_KEY = 'sidebar_collapse';
// 메뉴 고정(항상 펼침)은 사람마다 고르는 설정 → localStorage (브라우저를 껐다 켜도 유지, 그 PC/브라우저에만 적용)
const PIN_STORAGE_KEY = 'sidebar_pinned';

function loadPinned(): boolean {
	try {
		return localStorage.getItem(PIN_STORAGE_KEY) === '1';
	} catch {
		return false;
	}
}

function savePinned(value: boolean) {
	try {
		if (value) localStorage.setItem(PIN_STORAGE_KEY, '1');
		else localStorage.removeItem(PIN_STORAGE_KEY);
	} catch {
		/* 저장 못 해도 이번 화면에서는 동작 */
	}
}

export const useSidebarStore = defineStore('sidebar', {
	state: () => {
		const pinned = loadPinned();
		return {
			// 고정이면 항상 펼친 상태로 시작
			collapse: pinned ? false : loadSession<boolean>(STORAGE_KEY, false) === true,
			/** 저장된 접힘 상태가 있었는지 (있으면 화면 폭에 따른 자동 접기를 하지 않음) */
			restored: hasSession(STORAGE_KEY),
			/** 메뉴 고정: 화면을 골라도 접히지 않고, 새로고침/재접속해도 펼친 상태 유지 (2026-11-23) */
			pinned,
		};
	},
	getters: {},
	actions: {
		handleCollapse() {
			this.collapse = !this.collapse;
			saveSession(STORAGE_KEY, this.collapse);
			// 고정 중에 메뉴를 접으면 고정 해제
			if (this.collapse && this.pinned) {
				this.pinned = false;
				savePinned(false);
			}
		},
		/** 메뉴 고정 켜기/끄기. 켜면 바로 펼침 */
		togglePinned() {
			this.pinned = !this.pinned;
			savePinned(this.pinned);
			if (this.pinned && this.collapse) {
				this.collapse = false;
				saveSession(STORAGE_KEY, false);
			}
		},
		/** 고정이 아닐 때만 접기 (화면을 고른 뒤, 처음 열 때) */
		collapseIfNotPinned() {
			if (!this.pinned && !this.collapse) this.handleCollapse();
		},
	}
});
