import { defineStore } from "pinia";
import { fetchMyPermissions } from "../utils/web-permission";

interface ObjectList {
  [key: string]: string[];
}

const WEB_PERMS_STORAGE_KEY = "ms_web_perms";

interface WebPermsCache {
  userId: string;
  permissions: string[];
  restrictedScreens: string[];
  isAdmin: boolean;
}

function readCache(): WebPermsCache | null {
  try {
    const raw = localStorage.getItem(WEB_PERMS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WebPermsCache) : null;
  } catch {
    return null;
  }
}

/** 화면 권한 코드: 'screen:<라우트 name>' */
export function screenPermCode(routeName: string): string {
  return `screen:${routeName}`;
}

let loadingPromise: Promise<void> | null = null;

export const usePermissStore = defineStore("permiss", {
  state: () => {
    const keys = localStorage.getItem("ms_keys");
    const cache = readCache();
    const cacheValid = !!cache && cache.userId === localStorage.getItem("id");
    return {
      // 기존 숫자 키 (ms_keys) - 등록되지 않은 화면/메뉴는 계속 이 키로 판단
      key: keys ? JSON.parse(keys) : <string[]>[],
      defaultList: <ObjectList>{
        admin: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
        ],
        user: ["1", "2", "11", "13", "14", "15"],
      },
      // 권한관리 테이블(web_permission) 기반 권한
      permissions: <string[]>(cacheValid ? cache!.permissions : []),
      restrictedScreens: <string[]>(cacheValid ? cache!.restrictedScreens : []),
      isAdmin: cacheValid ? cache!.isAdmin : false,
      webPermsLoaded: false,
    };
  },
  actions: {
    handleSet(val: string[]) {
      this.key = val;
    },

    /** 서버에서 내 권한을 다시 불러온다 (로그인 직후, 앱 최초 진입 시) */
    async loadWebPermissions(force = false) {
      if (this.webPermsLoaded && !force) return;
      if (loadingPromise && !force) return loadingPromise;

      const userId = localStorage.getItem("id") ?? "";
      if (!userId) return;

      loadingPromise = (async () => {
        try {
          const res = await fetchMyPermissions(userId, localStorage.getItem("department"));
          this.permissions = res.permissions;
          this.restrictedScreens = res.restrictedScreens;
          this.isAdmin = res.isAdmin;
          this.webPermsLoaded = true;
          try {
            localStorage.setItem(
              WEB_PERMS_STORAGE_KEY,
              JSON.stringify(<WebPermsCache>{
                userId,
                permissions: res.permissions,
                restrictedScreens: res.restrictedScreens,
                isAdmin: res.isAdmin,
              })
            );
          } catch {
            /* ignore */
          }
        } catch (e) {
          // 서버 오류 시 캐시된 권한으로 동작
          console.error("권한 정보를 불러오지 못했습니다.", e);
        } finally {
          loadingPromise = null;
        }
      })();
      return loadingPromise;
    },

    clearWebPermissions() {
      this.permissions = [];
      this.restrictedScreens = [];
      this.isAdmin = false;
      this.webPermsLoaded = false;
      try {
        localStorage.removeItem(WEB_PERMS_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    },
  },
  getters: {
    /** 기능 권한 보유 여부 */
    hasPerm(state) {
      return (code: string) => state.isAdmin || state.permissions.includes(code);
    },
    /**
     * 화면 접근 가능 여부
     * - 권한관리에 등록된 화면: 부여받은 경우에만 접근
     * - 등록되지 않은 화면: true (기존 ms_keys 판단에 맡김)
     */
    canAccessScreen(state) {
      return (routeName: string | symbol | null | undefined) => {
        if (!routeName || typeof routeName !== "string") return true;
        const code = screenPermCode(routeName);
        if (!state.restrictedScreens.includes(code)) return true;
        return state.isAdmin || state.permissions.includes(code);
      };
    },
  },
});
