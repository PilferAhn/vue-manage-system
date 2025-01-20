import { RouteRecordRaw } from "vue-router";

export const modulesRouteIndexList: RouteRecordRaw[] = [
  {
    path: "/modules/application/create",
    name: "Create Module Application",
    meta: {
      title: "의뢰서 작성",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Application/Create.vue"
      ),
  },
];
