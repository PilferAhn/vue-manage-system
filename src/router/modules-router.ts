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
  {
    path: "/modules/application/load/:id",
    name: "LoadModuleApplication",
    meta: {
      title: "의뢰서 작성",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Application/LoadApplication.vue"
      ),
  },
  {
    path: "/modules/application/list",
    name: "ModuleApplicationList",
    meta: {
      title: "의뢰서 목록",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Applications/ApplicationList/ApplicationList.vue"
      ),
  },
];
