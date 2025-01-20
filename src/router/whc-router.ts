import { RouteRecordRaw } from "vue-router";

export const whcRouteIndexList: RouteRecordRaw[] = [
  {
    path: "/whc/package-management/package-list",
    name: "WHC Package List",
    meta: {
      title: "Package List",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Solder/Stock/Package/Package.vue"
      ),
  },
];
