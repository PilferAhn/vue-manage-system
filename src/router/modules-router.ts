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
  {
    path:"/modules/application/ordersheet",
    name: "ModuleOrderSheet",
    meta : {
      title:'모듈Odersheet',
      permiss:'11'
    },
    component: ()=>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/Ordersheet.vue"
      )
  },
  {
    path:"/modules/application/ordersheet/sheet/:sheetId",
    name: "OrderSheetCreate",
    meta : {
      title:'OrderSheet작성',
      permiss:'11'
    },
    component: ()=>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/OrdersheetFormTemplate.vue"
      )
  },
  {
    path:"/modules/application/ordersheet/pcb/:sheetId",
    name: "OrderSheetPcbCreate",
    meta : {
      title:'PCB Capture',
      permiss:'11'
    },
    component: ()=>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/OrdersheetPCBFormTemplate.vue"
      )
  },
  {
    path:"/modules/application/ordersheet/bom/:sheetId",
    name: "OrderSheetBomCreate",
    meta : {
      title:'BOM list',
      permiss:'11'
    },
    component: ()=>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/OrdersheetBOMFormTemplate.vue"
      )
  }
];
