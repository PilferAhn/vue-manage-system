import { RouteRecordRaw } from "vue-router";

export const dv2RouteIndexList: RouteRecordRaw[] = [
  {
    path: "/dv2/task-list",
    name: "DV2 List",
    meta: {
      title: "DV2 List",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Dv2/Dv2List/Dv2List.vue"
      ),
  }
];
