import { defineStore } from 'pinia';
import { loadSession, saveSession } from '../utils/session-state';

interface ListItem {
	name: string;
	path: string;
	title: string;
	/** 화면이 직접 정한 제목(예: "의뢰서 26-2302 D7H0"). F5 후에도 라우터 기본 제목으로 덮어쓰지 않음 */
	customTitle?: boolean;
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
		/** 같은 화면(name) 탭이 이미 있으면 그 탭을 새 주소로 바꿈 (탭 하나만 쓰는 화면용) */
		replaceTagsItem(index: number, data: ListItem) {
			this.list.splice(index, 1, data);
			this.persist();
		},
		/** 현재 열린 탭의 제목을 화면에서 직접 지정 */
		setTitleByPath(path: string, title: string) {
			const item = this.list.find(i => i.path === path);
			if (item && item.title !== title) {
				item.title = title;
				item.customTitle = true;
				this.persist();
			}
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
