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
  {
    path: "/whc/inductor-management/inductor-list",
    name: "WHC Inductor List",
    meta: {
      title: "Inductor List",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Solder/Stock/Inductor/InductorStocks.vue"
      ),
  },
  {
    path: "/whc/evb-management/evb-list",
    name: "WHC EVB List",
    meta: {
      title: "EVB List",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Solder/Stock/Evb/EvbStocks.vue"
      ),
  },
];
