import { RouteRecordRaw } from "vue-router";

export const pdtRouteIndexList: RouteRecordRaw[] = [
    {
      path: "/product/by-fab-form/:productName",
      name: "CreatePdtApplicationByFabForm",
      meta: {
        title: "PDT 의뢰서 작성",
        permiss: "11",
      },
      component: () =>
        import(
          /* webpackChunkName: "table" */ "../views/ProductPage/Application/CreatePdtApplicationByFabForm.vue"
        ),
    },
  ];