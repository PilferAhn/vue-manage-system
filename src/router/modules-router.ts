import { RouteRecordRaw } from "vue-router";

export const modulesRouteIndexList: RouteRecordRaw[] = [
  // 구 버전 경로로 들어오면 NEW 화면으로 이동 (없으면 '/modules/application/:id' 에 'create'/'list' 가 id 로 잡힘)
  { path: "/modules/application/create", redirect: "/modules/application/create_new" },
  { path: "/modules/application/list", redirect: "/modules/application/list_new" },
  // 구 버전 모듈 의뢰서 화면: 사용 중지 (NEW 화면 사용). 아무도 접근하지 않도록 라우트 비활성화
  // {
  //   path: "/modules/application/create",
  //   name: "Create Module Application",
  //   meta: {
  //     title: "의뢰서 작성",
  //     permiss: "11",
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "table" */ "../views/Modules/Application/Create.vue"
  //     ),
  // },
  // 구 버전 모듈 의뢰서 화면: 사용 중지 (NEW 화면 사용). 아무도 접근하지 않도록 라우트 비활성화
  // {
  //   path: "/modules/application/load/:id",
  //   name: "LoadModuleApplication",
  //   meta: {
  //     title: "의뢰서 작성",
  //     permiss: "11",
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "table" */ "../views/Modules/Application/LoadApplication.vue"
  //     ),
  // },
    {
    path: "/modules/application/create_new",
    name: "Create New Module",
    meta: {
      title: "의뢰서 작성_NEW",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Application/Module_application.vue"
      ),
  },
  // 구 버전 모듈 의뢰서 화면: 사용 중지 (NEW 화면 사용). 아무도 접근하지 않도록 라우트 비활성화
  // {
  //   path: "/modules/application/list",
  //   name: "ModuleApplicationList",
  //   meta: {
  //     title: "의뢰서 목록",
  //     permiss: "11",
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "table" */ "../views/Modules/Applications/ApplicationList/ApplicationList.vue"
  //     ),
  // },
  {
    path: "/modules/application/list_new",
    name: "ModuleApplicationListNew",
    meta: {
      title: "의뢰서 목록_NEW",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Applications/ApplicationList/ApplicationListNew.vue"
      ),
  },
  {
    path: "/modules/application/ordersheet",
    name: "ModuleOrderSheet",
    meta: {
      title: '모듈Odersheet',
      permiss: '11'
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/Ordersheet.vue"
      )
  },
  {
    path: "/modules/application/bomwait",
    name: "ModuleBomList",
    meta: {
      title: 'BOM대기',
      permiss: '11'
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/BomWait.vue"
      )
  },
  {
    path: "/modules/application/modulemeterialqty",
    name: "ModuleMeterialQty",
    meta: {
      title: '모듈원자재소요량',
      permiss: '11'
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/ModuleMeterialQty.vue"
      )
  },
  {
    path: "/modules/application/ordersheet/sheet/:sheetId",
    name: "OrderSheetCreate",
    meta: {
      title: 'OrderSheet작성',
      permiss: '11'
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/OrdersheetFormTemplate.vue"
      )
  },
  {
    path: "/modules/application/ordersheet/pcb/:sheetId",
    name: "OrderSheetPcbCreate",
    meta: {
      title: 'PCB Capture',
      permiss: '11'
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/OrdersheetPCBFormTemplate.vue"
      )
  },
  {
    path: "/modules/application/ordersheet/bom/:sheetId",
    name: "OrderSheetBomCreate",
    meta: {
      title: 'BOM list',
      permiss: '11'
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Ordersheet/OrdersheetBOMFormTemplate.vue"
      )
  },
  {
    path: "/modules/application/:id",
    name: "LoadModuleApplicationNew",
    meta: {
      title: "의뢰서 상세_NEW",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/Modules/Application/Module_application.vue"
      ),
  },
];
