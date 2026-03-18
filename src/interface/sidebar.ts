import { Component } from "vue";

export interface SidebarSubItem {
    title: string;
    index: string;
    permiss: string;
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
    subs?: SidebarSubItemLevel1[];
}
