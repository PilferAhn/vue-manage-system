import { RouteRecordRaw } from "vue-router";

export const fabRouteIndexList: RouteRecordRaw[] = [
  {
    path: "/fab/create-application",
    name: "FabApplication",
    meta: {
      title: "의뢰서 작성",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/Application/CreateApplication.vue"
      ),
  },
  {
    path: "/fab/create-application2",
    name: "FabApplication2",
    meta: {
      title: "새로운 의뢰서 작성",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/Application/CreateApplicationRev2.vue"
      ),
  },

  {
    path: "/fab/feb-application-list",
    name: "FabApplicationList",
    meta: {
      title: "작성된 의뢰 목록",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/ApplicationList.vue"
      ),
  },
  {
    path: "/fab/feb-application-list2",
    name: "FabApplicationList2",
    meta: {
      title: "작성된 의뢰 목록2",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/ApplicationList2.vue"
      ),
  },
  {
    path: "/fab/feb-application-list3",
    name: "FabApplicationList3",
    meta: {
      title: "개발 현황",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/rev2/ApplicationMonitor.vue"
      ),
  },
  {
    path: "/fab/fab-card-moniter",
    name: "PlanedWholeApps",
    meta: {
      title: "투입 계획서 목록",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/rev2/FabCardMoniter.vue"
      ),
  },
  {
    path: "/fab/my-application-status",
    name: "MyApplicationStatus",
    meta: {
      title: "투입 계획서 현황",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/MyApplicationStatus/MyApplicationStatus.vue"
      ),
  },
  {
    path: "/fab/view-application-list-rev2",
    name: "FabApplicationListRev2",
    meta: {
      title: "투입 계획서 현황2",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/rev2/MyApplicationList.vue"
      ),
  },
  {
    path: "/fab/review-application",
    name: "ApplicationReviewList",
    meta: {
      title: "투입 계획서 검토",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/rev2/ApplicationReviewList.vue"
      ),
  },
  {
    path: "/fab/admin-control",
    name: "AdminCortrol",
    meta: {
      title: "관리자 메뉴",
      permiss: "16",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/Admin/Admin.vue"
      ),
  },
  // {
  //   path: "/fab/review-application2",
  //   name: "ApplicationReviewList2",
  //   meta: {
  //     title: "투입 계획서 검토",
  //     permiss: "11",
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/rev2/application_review/AppReview.vue"
  //     ),
  // },
  {
    path: "/fab/load_application2/:productName",
    name: "LoadApplication2",
    meta: {
      title: "LoadApplication2",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/Application/LoadApplication2.vue"
      ),
  },
  {
    path: "/fab/load_application/:uuid",
    name: "LoadApplication",
    meta: {
      title: "LoadApplication",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/Application/LoadApplication.vue"
      ),
  },
  {
    path: "/fab/mes/sample_status",
    name: "SampleStatus",
    meta: {
      title: "SampleStatus",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/SampleStatus/SampleStatus.vue"
      ),
  },
  {
    path: "/fab/mes_sample_status",
    name: "LoadApplication",
    meta: {
      title: "LoadApplication",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/SampleStatus/SampleStatusMes.vue"
      ),
  },
  {
    path: "/fab/china69",
    name: "China69List",
    meta: {
      title: "China69List",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/SampleStatus/China69List.vue"
      ),
  },
  {
    path: "/fab/weekly-applications",
    name: "WeeklyApplicationList",
    meta: {
      title: "투입 현황",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/FAB/ApplicationList/rev2/WeeklyApplicationList.vue"
      ),
  },
];