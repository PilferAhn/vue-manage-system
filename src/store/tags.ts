import { defineStore } from 'pinia';
import { loadSession, saveSession } from '../utils/session-state';

interface ListItem {
	name: string;
	path: string;
	title: string;
}

// 열린 탭 목록은 sessionStorage 에 저장 → F5 후에도 유지 (브라우저 탭을 닫으면 초기화)
const STORAGE_KEY = 'tags';

export const useTagsStore = defineStore('tags', {
	state: () => {
		const saved = loadSession<ListItem[]>(STORAGE_KEY, []);
		return {
			list: <ListItem[]>(Array.isArray(saved) ? saved.filter(i => i && i.path) : [])
		};
	},
	getters: {
		show: state => {
			return state.list.length > 0;
		},
		nameList: state => {
			return state.list.map(item => item.name);
		}
	},
	actions: {
		persist() {
			saveSession(STORAGE_KEY, this.list);
		},
		delTagsItem(index: number) {
			this.list.splice(index, 1);
			this.persist();
		},
		setTagsItem(data: ListItem) {
			this.list.push(data);
			this.persist();
		},
		clearTags() {
			this.list = [];
			this.persist();
		},
		closeTagsOther(data: ListItem[]) {
			this.list = data;
			this.persist();
		},
		closeCurrentTag(data: any) {
			for (let i = 0, len = this.list.length; i < len; i++) {
				const item = this.list[i];
				if (item.path === data.$route.fullPath) {
					if (i < len - 1) {
						data.$router.push(this.list[i + 1].path);
					} else if (i > 0) {
						data.$router.push(this.list[i - 1].path);
					} else {
						data.$router.push('/');
					}
					this.list.splice(i, 1);
					this.persist();
					break;
				}
			}
		}
	}
});
