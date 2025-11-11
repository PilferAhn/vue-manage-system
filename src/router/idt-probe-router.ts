import { RouteRecordRaw } from "vue-router";

export const idtProbeRouteIndexList: RouteRecordRaw[] = [
  {
    path: "/idt-probe/register-items",
    name: "IdtProbeRegisterItems",
    meta: {
      title: "Register Items",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/IdtProbe/RegistrationOfItem/RegistrationOfItem.vue"
      ),
  },
  {
    path: "/idt-probe/in-progress-items",
    name: "IdtProbeInProgressItems",
    meta: {
      title: "In Progress Items",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/IdtProbe/ReceivedIdtProbeItems.vue"
      ),
  },
  {
    path: "/idt-probe/completed-list",
    name: "IdtProbeCompleteItems",
    meta: {
      title: "Completed Items",
      permiss: "11",
    },
    component: () =>
      import(
        /* webpackChunkName: "table" */ "../views/IdtProbe/CompletedIdtProbeItems.vue"
      ),
  }];