import { Component } from "vue";

export interface SidebarSubItem {
    title: string;
    index: string;
    permiss: string;
    /** 권한관리(web_permission) 기능 권한 코드. 지정 시 보유자에게만 표시 */
    perm?: string;
}

export interface SidebarSubItemLevel2 extends SidebarSubItem {
    subs?: SidebarSubItem[];
}

export interface SidebarSubItemLevel1 extends SidebarSubItem {
    subs?: SidebarSubItemLevel2[];
}

export interface SidebarItem {
    title: string;
    icon: string | Component;
    index: string;
    permiss: string;
    perm?: string;
    subs?: SidebarSubItemLevel1[];
}
