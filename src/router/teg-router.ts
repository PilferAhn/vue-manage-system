import { RouteRecordRaw } from "vue-router";

export const tegRouteIndexList: RouteRecordRaw[] = [
    {
      path: "/teg/application/by-fab-form/:productName",
      name: "CreateTegApplicationByFabForm",
      meta: {
        title: "TEG 의뢰서 작성",
        permiss: "11",
      },
      component: () =>
        import(
          /* webpackChunkName: "table" */ "../views/TegPage/Application/CreateTegAppByFabForm.vue"
        ),
    },
  ];