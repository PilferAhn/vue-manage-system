import { RouteRecordRaw } from "vue-router";

export const idtProbeRouteIndexList: RouteRecordRaw[] = [
  {
    path: "/idt-probe/register-wafer",
    name: "IdtProbeRegisterWafer",
    meta: {
      title: "Register Wafer",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/IdtProbe/RegistrationOfWafer/RegistrationOfWafer.vue"
      ),
  },
  {
    path: "/idt-probe/in-progress-wafers",
    name: "IdtProbeInProgressWafers",
    meta: {
      title: "In Progress Wafers",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/IdtProbe/ReceivedIdtProbeWafers.vue"
      ),
  },
  {
    path: "/idt-probe/completed-list",
    name: "IdtProbeCompletedWafers",
    meta: {
      title: "Completed Wafers",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/IdtProbe/CompletedIdtProbeWafers.vue"
      ),
  }];